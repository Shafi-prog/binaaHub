/**
 * Kuwait Market Manager
 * Handles Kuwait-specific market expansion, oil sector focus, payments, and compliance
 */

export interface KuwaitMarketConfig {
  currency: string;
  paymentMethods: KuwaitPaymentMethod[];
  logistics: KuwaitLogisticsProvider[];
  regulations: KuwaitRegulation[];
  localization: KuwaitLocalization;
  businessRegistration: KuwaitBusinessRequirements;
  oilSectorIntegration: KuwaitOilSectorConfig;
}

export interface KuwaitPaymentMethod {
  id: string;
  name: string;
  type: 'bank' | 'digital' | 'card' | 'installment' | 'oil_sector';
  provider: string;
  currency: string[];
  fees: {
    percentage: number;
    fixed: number;
    minimum: number;
    maximum: number;
  };
  processing_time: string;
  verification_required: boolean;
  compliance: string[];
  oil_sector_compatible: boolean;
}

export interface KuwaitLogisticsProvider {
  id: string;
  name: string;
  type: 'express' | 'standard' | 'economy' | 'oil_equipment' | 'industrial';
  coverage: string[];
  weight_limits: {
    min: number;
    max: number;
  };
  delivery_time: string;
  cost_per_kg: number;
  cost_per_km: number;
  tracking: boolean;
  insurance: boolean;
  hazmat_certified: boolean;
  oil_sector_approved: boolean;
}

export interface KuwaitRegulation {
  id: string;
  category: string;
  title: string;
  description: string;
  authority: string;
  compliance_level: 'mandatory' | 'recommended' | 'optional';
  penalties: string;
  update_frequency: string;
  last_updated: Date;
  oil_sector_specific: boolean;
}

export interface KuwaitLocalization {
  languages: string[];
  currencies: string[];
  date_format: string;
  number_format: string;
  phone_format: string;
  address_format: KuwaitAddressFormat;
  business_hours: KuwaitBusinessHours;
  holidays: KuwaitHoliday[];
  cultural_considerations: string[];
  oil_sector_terminology: Record<string, string>;
}

export interface KuwaitAddressFormat {
  street_required: boolean;
  block_required: boolean;
  building_required: boolean;
  apartment_required: boolean;
  area_required: boolean;
  governorate_required: boolean;
  postal_code_required: boolean;
}

export interface KuwaitBusinessHours {
  weekdays: string;
  friday: string;
  saturday: string;
  ramadan_hours: string;
  oil_sector_hours: string;
  public_holidays: string;
}

export interface KuwaitHoliday {
  id: string;
  name: string;
  date: string;
  type: 'national' | 'religious' | 'cultural' | 'oil_industry';
  affects_business: boolean;
  affects_delivery: boolean;
  affects_oil_operations: boolean;
}

export interface KuwaitBusinessRequirements {
  license_types: KuwaitLicenseType[];
  registration_process: KuwaitRegistrationStep[];
  compliance_requirements: string[];
  tax_information: KuwaitTaxInfo;
  documentation_required: string[];
  oil_sector_requirements: KuwaitOilSectorRequirements;
}

export interface KuwaitLicenseType {
  id: string;
  name: string;
  category: string;
  description: string;
  requirements: string[];
  cost: number;
  validity_period: string;
  renewal_process: string;
  oil_sector_applicable: boolean;
}

export interface KuwaitRegistrationStep {
  step: number;
  title: string;
  description: string;
  authority: string;
  documents_required: string[];
  estimated_time: string;
  cost: number;
  online_available: boolean;
  oil_sector_specific: boolean;
}

export interface KuwaitTaxInfo {
  corporate_tax_rate: number;
  withholding_tax_rate: number;
  zakat_applicable: boolean;
  oil_sector_tax_rate: number;
  exemptions: string[];
  filing_frequency: string;
  due_dates: Record<string, string>;
}

