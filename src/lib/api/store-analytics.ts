import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type {
  StoreStats,
  StoreAnalytics,
  RevenueByProduct,
  CustomerSegment,
  MarketingCampaign,
} from '@/types/store-analytics';

const supabase = createClientComponentClient();

// Get store statistics
export async function getStoreStats(storeId: string): Promise<StoreStats> {
  try {
    // Get products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, price, stock_quantity, low_stock_threshold, is_active')
      .eq('store_id', storeId);

    if (productsError) throw productsError;

    // Get orders
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, status, total_amount, created_at')
      .eq('store_id', storeId);

    if (ordersError) throw ordersError;

    // Get customers (unique users who placed orders)
    const { count: customerCount, error: customerError } = await supabase
      .from('orders')
      .select('user_id', { count: 'exact', head: true })
      .eq('store_id', storeId);

    if (customerError) throw customerError;

    // Get active promo codes
    const { data: promoCodes, error: promoError } = await supabase
      .from('promo_codes')
      .select('id')
      .eq('store_id', storeId)
      .eq('is_active', true)
      .eq('status', 'active');

    if (promoError) throw promoError;

    // Get store views for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count: todayViews, error: viewsError } = await supabase
      .from('store_views')
      .select('id', { count: 'exact', head: true })
      .eq('store_id', storeId)
      .gte('created_at', today.toISOString());

    if (viewsError) throw viewsError;

    // Get total views for conversion rate
    const { count: totalViews, error: totalViewsError } = await supabase
      .from('store_views')
      .select('id', { count: 'exact', head: true })
      .eq('store_id', storeId);

    if (totalViewsError) throw totalViewsError;

    // Calculate statistics
    const activeProducts = products?.filter((p) => p.is_active).length || 0;
    const lowStockProducts =
      products?.filter((p) => p.stock_quantity <= p.low_stock_threshold).length || 0;
    const activeOrders =
      orders?.filter((o) => o.status === 'pending' || o.status === 'processing').length || 0;
    const completedOrders =
      orders?.filter((o) => o.status === 'completed' || o.status === 'delivered').length || 0;

    const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

    // Calculate monthly revenue
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyRevenue =
      orders
        ?.filter((o) => new Date(o.created_at) >= firstDayOfMonth)
        .reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

    // Calculate daily revenue
    const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dailyRevenue =
      orders
        ?.filter((o) => new Date(o.created_at) >= todayDate)
        .reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

    // Calculate average order value
    const averageOrderValue = orders?.length ? totalRevenue / orders.length : 0;

    // Calculate conversion rate (orders / views * 100)
    const conversionRate = totalViews ? ((orders?.length || 0) / totalViews) * 100 : 0;

    return {
      totalProducts: products?.length || 0,
      activeProducts,
      lowStockProducts,
      totalOrders: orders?.length || 0,
      activeOrders,
      completedOrders,
      totalRevenue,
      monthlyRevenue,
      dailyRevenue,
      totalCustomers: customerCount || 0,
      activePromoCodes: promoCodes?.length || 0,
      averageOrderValue,
      totalViews: totalViews || 0,
      conversionRate,
    };
  } catch (error) {
    console.error('Error fetching store stats:', error);
    return {
      totalProducts: 0,
      activeProducts: 0,
      lowStockProducts: 0,
      totalOrders: 0,
      activeOrders: 0,
      completedOrders: 0,
      totalRevenue: 0,
      monthlyRevenue: 0,
      dailyRevenue: 0,
      totalCustomers: 0,
      activePromoCodes: 0,
      averageOrderValue: 0,
      totalViews: 0,
      conversionRate: 0,
    };
  }
}

// Get analytics data for a given time period
export async function getStoreAnalytics(
  storeId: string,
  period: 'daily' | 'weekly' | 'monthly' = 'daily',
  startDate?: Date,
  endDate?: Date
): Promise<StoreAnalytics> {
  try {
    // If dates not provided, default to last 30 days
    const end = endDate || new Date();
    const start = startDate || new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get orders within date range
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('store_id', storeId)
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString())
      .order('created_at', { ascending: true });

    if (ordersError) throw ordersError;

    // Get views within date range
    const { data: views, error: viewsError } = await supabase
      .from('store_views')
      .select('*')
      .eq('store_id', storeId)
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString());

    if (viewsError) throw viewsError;

    // Process data points based on period
    const dataPoints = generateDataPoints(orders || [], views || [], period, start, end);

    // Calculate totals
    const total_views = views?.length || 0;
    const total_orders = orders?.length || 0;
    const total_revenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
    const average_order_value = total_orders ? total_revenue / total_orders : 0;
    const conversion_rate = total_views ? (total_orders / total_views) * 100 : 0;

    return {
      daily: dataPoints.daily,
      weekly: dataPoints.weekly,
      monthly: dataPoints.monthly,
      total_views,
      total_orders,
      total_revenue,
      average_order_value,
      conversion_rate,
    };
  } catch (error) {
    console.error('Error fetching store analytics:', error);
    return {
      daily: [],
      weekly: [],
      monthly: [],
      total_views: 0,
      total_orders: 0,
      total_revenue: 0,
      average_order_value: 0,
      conversion_rate: 0,
    };
  }
}

