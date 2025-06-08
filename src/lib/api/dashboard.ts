// Dashboard API service functions
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type {
  DashboardStats,
  Project,
  ConstructionExpense,
  Order,
  Warranty,
  DeliveryAddress,
  UserProfile,
  SpendingByCategory,
  Notification,
} from '@/types/dashboard';
import type { ProjectImage } from '@/types/dashboard';

export interface PaginatedResponse<T> {
  items: T[];
  hasMore: boolean;
  total: number;
  page: number;
}

const PAGE_SIZE = 5;

const supabase = createClientComponentClient();

// Get dashboard statistics
export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  // Initialize default stats
  const stats: DashboardStats = {
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    totalSpent: 0,
    totalBudget: 0,
    activeWarranties: 0,
    expiringWarranties: 0,
    unreadNotifications: 0,
    pendingExpenses: 0,
    monthlySpending: 0,
  };

  try {
    // Get projects (no metadata)
    const projectsResult = await supabase
      .from('projects')
      .select('id, project_type, status, budget, actual_cost, is_active')
      .eq('user_id', userId);

    if (projectsResult.error) {
      throw new Error(`Failed to fetch projects: ${projectsResult.error.message}`);
    }

    const projects = projectsResult.data || [];
    stats.totalProjects = projects.length;
    stats.activeProjects = projects.filter((p) => p.status !== 'completed' && p.is_active !== false).length;
    stats.completedProjects = projects.filter((p) => p.status === 'completed' || p.is_active === false).length;
    stats.totalSpent = projects.reduce((sum, p) => sum + (p.actual_cost || 0), 0);
    stats.totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);

    // Get orders
    const ordersResult = await supabase.from('orders').select('id, status').eq('user_id', userId);

    if (ordersResult.error) {
      throw new Error(`Failed to fetch orders: ${ordersResult.error.message}`);
    }

    const orders = ordersResult.data || [];
    stats.totalOrders = orders.length;
    stats.activeOrders = orders.filter(
      (o) => o.status === 'pending' || o.status === 'processing'
    ).length;
    stats.completedOrders = orders.filter(
      (o) => o.status === 'delivered' || o.status === 'completed'
    ).length;

    // Get warranties
    const warrantiesResult = await supabase
      .from('warranties')
      .select('id, status, warranty_end_date')
      .eq('user_id', userId);

    if (warrantiesResult.error) {
      throw new Error(`Failed to fetch warranties: ${warrantiesResult.error.message}`);
    }

    const warranties = warrantiesResult.data || [];
    stats.activeWarranties = warranties.filter((w) => w.status === 'active').length;
    stats.expiringWarranties = warranties.filter((w) => {
      if (w.status !== 'active' || !w.warranty_end_date) return false;
      const daysUntilExpiry = Math.ceil(
        (new Date(w.warranty_end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
    }).length;

    // Get notifications
    const notificationsResult = await supabase
      .from('notifications')
      .select('id')
      .eq('user_id', userId)
      .eq('is_read', false);

    if (notificationsResult.error) {
      throw new Error(`Failed to fetch notifications: ${notificationsResult.error.message}`);
    }

    stats.unreadNotifications = (notificationsResult.data || []).length;

    // Calculate monthly spending (from expenses)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const expensesResult = await supabase
      .from('construction_expenses')
      .select('amount')
      .eq('user_id', userId)
      .gte('created_at', startOfMonth.toISOString());

    if (expensesResult.error) {
      throw new Error(`Failed to fetch expenses: ${expensesResult.error.message}`);
    }

    stats.monthlySpending = (expensesResult.data || []).reduce(
      (sum, exp) => sum + (exp.amount || 0),
      0
    );

    return stats;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Dashboard stats error: ${error.message}`);
    }
    throw new Error('Failed to fetch dashboard stats');
  }
}

// Get user's recent projects
export async function getRecentProjects(
  userId: string,
  page: number = 1
): Promise<PaginatedResponse<Project>> {
  const supabase = createClientComponentClient();
  const start = (page - 1) * PAGE_SIZE;

  console.log('🔍 [getRecentProjects] Starting with params:', { userId, page, start, PAGE_SIZE });
  console.log('🌐 [getRecentProjects] Supabase URL check...');
  
  // Add environment debug info
  console.log('🔧 [getRecentProjects] Environment check:', {
    nodeEnv: typeof process !== 'undefined' ? process.env.NODE_ENV : 'unknown',
    supabaseUrl: typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_URL : 'unknown',
    isClient: typeof window !== 'undefined'
  });

  try {
    // Check current session first
    console.log('🔐 [getRecentProjects] Checking current session...');
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    console.log('🔐 [getRecentProjects] Session check result:', { 
      hasSession: !!sessionData?.session, 
      hasUser: !!sessionData?.session?.user,
      sessionUserId: sessionData?.session?.user?.id,
      providedUserId: userId,
      userIdMatch: sessionData?.session?.user?.id === userId,
      sessionError: sessionError?.message 
    });

    // Get total count
    console.log('📊 [getRecentProjects] Getting total count...');
    const { count, error: countError } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    console.log('📊 [getRecentProjects] Count result:', { count, countError });

    if (countError) {
      console.error('❌ [getRecentProjects] Count error:', countError);
      console.error('❌ [getRecentProjects] Count error details:', JSON.stringify(countError, null, 2));
      throw countError;
    }

    // Get paginated data (no metadata)
    console.log('📋 [getRecentProjects] Getting paginated data...');
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(start, start + PAGE_SIZE - 1);

    console.log('📋 [getRecentProjects] Projects result:', { 
      projectsCount: projects?.length || 0, 
      error: error?.message,
      errorDetails: error ? JSON.stringify(error, null, 2) : null,
      sampleProject: projects?.[0] ? {
        id: projects[0].id,
        name: projects[0].name,
        user_id: projects[0].user_id
      } : null
    });

    if (error) {
      console.error('❌ [getRecentProjects] Projects query error:', error);
      console.error('❌ [getRecentProjects] Projects error details:', JSON.stringify(error, null, 2));
      throw error;
    }

    const result = {
      items: projects || [],
      hasMore: count ? start + PAGE_SIZE < count : false,
      total: count || 0,
      page,
    };

    console.log('✅ [getRecentProjects] Final result:', result);
    console.log('📊 [getRecentProjects] Summary:', {
      itemsReturned: result.items.length,
      totalInDb: result.total,
      hasMore: result.hasMore,
      page: result.page,
      expectedUserId: userId
    });
    
    return result;
  } catch (error) {
    console.error('❌ [getRecentProjects] Error fetching projects:', error);
    console.error('❌ [getRecentProjects] Error details:', JSON.stringify(error, null, 2));
    console.error('❌ [getRecentProjects] Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    
    return { items: [], hasMore: false, total: 0, page };
  }
}

// Get user's recent orders
export async function getRecentOrders(
  userId: string,
  page: number = 1
): Promise<PaginatedResponse<Order>> {
  const supabase = createClientComponentClient();
  const start = (page - 1) * PAGE_SIZE;

  try {
    // Get total count
    const { count } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Get paginated data
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(start, start + PAGE_SIZE - 1);

    if (error) throw error;

    return {
      items: orders || [],
      hasMore: count ? start + PAGE_SIZE < count : false,
      total: count || 0,
      page,
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { items: [], hasMore: false, total: 0, page };
  }
}

// Get construction expenses by category
export async function getSpendingByCategory(
  userId: string,
  projectId?: string
): Promise<SpendingByCategory[]> {
  try {
<<<<<<< HEAD
    console.log('🔍 [getSpendingByCategory] Starting fetch for userId:', userId, 'projectId:', projectId);
    
    // First check if the construction tables exist
    const { data: tableCheck, error: tableCheckError } = await supabase
      .from('construction_categories')
      .select('id')
      .limit(1);
    
    if (tableCheckError) {
      if (tableCheckError.code === '42P01') {
        console.log('⚠️ [getSpendingByCategory] construction_categories table does not exist, returning empty data');
        return [];
      }
      throw tableCheckError;
    }    let query = supabase
      .from('construction_expenses')
      .select(
        `
        id, amount, category_id, project_id,
        construction_categories!category_id(id, name, name_ar, color),
        projects!project_id(user_id)
        `
      );    if (projectId) {
=======
    let query = supabase
      .from('construction_expenses')
      .select(
        `
        id, amount, category_id,
        construction_categories:category_id(id, name, name_ar, color)
        `
      )
      .eq('user_id', userId);

    if (projectId) {
>>>>>>> e0e83bc2e6a4c393009b329773f07bfad211af6b
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;

<<<<<<< HEAD
    console.log('📊 [getSpendingByCategory] Raw query result:', { data, error });

    if (error) {
      if (error.code === '42P01') {
        console.log('⚠️ [getSpendingByCategory] construction_expenses table does not exist, returning empty data');
        return [];
      }
      console.error('❌ [getSpendingByCategory] Database error:', error);
      throw error;
    }

    // Filter expenses by user ownership of projects
    const userExpenses = (data || []).filter(expense => {
      if (!expense.projects) return false;
      const project = expense.projects as any;
      return project?.user_id === userId;
    });

    console.log(`📊 [getSpendingByCategory] Filtered ${userExpenses.length} expenses for user ${userId}`);

    // Group by category and sum amounts
    const categoryMap = new Map<string, SpendingByCategory>();

    for (const expense of userExpenses) {
      const categoryId = expense.category_id;
      const categoryData = expense.construction_categories;

      console.log('📋 [getSpendingByCategory] Processing expense:', { categoryId, categoryData, amount: expense.amount });

      if (!categoryData) {
        console.warn('⚠️ [getSpendingByCategory] No category data for expense:', expense.id);
        continue;
      }
      
=======
    if (error) throw error; // Group by category and sum amounts
    const categoryMap = new Map<string, SpendingByCategory>();

    for (const expense of data || []) {
      const categoryId = expense.category_id;
      const categoryData = expense.construction_categories;

      if (!categoryData) continue;
>>>>>>> e0e83bc2e6a4c393009b329773f07bfad211af6b
      if (categoryMap.has(categoryId)) {
        const existing = categoryMap.get(categoryId)!;
        existing.total_amount += expense.amount;
        existing.transaction_count += 1;
      } else {
        // Cast to any to safely access dynamic properties
        const catData = categoryData as any;
        categoryMap.set(categoryId, {
          category_id: categoryId,
          category_name:
            typeof catData === 'object' && catData?.name ? String(catData.name) : 'أخرى',
          category_name_ar:
            typeof catData === 'object' && catData?.name_ar ? String(catData.name_ar) : 'أخرى',
          total_amount: expense.amount,
          transaction_count: 1,
          color: typeof catData === 'object' && catData?.color ? String(catData.color) : '#999999',
        });
      }
    }

<<<<<<< HEAD
    const result = Array.from(categoryMap.values());
    console.log('✅ [getSpendingByCategory] Returning result:', result);
    return result;
  } catch (error) {
    console.error('❌ [getSpendingByCategory] Error fetching spending by category:', error);
    // Return empty array instead of throwing error to prevent app crashes
=======
    return Array.from(categoryMap.values());
  } catch (error) {
    console.error('Error fetching spending by category:', error);
>>>>>>> e0e83bc2e6a4c393009b329773f07bfad211af6b
    return [];
  }
}

// Get user's active warranties
export async function getActiveWarranties(
  userId: string,
  limit: number = PAGE_SIZE
): Promise<Warranty[]> {
  try {
    const { data, error } = await supabase
      .from('warranties')
      .select(
        `
        id, user_id, project_id, order_id, warranty_number, product_name, 
        brand, model, serial_number, purchase_date, warranty_start_date, 
        warranty_end_date, warranty_period_months, warranty_type, 
        coverage_description, status, is_transferable, claim_count,
        vendor_name, created_at, updated_at
        `
      )
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('warranty_end_date', { ascending: true })
      .limit(limit);

    if (error) throw error;

    // Return properly typed warranties
    const warranties: Warranty[] = [];

    for (const w of data || []) {
      warranties.push({
        id: w.id,
        user_id: w.user_id,
        project_id: w.project_id,
        order_id: w.order_id,
        warranty_number: w.warranty_number,
        product_name: w.product_name,
        brand: w.brand,
        model: w.model,
        serial_number: w.serial_number,
        purchase_date: w.purchase_date,
        warranty_start_date: w.warranty_start_date,
        warranty_end_date: w.warranty_end_date,
        warranty_period_months: w.warranty_period_months,
        warranty_type: w.warranty_type,
        coverage_description: w.coverage_description,
        status: w.status,
        is_transferable: w.is_transferable,
        claim_count: w.claim_count || 0,
        vendor_name: w.vendor_name,
        created_at: w.created_at,
        updated_at: w.updated_at,
      });
    }

    return warranties;
  } catch (error) {
    console.error('Error fetching active warranties:', error);
    return [];
  }
}

// Get all user warranties with filtering
export async function getAllWarranties(userId: string, status?: string): Promise<Warranty[]> {
  try {
    let query = supabase
      .from('warranties')
      .select(
        `
        id, user_id, project_id, order_id, warranty_number, product_name, 
        brand, model, serial_number, purchase_date, warranty_start_date, 
        warranty_end_date, warranty_period_months, warranty_type, 
        coverage_description, status, is_transferable, claim_count,
        vendor_name, vendor_contact, created_at, updated_at
        `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Return properly typed warranties
    const warranties: Warranty[] = [];

    for (const w of data || []) {
      warranties.push({
        id: w.id,
        user_id: w.user_id,
        project_id: w.project_id,
        order_id: w.order_id,
        warranty_number: w.warranty_number,
        product_name: w.product_name,
        brand: w.brand,
        model: w.model,
        serial_number: w.serial_number,
        purchase_date: w.purchase_date,
        warranty_start_date: w.warranty_start_date,
        warranty_end_date: w.warranty_end_date,
        warranty_period_months: w.warranty_period_months,
        warranty_type: w.warranty_type,
        coverage_description: w.coverage_description,
        status: w.status,
        is_transferable: w.is_transferable,
        claim_count: w.claim_count || 0,
        vendor_name: w.vendor_name,
        vendor_contact: w.vendor_contact,
        created_at: w.created_at,
        updated_at: w.updated_at,
      });
    }

    return warranties;
  } catch (error) {
    console.error('Error fetching warranties:', error);
    return [];
  }
}

// Get warranty statistics
export async function getWarrantyStats(userId: string): Promise<{
  total: number;
  active: number;
  expired: number;
  expiringSoon: number;
  totalClaims: number;
}> {
  try {
    const warranties = await getAllWarranties(userId);
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const stats = {
      total: warranties.length,
      active: warranties.filter((w) => w.status === 'active').length,
      expired: warranties.filter((w) => w.status === 'expired').length,
      expiringSoon: warranties.filter((w) => {
        if (w.status !== 'active') return false;
        const endDate = new Date(w.warranty_end_date);
        return endDate <= thirtyDaysFromNow && endDate > now;
      }).length,
      totalClaims: warranties.reduce((sum, w) => sum + (w.claim_count || 0), 0),
    };

    return stats;
  } catch (error) {
    console.error('Error fetching warranty stats:', error);
    return { total: 0, active: 0, expired: 0, expiringSoon: 0, totalClaims: 0 };
  }
}

// Create new warranty
export async function createWarranty(warranty: Partial<Warranty>): Promise<Warranty | null> {
  try {
    const { data, error } = await supabase.from('warranties').insert([warranty]).select().single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating warranty:', error);
    return null;
  }
}

// Update warranty
export async function updateWarranty(
  warrantyId: string,
  updates: Partial<Warranty>
): Promise<boolean> {
  try {
    const { error } = await supabase.from('warranties').update(updates).eq('id', warrantyId);

    return !error;
  } catch (error) {
    console.error('Error updating warranty:', error);
    return false;
  }
}

// Delete warranty
export async function deleteWarranty(warrantyId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('warranties').delete().eq('id', warrantyId);

    return !error;
  } catch (error) {
    console.error('Error deleting warranty:', error);
    return false;
  }
}

// Get user's delivery addresses
export async function getDeliveryAddresses(userId: string): Promise<DeliveryAddress[]> {
  try {
    const { data, error } = await supabase
      .from('delivery_addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false });

    if (error) throw error;

    // Properly type the addresses
    const addresses: DeliveryAddress[] = [];

    for (const a of data || []) {
      addresses.push(a as DeliveryAddress);
    }

    return addresses;
  } catch (error) {
    console.error('Error fetching delivery addresses:', error);
    return [];
  }
}

// Get user profile
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as UserProfile | null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

// Get recent notifications
export async function getRecentNotifications(
  userId: string,
  limit: number = PAGE_SIZE
): Promise<Notification[]> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Properly type the notifications
    const notifications: Notification[] = [];

    for (const n of data || []) {
      notifications.push(n as Notification);
    }

    return notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', notificationId);

    return !error;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
}

// Get recent construction expenses
export async function getRecentExpenses(
  userId: string,
  limit: number = 10
): Promise<ConstructionExpense[]> {
  try {
    const { data, error } = await supabase
      .from('construction_expenses')
      .select(
        `
        id, user_id, project_id, category_id, title, amount, description,
        currency, expense_date, vendor_name, payment_status, is_budgeted,
        created_at, updated_at
        `
      )
      .eq('user_id', userId)
      .order('expense_date', { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Properly type the expenses
    const expenses: ConstructionExpense[] = [];

    for (const e of data || []) {
      expenses.push({
        id: e.id,
        project_id: e.project_id,
        category_id: e.category_id,
        title: e.title,
        description: e.description,
        amount: e.amount,
        currency: e.currency || 'SAR',
        expense_date: e.expense_date,
        vendor_name: e.vendor_name,
        payment_status: e.payment_status || 'paid',
        is_budgeted: e.is_budgeted,
        created_by: e.user_id,
        created_at: e.created_at,
        updated_at: e.updated_at,
      } as ConstructionExpense);
    }

    return expenses;
  } catch (error) {
    console.error('Error fetching recent expenses:', error);
    return [];
  }
}

// Create a new project
export async function createProject(projectData: any): Promise<Project> {
  const supabase = createClientComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  const { images, ...rest } = projectData;
  const { data, error } = await supabase
    .from('projects')
    .insert({ ...rest, user_id: user.id })
    .select()
    .single();
  if (error) throw error;
  // Optionally insert images if provided
  if (images && Array.isArray(images)) {
    for (const imageUrl of images) {
      await addProjectImage(data.id, imageUrl);
    }
  }
  return data;
}

// Update an existing project
export async function updateProject(
  projectId: string,
  updates: Partial<{
    name: string;
    description: string;
    project_type: string;
    location: string;
    address: string;
    city: string;
    region: string;
    status: string;
    priority: string;
    start_date: string;
<<<<<<< HEAD
    expected_completion_date: string; // Will be mapped to end_date
=======
    expected_completion_date: string;
    actual_completion_date: string;
>>>>>>> e0e83bc2e6a4c393009b329773f07bfad211af6b
    budget: number;
    actual_cost: number;
    progress_percentage: number;
    rooms_count: number;
    bathrooms_count: number;
    floors_count: number;
    plot_area: number;
    building_area: number;
  }>
): Promise<Project> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

<<<<<<< HEAD
    // Map expected_completion_date to end_date for the DB
    const updatePayload: any = { ...updates, updated_at: new Date().toISOString() };
    if (updatePayload.expected_completion_date) {
      updatePayload.end_date = updatePayload.expected_completion_date;
      delete updatePayload.expected_completion_date;
    }
    // Remove fields not in schema
    delete updatePayload.actual_completion_date;

    console.log('[updateProject] Update payload:', updatePayload);

    const { data, error } = await supabase
      .from('projects')
      .update(updatePayload)
=======
    const { data, error } = await supabase
      .from('projects')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
>>>>>>> e0e83bc2e6a4c393009b329773f07bfad211af6b
      .eq('id', projectId)
      .eq('user_id', user.id) // Ensure user can only update their own projects
      .select()
      .single();

<<<<<<< HEAD
    if (error) {
      console.error('[updateProject] Supabase error:', error);
      throw error;
    }
=======
    if (error) throw error;
>>>>>>> e0e83bc2e6a4c393009b329773f07bfad211af6b

    // Transform the data to match the Project interface
    return {
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      description: data.description || '',
      project_type: data.project_type,
      location: data.location,
      address: data.address || '',
      city: data.city || '',
      region: data.region || '',
      status: data.status,
      priority: data.priority,
      start_date: data.start_date,
<<<<<<< HEAD
      expected_completion_date: data.end_date, // Map end_date back to expected_completion_date
=======
      expected_completion_date: data.expected_completion_date,
      actual_completion_date: data.actual_completion_date,
>>>>>>> e0e83bc2e6a4c393009b329773f07bfad211af6b
      budget: data.budget || 0,
      actual_cost: data.actual_cost || 0,
      currency: data.currency || 'SAR',
      progress_percentage: data.progress_percentage || 0,
      is_active: data.is_active,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
}

// Get a single project by ID
export async function getProjectById(projectId: string): Promise<Project | null> {
  try {
<<<<<<< HEAD
    console.log('🔍 [getProjectById] Starting fetch for projectId:', projectId);
    
=======
>>>>>>> e0e83bc2e6a4c393009b329773f07bfad211af6b
    const {
      data: { user },
    } = await supabase.auth.getUser();

<<<<<<< HEAD
    console.log('👤 [getProjectById] Auth user:', user ? { id: user.id, email: user.email } : 'null');
    
    if (!user) {
      console.error('❌ [getProjectById] User not authenticated');
      throw new Error('User not authenticated');
    }
    
    console.log('🔍 [getProjectById] Querying project with filters:', { projectId, userId: user.id });

    // First, let's check if this user has any projects at all (for debugging)
    const { data: allUserProjects, error: allProjectsError } = await supabase
      .from('projects')
      .select('id, name, user_id')
      .eq('user_id', user.id);
    
    console.log('📊 [getProjectById] User has total projects:', allUserProjects?.length || 0);
    
    if (allUserProjects && allUserProjects.length > 0) {
      console.log('📋 [getProjectById] User\'s project IDs:', allUserProjects.map(p => ({ id: p.id, name: p.name })));
    }    const { data, error } = await supabase
=======
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
>>>>>>> e0e83bc2e6a4c393009b329773f07bfad211af6b
      .from('projects')
      .select(
        `
        id, user_id, name, description, project_type, location, 
<<<<<<< HEAD
        address, status, start_date, end_date,
        budget, is_active, created_at, updated_at
        `
      ).eq('id', projectId)
      .eq('user_id', user.id) // Ensure user can only access their own projects
      .single();
    
    console.log('📊 [getProjectById] Raw query result:', { data, error });
    
    if (error) {
      // EMERGENCY FIX: Multiple error logging approaches
      console.error('❌ [getProjectById] Database error detected!');
      console.error('Error object keys:', Object.keys(error || {}));
      console.error('Error message:', error?.message || 'No message');
      console.error('Error code:', error?.code || 'No code');
      console.error('Error details:', error?.details || 'No details');
      console.error('Error hint:', error?.hint || 'No hint');
      console.error('Raw error:', error);
      console.error('Stringified error:', JSON.stringify(error, null, 2));
      
      if (error.code === 'PGRST116') {
        // No rows returned
        console.log('❌ [getProjectById] No rows returned (PGRST116) - Project not found or access denied');
        return null;
      }
      
      // Enhanced error logging with fallbacks
      const errorInfo = {
        timestamp: new Date().toISOString(),
        function: 'getProjectById',
        projectId: projectId,
        userId: user?.id,
        message: error?.message || 'Unknown error',
        code: error?.code || 'Unknown code',
        details: error?.details || 'No details available',
        hint: error?.hint || 'No hint available',
        full_error: error,
        error_type: typeof error,
        error_constructor: error?.constructor?.name
      };
      
      console.error('❌ [getProjectById] DETAILED ERROR INFO:', errorInfo);
      throw error;
    }
      console.log('✅ [getProjectById] Project found, transforming data...');
      const transformedProject = {
=======
        address, city, region, status, priority, start_date, 
        expected_completion_date, actual_completion_date,
        budget, actual_cost, currency, progress_percentage, 
        is_active, created_at, updated_at, rooms_count, bathrooms_count,
        floors_count, plot_area, building_area
        `
      )
      .eq('id', projectId)
      .eq('user_id', user.id) // Ensure user can only access their own projects
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      throw error;
    }

    // Transform the data to match the Project interface
    return {
>>>>>>> e0e83bc2e6a4c393009b329773f07bfad211af6b
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      description: data.description || '',
      project_type: data.project_type,
      location: data.location,
      address: data.address || '',
<<<<<<< HEAD
      city: '', // Column doesn't exist yet
      region: '', // Column doesn't exist yet      district: '', // Column doesn't exist yet
      country: '', // Column doesn't exist yet  
      status: data.status,
      priority: 'medium' as const, // Column doesn't exist yet, use default      start_date: data.start_date,
      expected_completion_date: data.end_date, // Map from end_date column
      actual_completion_date: undefined, // Column doesn't exist yet
      budget: data.budget || 0,
      actual_cost: undefined, // Column doesn't exist yet
      currency: 'SAR', // Column doesn't exist yet, use default
      progress_percentage: undefined, // Column doesn't exist yet
      is_active: data.is_active,
      created_at: data.created_at,
      updated_at: data.updated_at,
      location_lat: undefined, // Column doesn't exist yet
      location_lng: undefined, // Column doesn't exist yet
      rooms_count: undefined, // Column doesn't exist yet
      bathrooms_count: undefined, // Column doesn't exist yet
      floors_count: undefined, // Column doesn't exist yet
      plot_area: undefined, // Column doesn't exist yet
      building_area: undefined, // Column doesn't exist yet
      metadata: undefined, // Column doesn't exist yet
      image_url: undefined, // Column doesn't exist yet
    };
    
    console.log('✅ [getProjectById] Returning transformed project:', transformedProject);
    return transformedProject;
  } catch (error: any) {
    // EMERGENCY CATCH BLOCK - Multiple logging approaches
    console.error('❌ [getProjectById] UNEXPECTED ERROR CAUGHT!');
    console.error('Error type:', typeof error);
    console.error('Error constructor:', error?.constructor?.name);
    console.error('Error keys:', Object.keys(error || {}));
    console.error('Error message:', error?.message || 'No message available');
    console.error('Error name:', error?.name || 'No name available');
    console.error('Error stack:', error?.stack || 'No stack available');
    console.error('Raw error object:', error);
    console.error('Stringified error:', JSON.stringify(error, null, 2));
    
    const detailedError = {
      timestamp: new Date().toISOString(),
      function: 'getProjectById_catch',
      error_info: {
        message: error?.message,
        name: error?.name,
        stack: error?.stack,
        type: typeof error,
        constructor: error?.constructor?.name,
        keys: Object.keys(error || {})
      },
      full_error: error
    };
    
    console.error('❌ [getProjectById] DETAILED CATCH ERROR:', detailedError);
=======
      city: data.city || '',
      region: data.region || '',
      status: data.status,
      priority: data.priority,
      start_date: data.start_date,
      expected_completion_date: data.expected_completion_date,
      actual_completion_date: data.actual_completion_date,
      budget: data.budget || 0,
      actual_cost: data.actual_cost || 0,
      currency: data.currency || 'SAR',
      progress_percentage: data.progress_percentage || 0,
      is_active: data.is_active,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (error) {
    console.error('Error fetching project:', error);
>>>>>>> e0e83bc2e6a4c393009b329773f07bfad211af6b
    throw error;
  }
}

// Delete a project
export async function deleteProject(projectId: string): Promise<void> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('user_id', user.id); // Ensure user can only delete their own projects

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

// Add a function to create a project image
export async function addProjectImage(projectId: string, imageUrl: string): Promise<ProjectImage> {
  const supabase = createClientComponentClient();
  const { data, error } = await supabase
    .from('project_images')
    .insert({ project_id: projectId, image_url: imageUrl })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Get all images for a project
export async function getProjectImages(projectId: string): Promise<ProjectImage[]> {
  const supabase = createClientComponentClient();
  const { data, error } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
}
