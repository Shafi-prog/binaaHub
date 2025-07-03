// Types for the business system
export interface BusinessTypes {
  retail: 'retail';
  wholesale: 'wholesale';
  manufacturer: 'manufacturer';
  service: 'service';
}

export interface StoreInterface {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  business_type: keyof BusinessTypes;
  business_license?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  city?: string;
  region?: string;
  location_lat?: number;
  location_lng?: number;
  logo_url?: string;
  cover_image?: string;
  rating: number;
  total_reviews: number;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductInterface {
  id: string;
  store_id: string;
  name: string;
  description?: string;
  barcode?: string;
  sku?: string;
  price: number;
  sale_price?: number;
  stock: number;
  min_stock?: number;
  category?: string;
  brand?: string;
  image_url?: string;
  additional_images?: string[];
  specifications?: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderInterface {
  id: string;
  user_id: string;
  store_id: string;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  total_amount: number;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  currency: string;
  delivery_type: 'standard' | 'express' | 'pickup';
  delivery_address: {
    id: string;
    full_name: string;
    phone: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    region: string;
    postal_code?: string;
    is_default: boolean;
  };
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItemInterface {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface ShippingProviderInterface {
  id: string;
  name: string;
  logo_url?: string;
  api_url?: string;
  available_regions: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShippingInterface {
  id: string;
  order_id: string;
  provider_id: string;
  status: 'assigned' | 'in_transit' | 'delivered';
  tracking_url?: string;
  from_lat: number;
  from_lng: number;
  to_lat: number;
  to_lng: number;
  updated_at: string;
}

export interface ReviewInterface {
  id: string;
  store_id: string;
  user_id: string;
  order_id: string;
  rating: number;
  review_text?: string;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsDataPoint {
  date: string;
  views: number;
  orders: number;
  revenue: number;
  average_order: number;
}

export interface StoreAnalytics {
  daily: AnalyticsDataPoint[];
  weekly: AnalyticsDataPoint[];
  monthly: AnalyticsDataPoint[];
  total_views: number;
  total_orders: number;
  total_revenue: number;
  average_order_value: number;
  conversion_rate: number;
}

export interface MarketingCampaign {
  id: string;
  store_id: string;
  name: string;
  description?: string;
  type: 'email' | 'sms' | 'push' | 'in_app';
  segment_id?: string;
  content: {
    subject?: string;
    body: string;
    image_url?: string;
    cta_text?: string;
    cta_link?: string;
  };
  schedule_time?: string;
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'cancelled';
  metrics?: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    converted: number;
  };
  created_at: string;
  updated_at: string;
}

export interface CustomerSegment {
  id: string;
  store_id: string;
  name: string;
  description?: string;
  criteria: {
    purchase_frequency?: {
      min?: number;
      max?: number;
    };
    average_order_value?: {
      min?: number;
      max?: number;
    };
    last_purchase_date?: {
      min?: string;
      max?: string;
    };
    total_spent?: {
      min?: number;
      max?: number;
    };
    product_categories?: string[];
    regions?: string[];
  };
  customer_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
