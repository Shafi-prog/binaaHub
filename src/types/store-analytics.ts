// @ts-nocheck
// Store analytics types

export interface StoreStats {
  totalRevenue: number;
  totalOrders: number;
  activeOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  conversionRate: number;
}

export interface StoreAnalytics {
  revenue: AnalyticsDataPoint[];
  orders: AnalyticsDataPoint[];
  customers: AnalyticsDataPoint[];
  daily: AnalyticsDataPoint[];
  weekly: AnalyticsDataPoint[];
  monthly: AnalyticsDataPoint[];
}

export interface RevenueByProduct {
  name: string;
  revenue: number;
  quantity: number;
}

export interface CustomerSegment {
  segment: string;
  count: number;
  revenue: number;
}

export interface MarketingCampaign {
  campaign_id: string;
  name: string;
  type: string;
  status: string;
  budget: number;
  spent: number;
  spend: number;
  revenue: number;
  conversions: number;
  roi: number;
}

export interface AnalyticsDataPoint {
  date: string;
  value: number;
}


