// @ts-nocheck
// Project-related types

export interface ProjectData {
  id: string;
  name: string;
  description?: string;
  project_type?: string;
  address?: string;
  city?: string;
  region?: string;
  status: string;
  priority?: string;
  start_date?: string;
  end_date?: string;
  expected_completion_date?: string;
  actual_completion_date?: string;
  budget?: number;
  spent?: number;
  actual_cost?: number;
  progress_percentage?: number;
  location?: string;
  contractor_id?: string;
  for_sale?: boolean;
  advertisement_number?: string;
  sale_price?: number;
  sale_description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectExpense {
  id: string;
  project_id: string;
  category: string;
  amount: number;
  description?: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectSpending {
  category: string;
  amount: number;
  percentage: number;
}


