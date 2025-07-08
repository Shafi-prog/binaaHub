// @ts-nocheck
import type { Database } from './database';

export interface Order {
  id: string;
  order_number: string;
  status: Database['public']['Enums']['order_status'];
  total_amount: number;
  created_at: string;
  updated_at: string;
  delivery_date?: string | null;
  notes?: string | null;
  store?: {
    id: string;
    store_name: string;
  };
  project?: {
    id: string;
    name: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}


