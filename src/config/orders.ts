// @ts-nocheck
import type { Database } from './database';

export interface Order {
  id: string;
  user_id: string;
  store_id: string;
  project_id: string | null;
  order_number: string;
  status: Database['public']['Enums']['order_status'];
  payment_status: string;
  total_amount: number;
  has_warranty: boolean;
  warranty_duration_months: number | null;
  warranty_notes: string | null;
  delivery_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  store?: {
    store_name: string;
    id: string;
  };
  project?: {
    name: string;
    id: string;
  };
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  has_warranty: boolean;
  warranty_duration_months: number | null;
  warranty_notes: string | null;
  created_at: string;
  updated_at: string;
  product: {
    name: string;
    id: string;
  };
}


