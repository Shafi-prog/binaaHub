// Dashboard API service functions
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { isProjectActive } from '@/lib/project-utils';
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
  ConstructionCategory,
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

  try {    // Get projects (no metadata)
    const projectsResult = await supabase
      .from('projects')
      .select('id, project_type, status, budget, is_active')
      .eq('user_id', userId);

    if (projectsResult.error) {
      throw new Error(`Failed to fetch projects: ${projectsResult.error.message}`);
    }

    const projects = projectsResult.data || [];
    stats.totalProjects = projects.length;
    // Count only active (in progress) projects
    stats.activeProjects = projects.filter(isProjectActive).length;
    // Completed: status === 'completed' or is_active === false
    stats.completedProjects = projects.filter((p) => p.status === 'completed' || p.is_active === false).length;
    stats.totalSpent = 0; // projects.reduce((sum, p) => sum + (p.actual_cost || 0), 0); // actual_cost column doesn't exist yet
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

    stats.unreadNotifications = (notificationsResult.data || []).length;    // Calculate monthly spending (from expenses)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    try {
      const expensesResult = await supabase
        .from('construction_expenses')
        .select('amount, projects!inner(user_id)')
        .eq('projects.user_id', userId)
        .gte('created_at', startOfMonth.toISOString());

      if (!expensesResult.error) {
        stats.monthlySpending = (expensesResult.data || []).reduce(
          (sum, exp) => sum + (exp.amount || 0),
          0
        );
      }
    } catch (expenseError) {
      // If expenses calculation fails, set to 0
      stats.monthlySpending = 0;
    }

    return stats;  } catch (error: any) {
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

  try {
    // Get total count
    const { count, error: countError } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (countError) {
      throw countError;
    }

    // Get paginated data
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(start, start + PAGE_SIZE - 1);

    if (error) {
      throw error;
    }

    const result = {
      items: projects || [],
      hasMore: count ? start + PAGE_SIZE < count : false,
      total: count || 0,
      page,
    };
      return result;  } catch (error: any) {
    console.error('Error fetching recent projects:', error);
    
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
    };  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return { items: [], hasMore: false, total: 0, page };
  }
}

// Get construction expenses by category
export async function getSpendingByCategory(
  userId: string,
  projectId?: string
): Promise<SpendingByCategory[]> {
  try {    let query = supabase
      .from('construction_expenses')      .select(
        `id, amount, category_id, project_id, construction_categories(id, name, name_ar, color), projects!inner(user_id)`
      )
      .eq('projects.user_id', userId);

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    const categoryMap = new Map<string, SpendingByCategory>();

    for (const expense of data || []) {
      const categoryId = expense.category_id;
      const categoryData = expense.construction_categories as unknown as ConstructionCategory;

      if (!categoryData) continue;      if (categoryMap.has(categoryId)) {
        const existing = categoryMap.get(categoryId)!;
        existing.total_amount += expense.amount;
        existing.transaction_count += 1;
      } else {
        categoryMap.set(categoryId, {
          category_id: categoryId,
          category_name: categoryData.name,
          category_name_ar: categoryData.name_ar,
          color: categoryData.color,
          total_amount: expense.amount,
          transaction_count: 1,
        });
      }
    }    return Array.from(categoryMap.values());
  } catch (error: any) {
    console.error('Error fetching spending by category:', error?.message || error);
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

    return warranties;  } catch (error: any) {
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

    return warranties;  } catch (error: any) {
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

    return stats;  } catch (error: any) {
    console.error('Error fetching warranty stats:', error);
    return { total: 0, active: 0, expired: 0, expiringSoon: 0, totalClaims: 0 };
  }
}

// Create new warranty
export async function createWarranty(warranty: Partial<Warranty>): Promise<Warranty | null> {
  try {
    const { data, error } = await supabase.from('warranties').insert([warranty]).select().single();

    if (error) throw error;
    return data;  } catch (error: any) {
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

    return !error;  } catch (error: any) {
    console.error('Error updating warranty:', error);
    return false;
  }
}