export interface KuwaitOilSectorRequirements {
  koc_registration: boolean;
  knpc_approval: boolean;
  kgoc_certification: boolean;
  safety_certifications: string[];
  environmental_permits: string[];
  technical_specifications: string[];
}

export interface KuwaitOilSectorConfig {
  major_companies: KuwaitOilCompany[];
  equipment_categories: string[];
  safety_standards: string[];
  environmental_requirements: string[];
  procurement_processes: KuwaitProcurementProcess[];
}

export interface KuwaitOilCompany {
  id: string;
  name: string;
  type: 'upstream' | 'downstream' | 'integrated' | 'service';
  contact_info: {
    headquarters: string;
    phone: string;
    email: string;
    procurement_contact: string;
  };
  preferred_suppliers: string[];
  procurement_portal: string;
  payment_terms: string;
}

export interface KuwaitProcurementProcess {
  company: string;
  process_type: 'tender' | 'direct_purchase' | 'framework' | 'emergency';
  minimum_threshold: number;
  documentation_required: string[];
  evaluation_criteria: string[];
  timeline: string;
  payment_terms: string;
}

export class KuwaitMarketManager {
  private config: KuwaitMarketConfig;
  private cache: Map<string, any> = new Map();

  constructor() {
    this.config = this.initializeKuwaitConfig();
  }

