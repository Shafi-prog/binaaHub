// @ts-nocheck
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Supabase client
const supabase = createClientComponentClient();

// Types for our ERP system using Supabase
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address: string;
  city: string;
  country: string;
  total_orders: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
  status: 'active' | 'inactive';
  vat_number?: string;
  contact_person?: string;
  payment_terms?: string;
  credit_limit?: number;
  notes?: string;
}

export interface Product {
  id: string;
  name: string;
  name_ar?: string;
  sku: string;
  barcode?: string;
  price: number;
  cost: number;
  category: string;
  subcategory?: string;
  stock: number;
  min_stock: number;
  max_stock?: number;
  unit: string;
  description: string;
  description_ar?: string;
  supplier?: string;
  supplier_id?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  images?: string[];
  specifications?: Record<string, any>;
  is_service?: boolean;
  warranty_period?: number;
  expiry_date?: string;
  location?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  customer_name: string;
  total: number;
  subtotal: number;
  vat_amount: number;
  discount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method?: string;
  order_date: string;
  delivery_date?: string;
  delivery_address?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  shipping_cost?: number;
  reference_number?: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  sku: string;
  quantity: number;
  price: number;
  cost: number;
  total: number;
  vat_rate: number;
  vat_amount: number;
  discount?: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: string;
  customer_name: string;
  order_id?: string;
  total: number;
  subtotal: number;
  vat_amount: number;
  discount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issue_date: string;
  due_date: string;
  payment_date?: string;
  payment_method?: string;
  created_at: string;
  updated_at: string;
  items: InvoiceItem[];
  notes?: string;
  terms?: string;
  zatca_qr?: string;
  zatca_hash?: string;
  pdf_path?: string;
}

export interface InvoiceItem {
  description: string;
  description_ar?: string;
  quantity: number;
  price: number;
  vat_rate: number;
  vat_amount: number;
  discount?: number;
  total: number;
}

export interface StockMovement {
  id: string;
  product_id: string;
  product_name: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reference_type: 'purchase' | 'sale' | 'adjustment' | 'transfer';
  reference_id?: string;
  notes?: string;
  created_at: string;
  created_by: string;
}

