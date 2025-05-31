// Types for spending tracking module

export interface ConstructionCategory {
  id: string;
  category_name: string;
  category_name_ar: string;
  description?: string;
  parent_id?: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface SpendingByCategory {
  category_id: string;
  category_name: string;
  category_name_ar: string;
  total_amount: number;
  transaction_count: number;
  color: string;
}

export interface ConstructionExpense {
  id: string;
  project_id?: string;
  category_id: string;
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
  tags?: string[];
  category?: ConstructionCategory;
  created_at: string;
  updated_at: string;
}

export interface SpendingStats {
  total_spent: number;
  total_pending: number;
  total_categories: number;
  largest_expense: number;
  recent_expenses: ConstructionExpense[];
  spending_by_category: SpendingByCategory[];
}
