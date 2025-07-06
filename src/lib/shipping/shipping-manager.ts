import { createClient } from '@supabase/supabase-js';

// Shipping Provider Types
export interface ShippingProvider {
  id: string;
  name: string;
  type: 'express' | 'standard' | 'economy' | 'international' | 'local';
  isActive: boolean;
  config: Record<string, any>;
  supportedCountries: string[];
  features: string[];
  estimatedDays: {
    domestic: { min: number; max: number };
    international: { min: number; max: number };
  };
}

export interface ShippingRate {
  provider_id: string;
  service_type: string;
  cost: number;
  currency: string;
  estimated_days: number;
  tracking_available: boolean;
  insurance_available: boolean;
}

export interface ShippingRequest {
  origin: {
    country: string;
    city: string;
    postal_code: string;
    address: string;
  };
  destination: {
    country: string;
    city: string;
    postal_code: string;
    address: string;
  };
  package: {
    weight: number; // in kg
    dimensions: {
      length: number; // in cm
      width: number;
      height: number;
    };
    value: number;
    description: string;
  };
  service_type?: string;
  insurance?: boolean;
  signature_required?: boolean;
  delivery_instructions?: string;
}

export interface ShippingLabel {
  provider_id: string;
  tracking_number: string;
  label_url: string;
  cost: number;
  estimated_delivery: string;
  service_type: string;
}

export interface TrackingInfo {
  tracking_number: string;
  status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'exception';
  location: string;
  timestamp: string;
  description: string;
  events: TrackingEvent[];
}

export interface TrackingEvent {
  timestamp: string;
  location: string;
  status: string;
  description: string;
}

