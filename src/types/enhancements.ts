// Enhanced types for the comprehensive feature implementation

import type { Database } from './database';

// ====================================================================================
// 1. SHARED BARCODE & INVENTORY TYPES
// ====================================================================================

export interface GlobalItem {
  id: string;
  barcode: string;
  name: string;
  description?: string;
  brand?: string;
  model?: string;
  category?: string;
  specifications?: Record<string, any>;
  shared_image_url?: string;
  warranty_months: number;
  created_at: string;
  updated_at: string;
}

export interface StoreInventory {
  id: string;
  store_id: string;
  global_item_id: string;
  store_price: number;
  store_cost?: number;
  stock_quantity: number;
  min_stock_level: number;
  store_specific_notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  global_item?: GlobalItem;
}

export interface BulkImportSession {
  id: string;
  user_id: string;
  file_name: string;
  file_path?: string;
  total_rows: number;
  processed_rows: number;
  success_rows: number;
  error_rows: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error_log?: Record<string, any>;
  created_at: string;
  completed_at?: string;
}

export interface ExcelImportData {
  barcode: string;
  name: string;
  description?: string;
  brand?: string;
  category?: string;
  price: number;
  cost?: number;
  stock: number;
  min_stock?: number;
  notes?: string;
}

// ====================================================================================
// 2. ENHANCED INVITATION & COMMISSION TYPES
// ====================================================================================

export interface EnhancedInviteCode {
  user_id: string;
  code: string;
  usage_count: number;
  total_commission: number;
  commission_rate: number;
  is_active: boolean;
  expiry_date?: string;
  max_uses?: number;
  created_at: string;
  updated_at: string;
}