// Delete warranty
export async function deleteWarranty(warrantyId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('warranties').delete().eq('id', warrantyId);

    return !error;  } catch (error: any) {
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

    return addresses;  } catch (error: any) {
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
    return data as UserProfile | null;  } catch (error: any) {
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

    return notifications;  } catch (error: any) {
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

    return !error;  } catch (error: any) {
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
    }    return expenses;
  } catch (error: any) {
    console.error('Error fetching recent expenses:', error?.message || error);
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
    expected_completion_date: string; // Will be mapped to end_date
    budget: number;
    actual_cost: number;
    progress_percentage: number;
    rooms_count: number;
    bathrooms_count: number;
    floors_count: number;
    plot_area: number;
    building_area: number;
    // For-sale related fields
    for_sale: boolean;
    advertisement_number: string;
    sale_price: number;
    sale_description: string;
  }>
): Promise<Project> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Map expected_completion_date to end_date for the DB
    const updatePayload: any = { ...updates, updated_at: new Date().toISOString() };
    if (updatePayload.expected_completion_date) {
      updatePayload.end_date = updatePayload.expected_completion_date;
      delete updatePayload.expected_completion_date;
    }    // Only remove fields that truly do not exist in the schema
    delete updatePayload.actual_completion_date;
    delete updatePayload.district;
    delete updatePayload.country;
    delete updatePayload.currency;
    delete updatePayload.rooms_count;
    delete updatePayload.bathrooms_count;
    delete updatePayload.floors_count;
    delete updatePayload.plot_area;
    delete updatePayload.building_area;
    delete updatePayload.metadata;
    delete updatePayload.image_url;
    // DO NOT delete actual_cost, city, region, priority, progress_percentage, or for_sale fields

    console.log('[updateProject] Update payload:', updatePayload);

    const { data, error } = await supabase
      .from('projects')
      .update(updatePayload)
      .eq('id', projectId)
      .eq('user_id', user.id) // Ensure user can only update their own projects
      .select()
      .single();

    if (error) {
      console.error('[updateProject] Supabase error:', error);
      throw error;
    }

    // Transform the data to match the Project interface
    const transformedProject: Project = {
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      description: data.description || '',
      project_type: data.project_type,
      location: data.location,
      address: data.address || '',
      city: data.city || '',
      region: data.region || '',      status: data.status,
      priority: data.priority || 'medium',      start_date: data.start_date,
      expected_completion_date: data.end_date,
      actual_completion_date: undefined, // This field doesn't exist in the database
      budget: data.budget || 0,
      actual_cost: data.actual_cost,
      progress_percentage: data.progress_percentage,
      is_active: data.is_active,
      created_at: data.created_at,
      updated_at: data.updated_at,
      currency: 'SAR',
    };
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
    throw error;
  }
}

// Get a single project by ID
export async function getProjectById(projectId: string): Promise<Project | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // First check if project exists at all
    const { data: projectExists, error: existsError } = await supabase
      .from('projects')
      .select('id, user_id, name')
      .eq('id', projectId)
      .single();
    
    if (existsError) {
      if (existsError.code === 'PGRST116') {
        // Project doesn't exist
        throw new Error('PROJECT_NOT_FOUND');
      }
      throw existsError;
    }
    
    // Check if user owns the project
    if (projectExists.user_id !== user.id) {
      throw new Error('PROJECT_ACCESS_DENIED');
    }    // Now get the full project data
    const { data, error } = await supabase
      .from('projects')
      .select(
        `
        id, user_id, name, description, project_type, location, 
        address, city, region, status, priority, start_date, end_date,
        budget, actual_cost, progress_percentage, is_active, created_at, updated_at
        `
      ).eq('id', projectId)
      .eq('user_id', user.id)
      .single();
    
    if (error) {
      throw error;
    }

    // Transform the data to match the Project interface
    const transformedProject: Project = {
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      description: data.description || '',
      project_type: data.project_type,
      location: data.location,
      address: data.address || '',
      city: data.city || '',
      region: data.region || '',      status: data.status,
      priority: data.priority || 'medium',      start_date: data.start_date,
      expected_completion_date: data.end_date,
      actual_completion_date: undefined, // This field doesn't exist in the database
      budget: data.budget || 0,
      actual_cost: data.actual_cost ?? 0,
      progress_percentage: data.progress_percentage ?? 0,
      is_active: data.is_active,
      created_at: data.created_at,
      updated_at: data.updated_at,
      currency: 'SAR',
    };
      return transformedProject;
  } catch (error: any) {
    console.error('Error in getProjectById:', error?.message || error);
    
    // Provide specific error messages for different scenarios
    if (error.message === 'PROJECT_NOT_FOUND') {
      throw new Error('المشروع غير موجود في قاعدة البيانات');
    } else if (error.message === 'PROJECT_ACCESS_DENIED') {
      throw new Error('ليس لديك صلاحية للوصول إلى هذا المشروع');
    } else if (error.message === 'User not authenticated') {
      throw new Error('يرجى تسجيل الدخول أولاً');
    }
    
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
      .eq('user_id', user.id); // Ensure user can only delete their own projects    if (error) throw error;
  } catch (error: any) {
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

// Get all user's projects (no pagination)
export async function getAllProjects(userId: string): Promise<Project[]> {
  const supabase = createClientComponentClient();

  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select(`
        id, user_id, name, description, project_type, location, 
        address, city, region, status, priority, start_date, end_date,
        budget, actual_cost, progress_percentage, is_active, created_at, updated_at
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Transform projects to match the Project interface
    const transformedProjects: Project[] = (projects || []).map(data => ({
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
      priority: data.priority || 'medium',
      start_date: data.start_date,
      expected_completion_date: data.end_date, // Map end_date to expected_completion_date
      actual_completion_date: undefined, // This field doesn't exist in the database
      budget: data.budget || 0,
      actual_cost: data.actual_cost ?? 0,
      progress_percentage: data.progress_percentage ?? 0,
      is_active: data.is_active,
      created_at: data.created_at,
      updated_at: data.updated_at,
      currency: 'SAR',
    }));

    return transformedProjects;
  } catch (error: any) {
    console.error('Error fetching all projects:', error);
    return [];
  }
}
