/**
 * Wathq API Integration for Commercial Registration Verification
 * Saudi Arabia Ministry of Commerce and Investment
 */

interface WathqCommercialRecord {
  cr_number: string;
  business_name_ar: string;
  business_name_en?: string;
  business_type: string;
  owner_name: string;
  registration_date: string;
  expiry_date: string;
  status: 'active' | 'inactive' | 'suspended' | 'cancelled';
  activities: string[];
  capital: number;
  city: string;
  address: string;
  is_verified: boolean;
}

interface WathqApiResponse {
  success: boolean;
  data?: WathqCommercialRecord;
  error?: string;
  error_code?: string;
}

interface WathqApiCredentials {
  client_id: string;
  client_secret: string;
  api_key: string;
  environment: 'sandbox' | 'production';
}

/**
 * Wathq API Service for verifying commercial registrations
 */
export class WathqApiService {
  private credentials: WathqApiCredentials;
  private baseUrl: string;
  private accessToken?: string;
  private tokenExpiry?: Date;

  constructor(credentials: WathqApiCredentials) {
    this.credentials = credentials;
    this.baseUrl = credentials.environment === 'production' 
      ? 'https://api.wathq.sa'
      : 'https://sandbox-api.wathq.sa';
  }

  /**
   * Authenticate with Wathq API and get access token
   */
  private async authenticate(): Promise<string> {
    try {
      // Check if we have a valid token
      if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
        return this.accessToken;
      }

      const response = await fetch(`${this.baseUrl}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.credentials.client_id,
          client_secret: this.credentials.client_secret,
          scope: 'commercial_registry'
        })
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.status}`);
      }      const data = await response.json();
      
      this.accessToken = data.access_token;
      this.tokenExpiry = new Date(Date.now() + (data.expires_in * 1000));
      
      if (!this.accessToken) {
        throw new Error('No access token received');
      }
      