  private initializeKuwaitConfig(): KuwaitMarketConfig {
    return {
      currency: 'KWD',
      paymentMethods: [
        {
          id: 'nbk',
          name: 'National Bank of Kuwait',
          type: 'bank',
          provider: 'NBK',
          currency: ['KWD', 'USD', 'EUR'],
          fees: {
            percentage: 2.0,
            fixed: 1.5,
            minimum: 3,
            maximum: 50
          },
          processing_time: '24-48 hours',
          verification_required: true,
          compliance: ['Central Bank of Kuwait', 'Anti-Money Laundering'],
          oil_sector_compatible: true
        },
        {
          id: 'cbk',
          name: 'Commercial Bank of Kuwait',
          type: 'bank',
          provider: 'CBK',
          currency: ['KWD', 'USD'],
          fees: {
            percentage: 2.2,
            fixed: 2,
            minimum: 4,
            maximum: 75
          },
          processing_time: '24-72 hours',
          verification_required: true,
          compliance: ['Central Bank of Kuwait', 'FATCA'],
          oil_sector_compatible: true
        },
        {
          id: 'kib',
          name: 'Kuwait International Bank',
          type: 'bank',
          provider: 'KIB',
          currency: ['KWD'],
          fees: {
            percentage: 1.8,
            fixed: 1,
            minimum: 2,
            maximum: 40
          },
          processing_time: '24-48 hours',
          verification_required: true,
          compliance: ['Central Bank of Kuwait', 'Sharia Compliance'],
          oil_sector_compatible: true
        },
        {
          id: 'knet',
          name: 'K-Net',
          type: 'digital',
          provider: 'Kuwait Net',
          currency: ['KWD'],
          fees: {
            percentage: 1.0,
            fixed: 0.5,
            minimum: 1,
            maximum: 25
          },
          processing_time: 'Instant',
          verification_required: false,
          compliance: ['Central Bank of Kuwait'],
          oil_sector_compatible: false
        },
        {
          id: 'koc-procurement',
          name: 'KOC Procurement System',
          type: 'oil_sector',
          provider: 'Kuwait Oil Company',
          currency: ['KWD', 'USD'],
          fees: {
            percentage: 0.5,
            fixed: 0,
            minimum: 0,
            maximum: 1000
          },
          processing_time: '30-90 days',
          verification_required: true,
          compliance: ['KOC Standards', 'ISO 9001', 'HSE Requirements'],
          oil_sector_compatible: true
        }
      ],
      logistics: [
        {
          id: 'kuwait-post',
          name: 'Kuwait Post',
          type: 'standard',
          coverage: ['All Kuwait Governorates'],
          weight_limits: { min: 0.1, max: 30 },
          delivery_time: '2-5 business days',
          cost_per_kg: 8,
          cost_per_km: 0.3,
          tracking: true,
          insurance: true,
          hazmat_certified: false,
          oil_sector_approved: false
        },
        {
          id: 'aramex-kuwait',
          name: 'Aramex Kuwait',
          type: 'express',
          coverage: ['Kuwait City', 'Hawalli', 'Farwaniya', 'Mubarak Al-Kabeer'],
          weight_limits: { min: 0.1, max: 50 },
          delivery_time: '24-48 hours',
          cost_per_kg: 15,
          cost_per_km: 0.8,
          tracking: true,
          insurance: true,
          hazmat_certified: true,
          oil_sector_approved: true
        },
        {
          id: 'oil-equipment-logistics',
          name: 'Kuwait Oil Equipment Transport',
          type: 'oil_equipment',
          coverage: ['All Kuwait', 'Oil Fields', 'Refineries'],
          weight_limits: { min: 1, max: 10000 },
          delivery_time: '3-7 business days',
          cost_per_kg: 2,
          cost_per_km: 3,
          tracking: true,
          insurance: true,
          hazmat_certified: true,
          oil_sector_approved: true
        },
        {
          id: 'industrial-transport',
          name: 'Kuwait Industrial Transport',
          type: 'industrial',
          coverage: ['Industrial Areas', 'Free Trade Zone'],
          weight_limits: { min: 10, max: 5000 },
          delivery_time: '2-4 business days',
          cost_per_kg: 5,
          cost_per_km: 2,
          tracking: true,
          insurance: true,
          hazmat_certified: true,
          oil_sector_approved: true
        }
      ],
      regulations: [
        {
          id: 'kuwait-consumer-protection',
          category: 'Consumer Rights',
          title: 'Kuwait Consumer Protection Law',
          description: 'Consumer rights and business obligations',
          authority: 'Ministry of Commerce and Industry',
          compliance_level: 'mandatory',
          penalties: 'Fines up to KWD 50,000',
          update_frequency: 'Annual review',
          last_updated: new Date('2024-01-01'),
          oil_sector_specific: false
        },
        {
          id: 'oil-industry-regulation',
          category: 'Oil & Gas',
          title: 'Oil Industry Safety and Environmental Standards',
          description: 'Comprehensive safety and environmental regulations for oil sector',
          authority: 'Kuwait Petroleum Corporation',
          compliance_level: 'mandatory',
          penalties: 'License suspension, fines up to KWD 1,000,000',
          update_frequency: 'Quarterly review',
          last_updated: new Date('2024-06-01'),
          oil_sector_specific: true
        },
        {
          id: 'ecommerce-law-kuwait',
          category: 'E-commerce',
          title: 'Electronic Commerce and Digital Transactions Law',
          description: 'Digital business regulations and cybersecurity requirements',
          authority: 'Central Agency for Information Technology',
          compliance_level: 'mandatory',
          penalties: 'Business closure, fines up to KWD 100,000',
          update_frequency: 'Bi-annual',
          last_updated: new Date('2024-03-01'),
          oil_sector_specific: false
        }
      ],
      localization: {
        languages: ['Arabic', 'English'],
        currencies: ['KWD', 'USD'],
        date_format: 'DD/MM/YYYY',
        number_format: '1,234.567',
        phone_format: '+965-XXXX-XXXX',
        address_format: {
          street_required: true,
          block_required: true,
          building_required: true,
          apartment_required: false,
          area_required: true,
          governorate_required: true,
          postal_code_required: true
        },
        business_hours: {
          weekdays: '8:00 AM - 5:00 PM',
          friday: '1:30 PM - 5:00 PM',
          saturday: '8:00 AM - 1:00 PM',
          ramadan_hours: '9:00 AM - 3:00 PM',
          oil_sector_hours: '24/7 operations with shift schedules',
          public_holidays: 'Closed'
        },
        holidays: [
          {
            id: 'kuwait-national-day',
            name: 'Kuwait National Day',
            date: '2024-02-25',
            type: 'national',
            affects_business: true,
            affects_delivery: true,
            affects_oil_operations: false
          },
          {
            id: 'liberation-day',
            name: 'Liberation Day',
            date: '2024-02-26',
            type: 'national',
            affects_business: true,
            affects_delivery: true,
            affects_oil_operations: false
          },
          {
            id: 'oil-industry-day',
            name: 'Kuwait Oil Industry Day',
            date: '2024-12-23',
            type: 'oil_industry',
            affects_business: false,
            affects_delivery: false,
            affects_oil_operations: true
          }
        ],
        cultural_considerations: [
          'Strong Islamic values and traditions',
          'Respect for Kuwaiti heritage and customs',
          'Friday prayer time business closures',
          'Ramadan working hour adjustments',
          'Conservative business dress code',
          'Emphasis on personal relationships in business'
        ],
        oil_sector_terminology: {
          'upstream': 'الأنشطة الاستكشافية والإنتاجية',
          'downstream': 'أنشطة التكرير والتسويق',
          'crude_oil': 'النفط الخام',
          'refinery': 'المصفاة',
          'petrochemicals': 'البتروكيماويات',
          'drilling': 'الحفر',
          'production': 'الإنتاج',
          'pipeline': 'الأنابيب',
          'terminal': 'المحطة',
          'storage': 'التخزين'
        }
      },
      businessRegistration: {
        license_types: [
          {
            id: 'commercial-license-kuwait',
            name: 'Commercial License',
            category: 'Trading',
            description: 'General trading and retail business activities',
            requirements: ['Kuwaiti partner (51% ownership)', 'Minimum capital KWD 1,000'],
            cost: 5000,
            validity_period: '1 year',
            renewal_process: 'Annual renewal with MOCI',
            oil_sector_applicable: false
          },
          {
            id: 'industrial-license',
            name: 'Industrial License',
            category: 'Manufacturing',
            description: 'Manufacturing and industrial operations',
            requirements: ['Environmental approval', 'Technical specifications'],
            cost: 15000,
            validity_period: '5 years',
            renewal_process: 'Renewal every 5 years',
            oil_sector_applicable: true
          },
          {
            id: 'oil-services-license',
            name: 'Oil Services License',
            category: 'Oil & Gas Services',
            description: 'Specialized services for oil and gas industry',
            requirements: ['KOC pre-qualification', 'HSE certification', 'Technical competency'],
            cost: 25000,
            validity_period: '3 years',
            renewal_process: 'Performance-based renewal',
            oil_sector_applicable: true
          }
        ],
        registration_process: [
          {
            step: 1,
            title: 'Company Name Reservation',
            description: 'Reserve company name with MOCI',
            authority: 'Ministry of Commerce and Industry',
            documents_required: ['Application form', 'Passport copies'],
            estimated_time: '1-2 days',
            cost: 100,
            online_available: true,
            oil_sector_specific: false
          },
          {
            step: 2,
            title: 'License Application',
            description: 'Submit business license application',
            authority: 'MOCI or Free Trade Zone',
            documents_required: ['MOA', 'Lease agreement', 'Capital proof'],
            estimated_time: '5-10 days',
            cost: 5000,
            online_available: true,
            oil_sector_specific: false
          },
          {
            step: 3,
            title: 'Oil Sector Pre-qualification',
            description: 'Additional qualification for oil sector suppliers',
            authority: 'Kuwait Oil Company',
            documents_required: ['Technical capabilities', 'HSE records', 'Financial statements'],
            estimated_time: '30-90 days',
            cost: 10000,
            online_available: false,
            oil_sector_specific: true
          }
        ],
        compliance_requirements: [
          'Corporate tax compliance (15%)',
          'Zakat payment (if applicable)',
          'Environmental impact assessment',
          'Worker safety compliance',
          'Anti-corruption compliance',
          'Cybersecurity standards (for digital businesses)'
        ],
        tax_information: {
          corporate_tax_rate: 15,
          withholding_tax_rate: 10,
          zakat_applicable: true,
          oil_sector_tax_rate: 15,
          exemptions: ['Educational services', 'Healthcare', 'Charitable organizations'],
          filing_frequency: 'Annual',
          due_dates: {
            'Corporate Tax Return': '4 months after financial year end',
            'Withholding Tax': 'Monthly within 15 days'
          }
        },
        documentation_required: [
          'Civil ID copy',
          'Passport with Kuwait visa',
          'Commercial license copy',
          'Lease agreement',
          'Bank account details',
          'Insurance certificates'
        ],
        oil_sector_requirements: {
          koc_registration: true,
          knpc_approval: true,
          kgoc_certification: true,
          safety_certifications: [
            'ISO 45001 (Occupational Health and Safety)',
            'ISO 14001 (Environmental Management)',
            'API Certifications (for oil equipment)',
            'NACE Certification (for corrosion control)'
          ],
          environmental_permits: [
            'Environmental Impact Assessment',
            'Waste Management Permit',
            'Air Quality Permit',
            'Water Usage Permit'
          ],
          technical_specifications: [
            'Equipment specifications and certifications',
            'Quality management system (ISO 9001)',
            'Technical personnel qualifications',
            'Maintenance and service capabilities'
          ]
        }
      },
      oilSectorIntegration: {
        major_companies: [
          {
            id: 'koc',
            name: 'Kuwait Oil Company',
            type: 'upstream',
            contact_info: {
              headquarters: 'Ahmad Al-Jaber Oil & Gas Building, Kuwait City',
              phone: '+965-2398-0000',
              email: 'info@kockw.com',
              procurement_contact: 'procurement@kockw.com'
            },
            preferred_suppliers: ['International oil service companies', 'Local authorized dealers'],
            procurement_portal: 'https://procurement.kockw.com',
            payment_terms: 'Net 90 days'
          },
          {
            id: 'knpc',
            name: 'Kuwait National Petroleum Company',
            type: 'downstream',
            contact_info: {
              headquarters: 'KNPC Tower, Shuwaikh Industrial Area',
              phone: '+965-2395-0000',
              email: 'info@knpc.com',
              procurement_contact: 'purchasing@knpc.com'
            },
            preferred_suppliers: ['Refinery equipment suppliers', 'Chemical suppliers'],
            procurement_portal: 'https://suppliers.knpc.com',
            payment_terms: 'Net 60 days'
          },
          {
            id: 'kpc',
            name: 'Kuwait Petroleum Corporation',
            type: 'integrated',
            contact_info: {
              headquarters: 'KPC Tower, Kuwait City',
              phone: '+965-2240-4444',
              email: 'info@kpc.com.kw',
              procurement_contact: 'procurement@kpc.com.kw'
            },
            preferred_suppliers: ['Major international contractors', 'Technology providers'],
            procurement_portal: 'https://procurement.kpc.com.kw',
            payment_terms: 'Net 120 days'
          }
        ],
        equipment_categories: [
          'Drilling Equipment',
          'Production Equipment',
          'Refinery Equipment',
          'Pipeline Equipment',
          'Safety Equipment',
          'Instrumentation & Control',
          'Maintenance Tools',
          'Transportation Equipment',
          'Environmental Equipment',
          'Laboratory Equipment'
        ],
        safety_standards: [
          'Kuwait HSE Management System',
          'International Safety Standards (API, ASME)',
          'Fire Safety and Prevention',
          'Personal Protective Equipment Standards',
          'Emergency Response Procedures',
          'Confined Space Entry Requirements',
          'Hot Work Permit Systems',
          'Chemical Handling and Storage'
        ],
        environmental_requirements: [
          'Environmental Impact Assessment',
          'Waste Management Compliance',
          'Air Quality Standards',
          'Water Protection Measures',
          'Soil Contamination Prevention',
          'Noise Level Compliance',
          'Energy Efficiency Standards',
          'Carbon Footprint Reduction'
        ],
        procurement_processes: [
          {
            company: 'Kuwait Oil Company',
            process_type: 'tender',
            minimum_threshold: 50000,
            documentation_required: [
              'Technical specifications',
              'Commercial proposal',
              'Company profile and references',
              'HSE compliance certificates',
              'Quality assurance documentation'
            ],
            evaluation_criteria: [
              'Technical compliance (40%)',
              'Commercial competitiveness (30%)',
              'HSE performance (20%)',
              'Local content (10%)'
            ],
            timeline: '60-90 days',
            payment_terms: 'Net 90 days with performance bond'
          },
          {
            company: 'Kuwait National Petroleum Company',
            process_type: 'framework',
            minimum_threshold: 25000,
            documentation_required: [
              'Framework agreement compliance',
              'Delivery schedule',
              'Quality certificates',
              'Insurance coverage'
            ],
            evaluation_criteria: [
              'Price competitiveness (50%)',
              'Delivery capability (30%)',
              'Quality assurance (20%)'
            ],
            timeline: '30-45 days',
            payment_terms: 'Net 60 days'
          }
        ]
      }
    };
  }

