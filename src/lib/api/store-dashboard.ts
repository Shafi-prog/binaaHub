import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/database';

export interface StoreStats {
  totalProducts: number;
  activeOrders?: number;
  totalOrders: number;
  pendingOrders: number;
  monthlyRevenue?: number;
  totalRevenue: number;
  activePromoCodes?: number;
  activeWarranties: number;
  store_name?: string;
  recentOrders: Array<{
    id: string;
    customerName: string;
    amount: number;
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    created_at: string;
    users?: { name: string };
  }>;
  viewsToday: number;
}

export async function getStoreDashboardStats(storeId: string): Promise<StoreStats> {
  const supabase = createClientComponentClient<Database>();

  const [
    { data: products },
    { data: orders },
    { data: warranties },
    { data: metrics },
    { data: recentOrders },
  ] = await Promise.all([
    // Get total products
    supabase.from('products').select('id').eq('store_id', storeId),

    // Get orders summary
    supabase.from('orders').select('id, total_amount, status').eq('store_id', storeId),

    // Get active warranties
    supabase.from('warranties').select('id').eq('store_id', storeId).eq('status', 'active'),

    // Get today's metrics
    supabase
      .from('daily_store_metrics')
      .select('*')
      .eq('store_id', storeId)
      .eq('date', new Date().toISOString().split('T')[0])
      .single(),

    // Get recent orders with customer names
    supabase
      .from('orders')
      .select(
        `
        id,
        total_amount,
        status,
        created_at,
        users!orders_user_id_fkey (name)
      `
      )
      .eq('store_id', storeId)
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
  const pendingOrders = orders?.filter((order) => order.status === 'pending').length || 0;

  return {
    totalProducts: products?.length || 0,
    totalOrders: orders?.length || 0,
    totalRevenue,
    pendingOrders,
    activeWarranties: warranties?.length || 0,
    viewsToday: metrics?.view_count || 0,
    recentOrders:
      recentOrders?.map((order) => ({
        id: order.id,
        customerName: order.users?.[0]?.name || 'Unknown Customer',
        amount: order.total_amount || 0,
        status: order.status,
        created_at: order.created_at,
      })) || [],
  };
}
