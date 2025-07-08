// @ts-nocheck
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/database';
import { CacheService } from '@/lib/cache';

export type UserDashboardStats = {
  activeProjects: number;
  activeWarranties: number;
  completedProjects: number;
  completedOrders: number;
  totalOrders: number;
  totalInvoices: number; // إضافة عدد الفواتير
  recentWarranties: Array<{
    id: string;
    product_name: string;
    store_name: string;
    expiry_date: string;
    status: Database['public']['Enums']['warranty_status'];
  }>;
  recentOrders: Array<{
    id: string;
    store_name: string;
    amount: number;
    status: Database['public']['Enums']['order_status'] | string;
    created_at: string;
    type: 'order' | 'invoice'; // إضافة نوع للتمييز بين الطلبات والفواتير
    invoice_number?: string; // رقم الفاتورة إذا كان نوعها فاتورة
    payment_status?: string; // حالة الدفع للفواتير
  }>;
  recentProjects: Array<{
    id: string;
    name: string;
    project_type: Database['public']['Enums']['project_type'];
    status: string;
    progress: number;
  }>;
};

// Helper: determine if a project is active (in progress)
function isProjectActive(project: { status: string; is_active?: boolean }) {
  const status = (project.status || '').toString().trim().toLowerCase();
  return (
    ['construction', 'finishing', 'in_progress', 'active'].includes(status) &&
    project.is_active !== false
  );
}

export async function getUserDashboardStats(userId: string): Promise<UserDashboardStats> {
  // Check cache first
  const cacheKey = CacheService.userStatsKey(userId);
  const cachedStats = await CacheService.get<UserDashboardStats>(cacheKey);
  
  if (cachedStats) {
    return cachedStats;
  }

  const supabase = createClientComponentClient<Database>();

  // First, get user information for email/phone matching
  const { data: userInfo } = await supabase
    .from('users')
    .select('email, phone')
    .eq('id', userId)
    .single();

  const [
    { data: projects },
    { data: warranties },
    { data: orders },
    { data: invoices }, // إضافة الفواتير
    { data: recentWarranties },
    { data: recentOrders },
    { data: recentInvoices }, // إضافة الفواتير الحديثة
    { data: recentProjects },
  ] = await Promise.all([
    // Get projects summary - remove limit to get all projects
    supabase.from('projects').select('id, status, is_active, metadata').eq('user_id', userId),

    // Get warranties summary
    supabase.from('warranties').select('id, status').eq('user_id', userId),

    // Get orders summary
    supabase.from('orders').select('id, status').eq('user_id', userId),

    // Get user's invoices by matching email and phone
    supabase
      .from('invoices')
      .select('id, status, customer_email, customer_phone')
      .or(`customer_email.eq.${userInfo?.email || 'none'},customer_phone.eq.${userInfo?.phone || 'none'}`),

    // Get recent warranties with store details
    supabase
      .from('warranties')
      .select(
        `
        id,
        product_name,
        expiry_date,
        status,
        store_profiles!warranties_store_id_fkey (store_name)
      `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5),

    // Get recent orders with store details
    supabase
      .from('orders')
      .select(
        `
        id,
        total_amount,
        status,
        created_at,
        store_profiles!orders_store_id_fkey (store_name)
      `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(3), // تقليل العدد لإفساح المجال للفواتير

    // Get recent invoices with store details
    supabase
      .from('invoices')
      .select(
        `
        id,
        invoice_number,
        total_amount,
        status,
        payment_status,
        created_at,
        stores!invoices_store_id_fkey (store_name)
      `
      )
      .or(`customer_email.eq.${userInfo?.email || 'none'},customer_phone.eq.${userInfo?.phone || 'none'}`)
      .order('created_at', { ascending: false })
      .limit(2), // إضافة آخر فاتورتين

    // Get recent projects
    supabase
      .from('projects')
      .select('id, name, project_type, status, metadata')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(5),
  ]);

  // Merge metadata fields into each project
  const projectsWithMeta = (projects || []).map((p) => ({ ...p, ...(p.metadata || {}) }));

  // Use new active logic
  const activeProjects = projectsWithMeta.filter(isProjectActive).length || 0;
  const completedProjects = projectsWithMeta.filter((p) => p.status === 'completed').length || 0;
  const activeWarranties = warranties?.filter((w) => w.status === 'active').length || 0;
  const completedOrders = (orders || []).filter((o) => o.status === 'completed' || o.status === 'delivered').length;
  const completedInvoices = (invoices || []).filter((i) => i.status === 'paid').length;

  // Combine recent orders and invoices
  const combinedRecentOrders = [
    // Add recent orders
    ...(recentOrders?.map((o) => ({
      id: o.id,
      store_name: (o.store_profiles as any)?.store_name || 'Unknown Store',
      amount: o.total_amount || 0,
      status: o.status,
      created_at: o.created_at,
      type: 'order' as const,
    })) || []),
    // Add recent invoices as orders
    ...(recentInvoices?.map((i) => ({
      id: i.id,
      store_name: (i.stores as any)?.store_name || 'Unknown Store',
      amount: i.total_amount || 0,
      status: i.payment_status === 'paid' ? 'delivered' : 'pending',
      created_at: i.created_at,
      type: 'invoice' as const,
      invoice_number: i.invoice_number,
      payment_status: i.payment_status,
    })) || []),
  ]
    // Sort by creation date
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    // Take only the 5 most recent
    .slice(0, 5);

  const userStats: UserDashboardStats = {
    activeProjects,
    completedProjects,
    activeWarranties,
    completedOrders: completedOrders + completedInvoices, // دمج الطلبات والفواتير المكتملة
    totalOrders: (orders?.length || 0) + (invoices?.length || 0), // دمج إجمالي الطلبات والفواتير
    totalInvoices: invoices?.length || 0,
    recentWarranties:
      recentWarranties?.map((w) => ({
        id: w.id,
        product_name: w.product_name,
        store_name: (w.store_profiles as any)?.store_name || 'Unknown Store',
        expiry_date: w.expiry_date,
        status: w.status,
      })) || [],
    recentOrders: combinedRecentOrders,
    recentProjects:
      (recentProjects || []).map((p) => ({
        ...p,
        ...(p.metadata || {}),
        progress: p.status === 'completed' ? 100 : p.status === 'planning' ? 0 : 50,
      })) || [],
  };

  // Cache the result
  await CacheService.set(cacheKey, userStats);

  return userStats;
}


