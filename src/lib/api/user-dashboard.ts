import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/database';

export type UserDashboardStats = {
  activeProjects: number;
  activeWarranties: number;
  completedProjects: number;
  totalOrders: number;
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
    status: Database['public']['Enums']['order_status'];
    created_at: string;
  }>;
  recentProjects: Array<{
    id: string;
    name: string;
    project_type: Database['public']['Enums']['project_type'];
    status: string;
    progress: number;
  }>;
};

export async function getUserDashboardStats(userId: string): Promise<UserDashboardStats> {
  const supabase = createClientComponentClient<Database>();

  const [
    { data: projects },
    { data: warranties },
    { data: orders },
    { data: recentWarranties },
    { data: recentOrders },
    { data: recentProjects },
  ] = await Promise.all([
    // Get projects summary
    supabase.from('projects').select('id, status').eq('user_id', userId),

    // Get warranties summary
    supabase.from('warranties').select('id, status').eq('user_id', userId),

    // Get orders summary
    supabase.from('orders').select('id').eq('user_id', userId),

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
      .limit(5),

    // Get recent projects
    supabase
      .from('projects')
      .select('id, name, project_type, status')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(5),
  ]);

  const activeProjects = projects?.filter((p) => p.status !== 'completed').length || 0;
  const completedProjects = projects?.filter((p) => p.status === 'completed').length || 0;
  const activeWarranties = warranties?.filter((w) => w.status === 'active').length || 0;

  return {
    activeProjects,
    completedProjects,
    activeWarranties,
    totalOrders: orders?.length || 0,
    recentWarranties:
      recentWarranties?.map((w) => ({
        id: w.id,
        product_name: w.product_name,
        store_name: (w.store_profiles as any)?.store_name || 'Unknown Store',
        expiry_date: w.expiry_date,
        status: w.status,
      })) || [],
    recentOrders:
      recentOrders?.map((o) => ({
        id: o.id,
        store_name: (o.store_profiles as any)?.store_name || 'Unknown Store',
        amount: o.total_amount || 0,
        status: o.status,
        created_at: o.created_at,
      })) || [],
    recentProjects:
      recentProjects?.map((p) => ({
        id: p.id,
        name: p.name,
        project_type: p.project_type,
        status: p.status,
        progress: p.status === 'completed' ? 100 : p.status === 'planning' ? 0 : 50,
      })) || [],
  };
}
