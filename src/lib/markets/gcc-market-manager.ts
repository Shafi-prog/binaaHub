// @ts-nocheck
import { createClient } from '@supabase/supabase-js';

// GCC Market Types
export interface GCCMarket {
  id: string;
  name: string;
  country_code: string;
  currency: string;
  language: string[];
  timezone: string;
  business_hours: {
    start: string;
    end: string;
    weekend: string[];
  };
  payment_methods: string[];
  shipping_providers: string[];
  regulations: {
    tax_rate: number;
    business_registration: string[];
    compliance_requirements: string[];
  };
  cultural_settings: {
    date_format: string;
    number_format: string;
    calendar_type: string;
    holidays: string[];
  };
}

export interface MarketMetrics {
  market_id: string;
  total_vendors: number;
  total_customers: number;
  monthly_revenue: number;
  average_order_value: number;
  growth_rate: number;
  market_penetration: number;
}

export interface LocalizationSettings {
  market_id: string;
  currency_symbol: string;
  currency_position: 'before' | 'after';
  thousand_separator: string;
  decimal_separator: string;
  date_format: string;
  time_format: '12h' | '24h';
  week_start: 'sunday' | 'monday';
  rtl_support: boolean;
  local_fonts: string[];
}

export class GCCMarketManager {
  private supabase;
  private markets: Map<string, GCCMarket> = new Map();

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    this.initializeMarkets();
  }

  private initializeMarkets() {
    // Saudi Arabia (Primary Market)
    this.markets.set('SA', {
      id: 'SA',
      name: 'المملكة العربية السعودية',
      country_code: 'SA',
      currency: 'SAR',
      language: ['ar', 'en'],
      timezone: 'Asia/Riyadh',
      business_hours: {
        start: '08:00',
        end: '22:00',
        weekend: ['friday', 'saturday']
      },
      payment_methods: ['mada', 'visa', 'mastercard', 'stc_pay', 'apple_pay', 'tamara', 'tabby'],
      shipping_providers: ['aramex', 'smsa', 'naqel', 'dhl', 'fedex', 'saudi_post'],
      regulations: {
        tax_rate: 15, // 15% VAT
        business_registration: ['commercial_registration', 'zakat_certificate', 'vat_registration'],
        compliance_requirements: ['zatca_compliance', 'saudi_standards', 'consumer_protection']
      },
      cultural_settings: {
        date_format: 'DD/MM/YYYY',
        number_format: '1,234.56',
        calendar_type: 'hijri_gregorian',
        holidays: ['national_day', 'founding_day', 'eid_al_fitr', 'eid_al_adha', 'arafah_day']
      }
    });

    // UAE Market
    this.markets.set('AE', {
      id: 'AE',
      name: 'دولة الإمارات العربية المتحدة',
      country_code: 'AE',
      currency: 'AED',
      language: ['ar', 'en'],
      timezone: 'Asia/Dubai',
      business_hours: {
        start: '08:00',
        end: '22:00',
        weekend: ['saturday', 'sunday']
      },
      payment_methods: ['emirates_nbd', 'adcb', 'visa', 'mastercard', 'apple_pay', 'google_pay', 'paypal'],
      shipping_providers: ['emirates_post', 'aramex', 'dhl', 'fedex', 'ups'],
      regulations: {
        tax_rate: 5, // 5% VAT
        business_registration: ['trade_license', 'establishment_card', 'vat_registration'],
        compliance_requirements: ['uae_standards', 'consumer_rights', 'data_protection']
      },
      cultural_settings: {
        date_format: 'DD/MM/YYYY',
        number_format: '1,234.56',
        calendar_type: 'gregorian',
        holidays: ['uae_national_day', 'commemoration_day', 'new_year', 'eid_al_fitr', 'eid_al_adha']
      }
    });

    // Kuwait Market
    this.markets.set('KW', {
      id: 'KW',
      name: 'دولة الكويت',
      country_code: 'KW',
      currency: 'KWD',
      language: ['ar', 'en'],
      timezone: 'Asia/Kuwait',
      business_hours: {
        start: '08:00',
        end: '22:00',
        weekend: ['friday', 'saturday']
      },
      payment_methods: ['knet', 'visa', 'mastercard', 'nbk', 'gulf_bank', 'apple_pay'],
      shipping_providers: ['kuwait_post', 'aramex_kuwait', 'dhl_kuwait', 'fedex_kuwait'],
      regulations: {
        tax_rate: 0, // No VAT in Kuwait
        business_registration: ['commercial_license', 'industrial_license', 'municipal_license'],
        compliance_requirements: ['kuwait_standards', 'consumer_protection', 'labor_law']
      },
      cultural_settings: {
        date_format: 'DD/MM/YYYY',
        number_format: '1,234.567', // 3 decimal places for KWD
        calendar_type: 'hijri_gregorian',
        holidays: ['national_day', 'liberation_day', 'eid_al_fitr', 'eid_al_adha', 'islamic_new_year']
      }
    });

    // Qatar Market
    this.markets.set('QA', {
      id: 'QA',
      name: 'دولة قطر',
      country_code: 'QA',
      currency: 'QAR',
      language: ['ar', 'en'],
      timezone: 'Asia/Qatar',
      business_hours: {
        start: '08:00',
        end: '22:00',
        weekend: ['friday', 'saturday']
      },
      payment_methods: ['qnb', 'cbq', 'visa', 'mastercard', 'apple_pay', 'google_pay'],
      shipping_providers: ['qatar_post', 'aramex_qatar', 'dhl_qatar', 'fedex_qatar'],
      regulations: {
        tax_rate: 0, // No VAT in Qatar
        business_registration: ['commercial_registration', 'industrial_license', 'professional_license'],
        compliance_requirements: ['qcs_standards', 'consumer_protection', 'cyber_security']
      },
      cultural_settings: {
        date_format: 'DD/MM/YYYY',
        number_format: '1,234.56',
        calendar_type: 'hijri_gregorian',
        holidays: ['national_day', 'sports_day', 'eid_al_fitr', 'eid_al_adha', 'arafah_day']
      }
    });

    // Bahrain Market
    this.markets.set('BH', {
      id: 'BH',
      name: 'مملكة البحرين',
      country_code: 'BH',
      currency: 'BHD',
      language: ['ar', 'en'],
      timezone: 'Asia/Bahrain',
      business_hours: {
        start: '08:00',
        end: '22:00',
        weekend: ['friday', 'saturday']
      },
      payment_methods: ['benefit', 'visa', 'mastercard', 'nbb', 'abc_bank', 'apple_pay'],
      shipping_providers: ['bahrain_post', 'aramex_bahrain', 'dhl_bahrain'],
      regulations: {
        tax_rate: 10, // 10% VAT
        business_registration: ['commercial_registration', 'industrial_license', 'municipal_license'],
        compliance_requirements: ['bsf_standards', 'consumer_protection', 'financial_regulations']
      },
      cultural_settings: {
        date_format: 'DD/MM/YYYY',
        number_format: '1,234.567', // 3 decimal places for BHD
        calendar_type: 'hijri_gregorian',
        holidays: ['national_day', 'independence_day', 'eid_al_fitr', 'eid_al_adha', 'ashura']
      }
    });

    // Oman Market
    this.markets.set('OM', {
      id: 'OM',
      name: 'سلطنة عُمان',
      country_code: 'OM',
      currency: 'OMR',
      language: ['ar', 'en'],
      timezone: 'Asia/Muscat',
      business_hours: {
        start: '08:00',
        end: '22:00',
        weekend: ['friday', 'saturday']
      },
      payment_methods: ['oman_net', 'visa', 'mastercard', 'bank_muscat', 'nbos', 'apple_pay'],
      shipping_providers: ['oman_post', 'aramex_oman', 'dhl_oman'],
      regulations: {
        tax_rate: 5, // 5% VAT
        business_registration: ['commercial_registration', 'municipal_license', 'environmental_permit'],
        compliance_requirements: ['oman_standards', 'consumer_rights', 'environmental_compliance']
      },
      cultural_settings: {
        date_format: 'DD/MM/YYYY',
        number_format: '1,234.567', // 3 decimal places for OMR
        calendar_type: 'hijri_gregorian',
        holidays: ['national_day', 'renaissance_day', 'eid_al_fitr', 'eid_al_adha', 'islamic_new_year']
      }
    });
  }

  // Get all GCC markets
  getAllMarkets(): GCCMarket[] {
    return Array.from(this.markets.values());
  }

  // Get market by country code
  getMarket(countryCode: string): GCCMarket | undefined {
    return this.markets.get(countryCode.toUpperCase());
  }

  // Get markets by language
  getMarketsByLanguage(language: string): GCCMarket[] {
    return Array.from(this.markets.values()).filter(
      market => market.language.includes(language)
    );
  }

  // Get localization settings for market
  getLocalizationSettings(marketId: string): LocalizationSettings {
    const market = this.getMarket(marketId);
    if (!market) {
      throw new Error('Market not found');
    }

    const currencySettings: Record<string, any> = {
      'SAR': { symbol: 'ر.س', position: 'after', thousand: ',', decimal: '.' },
      'AED': { symbol: 'د.إ', position: 'after', thousand: ',', decimal: '.' },
      'KWD': { symbol: 'د.ك', position: 'after', thousand: ',', decimal: '.' },
      'QAR': { symbol: 'ر.ق', position: 'after', thousand: ',', decimal: '.' },
      'BHD': { symbol: 'د.ب', position: 'after', thousand: ',', decimal: '.' },
      'OMR': { symbol: 'ر.ع', position: 'after', thousand: ',', decimal: '.' }
    };

    const settings = currencySettings[market.currency] || currencySettings['SAR'];

    return {
      market_id: marketId,
      currency_symbol: settings.symbol,
      currency_position: settings.position,
      thousand_separator: settings.thousand,
      decimal_separator: settings.decimal,
      date_format: market.cultural_settings.date_format,
      time_format: '24h',
      week_start: 'sunday',
      rtl_support: true,
      local_fonts: ['Noto Sans Arabic', 'Cairo', 'Amiri', 'Roboto']
    };
  }

  // Convert currency between GCC markets
  async convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): Promise<number> {
    // Mock exchange rates (in production, use real-time rates)
    const exchangeRates: Record<string, Record<string, number>> = {
      'SAR': { 'AED': 0.98, 'KWD': 0.115, 'QAR': 1.37, 'BHD': 0.141, 'OMR': 0.144 },
      'AED': { 'SAR': 1.02, 'KWD': 0.117, 'QAR': 1.40, 'BHD': 0.144, 'OMR': 0.147 },
      'KWD': { 'SAR': 8.70, 'AED': 8.53, 'QAR': 11.94, 'BHD': 1.23, 'OMR': 1.25 },
      'QAR': { 'SAR': 0.73, 'AED': 0.71, 'KWD': 0.084, 'BHD': 0.103, 'OMR': 0.105 },
      'BHD': { 'SAR': 7.09, 'AED': 6.95, 'KWD': 0.81, 'QAR': 9.72, 'OMR': 1.02 },
      'OMR': { 'SAR': 6.95, 'AED': 6.81, 'KWD': 0.80, 'QAR': 9.52, 'BHD': 0.98 }
    };

    if (fromCurrency === toCurrency) return amount;

    const rate = exchangeRates[fromCurrency]?.[toCurrency];
    if (!rate) {
      throw new Error(`Exchange rate not available for ${fromCurrency} to ${toCurrency}`);
    }

    return Number((amount * rate).toFixed(3));
  }

  // Get market metrics
  async getMarketMetrics(marketId: string): Promise<MarketMetrics> {
    try {
      const { data, error } = await this.supabase
        .from('market_metrics')
        .select('*')
        .eq('market_id', marketId)
        .single();

      if (error) {
        // Return mock data if no real data exists
        return this.generateMockMetrics(marketId);
      }

      return data;
    } catch (error) {
      return this.generateMockMetrics(marketId);
    }
  }

  // Generate mock metrics for development
  private generateMockMetrics(marketId: string): MarketMetrics {
    const baseMetrics: Record<string, Partial<MarketMetrics>> = {
      'SA': { total_vendors: 15000, total_customers: 250000, monthly_revenue: 12500000 },
      'AE': { total_vendors: 8000, total_customers: 120000, monthly_revenue: 8200000 },
      'KW': { total_vendors: 3500, total_customers: 45000, monthly_revenue: 3800000 },
      'QA': { total_vendors: 2500, total_customers: 35000, monthly_revenue: 3200000 },
      'BH': { total_vendors: 1200, total_customers: 18000, monthly_revenue: 1500000 },
      'OM': { total_vendors: 1800, total_customers: 25000, monthly_revenue: 2100000 }
    };

    const base = baseMetrics[marketId] || baseMetrics['SA'];

    return {
      market_id: marketId,
      total_vendors: base.total_vendors || 1000,
      total_customers: base.total_customers || 10000,
      monthly_revenue: base.monthly_revenue || 1000000,
      average_order_value: 250,
      growth_rate: 15 + Math.random() * 10, // 15-25% growth
      market_penetration: 5 + Math.random() * 15 // 5-20% penetration
    };
  }

  // Check market availability for product/service
  async checkMarketAvailability(
    productId: string,
    marketId: string
  ): Promise<{
    available: boolean;
    restrictions?: string[];
    compliance_required?: string[];
    estimated_delivery_days?: number;
  }> {
    const market = this.getMarket(marketId);
    if (!market) {
      return { available: false, restrictions: ['Market not supported'] };
    }

    // Mock availability check
    const available = Math.random() > 0.1; // 90% availability
    
    if (!available) {
      return {
        available: false,
        restrictions: ['Product not available in this market', 'Regulatory restrictions']
      };
    }

    return {
      available: true,
      compliance_required: market.regulations.compliance_requirements.slice(0, 2),
      estimated_delivery_days: marketId === 'SA' ? 1 : 2 + Math.floor(Math.random() * 3)
    };
  }

  // Get business hours for market
  getBusinessHours(marketId: string): { open: boolean; next_open?: string; next_close?: string } {
    const market = this.getMarket(marketId);
    if (!market) {
      return { open: false };
    }

    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'lowercase' });
    const currentTime = now.toTimeString().substring(0, 5);

    const isWeekend = market.business_hours.weekend.includes(currentDay);
    const isBusinessHours = currentTime >= market.business_hours.start && 
                           currentTime <= market.business_hours.end;

    return {
      open: !isWeekend && isBusinessHours,
      next_open: isWeekend || !isBusinessHours ? market.business_hours.start : undefined,
      next_close: isBusinessHours ? market.business_hours.end : undefined
    };
  }

  // Format price for market
  formatPrice(amount: number, marketId: string): string {
    const settings = this.getLocalizationSettings(marketId);
    const formattedAmount = amount.toLocaleString('en-US', {
      minimumFractionDigits: marketId === 'KW' || marketId === 'BH' || marketId === 'OM' ? 3 : 2,
      maximumFractionDigits: marketId === 'KW' || marketId === 'BH' || marketId === 'OM' ? 3 : 2
    });

    return settings.currency_position === 'before' 
      ? `${settings.currency_symbol} ${formattedAmount}`
      : `${formattedAmount} ${settings.currency_symbol}`;
  }

  // Log market activity
  async logMarketActivity(marketId: string, activity: string, data: any): Promise<void> {
    try {
      await this.supabase.from('market_activity_logs').insert({
        market_id: marketId,
        activity,
        data,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to log market activity:', error);
    }
  }

  // Get market expansion roadmap
  getExpansionRoadmap(): Array<{
    market: string;
    phase: number;
    timeline: string;
    investment: string;
    target_metrics: Record<string, number>;
    key_milestones: string[];
  }> {
    return [
      {
        market: 'UAE',
        phase: 3,
        timeline: 'Q3 2025',
        investment: '$5M',
        target_metrics: { vendors: 5000, customers: 50000, revenue: 5000000 },
        key_milestones: [
          'Emirates NBD payment integration',
          'Dubai logistics hub setup',
          'Local vendor onboarding program',
          'Arabic/English localization'
        ]
      },
      {
        market: 'Kuwait',
        phase: 3,
        timeline: 'Q4 2025',
        investment: '$3M',
        target_metrics: { vendors: 2000, customers: 25000, revenue: 2500000 },
        key_milestones: [
          'KNET payment integration',
          'Oil sector partnerships',
          'Kuwait compliance certification',
          'Local courier partnerships'
        ]
      },
      {
        market: 'Qatar',
        phase: 3,
        timeline: 'Q1 2026',
        investment: '$4M',
        target_metrics: { vendors: 1500, customers: 20000, revenue: 3000000 },
        key_milestones: [
          'QNB payment integration',
          'FIFA legacy projects',
          'Luxury goods specialization',
          'Construction sector focus'
        ]
      }
    ];
  }
}

export const gccMarketManager = new GCCMarketManager();


