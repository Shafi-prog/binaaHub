// @ts-nocheck
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ERPData {
  id: string;
  name: string;
  type: string;
  value: number;
  created_at: string;
  updated_at: string;
}

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
  status: 'active' | 'inactive';
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  cost: number;
  category: string;
  stock: number;
  min_stock: number;
  unit: string;
  description: string;
  supplier?: string;
  barcode?: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  customer_name: string;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  order_date: string;
  delivery_date?: string;
  items: OrderItem[];
  vat_amount: number;
  discount: number;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  vat_rate: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: string;
  customer_name: string;
  total: number;
  vat_amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issue_date: string;
  due_date: string;
  payment_date?: string;
  zatca_qr?: string;
  items: InvoiceItem[];
}

export interface DashboardStats {
  total_revenue: number;
  monthly_revenue: number;
  revenue_growth: number;
  total_orders: number;
  pending_orders: number;
  total_customers: number;
  new_customers: number;
  low_stock_items: number;
  total_invoices: number;
  overdue_invoices: number;
}

export const supabaseERPService = {
  // Dashboard methods
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Mock implementation - replace with actual Supabase queries
      return {
        total_revenue: 125000,
        monthly_revenue: 15000,
        revenue_growth: 12.5,
        total_orders: 342,
        pending_orders: 25,
        total_customers: 128,
        new_customers: 8,
        low_stock_items: 12,
        total_invoices: 156,
        overdue_invoices: 5,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Generic CRUD operations
  async getAll(table: string): Promise<ERPData[]> {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Error fetching ${table}:`, error);
      throw error;
    }
  },

  async getById(table: string, id: string): Promise<ERPData | null> {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching ${table} by id:`, error);
      throw error;
    }
  },

  async create(table: string, data: Partial<ERPData>): Promise<ERPData> {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      console.error(`Error creating ${table}:`, error);
      throw error;
    }
  },

  async update(table: string, id: string, data: Partial<ERPData>): Promise<ERPData> {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      console.error(`Error updating ${table}:`, error);
      throw error;
    }
  },

  async delete(table: string, id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error(`Error deleting ${table}:`, error);
      throw error;
    }
  },

  // Authentication
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  },

  // Specific entity methods
  async getCustomers(): Promise<Customer[]> {
    try {
      // Mock implementation - replace with actual Supabase queries
      return [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          company: 'Tech Corp',
          address: '123 Main St',
          city: 'New York',
          country: 'USA',
          total_orders: 5,
          total_spent: 2500,
          created_at: new Date().toISOString(),
          status: 'active',
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+1234567891',
          company: 'Design Studio',
          address: '456 Oak Ave',
          city: 'Los Angeles',
          country: 'USA',
          total_orders: 3,
          total_spent: 1800,
          created_at: new Date().toISOString(),
          status: 'active',
        },
      ];
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  async getProducts(): Promise<Product[]> {
    try {
      return [
        {
          id: '1',
          name: 'Laptop Pro',
          description: 'High-performance laptop',
          price: 1299,
          cost: 800,
          sku: 'LAP001',
          category: 'Electronics',
          stock: 50,
          min_stock: 10,
          unit: 'pcs',
          supplier: 'Tech Supplier Inc',
          created_at: new Date().toISOString(),
          status: 'active',
        },
        {
          id: '2',
          name: 'Wireless Mouse',
          description: 'Ergonomic wireless mouse',
          price: 29,
          cost: 15,
          sku: 'MOU001',
          category: 'Accessories',
          stock: 200,
          min_stock: 50,
          unit: 'pcs',
          supplier: 'Accessory Co',
          created_at: new Date().toISOString(),
          status: 'active',
        },
      ];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async getOrders(): Promise<Order[]> {
    try {
      return [
        {
          id: '1',
          order_number: 'ORD-001',
          customer_id: '1',
          customer_name: 'John Doe',
          total: 1328,
          status: 'confirmed',
          payment_status: 'paid',
          order_date: new Date().toISOString(),
          vat_amount: 132.8,
          discount: 0,
          items: [
            {
              product_id: '1',
              product_name: 'Laptop Pro',
              quantity: 1,
              price: 1299,
              total: 1299,
            },
            {
              product_id: '2',
              product_name: 'Wireless Mouse',
              quantity: 1,
              price: 29,
              total: 29,
            },
          ],
        },
      ];
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  async getInvoices(): Promise<Invoice[]> {
    try {
      return [
        {
          id: '1',
          invoice_number: 'INV-001',
          customer_id: '1',
          customer_name: 'John Doe',
          total: 1328,
          vat_amount: 132.8,
          status: 'sent',
          issue_date: new Date().toISOString(),
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          items: [
            {
              description: 'Laptop Pro',
              quantity: 1,
              price: 1299,
              vat_rate: 0.15,
              total: 1299,
            },
            {
              description: 'Wireless Mouse',
              quantity: 1,
              price: 29,
              vat_rate: 0.15,
              total: 29,
            },
          ],
        },
      ];
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  },

  async getInventory() {
    return this.getAll('inventory');
  },

  async getSuppliers() {
    return this.getAll('suppliers');
  },

  // Customer-specific methods
  async createCustomer(customerData: Partial<Customer>): Promise<Customer> {
    try {
      const newCustomer: Customer = {
        id: customerData.id || crypto.randomUUID(),
        name: customerData.name || '',
        email: customerData.email || '',
        phone: customerData.phone || '',
        company: customerData.company,
        address: customerData.address || '',
        city: customerData.city || '',
        country: customerData.country || '',
        total_orders: customerData.total_orders || 0,
        total_spent: customerData.total_spent || 0,
        created_at: new Date().toISOString(),
        status: customerData.status || 'active',
      };
      
      // In a real implementation, this would save to Supabase
      // const { data, error } = await supabase.from('customers').insert(newCustomer).select().single();
      // if (error) throw error;
      
      return newCustomer;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  async updateCustomer(id: string, customerData: Partial<Customer>): Promise<Customer> {
    try {
      // Mock implementation - replace with actual Supabase update
      const updatedCustomer: Customer = {
        id,
        name: customerData.name || '',
        email: customerData.email || '',
        phone: customerData.phone || '',
        company: customerData.company,
        address: customerData.address || '',
        city: customerData.city || '',
        country: customerData.country || '',
        total_orders: customerData.total_orders || 0,
        total_spent: customerData.total_spent || 0,
        created_at: customerData.created_at || new Date().toISOString(),
        status: customerData.status || 'active',
      };
      
      return updatedCustomer;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  },

  async deleteCustomer(id: string): Promise<void> {
    try {
      // Mock implementation - replace with actual Supabase delete
      // const { error } = await supabase.from('customers').delete().eq('id', id);
      // if (error) throw error;
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  },

  // Product-specific methods
  async createProduct(productData: Partial<Product>): Promise<Product> {
    try {
      const newProduct: Product = {
        id: productData.id || crypto.randomUUID(),
        name: productData.name || '',
        sku: productData.sku || '',
        price: productData.price || 0,
        cost: productData.cost || 0,
        category: productData.category || '',
        stock: productData.stock || 0,
        min_stock: productData.min_stock || 0,
        unit: productData.unit || 'pcs',
        description: productData.description || '',
        supplier: productData.supplier,
        barcode: productData.barcode,
        status: productData.status || 'active',
        created_at: new Date().toISOString(),
      };
      
      return newProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    try {
      const updatedProduct: Product = {
        id,
        name: productData.name || '',
        sku: productData.sku || '',
        price: productData.price || 0,
        cost: productData.cost || 0,
        category: productData.category || '',
        stock: productData.stock || 0,
        min_stock: productData.min_stock || 0,
        unit: productData.unit || 'pcs',
        description: productData.description || '',
        supplier: productData.supplier,
        barcode: productData.barcode,
        status: productData.status || 'active',
        created_at: productData.created_at || new Date().toISOString(),
      };
      
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  async deleteProduct(id: string): Promise<void> {
    try {
      // Mock implementation
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },
};

export default supabaseERPService;