// Supabase ERP Service Class
export class SupabaseERPService {
  // Customer methods
  async getCustomers(filter: any = {}, limit: number = 100, offset: number = 0): Promise<Customer[]> {
    let query = supabase
      .from('erp_customers')
      .select('*')
      .range(offset, offset + limit - 1);

    // Apply filters
    if (filter.search) {
      query = query.or(`name.ilike.%${filter.search}%,email.ilike.%${filter.search}%,company.ilike.%${filter.search}%`);
    }
    if (filter.status) {
      query = query.eq('status', filter.status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('erp_customers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async createCustomer(customer: Omit<Customer, 'created_at' | 'updated_at'>): Promise<Customer> {
    const { data, error } = await supabase
      .from('erp_customers')
      .insert([{
        ...customer,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer> {
    const { data, error } = await supabase
      .from('erp_customers')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteCustomer(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('erp_customers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  // Product methods
  async getProducts(filter: any = {}, limit: number = 100, offset: number = 0): Promise<Product[]> {
    let query = supabase
      .from('erp_products')
      .select('*')
      .range(offset, offset + limit - 1);

    // Apply filters
    if (filter.search) {
      query = query.or(`name.ilike.%${filter.search}%,sku.ilike.%${filter.search}%,barcode.ilike.%${filter.search}%`);
    }
    if (filter.category) {
      query = query.eq('category', filter.category);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('erp_products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async createProduct(product: Omit<Product, 'created_at' | 'updated_at'>): Promise<Product> {
    const { data, error } = await supabase
      .from('erp_products')
      .insert([{
        ...product,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase
      .from('erp_products')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateProductStock(id: string, quantity: number, type: 'add' | 'subtract' = 'subtract'): Promise<boolean> {
    // First get current stock
    const { data: product, error: fetchError } = await supabase
      .from('erp_products')
      .select('stock')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    
    const newStock = type === 'add' 
      ? product.stock + quantity 
      : product.stock - quantity;
    
    const { error } = await supabase
      .from('erp_products')
      .update({ 
        stock: newStock,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  async getLowStockProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('erp_products')
      .select('*')
      .lte('stock', 'min_stock');
    
    if (error) throw error;
    return data || [];
  }

  // Order methods
  async getOrders(filter: any = {}, limit: number = 100, offset: number = 0): Promise<Order[]> {
    let query = supabase
      .from('erp_orders')
      .select('*')
      .range(offset, offset + limit - 1);

    // Apply filters
    if (filter.status) {
      query = query.eq('status', filter.status);
    }
    if (filter.customer_id) {
      query = query.eq('customer_id', filter.customer_id);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getOrderById(id: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('erp_orders')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async createOrder(order: Omit<Order, 'created_at' | 'updated_at'>): Promise<Order> {
    const { data, error } = await supabase
      .from('erp_orders')
      .insert([{
        ...order,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;

    // Update product stock for each item
    for (const item of order.items) {
      await this.updateProductStock(item.product_id, item.quantity, 'subtract');
        // Record stock movement
      await this.recordStockMovement({
        product_id: item.product_id,
        product_name: item.product_name,
        type: 'out',
        quantity: item.quantity,
        reference_type: 'sale',
        reference_id: order.id,
        created_at: new Date().toISOString(),
        created_by: 'system'
      });
    }
    
    return data;
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    const { data, error } = await supabase
      .from('erp_orders')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Invoice methods
  async getInvoices(filter: any = {}, limit: number = 100, offset: number = 0): Promise<Invoice[]> {
    let query = supabase
      .from('erp_invoices')
      .select('*')
      .range(offset, offset + limit - 1);

    // Apply filters
    if (filter.status) {
      query = query.eq('status', filter.status);
    }
    if (filter.customer_id) {
      query = query.eq('customer_id', filter.customer_id);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getInvoiceById(id: string): Promise<Invoice | null> {
    const { data, error } = await supabase
      .from('erp_invoices')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async createInvoice(invoice: Omit<Invoice, 'created_at' | 'updated_at'>): Promise<Invoice> {
    const { data, error } = await supabase
      .from('erp_invoices')
      .insert([{
        ...invoice,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateInvoice(id: string, updates: Partial<Invoice>): Promise<Invoice> {
    const { data, error } = await supabase
      .from('erp_invoices')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getOverdueInvoices(): Promise<Invoice[]> {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('erp_invoices')
      .select('*')
      .in('status', ['sent', 'overdue'])
      .lt('due_date', now);
    
    if (error) throw error;
    return data || [];
  }

  // Stock movement methods
  async recordStockMovement(movement: Omit<StockMovement, 'id'>): Promise<StockMovement> {
    const { data, error } = await supabase
      .from('erp_stock_movements')
      .insert([movement])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getStockMovements(productId?: string, limit: number = 100): Promise<StockMovement[]> {
    let query = supabase
      .from('erp_stock_movements')
      .select('*')
      .limit(limit);
    
    if (productId) {
      query = query.eq('product_id', productId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  // Analytics methods
  async getDashboardStats(): Promise<any> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

    // Get total revenue from paid invoices
    const { data: totalRevenueData } = await supabase
      .from('erp_invoices')
      .select('total')
      .eq('status', 'paid');
    
    const totalRevenue = totalRevenueData?.reduce((sum, inv) => sum + inv.total, 0) || 0;

    // Get monthly revenue
    const { data: monthlyRevenueData } = await supabase
      .from('erp_invoices')
      .select('total')
      .eq('status', 'paid')
      .gte('payment_date', startOfMonth);
    
    const monthlyRevenue = monthlyRevenueData?.reduce((sum, inv) => sum + inv.total, 0) || 0;

    // Get last month revenue for growth calculation
    const { data: lastMonthRevenueData } = await supabase
      .from('erp_invoices')
      .select('total')
      .eq('status', 'paid')
      .gte('payment_date', startOfLastMonth)
      .lte('payment_date', endOfLastMonth);
    
    const lastMonthRevenue = lastMonthRevenueData?.reduce((sum, inv) => sum + inv.total, 0) || 0;

    const revenueGrowth = lastMonthRevenue > 0 
      ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0;

    // Get order counts
    const { count: totalOrders } = await supabase
      .from('erp_orders')
      .select('*', { count: 'exact', head: true });

    const { count: pendingOrders } = await supabase
      .from('erp_orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Get customer counts
    const { count: totalCustomers } = await supabase
      .from('erp_customers')
      .select('*', { count: 'exact', head: true });

    const { count: newCustomers } = await supabase
      .from('erp_customers')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth);

    // Get low stock items
    const { count: lowStockItems } = await supabase
      .from('erp_products')
      .select('*', { count: 'exact', head: true })
      .lte('stock', 'min_stock');

    // Get invoice counts
    const { count: totalInvoices } = await supabase
      .from('erp_invoices')
      .select('*', { count: 'exact', head: true });

    const { count: overdueInvoices } = await supabase
      .from('erp_invoices')
      .select('*', { count: 'exact', head: true })
      .in('status', ['sent', 'overdue'])
      .lt('due_date', now.toISOString());

    return {
      totalRevenue,
      monthlyRevenue,
      revenueGrowth,
      totalOrders: totalOrders || 0,
      pendingOrders: pendingOrders || 0,
      totalCustomers: totalCustomers || 0,
      newCustomers: newCustomers || 0,
      lowStockItems: lowStockItems || 0,
      totalInvoices: totalInvoices || 0,
      overdueInvoices: overdueInvoices || 0
    };
  }
}

// Initialize Supabase ERP service
export const supabaseERPService = new SupabaseERPService();

// Helper functions
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${prefix}${timestamp}${random}`.toUpperCase();
}

export function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${year}${month}${day}-${random}`;
}

export function generateInvoiceNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `INV-${year}${month}${day}-${random}`;
}

export function calculateVAT(amount: number, rate: number = 15): number {
  return (amount * rate) / 100;
}

export function calculateTotal(subtotal: number, vatRate: number = 15, discount: number = 0): {
  vat: number;
  total: number;
} {
  const discountedAmount = subtotal - discount;
  const vat = calculateVAT(discountedAmount, vatRate);
  const total = discountedAmount + vat;
  return { vat, total };
}


