// Enhanced types for construction supervisor features
export interface ConstructionSupervisor {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  email: string;
  location: string;
  specializations?: string[];
  experience_years: number;
  certifications?: string[];
  portfolio_urls?: string[];
  hourly_rate?: number;
  daily_rate?: number;
  rating: number;
  total_projects: number;
  is_available: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupervisorRequest {
  id: string;
  user_id: string;
  supervisor_id: string;
  project_id?: string;
  request_type: 'consultation' | 'full_supervision' | 'inspection';
  description: string;
  budget_range_min?: number;
  budget_range_max?: number;
  preferred_start_date?: string;
  duration_weeks?: number;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  supervisor_response?: string;
  created_at: string;
  updated_at: string;
}

export interface ConstructionContract {
  id: string;
  project_id: string;
  user_id: string;
  supervisor_id: string;
  contract_number: string;
  total_amount: number;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  start_date: string;
  end_date: string;
  terms: string;
  payment_schedule?: PaymentMilestone[];
  user_signature_date?: string;
  supervisor_signature_date?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentMilestone {
  id: string;
  contract_id: string;
  milestone_number: number;
  title: string;
  description?: string;
  amount: number;
  due_date: string;
  status: 'pending' | 'completed' | 'paid';
  completed_date?: string;
  notes?: string;
  completion_criteria?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectExpense {
  id: string;
  project_id: string;
  supervisor_id: string;
  expense_type: 'materials' | 'labor' | 'equipment' | 'permits' | 'other';
  description: string;
  amount: number;
  receipt_url?: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SupervisorPermission {
  id: string;
  contract_id: string;
  supervisor_id: string;
  permission_type: 'expense_approval' | 'material_ordering' | 'schedule_changes';
  spending_limit?: number;
  category_restrictions?: string[];
  is_active: boolean;
  granted_at: string;
  expires_at?: string;
  granted_by: string;
}