// Get revenue by product
export async function getRevenueByProduct(
  storeId: string,
  startDate?: Date,
  endDate?: Date
): Promise<RevenueByProduct[]> {
  try {
    // Get revenue data with properly typed joins
    const { data, error } = await supabase
      .from('order_items')
      .select(
        `
        id,
        product_id,
        quantity,
        price,
        products!inner (
          id,
          name,
          store_id
        ),
        orders!inner (
          store_id
        )
      `
      )
      .eq('orders.store_id', storeId)
      .throwOnError();

    if (!data) return [];

    // Process and aggregate data
    const revenueMap = new Map<string, RevenueByProduct>();
    const totalRevenue = data.reduce((sum, item) => sum + item.quantity * item.price, 0);

    data.forEach((item) => {
      if (!item.products) return; // Skip if no product data

      const revenue = item.quantity * item.price;
      const percentage = totalRevenue ? (revenue / totalRevenue) * 100 : 0;

      if (revenueMap.has(item.product_id)) {
        const existing = revenueMap.get(item.product_id)!;
        existing.quantity_sold += item.quantity;
        existing.revenue += revenue;
        existing.percentage = (existing.revenue / totalRevenue) * 100;
      } else {
        revenueMap.set(item.product_id, {
          product_id: item.product_id,
          product_name: item.products?.[0]?.name || 'Unknown Product',
          quantity_sold: item.quantity,
          revenue,
          percentage,
        });
      }
    });

    return Array.from(revenueMap.values());
  } catch (error) {
    console.error('Error fetching revenue by product:', error);
    return [];
  }
}

// Get customer segments
export async function getCustomerSegments(storeId: string): Promise<CustomerSegment[]> {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('user_id, total_amount')
      .eq('store_id', storeId);

    if (error) throw error;

    // Process customer data
    const customerMap = new Map<
      string,
      {
        total_spent: number;
        order_count: number;
        average_order: number;
      }
    >();

    orders?.forEach((order) => {
      const existing = customerMap.get(order.user_id) || {
        total_spent: 0,
        order_count: 0,
        average_order: 0,
      };

      existing.total_spent += order.total_amount;
      existing.order_count += 1;
      existing.average_order = existing.total_spent / existing.order_count;

      customerMap.set(order.user_id, existing);
    });

    // Define segments
    const segments: CustomerSegment[] = [
      {
        segment_id: 'high_value',
        segment_name: 'العملاء ذوي القيمة العالية',
        customer_count: 0,
        total_revenue: 0,
        average_order_value: 0,
        purchase_frequency: 0,
      },
      {
        segment_id: 'regular',
        segment_name: 'العملاء المنتظمين',
        customer_count: 0,
        total_revenue: 0,
        average_order_value: 0,
        purchase_frequency: 0,
      },
      {
        segment_id: 'occasional',
        segment_name: 'العملاء العرضيين',
        customer_count: 0,
        total_revenue: 0,
        average_order_value: 0,
        purchase_frequency: 0,
      },
    ];

    // Categorize customers into segments
    customerMap.forEach((data) => {
      let segment;
      if (data.average_order > 1000 && data.order_count >= 3) {
        segment = segments[0]; // high_value
      } else if (data.order_count >= 2) {
        segment = segments[1]; // regular
      } else {
        segment = segments[2]; // occasional
      }

      segment.customer_count += 1;
      segment.total_revenue += data.total_spent;
      segment.average_order_value = segment.total_revenue / segment.customer_count;
      segment.purchase_frequency = data.order_count;
    });

    return segments;
  } catch (error) {
    console.error('Error fetching customer segments:', error);
    return [];
  }
}

// Get marketing campaigns
export async function getMarketingCampaigns(storeId: string): Promise<MarketingCampaign[]> {
  try {
    const { data, error } = await supabase
      .from('marketing_campaigns')
      .select('*')
      .eq('store_id', storeId)
      .order('start_date', { ascending: false });

    if (error) throw error;

    return data.map((campaign) => ({
      ...campaign,
      roi: campaign.revenue ? ((campaign.revenue - campaign.spend) / campaign.spend) * 100 : 0,
    }));
  } catch (error) {
    console.error('Error fetching marketing campaigns:', error);
    return [];
  }
}

// Helper function to generate data points
function generateDataPoints(
  orders: any[],
  views: any[],
  period: 'daily' | 'weekly' | 'monthly',
  start: Date,
  end: Date
) {
  const dataPoints = {
    daily: [] as any[],
    weekly: [] as any[],
    monthly: [] as any[],
  };

  // Implementation depends on your specific needs
  // This is a basic example for daily data
  let currentDate = new Date(start);
  while (currentDate <= end) {
    const dayOrders = orders.filter(
      (o) => new Date(o.created_at).toDateString() === currentDate.toDateString()
    );
    const dayViews = views.filter(
      (v) => new Date(v.created_at).toDateString() === currentDate.toDateString()
    );

    const dayRevenue = dayOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

    dataPoints.daily.push({
      date: currentDate.toISOString(),
      views: dayViews.length,
      orders: dayOrders.length,
      revenue: dayRevenue,
      average_order: dayOrders.length ? dayRevenue / dayOrders.length : 0,
    });

    currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
  }

  // Weekly and monthly aggregations would go here
  // For now, we'll just return the daily data
  dataPoints.weekly = dataPoints.daily;
  dataPoints.monthly = dataPoints.daily;

  return dataPoints;
}
