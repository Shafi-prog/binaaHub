// Store analytics types
export interface StoreStats {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  dailyRevenue: number;
  totalCustomers: number;
  activePromoCodes: number;
  averageOrderValue: number;
  totalViews: number;
  conversionRate: number;
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

export interface RevenueByProduct {
  product_id: string;
  product_name: string;
  quantity_sold: number;
  revenue: number;
  percentage: number;
}

export interface CustomerSegment {
  segment_id: string;
  segment_name: string;
  customer_count: number;
  total_revenue: number;
  average_order_value: number;
  purchase_frequency: number;
}

export interface MarketingCampaign {
  campaign_id: string;
  name: string;
  start_date: string;
  end_date: string;
  budget: number;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  roi: number;
}