export class ShippingManager {
  private supabase;
  private providers: Map<string, ShippingProvider> = new Map();

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    this.initializeProviders();
  }

  private initializeProviders() {
    // DHL Express
    this.providers.set('dhl', {
      id: 'dhl',
      name: 'DHL Express',
      type: 'express',
      isActive: true,
      config: {
        api_key: process.env.DHL_API_KEY,
        account_number: process.env.DHL_ACCOUNT_NUMBER,
        api_url: 'https://api.dhl.com/mydhlapi'
      },
      supportedCountries: ['SA', 'AE', 'KW', 'QA', 'BH', 'OM', 'US', 'EU', 'UK', 'CN', 'IN'],
      features: ['tracking', 'insurance', 'signature', 'customs', 'express_delivery'],
      estimatedDays: {
        domestic: { min: 1, max: 2 },
        international: { min: 2, max: 5 }
      }
    });

    // FedEx
    this.providers.set('fedex', {
      id: 'fedex',
      name: 'FedEx',
      type: 'express',
      isActive: true,
      config: {
        api_key: process.env.FEDEX_API_KEY,
        secret_key: process.env.FEDEX_SECRET_KEY,
        account_number: process.env.FEDEX_ACCOUNT_NUMBER,
        api_url: 'https://apis.fedex.com'
      },
      supportedCountries: ['SA', 'AE', 'KW', 'QA', 'BH', 'OM', 'US', 'EU', 'UK', 'CN', 'IN', 'JP'],
      features: ['tracking', 'insurance', 'signature', 'customs', 'overnight', 'ground'],
      estimatedDays: {
        domestic: { min: 1, max: 3 },
        international: { min: 2, max: 7 }
      }
    });

    // Aramex
    this.providers.set('aramex', {
      id: 'aramex',
      name: 'Aramex',
      type: 'standard',
      isActive: true,
      config: {
        username: process.env.ARAMEX_USERNAME,
        password: process.env.ARAMEX_PASSWORD,
        account_number: process.env.ARAMEX_ACCOUNT_NUMBER,
        api_url: 'https://ws.aramex.net'
      },
      supportedCountries: ['SA', 'AE', 'KW', 'QA', 'BH', 'OM', 'JO', 'LB', 'EG', 'MA'],
      features: ['tracking', 'cod', 'insurance', 'regional_network'],
      estimatedDays: {
        domestic: { min: 1, max: 3 },
        international: { min: 3, max: 7 }
      }
    });

    // SMSA Express (Saudi Arabia)
    this.providers.set('smsa', {
      id: 'smsa',
      name: 'SMSA Express',
      type: 'local',
      isActive: true,
      config: {
        username: process.env.SMSA_USERNAME,
        password: process.env.SMSA_PASSWORD,
        api_url: 'https://api.smsaexpress.com'
      },
      supportedCountries: ['SA'],
      features: ['tracking', 'cod', 'same_day', 'next_day'],
      estimatedDays: {
        domestic: { min: 1, max: 2 },
        international: { min: 5, max: 10 }
      }
    });

    // Saudi Post
    this.providers.set('saudi_post', {
      id: 'saudi_post',
      name: 'Saudi Post',
      type: 'economy',
      isActive: true,
      config: {
        api_key: process.env.SAUDI_POST_API_KEY,
        api_url: 'https://api.sp.com.sa'
      },
      supportedCountries: ['SA'],
      features: ['tracking', 'cod', 'po_box_delivery'],
      estimatedDays: {
        domestic: { min: 2, max: 5 },
        international: { min: 7, max: 14 }
      }
    });

    // Emirates Post (UAE)
    this.providers.set('emirates_post', {
      id: 'emirates_post',
      name: 'Emirates Post',
      type: 'standard',
      isActive: true,
      config: {
        api_key: process.env.EMIRATES_POST_API_KEY,
        api_url: 'https://api.emiratespost.ae'
      },
      supportedCountries: ['AE'],
      features: ['tracking', 'cod', 'po_box_delivery'],
      estimatedDays: {
        domestic: { min: 1, max: 3 },
        international: { min: 5, max: 10 }
      }
    });

    // UPS
    this.providers.set('ups', {
      id: 'ups',
      name: 'UPS',
      type: 'express',
      isActive: true,
      config: {
        access_key: process.env.UPS_ACCESS_KEY,
        username: process.env.UPS_USERNAME,
        password: process.env.UPS_PASSWORD,
        api_url: 'https://onlinetools.ups.com'
      },
      supportedCountries: ['SA', 'AE', 'KW', 'QA', 'BH', 'OM', 'US', 'EU', 'UK', 'CA'],
      features: ['tracking', 'insurance', 'signature', 'customs', 'ground', 'air'],
      estimatedDays: {
        domestic: { min: 1, max: 4 },
        international: { min: 2, max: 8 }
      }
    });

    // Local Saudi Couriers
    this.providers.set('naqel', {
      id: 'naqel',
      name: 'Naqel Express',
      type: 'local',
      isActive: true,
      config: {
        api_key: process.env.NAQEL_API_KEY,
        api_url: 'https://api.naqelexpress.com'
      },
      supportedCountries: ['SA'],
      features: ['tracking', 'cod', 'same_day', 'next_day'],
      estimatedDays: {
        domestic: { min: 1, max: 2 },
        international: { min: 5, max: 10 }
      }
    });

    // J&T Express
    this.providers.set('jnt', {
      id: 'jnt',
      name: 'J&T Express',
      type: 'standard',
      isActive: true,
      config: {
        api_key: process.env.JNT_API_KEY,
        api_url: 'https://api.jtexpress.com.sa'
      },
      supportedCountries: ['SA', 'AE', 'KW', 'MY', 'SG', 'TH', 'VN', 'PH'],
      features: ['tracking', 'cod', 'regional_network'],
      estimatedDays: {
        domestic: { min: 1, max: 3 },
        international: { min: 3, max: 8 }
      }
    });
  }

  // Get all active shipping providers
  getActiveProviders(): ShippingProvider[] {
    return Array.from(this.providers.values()).filter(provider => provider.isActive);
  }

  // Get provider by ID
  getProvider(providerId: string): ShippingProvider | undefined {
    return this.providers.get(providerId);
  }

  // Get providers by type
  getProvidersByType(type: ShippingProvider['type']): ShippingProvider[] {
    return Array.from(this.providers.values()).filter(
      provider => provider.type === type && provider.isActive
    );
  }

  // Get providers for specific country
  getProvidersForCountry(countryCode: string): ShippingProvider[] {
    return Array.from(this.providers.values()).filter(
      provider => provider.supportedCountries.includes(countryCode) && provider.isActive
    );
  }

  // Get shipping rates from multiple providers
  async getShippingRates(request: ShippingRequest): Promise<ShippingRate[]> {
    try {
      const availableProviders = this.getProvidersForCountry(request.origin.country);
      const rates: ShippingRate[] = [];

      for (const provider of availableProviders) {
        try {
          const providerRates = await this.getProviderRates(provider, request);
          rates.push(...providerRates);
        } catch (error) {
          console.error(`Failed to get rates from ${provider.name}:`, error);
        }
      }

      // Sort by cost
      return rates.sort((a, b) => a.cost - b.cost);
    } catch (error) {
      console.error('Failed to get shipping rates:', error);
      return [];
    }
  }

  // Get rates from specific provider
  private async getProviderRates(provider: ShippingProvider, request: ShippingRequest): Promise<ShippingRate[]> {
    // Mock rate calculation based on provider characteristics
    const isInternational = request.origin.country !== request.destination.country;
    const baseRate = this.calculateBaseRate(provider, request, isInternational);
    
    const rates: ShippingRate[] = [];

    // Generate different service types based on provider features
    if (provider.features.includes('same_day') && !isInternational) {
      rates.push({
        provider_id: provider.id,
        service_type: 'same_day',
        cost: baseRate * 2.5,
        currency: 'SAR',
        estimated_days: 0,
        tracking_available: true,
        insurance_available: provider.features.includes('insurance')
      });
    }

    if (provider.features.includes('next_day') || provider.type === 'express') {
      rates.push({
        provider_id: provider.id,
        service_type: 'express',
        cost: baseRate * 1.8,
        currency: 'SAR',
        estimated_days: isInternational ? provider.estimatedDays.international.min : provider.estimatedDays.domestic.min,
        tracking_available: true,
        insurance_available: provider.features.includes('insurance')
      });
    }

    // Standard service
    rates.push({
      provider_id: provider.id,
      service_type: 'standard',
      cost: baseRate,
      currency: 'SAR',
      estimated_days: isInternational ? 
        Math.round((provider.estimatedDays.international.min + provider.estimatedDays.international.max) / 2) :
        Math.round((provider.estimatedDays.domestic.min + provider.estimatedDays.domestic.max) / 2),
      tracking_available: provider.features.includes('tracking'),
      insurance_available: provider.features.includes('insurance')
    });

    // Economy service for non-express providers
    if (provider.type !== 'express') {
      rates.push({
        provider_id: provider.id,
        service_type: 'economy',
        cost: baseRate * 0.7,
        currency: 'SAR',
        estimated_days: isInternational ? provider.estimatedDays.international.max : provider.estimatedDays.domestic.max,
        tracking_available: provider.features.includes('tracking'),
        insurance_available: false
      });
    }

    return rates;
  }

  // Calculate base shipping rate
  private calculateBaseRate(provider: ShippingProvider, request: ShippingRequest, isInternational: boolean): number {
    const { weight, dimensions, value } = request.package;
    
    // Calculate dimensional weight
    const dimensionalWeight = (dimensions.length * dimensions.width * dimensions.height) / 5000; // cm³ to kg
    const billableWeight = Math.max(weight, dimensionalWeight);
    
    // Base rate calculation
    let baseRate = 15; // Base rate in SAR
    
    // Weight-based pricing
    baseRate += billableWeight * 5;
    
    // International shipping surcharge
    if (isInternational) {
      baseRate *= 2.5;
    }
    
    // Provider type multiplier
    switch (provider.type) {
      case 'express':
        baseRate *= 1.5;
        break;
      case 'local':
        baseRate *= 0.8;
        break;
      case 'economy':
        baseRate *= 0.6;
        break;
    }
    
    // Value-based insurance (if valuable items)
    if (value > 1000) {
      baseRate += value * 0.01; // 1% of value
    }
    
    return Math.round(baseRate * 100) / 100; // Round to 2 decimal places
  }

  // Create shipping label
  async createShippingLabel(
    providerId: string,
    request: ShippingRequest,
    serviceType: string
  ): Promise<ShippingLabel> {
    const provider = this.getProvider(providerId);
    if (!provider) {
      throw new Error('Provider not found');
    }

    try {
      // Mock label creation
      const trackingNumber = this.generateTrackingNumber(providerId);
      const isInternational = request.origin.country !== request.destination.country;
      const estimatedDays = serviceType === 'express' ? 
        (isInternational ? provider.estimatedDays.international.min : provider.estimatedDays.domestic.min) :
        (isInternational ? provider.estimatedDays.international.max : provider.estimatedDays.domestic.max);

      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + estimatedDays);

      const rates = await this.getProviderRates(provider, request);
      const selectedRate = rates.find(r => r.service_type === serviceType) || rates[0];

      const label: ShippingLabel = {
        provider_id: providerId,
        tracking_number: trackingNumber,
        label_url: `https://labels.${provider.id}.com/${trackingNumber}.pdf`,
        cost: selectedRate.cost,
        estimated_delivery: estimatedDelivery.toISOString(),
        service_type: serviceType
      };

      // Log shipping label creation
      await this.logShippingActivity('label_created', {
        provider_id: providerId,
        tracking_number: trackingNumber,
        service_type: serviceType,
        cost: label.cost,
        origin: request.origin,
        destination: request.destination,
        package: request.package
      });

      return label;
    } catch (error) {
      console.error('Failed to create shipping label:', error);
      throw error;
    }
  }

  // Generate tracking number
  private generateTrackingNumber(providerId: string): string {
    const prefix = providerId.toUpperCase().substring(0, 3);
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  // Track shipment
  async trackShipment(trackingNumber: string): Promise<TrackingInfo> {
    try {
      // Determine provider from tracking number
      const providerId = this.getProviderFromTrackingNumber(trackingNumber);
      const provider = this.getProvider(providerId);
      
      if (!provider) {
        throw new Error('Unable to determine shipping provider');
      }

      // Mock tracking information
      const mockEvents = this.generateMockTrackingEvents(trackingNumber);
      const latestEvent = mockEvents[mockEvents.length - 1];

      const trackingInfo: TrackingInfo = {
        tracking_number: trackingNumber,
        status: latestEvent.status as TrackingInfo['status'],
        location: latestEvent.location,
        timestamp: latestEvent.timestamp,
        description: latestEvent.description,
        events: mockEvents
      };

      // Log tracking request
      await this.logShippingActivity('tracking_requested', {
        tracking_number: trackingNumber,
        provider_id: providerId,
        status: trackingInfo.status
      });

      return trackingInfo;
    } catch (error) {
      console.error('Failed to track shipment:', error);
      throw error;
    }
  }

  // Get provider from tracking number
  private getProviderFromTrackingNumber(trackingNumber: string): string {
    const prefix = trackingNumber.substring(0, 3).toLowerCase();
    
    // Map common prefixes to providers
    const prefixMap: Record<string, string> = {
      'dhl': 'dhl',
      'fed': 'fedex',
      'ara': 'aramex',
      'sms': 'smsa',
      'sau': 'saudi_post',
      'emi': 'emirates_post',
      'ups': 'ups',
      'naq': 'naqel',
      'jnt': 'jnt'
    };

    return prefixMap[prefix] || 'dhl'; // Default to DHL
  }

  // Generate mock tracking events
  private generateMockTrackingEvents(trackingNumber: string): TrackingEvent[] {
    const events: TrackingEvent[] = [];
    const now = new Date();
    
    // Generate events going backwards in time
    const statuses = [
      { status: 'pending', description: 'Shipment information received', hoursAgo: 48 },
      { status: 'picked_up', description: 'Package picked up from sender', hoursAgo: 36 },
      { status: 'in_transit', description: 'Package in transit to destination city', hoursAgo: 24 },
      { status: 'in_transit', description: 'Package arrived at sorting facility', hoursAgo: 12 },
      { status: 'out_for_delivery', description: 'Out for delivery', hoursAgo: 2 }
    ];

    const cities = ['Riyadh', 'Jeddah', 'Dammam', 'Medina', 'Mecca'];
    
    statuses.forEach((statusInfo, index) => {
      const eventTime = new Date(now.getTime() - statusInfo.hoursAgo * 60 * 60 * 1000);
      events.push({
        timestamp: eventTime.toISOString(),
        location: cities[index % cities.length],
        status: statusInfo.status,
        description: statusInfo.description
      });
    });

    // Sometimes add delivery event
    if (Math.random() > 0.7) {
      const deliveredTime = new Date(now.getTime() - 1 * 60 * 60 * 1000);
      events.push({
        timestamp: deliveredTime.toISOString(),
        location: 'Destination Address',
        status: 'delivered',
        description: 'Package delivered successfully'
      });
    }

    return events;
  }

  // Log shipping activity
  private async logShippingActivity(activity: string, data: any): Promise<void> {
    try {
      await this.supabase.from('shipping_logs').insert({
        activity,
        data,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to log shipping activity:', error);
    }
  }

  // Get shipping statistics
  async getShippingStats(period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<{
    total_shipments: number;
    delivered_shipments: number;
    in_transit_shipments: number;
    failed_shipments: number;
    delivery_rate: number;
    average_delivery_time: number;
    provider_breakdown: Record<string, any>;
    cost_breakdown: Record<string, number>;
  }> {
    try {
      const now = new Date();
      let startDate: Date;

      switch (period) {
        case 'day':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
      }

      const { data, error } = await this.supabase
        .from('shipping_logs')
        .select('*')
        .eq('activity', 'label_created')
        .gte('created_at', startDate.toISOString());

      if (error) throw error;

      const shipments = data || [];
      
      // Mock statistics calculation
      const totalShipments = shipments.length || 150;
      const deliveredShipments = Math.floor(totalShipments * 0.85);
      const inTransitShipments = Math.floor(totalShipments * 0.12);
      const failedShipments = totalShipments - deliveredShipments - inTransitShipments;

      // Provider breakdown
      const providerBreakdown: Record<string, any> = {};
      this.getActiveProviders().forEach(provider => {
        const providerShipments = Math.floor(totalShipments * Math.random() * 0.3);
        providerBreakdown[provider.id] = {
          total: providerShipments,
          delivered: Math.floor(providerShipments * 0.85),
          in_transit: Math.floor(providerShipments * 0.12),
          failed: Math.floor(providerShipments * 0.03),
          cost: Math.floor(providerShipments * 25 * (1 + Math.random()))
        };
      });

      // Cost breakdown
      const costBreakdown: Record<string, number> = {
        express: totalShipments * 45,
        standard: totalShipments * 25,
        economy: totalShipments * 15,
        same_day: totalShipments * 65
      };

      return {
        total_shipments: totalShipments,
        delivered_shipments: deliveredShipments,
        in_transit_shipments: inTransitShipments,
        failed_shipments: failedShipments,
        delivery_rate: totalShipments > 0 ? (deliveredShipments / totalShipments) * 100 : 0,
        average_delivery_time: 2.5, // days
        provider_breakdown: providerBreakdown,
        cost_breakdown: costBreakdown
      };
    } catch (error) {
      console.error('Failed to fetch shipping stats:', error);
      return {
        total_shipments: 0,
        delivered_shipments: 0,
        in_transit_shipments: 0,
        failed_shipments: 0,
        delivery_rate: 0,
        average_delivery_time: 0,
        provider_breakdown: {},
        cost_breakdown: {}
      };
    }
  }

  // Optimize delivery routes
  async optimizeDeliveryRoute(deliveries: Array<{
    address: string;
    coordinates: { lat: number; lng: number };
    priority: 'high' | 'medium' | 'low';
    time_window?: { start: string; end: string };
  }>): Promise<{
    optimized_route: typeof deliveries;
    total_distance: number;
    estimated_time: number;
    fuel_savings: number;
  }> {
    try {
      // Mock route optimization
      const sortedDeliveries = deliveries.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });

      const totalDistance = deliveries.length * 15; // Mock 15km per delivery
      const estimatedTime = deliveries.length * 45; // Mock 45 minutes per delivery
      const fuelSavings = Math.floor(totalDistance * 0.15); // 15% savings from optimization

      return {
        optimized_route: sortedDeliveries,
        total_distance: totalDistance,
        estimated_time: estimatedTime,
        fuel_savings: fuelSavings
      };
    } catch (error) {
      console.error('Failed to optimize delivery route:', error);
      throw error;
    }
  }
}

export const shippingManager = new ShippingManager();
