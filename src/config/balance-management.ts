// @ts-nocheck
// Balance Management & Authorization Types
export interface UserBalance {
  id: string;
  user_id: string;
  current_balance: number;
  currency: string;
  last_deposit_date?: string;
  last_withdrawal_date?: string;
  created_at: string;
  updated_at: string;
}

export interface BalanceTransaction {
  id: string;
  user_id: string;
  transaction_type: 'deposit' | 'withdrawal' | 'payment' | 'refund' | 'commission';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  reference_id?: string;
  reference_type?: 'project' | 'contract' | 'expense' | 'authorization';
  payment_method?: string;
  transaction_date: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface SpendingAuthorization {
  id: string;
  user_id: string;
  supervisor_id: string;
  project_id: string;
  contract_id?: string;
  amount: number;
  currency: string;
  purpose: string;
  authorization_type: 'one_time' | 'recurring' | 'category_based';
  category?: string;
  spending_limit: number;
  status: 'pending' | 'approved' | 'rejected' | 'expired' | 'cancelled';
  approved_date?: string;
  expiry_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CommissionRecord {
  id: string;
  supervisor_id: string;
  user_id: string;
  project_id: string;
  expense_id?: string;
  purchase_id?: string;
  transaction_id?: string;
  commission_type: 'purchase' | 'project_completion' | 'milestone';
  amount: number;
  percentage: number;
  base_amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'cancelled';
  payment_date?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface WarrantyRecord {
  id: string;
  project_id: string;
  expense_id?: string;
  purchase_id?: string;
  item_name: string;
  vendor_name?: string;
  vendor_contact?: string;
  purchase_date: string;
  warranty_start_date: string;
  warranty_end_date: string;
  warranty_terms?: string;
  warranty_document_url?: string;
  registered_by: string; // supervisor_id or user_id
  status: 'active' | 'expired' | 'claimed';
  claim_date?: string;
  claim_details?: string;
  created_at: string;
  updated_at: string;
}