      return this.accessToken;

    } catch (error) {
      console.error('Wathq authentication error:', error);
      throw new Error('فشل في المصادقة مع واثق');
    }
  }

  /**
   * Verify commercial registration number
   */
  async verifyCommercialRegistration(crNumber: string): Promise<WathqApiResponse> {
    try {
      // Validate CR number format (10 digits)
      if (!/^\d{10}$/.test(crNumber)) {
        return {
          success: false,
          error: 'رقم السجل التجاري يجب أن يكون 10 أرقام',
          error_code: 'INVALID_FORMAT'
        };
      }

      const token = await this.authenticate();

      const response = await fetch(`${this.baseUrl}/v1/commercial-registry/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-API-Key': this.credentials.api_key,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          cr_number: crNumber,
          include_details: true
        })
      });

      if (!response.ok) {
        if (response.status === 404) {
          return {
            success: false,
            error: 'السجل التجاري غير موجود',
            error_code: 'NOT_FOUND'
          };
        }
        
        if (response.status === 401) {
          return {
            success: false,
            error: 'غير مصرح بالوصول إلى واثق',
            error_code: 'UNAUTHORIZED'
          };
        }

        if (response.status === 429) {
          return {
            success: false,
            error: 'تم تجاوز حد الطلبات، يرجى المحاولة لاحقاً',
            error_code: 'RATE_LIMIT'
          };
        }

        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform API response to our format
      const commercialRecord: WathqCommercialRecord = {
        cr_number: data.commercial_registration.cr_number,
        business_name_ar: data.commercial_registration.business_name_ar,
        business_name_en: data.commercial_registration.business_name_en,
        business_type: data.commercial_registration.business_type,
        owner_name: data.commercial_registration.owner_name,
        registration_date: data.commercial_registration.registration_date,
        expiry_date: data.commercial_registration.expiry_date,
        status: data.commercial_registration.status,
        activities: data.commercial_registration.activities || [],
        capital: data.commercial_registration.capital || 0,
        city: data.commercial_registration.city,
        address: data.commercial_registration.address,
        is_verified: data.commercial_registration.status === 'active'
      };

      return {
        success: true,
        data: commercialRecord
      };

    } catch (error) {
      console.error('Wathq API error:', error);
      return {
        success: false,
        error: 'حدث خطأ في التحقق من السجل التجاري',
        error_code: 'API_ERROR'
      };
    }
  }

  /**
   * Verify business license for specific activities
   */
  async verifyBusinessLicense(crNumber: string, activityCode: string): Promise<WathqApiResponse> {
    try {
      const token = await this.authenticate();

      const response = await fetch(`${this.baseUrl}/v1/business-license/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-API-Key': this.credentials.api_key,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          cr_number: crNumber,
          activity_code: activityCode
        })
      });

      if (!response.ok) {
        throw new Error(`Business license verification failed: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: data.is_authorized,
        data: data.license_details
      };

    } catch (error) {
      console.error('Business license verification error:', error);
      return {
        success: false,
        error: 'فشل في التحقق من ترخيص النشاط',
        error_code: 'LICENSE_ERROR'
      };
    }
  }

  /**
   * Get business activities for a commercial registration
   */
  async getBusinessActivities(crNumber: string): Promise<string[]> {
    try {
      const verificationResult = await this.verifyCommercialRegistration(crNumber);
      
      if (verificationResult.success && verificationResult.data) {
        return verificationResult.data.activities;
      }
      
      return [];

    } catch (error) {
      console.error('Error getting business activities:', error);
      return [];
    }
  }
}

/**
 * Mock Wathq service for development/testing
 */
export class MockWathqApiService extends WathqApiService {
  constructor() {
    super({
      client_id: 'mock_client',
      client_secret: 'mock_secret',
      api_key: 'mock_key',
      environment: 'sandbox'
    });
  }

  async verifyCommercialRegistration(crNumber: string): Promise<WathqApiResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock data for testing
    const mockRecords: { [key: string]: WathqCommercialRecord } = {
      '1010012345': {
        cr_number: '1010012345',
        business_name_ar: 'شركة البناء المتطورة',
        business_name_en: 'Advanced Construction Company',
        business_type: 'شركة ذات مسؤولية محدودة',
        owner_name: 'محمد أحمد العتيبي',
        registration_date: '2020-01-15',
        expiry_date: '2025-01-15',
        status: 'active',
        activities: [
          'تجارة مواد البناء',
          'المقاولات العامة',
          'التجارة الإلكترونية'
        ],
        capital: 500000,
        city: 'الرياض',
        address: 'شارع الملك فهد، الرياض 12345',
        is_verified: true
      },
      '1010023456': {
        cr_number: '1010023456',
        business_name_ar: 'مؤسسة التجهيزات الصحية',
        business_name_en: 'Sanitary Equipment Est.',
        business_type: 'مؤسسة فردية',
        owner_name: 'سعد محمد الدوسري',
        registration_date: '2019-06-20',
        expiry_date: '2024-06-20',
        status: 'active',
        activities: [
          'تجارة المعدات الصحية',
          'الصيانة والإصلاح'
        ],
        capital: 250000,
        city: 'جدة',
        address: 'طريق الملك عبدالعزيز، جدة 21456',
        is_verified: true
      },
      '1010034567': {
        cr_number: '1010034567',
        business_name_ar: 'شركة الأدوات الكهربائية المحدودة',
        business_name_en: 'Electrical Tools Ltd.',
        business_type: 'شركة ذات مسؤولية محدودة',
        owner_name: 'عبدالله سالم النعيمي',
        registration_date: '2021-03-10',
        expiry_date: '2026-03-10',
        status: 'active',
        activities: [
          'تجارة الأدوات الكهربائية',
          'التجارة الإلكترونية',
          'التوريد والتركيب'
        ],
        capital: 750000,
        city: 'الدمام',
        address: 'الدمام، المنطقة الشرقية 31456',
        is_verified: true
      }
    };

    // Check if CR number exists in mock data
    if (mockRecords[crNumber]) {
      return {
        success: true,
        data: mockRecords[crNumber]
      };
    }

    // Return error for unknown CR numbers
    return {
      success: false,
      error: 'السجل التجاري غير موجود',
      error_code: 'NOT_FOUND'
    };
  }
}

/**
 * Create Wathq service instance based on environment
 */
export function createWathqService(): WathqApiService {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment || !process.env.WATHQ_CLIENT_ID) {
    return new MockWathqApiService();
  }

  return new WathqApiService({
    client_id: process.env.WATHQ_CLIENT_ID!,
    client_secret: process.env.WATHQ_CLIENT_SECRET!,
    api_key: process.env.WATHQ_API_KEY!,
    environment: process.env.WATHQ_ENVIRONMENT as 'sandbox' | 'production' || 'sandbox'
  });
}

/**
 * Utility functions for CR number validation
 */
export const CRUtils = {
  /**
   * Validate commercial registration number format
   */
  isValidCRNumber(crNumber: string): boolean {
    return /^\d{10}$/.test(crNumber);
  },

  /**
   * Format CR number for display
   */
  formatCRNumber(crNumber: string): string {
    if (!this.isValidCRNumber(crNumber)) {
      return crNumber;
    }
    
    return `${crNumber.substring(0, 4)}-${crNumber.substring(4, 8)}-${crNumber.substring(8)}`;
  },

  /**
   * Remove formatting from CR number
   */
  cleanCRNumber(crNumber: string): string {
    return crNumber.replace(/\D/g, '');
  }
};

export type { WathqCommercialRecord, WathqApiResponse, WathqApiCredentials };
