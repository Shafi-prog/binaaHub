// Types for the comprehensive dashboard system
export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  region?: string;
  account_type: 'user' | 'store' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  avatar_url?: string;
  date_of_birth?: string;
  gender?: string;
  occupation?: string;
  company_name?: string;
  national_id?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  preferred_language: string;
  notification_preferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  project_type: string;
  location: string;
  address?: string;
  city?: string;
  region?: string;
  plot_area?: number;
  building_area?: number;
  floors_count?: number;
  rooms_count?: number;
  bathrooms_count?: number;
  status:
    | 'planning'
    | 'design'
    | 'permits'
    | 'construction'
    | 'finishing'
    | 'completed'
    | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  start_date?: string;
  expected_completion_date?: string;
  actual_completion_date?: string;
  budget?: number;
  actual_cost?: number;
  currency: string;
  progress_percentage?: number;
  is_active: boolean;
  for_sale?: boolean;
  images?: ProjectImage[];
  created_at: string;
  updated_at: string;
  country?: string; // Added `country` property to the `Project` interface to resolve type errors.
  location_lat?: number;
  location_lng?: number; // Added `location_lat` and `location_lng` properties to the `Project` interface to resolve type errors.
  metadata?: Record<string, any>; // Added `metadata` property to the `Project` interface to resolve type errors.
  image_url?: string; // Added `image_url` property to the `Project` interface to resolve type errors.
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  created_at: string;
}

export interface ProjectPhase {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  phase_order: number;
  status: 'pending' | 'in_progress' | 'completed' | 'on_hold';
  start_date?: string;
  end_date?: string;
  budget?: number;
  actual_cost?: number;
  progress_percentage?: number;
  created_at: string;
  updated_at: string;
}

export interface ConstructionCategory {
  id: string;
  name: string;
  name_ar: string;
  description?: string;
  parent_category_id?: string;
  icon?: string;
  color?: string;
  is_active: boolean;
  sort_order: number;
}

export interface ConstructionExpense {
  id: string;
  project_id: string;
  phase_id?: string;
  category_id: string;
  subcategory?: string;
  title: string;
  description?: string;
  amount: number;
  currency: string;
  expense_date: string;
  vendor_name?: string;
  vendor_contact?: string;
  invoice_number?: string;
  invoice_url?: string;
  receipt_url?: string;
  payment_method?: string;
  payment_status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  paid_date?: string;
  notes?: string;
  quantity?: number;
  unit_price?: number;
  unit?: string;
  is_budgeted: boolean;
  created_by: string;
  approved_by?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;

  // Joined data
  category?: ConstructionCategory;
  project?: Project;
}

export interface Store {
  id: string;
  user_id: string;
  store_name: string;
  business_license?: string;
  description?: string;
  category?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  region?: string;
  website?: string;
  logo_url?: string;
  cover_image_url?: string;
  rating: number;
  total_reviews: number;
  is_verified: boolean;
  is_active: boolean;
  delivery_areas?: string[];
  working_hours?: any;
  payment_methods?: string[];
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  store_id: string;
  category_id?: string;
  name: string;
  description?: string;
  brand?: string;
  model?: string;
  sku?: string;
  price: number;
  cost_price?: number;
  currency: string;
  unit: string;
  minimum_quantity: number;
  stock_quantity: number;
  low_stock_threshold: number;
  is_digital: boolean;
  weight?: number;
  dimensions?: any;
  images?: string[];
  specifications?: any;
  warranty_period: number;
  warranty_terms?: string;
  is_featured: boolean;
  is_active: boolean;
  tags?: string[];
  created_at: string;
  updated_at: string;

  // Joined data
  store?: Store;
  category?: ConstructionCategory;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string;
  project_id?: string;
  store_id?: string;
  status:
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'returned';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'partial';
  total_amount: number;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  currency: string;
  delivery_type: string;
  delivery_address?: string;
  delivery_city?: string;
  delivery_region?: string;
  delivery_postal_code?: string;
  delivery_instructions?: string;
  delivery_date?: string;
  delivered_at?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  notes?: string;
  tracking_number?: string;
  estimated_delivery_date?: string;
  confirmed_at?: string;
  shipped_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;

  // Joined data
  store?: Store;
  project?: Project;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  product_name: string;
  product_sku?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  unit?: string;
  notes?: string;
  warranty_start_date?: string;
  warranty_end_date?: string;
  created_at: string;

  // Joined data
  product?: Product;
}