  // Market expansion methods
  async expandToKuwait(): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const setupSteps = [
        'Kuwait banking integration',
        'Oil sector partnerships',
        'Logistics network setup',
        'Regulatory compliance',
        'Arabic localization',
        'Business registration assistance'
      ];

      const results = [];
      for (const step of setupSteps) {
        results.push(await this.executeSetupStep(step));
      }

      return {
        success: true,
        message: 'Kuwait market expansion initiated successfully',
        data: {
          market: 'Kuwait',
          setup_steps: results,
          oil_sector_focus: {
            major_companies: this.config.oilSectorIntegration.major_companies.length,
            equipment_categories: this.config.oilSectorIntegration.equipment_categories.length,
            compliance_ready: true
          },
          next_actions: [
            'Establish partnerships with KOC and KNPC',
            'Set up Kuwait City office',
            'Hire oil sector specialists',
            'Launch targeted oil industry campaigns'
          ]
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `Kuwait expansion failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async executeSetupStep(step: string): Promise<{ step: string; status: string; details: any }> {
    const stepConfig = {
      'Kuwait banking integration': {
        banks: this.config.paymentMethods.filter(p => p.type === 'bank').map(p => p.name),
        oil_sector_compatible: this.config.paymentMethods.filter(p => p.oil_sector_compatible).length
      },
      'Oil sector partnerships': {
        major_companies: this.config.oilSectorIntegration.major_companies.map(c => c.name),
        procurement_portals: 'Integrated',
        compliance_level: '100% ready'
      },
      'Logistics network setup': {
        providers: this.config.logistics.map(l => l.name),
        oil_equipment_capable: this.config.logistics.filter(l => l.oil_sector_approved).length,
        hazmat_certified: this.config.logistics.filter(l => l.hazmat_certified).length
      },
      'Regulatory compliance': {
        regulations: this.config.regulations.length,
        oil_sector_specific: this.config.regulations.filter(r => r.oil_sector_specific).length,
        compliance_level: '100% ready'
      },
      'Arabic localization': {
        languages: this.config.localization.languages,
        oil_terminology: Object.keys(this.config.localization.oil_sector_terminology).length,
        cultural_adaptations: 'Implemented'
      },
      'Business registration assistance': {
        license_types: this.config.businessRegistration.license_types.length,
        oil_sector_licenses: this.config.businessRegistration.license_types.filter(l => l.oil_sector_applicable).length,
        guidance_available: true
      }
    };

    return {
      step,
      status: 'completed',
      details: stepConfig[step as keyof typeof stepConfig] || {}
    };
  }

  // Oil sector specific methods
  getOilSectorCompanies(): KuwaitOilCompany[] {
    return this.config.oilSectorIntegration.major_companies;
  }

  getOilEquipmentCategories(): string[] {
    return this.config.oilSectorIntegration.equipment_categories;
  }

  checkOilSectorCompliance(supplierProfile: any): { compliant: boolean; requirements: string[]; recommendations: string[] } {
    const requirements = this.config.businessRegistration.oil_sector_requirements;
    
    return {
      compliant: true, // Simplified for demo
      requirements: [
        'KOC registration and pre-qualification',
        'ISO 45001 safety certification',
        'Environmental permits',
        'Technical personnel qualifications'
      ],
      recommendations: [
        'Establish local partnerships',
        'Invest in HSE training',
        'Obtain API certifications',
        'Develop Arabic language capabilities'
      ]
    };
  }

  getProcurementProcess(company: string, value: number): KuwaitProcurementProcess | null {
    return this.config.oilSectorIntegration.procurement_processes.find(
      p => p.company.toLowerCase().includes(company.toLowerCase()) && value >= p.minimum_threshold
    ) || null;
  }

  // Payment methods with oil sector focus
  getOilSectorPaymentMethods(): KuwaitPaymentMethod[] {
    return this.config.paymentMethods.filter(method => method.oil_sector_compatible);
  }

  // Logistics with hazmat and oil equipment capability
  getOilSectorLogistics(): KuwaitLogisticsProvider[] {
    return this.config.logistics.filter(provider => provider.oil_sector_approved);
  }

  // Currency and localization
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('ar-KW', {
      style: 'currency',
      currency: 'KWD',
      minimumFractionDigits: 3
    }).format(amount);
  }

  formatPhoneNumber(phone: string): string {
    // Format to Kuwait standard: +965-XXXX-XXXX
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('965')) {
      return cleaned.replace(/^965(\d{4})(\d{4})$/, '+965-$1-$2');
    }
    return phone;
  }

  translateOilTerm(englishTerm: string): string {
    return this.config.localization.oil_sector_terminology[englishTerm.toLowerCase()] || englishTerm;
  }

  isBusinessHours(): boolean {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 5 = Friday, 6 = Saturday
    const hour = now.getHours();

    if (day === 5) { // Friday
      return hour >= 13.5 && hour < 17; // 1:30 PM - 5:00 PM
    } else if (day === 6) { // Saturday
      return hour >= 8 && hour < 13; // 8 AM - 1 PM
    } else { // Sunday to Thursday
      return hour >= 8 && hour < 17; // 8 AM - 5 PM
    }
  }

  // Business registration assistance
  getBusinessRequirements(): KuwaitBusinessRequirements {
    return this.config.businessRegistration;
  }

  calculateRegistrationCost(licenseType: string, includeOilSector: boolean = false): { total: number; breakdown: Record<string, number> } {
    const license = this.config.businessRegistration.license_types.find(
      lt => lt.id === licenseType
    );

    if (!license) {
      return { total: 0, breakdown: {} };
    }

    const breakdown: Record<string, number> = {
      'License Fee': license.cost,
      'Name Reservation': 100,
      'Government Fees': 1000,
      'Documentation': 300
    };

    if (includeOilSector && license.oil_sector_applicable) {
      breakdown['Oil Sector Pre-qualification'] = 10000;
      breakdown['HSE Certification'] = 5000;
      breakdown['Technical Assessment'] = 3000;
    }

    return {
      total: Object.values(breakdown).reduce((sum, cost) => sum + cost, 0),
      breakdown
    };
  }

  // Cache management
  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export default KuwaitMarketManager;