export interface Commission {
  id: string;
  referrer_id: string;
  referee_id: string;
  order_id?: string;
  commission_type: 'user_signup' | 'store_signup' | 'purchase';
  commission_rate: number;
  order_amount?: number;
  commission_amount: number;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CommissionPayout {
  id: string;
  user_id: string;
  total_amount: number;
  commission_ids: string[];
  payment_method?: string;
  payment_reference?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processed_at?: string;
  notes?: string;
  created_at: string;
}

export interface CommissionDashboard {
  total_earned: number;
  pending_amount: number;
  paid_amount: number;
  total_referrals: number;
  active_referrals: number;
  monthly_earnings: number;
  recent_commissions: Commission[];
}

// ====================================================================================
// 3. CONSTRUCTION SUPERVISOR TYPES
// ====================================================================================

export interface ConstructionSupervisor {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  email?: string;
  license_number?: string;
  specializations: string[];
  hourly_rate?: number;
  experience_years?: number;
  rating: number;
  total_projects: number;
  is_available: boolean;
  is_verified: boolean;
  profile_image_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface SupervisorRequest {
  id: string;
  user_id: string;
  project_id: string;
  supervisor_id?: string;
  request_type: 'consultation' | 'full_supervision' | 'periodic_inspection';
  description: string;
  budget_range_min?: number;
  budget_range_max?: number;
  preferred_start_date?: string;
  duration_weeks?: number;
  status: 'pending' | 'accepted' | 'declined' | 'in_progress' | 'completed' | 'cancelled';
  supervisor_response?: string;
  created_at: string;
  updated_at: string;
  supervisor?: ConstructionSupervisor;
  project?: {
    name: string;
    description?: string;
  };
}

// ====================================================================================
// 4. CONTRACT & PAYMENT TYPES
// ====================================================================================

export interface ConstructionContract {
  id: string;
  project_id: string;
  user_id: string;
  supervisor_id: string;
  contract_number: string;
  title: string;
  description: string;
  total_amount: number;
  start_date: string;
  end_date: string;
  payment_schedule: PaymentScheduleItem[];
  terms_and_conditions: string;
  status: 'draft' | 'pending_signature' | 'active' | 'completed' | 'terminated' | 'disputed';
  user_signature_date?: string;
  supervisor_signature_date?: string;
  contract_document_url?: string;
  created_at: string;
  updated_at: string;
  supervisor?: ConstructionSupervisor;
  project?: {
    name: string;
    description?: string;
  };
}

export interface PaymentScheduleItem {
  milestone_number: number;
  title: string;
  description?: string;
  amount: number;
  due_date: string;
  completion_criteria?: string;
}

export interface PaymentMilestone {
  id: string;
  contract_id: string;
  milestone_number: number;
  title: string;
  description?: string;
  amount: number;
  due_date: string;
  completion_criteria?: string;
  status: 'pending' | 'completed' | 'approved' | 'paid' | 'overdue';
  completed_date?: string;
  approved_date?: string;
  paid_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SupervisorPermission {
  id: string;
  contract_id: string;
  supervisor_id: string;
  permission_type: 'purchase' | 'payment' | 'worker_hire';
  spending_limit?: number;
  category_restrictions?: string[];
  is_active: boolean;
  granted_at: string;
  expires_at?: string;
  granted_by?: string;
}

// ====================================================================================
// 5. EXPENSE & WORKER TYPES
// ====================================================================================

export interface ProjectExpense {
  id: string;
  project_id: string;
  contract_id?: string;
  supervisor_id?: string;
  expense_type: 'materials' | 'labor' | 'equipment' | 'transport' | 'other';
  description: string;
  amount: number;
  receipt_url?: string;
  vendor_name?: string;
  vendor_contact?: string;
  expense_date: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
  category?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  supervisor?: ConstructionSupervisor;
}

export interface ProjectWorker {
  id: string;
  project_id: string;
  supervisor_id?: string;
  worker_name: string;
  worker_phone?: string;
  worker_id_number?: string;
  specialty: string;
  daily_wage: number;
  hire_date: string;
  termination_date?: string;
  is_active: boolean;
  performance_rating?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkerAttendance {
  id: string;
  worker_id: string;
  project_id: string;
  work_date: string;
  hours_worked: number;
  overtime_hours: number;
  daily_wage: number;
  overtime_rate?: number;
  total_payment: number;
  payment_status: 'pending' | 'paid';
  paid_date?: string;
  notes?: string;
  recorded_by?: string;
  created_at: string;
}

// ====================================================================================
// 6. ANALYTICS & NOTIFICATION TYPES
// ====================================================================================

export interface UserAnalytics {
  id: string;
  user_id: string;
  metric_type: string;
  metric_value: number;
  period_start: string;
  period_end: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface EmailNotification {
  id: string;
  user_id: string;
  template_name: string;
  subject: string;
  recipient_email: string;
  template_data?: Record<string, any>;
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  sent_at?: string;
  error_message?: string;
  retry_count: number;
  max_retries: number;
  scheduled_for: string;
  created_at: string;
}

export interface SystemNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category?: string;
  related_entity_type?: string;
  related_entity_id?: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

// ====================================================================================
// 7. DASHBOARD & ANALYTICS AGGREGATES
// ====================================================================================

export interface EnhancedUserDashboard {
  user: {
    id: string;
    name: string;
    email: string;
    account_type: string;
  };
  analytics: {
    total_projects: number;
    active_projects: number;
    total_spending: number;
    monthly_spending: number;
    pending_payments: number;
    active_warranties: number;
  };
  commissions: CommissionDashboard;
  recent_activities: Array<{
    type: string;
    description: string;
    amount?: number;
    date: string;
  }>;
  notifications: SystemNotification[];
}

export interface EnhancedStoreDashboard {
  store: {
    id: string;
    store_name: string;
    category?: string;
    rating: number;
  };
  analytics: {
    total_products: number;
    total_orders: number;
    monthly_revenue: number;
    commission_earned: number;
    active_inventory: number;
    low_stock_items: number;
  };
  recent_orders: Array<{
    id: string;
    customer_name: string;
    amount: number;
    status: string;
    created_at: string;
  }>;
  inventory_alerts: Array<{
    product_name: string;
    current_stock: number;
    min_stock: number;
  }>;
}

export interface SupervisorDashboard {
  supervisor: ConstructionSupervisor;
  analytics: {
    active_projects: number;
    completed_projects: number;
    total_earnings: number;
    monthly_earnings: number;
    average_rating: number;
    pending_requests: number;
  };
  active_contracts: ConstructionContract[];
  recent_expenses: ProjectExpense[];
  pending_milestones: PaymentMilestone[];
}

// ====================================================================================
// 8. API RESPONSE TYPES
// ====================================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BarcodeSearchResult {
  global_item: GlobalItem;
  store_inventory: StoreInventory[];
  lowest_price: number;
  highest_price: number;
  available_stores: number;
}

// ====================================================================================
// 9. FORM TYPES
// ====================================================================================

export interface BulkImportFormData {
  file: File;
  import_type: 'global_items' | 'store_inventory';
  overwrite_existing: boolean;
  validate_only: boolean;
}

export interface SupervisorRequestFormData {
  project_id: string;
  request_type: 'consultation' | 'full_supervision' | 'periodic_inspection';
  description: string;
  budget_range_min?: number;
  budget_range_max?: number;
  preferred_start_date?: string;
  duration_weeks?: number;
}

export interface ContractFormData {
  project_id: string;
  supervisor_id: string;
  title: string;
  description: string;
  total_amount: number;
  start_date: string;
  end_date: string;
  payment_schedule: PaymentScheduleItem[];
  terms_and_conditions: string;
}

export interface ExpenseFormData {
  project_id: string;
  contract_id?: string;
  expense_type: 'materials' | 'labor' | 'equipment' | 'transport' | 'other';
  description: string;
  amount: number;
  vendor_name?: string;
  vendor_contact?: string;
  expense_date: string;
  category?: string;
  notes?: string;
  receipt_file?: File;
}

// ====================================================================================
// 10. UTILITY TYPES
// ====================================================================================

export type NotificationType = 'commission_earned' | 'payment_due' | 'expense_approved' | 'contract_signed' | 'milestone_completed' | 'warranty_expiring';

export interface EmailTemplate {
  name: string;
  subject: string;
  html_content: string;
  text_content: string;
  variables: string[];
}

export interface DashboardMetric {
  label: string;
  value: number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  format: 'currency' | 'number' | 'percentage';
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }>;
}
