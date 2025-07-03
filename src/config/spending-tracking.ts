import {
  ConstructionCategory as DashboardConstructionCategory,
  ConstructionExpense as DashboardConstructionExpense,
} from './dashboard';
import {
  ConstructionCategory as SpendingConstructionCategory,
  ConstructionExpense as SpendingConstructionExpense,
  SpendingByCategory,
} from './spending';

// Merged types to handle incompatibilities
export interface ConstructionCategory extends SpendingConstructionCategory {
  id: string;
  name?: string;
  name_ar?: string;
  is_active?: boolean;
  sort_order?: number;
  color: string;
  total_amount: number;
  transaction_count: number;
}

export interface ConstructionExpense extends SpendingConstructionExpense {
  id: string;
  title: string;
  description?: string;
  amount: number;
  currency: string;
  expense_date: string;
  created_by: string;
  status?: 'pending' | 'paid' | 'overdue' | 'cancelled';
  vendor?: string;
  category?: ConstructionCategory;
  is_budgeted: boolean;
}

// Re-export for consistency
export type { SpendingByCategory };

export interface SpendingData {
  categories: ConstructionCategory[];
  total_spent: number;
  total_transactions: number;
}
