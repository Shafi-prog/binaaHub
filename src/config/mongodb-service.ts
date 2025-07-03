import { MongoClient, Db, Collection } from 'mongodb';

// MongoDB connection
let client: MongoClient;
let db: Db;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DATABASE_NAME = process.env.DATABASE_NAME || 'binna_erp';

export async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DATABASE_NAME);
  }
  return { client, db };
}

// Collection interfaces
export interface Customer {
  _id?: string;
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
  created_at: Date;
  updated_at: Date;
  status: 'active' | 'inactive';
  vat_number?: string;
  contact_person?: string;
  payment_terms?: string;
  credit_limit?: number;
  notes?: string;
}

export interface Product {
  _id?: string;
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
  created_at: Date;
  updated_at: Date;
  images?: string[];
  specifications?: Record<string, any>;
  is_service?: boolean;
  warranty_period?: number;
  expiry_date?: Date;
  location?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export interface Order {
  _id?: string;
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
  order_date: Date;
  delivery_date?: Date;
  delivery_address?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
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
  _id?: string;
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
  issue_date: Date;
  due_date: Date;
  payment_date?: Date;
  payment_method?: string;
  created_at: Date;
  updated_at: Date;
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

export interface Supplier {
  _id?: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  vat_number?: string;
  contact_person: string;
  payment_terms: string;
  created_at: Date;
  updated_at: Date;
  status: 'active' | 'inactive';
  notes?: string;
}

export interface StockMovement {
  _id?: string;
  id: string;
  product_id: string;
  product_name: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reference_type: 'purchase' | 'sale' | 'adjustment' | 'transfer';
  reference_id?: string;
  notes?: string;
  created_at: Date;
  created_by: string;
}

// ERP Service Class
export class ERPService {
  private db: Db;

  constructor(database: Db) {
    this.db = database;
  }

  // Customer methods
  async getCustomers(filter: any = {}, limit: number = 100, skip: number = 0): Promise<Customer[]> {
    const collection = this.db.collection<Customer>('customers');
    return await collection.find(filter).limit(limit).skip(skip).toArray();
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    const collection = this.db.collection<Customer>('customers');
    return await collection.findOne({ id });
  }

  async createCustomer(customer: Omit<Customer, '_id' | 'created_at' | 'updated_at'>): Promise<Customer> {
    const collection = this.db.collection<Customer>('customers');
    const now = new Date();
    const newCustomer = {
      ...customer,
      created_at: now,
      updated_at: now
    };
    const result = await collection.insertOne(newCustomer);
    return { ...newCustomer, _id: result.insertedId.toString() };
  }

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<boolean> {
    const collection = this.db.collection<Customer>('customers');
    const result = await collection.updateOne(
      { id },
      { $set: { ...updates, updated_at: new Date() } }
    );
    return result.modifiedCount > 0;
  }

  async deleteCustomer(id: string): Promise<boolean> {
    const collection = this.db.collection<Customer>('customers');
    const result = await collection.deleteOne({ id });
    return result.deletedCount > 0;
  }

  // Product methods
  async getProducts(filter: any = {}, limit: number = 100, skip: number = 0): Promise<Product[]> {
    const collection = this.db.collection<Product>('products');
    return await collection.find(filter).limit(limit).skip(skip).toArray();
  }

  async getProductById(id: string): Promise<Product | null> {
    const collection = this.db.collection<Product>('products');
    return await collection.findOne({ id });
  }

  async createProduct(product: Omit<Product, '_id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const collection = this.db.collection<Product>('products');
    const now = new Date();
    const newProduct = {
      ...product,
      created_at: now,
      updated_at: now
    };
    const result = await collection.insertOne(newProduct);
    return { ...newProduct, _id: result.insertedId.toString() };
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<boolean> {
    const collection = this.db.collection<Product>('products');
    const result = await collection.updateOne(
      { id },
      { $set: { ...updates, updated_at: new Date() } }
    );
    return result.modifiedCount > 0;
  }

  async updateProductStock(id: string, quantity: number, type: 'add' | 'subtract' = 'subtract'): Promise<boolean> {
    const collection = this.db.collection<Product>('products');
    const increment = type === 'add' ? quantity : -quantity;
    const result = await collection.updateOne(
      { id },
      { 
        $inc: { stock: increment },
        $set: { updated_at: new Date() }
      }
    );
    return result.modifiedCount > 0;
  }

  async getLowStockProducts(threshold?: number): Promise<Product[]> {
    const collection = this.db.collection<Product>('products');
    return await collection.find({
      $expr: { $lte: ['$stock', '$min_stock'] }
    }).toArray();
  }

  // Order methods
  async getOrders(filter: any = {}, limit: number = 100, skip: number = 0): Promise<Order[]> {
    const collection = this.db.collection<Order>('orders');
    return await collection.find(filter).sort({ created_at: -1 }).limit(limit).skip(skip).toArray();
  }

  async getOrderById(id: string): Promise<Order | null> {
    const collection = this.db.collection<Order>('orders');
    return await collection.findOne({ id });
  }

  async createOrder(order: Omit<Order, '_id' | 'created_at' | 'updated_at'>): Promise<Order> {
    const collection = this.db.collection<Order>('orders');
    const now = new Date();
    const newOrder = {
      ...order,
      created_at: now,
      updated_at: now
    };
    
    // Update product stock
    for (const item of order.items) {
      await this.updateProductStock(item.product_id, item.quantity, 'subtract');
      
      // Record stock movement
      await this.recordStockMovement({
        id: `${order.id}-${item.product_id}`,
        product_id: item.product_id,
        product_name: item.product_name,
        type: 'out',
        quantity: item.quantity,
        reference_type: 'sale',
        reference_id: order.id,
        created_at: now,
        created_by: 'system'
      });
    }
    
    const result = await collection.insertOne(newOrder);
    return { ...newOrder, _id: result.insertedId.toString() };
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<boolean> {
    const collection = this.db.collection<Order>('orders');
    const result = await collection.updateOne(
      { id },
      { $set: { ...updates, updated_at: new Date() } }
    );
    return result.modifiedCount > 0;
  }

  // Invoice methods
  async getInvoices(filter: any = {}, limit: number = 100, skip: number = 0): Promise<Invoice[]> {
    const collection = this.db.collection<Invoice>('invoices');
    return await collection.find(filter).sort({ created_at: -1 }).limit(limit).skip(skip).toArray();
  }

  async getInvoiceById(id: string): Promise<Invoice | null> {
    const collection = this.db.collection<Invoice>('invoices');
    return await collection.findOne({ id });
  }

  async createInvoice(invoice: Omit<Invoice, '_id' | 'created_at' | 'updated_at'>): Promise<Invoice> {
    const collection = this.db.collection<Invoice>('invoices');
    const now = new Date();
    const newInvoice = {
      ...invoice,
      created_at: now,
      updated_at: now
    };
    const result = await collection.insertOne(newInvoice);
    return { ...newInvoice, _id: result.insertedId.toString() };
  }

  async updateInvoice(id: string, updates: Partial<Invoice>): Promise<boolean> {
    const collection = this.db.collection<Invoice>('invoices');
    const result = await collection.updateOne(
      { id },
      { $set: { ...updates, updated_at: new Date() } }
    );
    return result.modifiedCount > 0;
  }

  async getOverdueInvoices(): Promise<Invoice[]> {
    const collection = this.db.collection<Invoice>('invoices');
    const now = new Date();
    return await collection.find({
      status: { $in: ['sent', 'overdue'] },
      due_date: { $lt: now }
    }).toArray();
  }

  // Stock movement methods
  async recordStockMovement(movement: Omit<StockMovement, '_id'>): Promise<StockMovement> {
    const collection = this.db.collection<StockMovement>('stock_movements');
    const result = await collection.insertOne(movement);
    return { ...movement, _id: result.insertedId.toString() };
  }

  async getStockMovements(productId?: string, limit: number = 100): Promise<StockMovement[]> {
    const collection = this.db.collection<StockMovement>('stock_movements');
    const filter = productId ? { product_id: productId } : {};
    return await collection.find(filter).sort({ created_at: -1 }).limit(limit).toArray();
  }

  // Analytics methods
  async getDashboardStats(): Promise<any> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get total revenue
    const totalRevenueResult = await this.db.collection('invoices').aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]).toArray();
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    // Get monthly revenue
    const monthlyRevenueResult = await this.db.collection('invoices').aggregate([
      { $match: { status: 'paid', payment_date: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]).toArray();
    const monthlyRevenue = monthlyRevenueResult[0]?.total || 0;

    // Get last month revenue for growth calculation
    const lastMonthRevenueResult = await this.db.collection('invoices').aggregate([
      { 
        $match: { 
          status: 'paid', 
          payment_date: { $gte: startOfLastMonth, $lte: endOfLastMonth } 
        } 
      },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]).toArray();
    const lastMonthRevenue = lastMonthRevenueResult[0]?.total || 0;

    const revenueGrowth = lastMonthRevenue > 0 
      ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0;

    // Get order counts
    const totalOrders = await this.db.collection('orders').countDocuments();
    const pendingOrders = await this.db.collection('orders').countDocuments({ status: 'pending' });

    // Get customer counts
    const totalCustomers = await this.db.collection('customers').countDocuments();
    const newCustomers = await this.db.collection('customers').countDocuments({
      created_at: { $gte: startOfMonth }
    });

    // Get low stock items
    const lowStockItems = await this.db.collection('products').countDocuments({
      $expr: { $lte: ['$stock', '$min_stock'] }
    });

    // Get invoice counts
    const totalInvoices = await this.db.collection('invoices').countDocuments();
    const overdueInvoices = await this.db.collection('invoices').countDocuments({
      status: { $in: ['sent', 'overdue'] },
      due_date: { $lt: now }
    });

    return {
      totalRevenue,
      monthlyRevenue,
      revenueGrowth,
      totalOrders,
      pendingOrders,
      totalCustomers,
      newCustomers,
      lowStockItems,
      totalInvoices,
      overdueInvoices
    };
  }

  async getRevenueByMonth(months: number = 12): Promise<any[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    return await this.db.collection('invoices').aggregate([
      {
        $match: {
          status: 'paid',
          payment_date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$payment_date' },
            month: { $month: '$payment_date' }
          },
          revenue: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]).toArray();
  }

  async getTopProducts(limit: number = 10): Promise<any[]> {
    return await this.db.collection('orders').aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product_id',
          product_name: { $first: '$items.product_name' },
          total_quantity: { $sum: '$items.quantity' },
          total_revenue: { $sum: '$items.total' }
        }
      },
      { $sort: { total_revenue: -1 } },
      { $limit: limit }
    ]).toArray();
  }

  async getTopCustomers(limit: number = 10): Promise<any[]> {
    return await this.db.collection('orders').aggregate([
      {
        $group: {
          _id: '$customer_id',
          customer_name: { $first: '$customer_name' },
          total_orders: { $sum: 1 },
          total_spent: { $sum: '$total' }
        }
      },
      { $sort: { total_spent: -1 } },
      { $limit: limit }
    ]).toArray();
  }
}

// Initialize ERP service
export async function initERPService(): Promise<ERPService> {
  const { db } = await connectToDatabase();
  return new ERPService(db);
}

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