export interface Warranty {
  id: string;
  user_id: string;
  project_id?: string;
  order_id?: string;
  order_item_id?: string;
  store_id?: string;
  product_id?: string;
  warranty_number: string;
  product_name: string;
  brand?: string;
  model?: string;
  serial_number?: string;
  purchase_date: string;
  warranty_start_date: string;
  warranty_end_date: string;
  warranty_period_months: number;
  warranty_type: 'manufacturer' | 'extended' | 'store' | 'custom';
  coverage_description?: string;
  terms_and_conditions?: string;
  exclusions?: string;
  status: 'active' | 'expired' | 'claimed' | 'void' | 'transferred';
  is_transferable: boolean;
  claim_count: number;
  last_claim_date?: string;
  purchase_receipt_url?: string;
  warranty_certificate_url?: string;
  product_images?: string[];
  vendor_name?: string;
  vendor_contact?: string;
  service_center_info?: any;
  notes?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;

  // Joined data
  store?: Store;
  project?: Project;
  order?: Order;
}

export interface WarrantyClaim {
  id: string;
  warranty_id: string;
  claim_number: string;
  claim_type: 'repair' | 'replacement' | 'refund' | 'service';
  status:
    | 'submitted'
    | 'under_review'
    | 'approved'
    | 'rejected'
    | 'in_progress'
    | 'completed'
    | 'closed';
  issue_description: string;
  reported_date: string;
  issue_photos?: string[];
  diagnosis?: string;
  resolution_description?: string;
  service_provider?: string;
  service_date?: string;
  completion_date?: string;
  cost_covered: number;
  cost_customer: number;
  customer_notes?: string;
  vendor_notes?: string;
  resolution_notes?: string;
  customer_satisfaction_rating?: number;
  customer_feedback?: string;
  created_at: string;
  updated_at: string;

  // Joined data
  warranty?: Warranty;
}

export interface DeliveryAddress {
  id: string;
  user_id: string;
  title: string;
  recipient_name?: string;
  phone?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  region: string;
  postal_code?: string;
  country: string;
  delivery_instructions?: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  is_read: boolean;
  action_url?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  channel: 'app' | 'email' | 'sms' | 'push';
  related_entity_type?: string;
  related_entity_id?: string;
  sent_at: string;
  read_at?: string;
  expires_at?: string;
}

export interface DashboardStats {
  activeProjects: number;
  completedProjects: number;
  totalProjects: number;
  totalSpent: number;
  totalBudget: number;
  activeOrders: number;
  completedOrders: number;
  totalOrders: number;
  activeWarranties: number;
  expiringWarranties: number;
  unreadNotifications: number;
  pendingExpenses: number;
  monthlySpending: number;
}

export interface SpendingByCategory {
  category_id: string;
  category_name: string;
  category_name_ar: string;
  total_amount: number;
  transaction_count: number;
  color?: string;
}

export interface MonthlySpending {
  month: string;
  year: number;
  total_amount: number;
  expense_count: number;
}

export interface ReportOptions {
  type: 'expense_summary' | 'project_status' | 'warranty_list' | 'order_history';
  format: 'pdf' | 'excel' | 'csv';
  dateFrom?: string;
  dateTo?: string;
  projectId?: string;
  categoryId?: string;
  includeImages?: boolean;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form types
export interface ProjectForm {
  name: string;
  description?: string;
  project_type: string;
  location: string;
  address?: string;
  city?: string;
  region?: string;
  plot_area?: number;
  building_area?: number;
  floors_count?: number;
  rooms_count?: number;
  bathrooms_count?: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  start_date?: string;
  expected_completion_date?: string;
  budget?: number;
}

export interface ExpenseForm {
  project_id: string;
  phase_id?: string;
  category_id: string;
  subcategory?: string;
  title: string;
  description?: string;
  amount: number;
  expense_date: string;
  vendor_name?: string;
  vendor_contact?: string;
  invoice_number?: string;
  payment_method?: string;
  payment_status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  paid_date?: string;
  notes?: string;
  quantity?: number;
  unit_price?: number;
  unit?: string;
  is_budgeted: boolean;
  tags?: string[];
}

export interface WarrantyForm {
  project_id?: string;
  order_id?: string;
  store_id?: string;
  product_name: string;
  brand?: string;
  model?: string;
  serial_number?: string;
  purchase_date: string;
  warranty_start_date: string;
  warranty_period_months: number;
  warranty_type: 'manufacturer' | 'extended' | 'store' | 'custom';
  coverage_description?: string;
  terms_and_conditions?: string;
  vendor_name?: string;
  vendor_contact?: string;
  notes?: string;
}

export interface DeliveryAddressForm {
  title: string;
  recipient_name?: string;
  phone?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  region: string;
  postal_code?: string;
  delivery_instructions?: string;
  is_default: boolean;
}
