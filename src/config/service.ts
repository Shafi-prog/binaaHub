import { SupabaseClient } from '@supabase/supabase-js';

export interface ERPAnalytics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  currency: string;
  period: {
    startDate?: string;
    endDate?: string;
  };
}

export interface ERPFinancialMetrics {
  totalRevenue: number;
  netRevenue: number;
  totalTaxes: number;
  orderCount: number;
  averageOrderValue: number;
}

export interface ERPSalesAnalytics {
  statusDistribution: Record<string, number>;
  customerDistribution: Record<string, number>;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
}

export interface ERPInventoryAnalytics {
  totalItems: number;
  stockItems: number;
  lowStockItems: number;
  totalInventoryValue: number;
  averageItemValue: number;
}

export interface ERPCustomerAnalytics {
  totalCustomers: number;
  activeCustomers: number;
  groupDistribution: Record<string, number>;
  customerGrowthRate: number;
}

export interface ERPDashboardSummary {
  totalItems: number;
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockAlerts: number;
}

export class ERPIntegrationServiceCore {
  private supabase: SupabaseClient;

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
  }

  // Analytics Methods
  async getStoreAnalytics(storeId: string, options?: {
    startDate?: string;
    endDate?: string;
    currency?: string;
  }): Promise<ERPAnalytics> {
    try {
      let salesQuery = this.supabase
        .from('erp_sales_orders')
        .select('*');

      if (options?.startDate) {
        salesQuery = salesQuery.gte('transaction_date', options.startDate);
      }

      if (options?.endDate) {
        salesQuery = salesQuery.lte('transaction_date', options.endDate);
      }

      const { data: salesOrders, error: salesError } = await salesQuery;
      if (salesError) throw salesError;

      const totalRevenue = salesOrders?.reduce((sum: number, order: any) => sum + (order.grand_total || 0), 0) || 0;
      const totalOrders = salesOrders?.length || 0;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      return {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        currency: options?.currency || 'USD',
        period: {
          startDate: options?.startDate,
          endDate: options?.endDate
        }
      };
    } catch (error) {
      console.error('Error getting store analytics:', error);
      throw error;
    }
  }

  async getFinancialMetrics(storeId: string, options?: {
    startDate?: string;
    endDate?: string;
  }): Promise<ERPFinancialMetrics> {
    try {
      let query = this.supabase
        .from('erp_sales_orders')
        .select('grand_total, base_grand_total, total_taxes_and_charges, transaction_date, status');

      if (options?.startDate) {
        query = query.gte('transaction_date', options.startDate);
      }

      if (options?.endDate) {
        query = query.lte('transaction_date', options.endDate);
      }

      const { data: orders, error } = await query;
      if (error) throw error;

      const totalRevenue = orders?.reduce((sum: number, order: any) => sum + (order.grand_total || 0), 0) || 0;
      const totalTaxes = orders?.reduce((sum: number, order: any) => sum + (order.total_taxes_and_charges || 0), 0) || 0;
      const netRevenue = totalRevenue - totalTaxes;

      return {
        totalRevenue,
        netRevenue,
        totalTaxes,
        orderCount: orders?.length || 0,
        averageOrderValue: orders?.length ? totalRevenue / orders.length : 0
      };
    } catch (error) {
      console.error('Error getting financial metrics:', error);
      throw error;
    }
  }

  async getSalesAnalytics(storeId: string, options?: {
    startDate?: string;
    endDate?: string;
  }): Promise<ERPSalesAnalytics> {
    try {
      let query = this.supabase
        .from('erp_sales_orders')
        .select('*');

      if (options?.startDate) {
        query = query.gte('transaction_date', options.startDate);
      }

      if (options?.endDate) {
        query = query.lte('transaction_date', options.endDate);
      }

      const { data: orders, error } = await query;
      if (error) throw error;

      const statusDistribution = orders?.reduce((acc: Record<string, number>, order: any) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {}) || {};

      const customerDistribution = orders?.reduce((acc: Record<string, number>, order: any) => {
        acc[order.customer_name] = (acc[order.customer_name] || 0) + (order.grand_total || 0);
        return acc;
      }, {}) || {};

      return {
        statusDistribution,
        customerDistribution,
        totalOrders: orders?.length || 0,
        completedOrders: orders?.filter((o: any) => o.status === 'Completed').length || 0,
        pendingOrders: orders?.filter((o: any) => o.status === 'Draft' || o.status === 'To Deliver and Bill').length || 0
      };
    } catch (error) {
      console.error('Error getting sales analytics:', error);
      throw error;
    }
  }

  async getInventoryAnalytics(storeId: string): Promise<ERPInventoryAnalytics> {
    try {
      const { data: items, error } = await this.supabase
        .from('erp_items')
        .select('*');

      if (error) throw error;

      const totalItems = items?.length || 0;
      const stockItems = items?.filter((item: any) => item.is_stock_item).length || 0;
      const lowStockItems = items?.filter((item: any) => (item.opening_stock || 0) < (item.safety_stock || 10)).length || 0;
      const totalInventoryValue = items?.reduce((sum: number, item: any) => {
        return sum + ((item.opening_stock || 0) * (item.valuation_rate || 0));
      }, 0) || 0;

      return {
        totalItems,
        stockItems,
        lowStockItems,
        totalInventoryValue,
        averageItemValue: totalItems > 0 ? totalInventoryValue / totalItems : 0
      };
    } catch (error) {
      console.error('Error getting inventory analytics:', error);
      throw error;
    }
  }

  async getCustomerAnalytics(storeId: string, options?: {
    startDate?: string;
    endDate?: string;
  }): Promise<ERPCustomerAnalytics> {
    try {
      const { data: customers, error } = await this.supabase
        .from('erp_customers')
        .select('*');

      if (error) throw error;

      const totalCustomers = customers?.length || 0;
      const activeCustomers = customers?.filter((c: any) => !c.disabled && !c.is_frozen).length || 0;

      const groupDistribution = customers?.reduce((acc: Record<string, number>, customer: any) => {
        acc[customer.customer_group] = (acc[customer.customer_group] || 0) + 1;
        return acc;
      }, {}) || {};

      return {
        totalCustomers,
        activeCustomers,
        groupDistribution,
        customerGrowthRate: 0
      };
    } catch (error) {
      console.error('Error getting customer analytics:', error);
      throw error;
    }
  }

  async getDashboardSummary(storeId: string): Promise<ERPDashboardSummary> {
    try {
      const [items, customers, salesOrders] = await Promise.all([
        this.supabase.from('erp_items').select('*'),
        this.supabase.from('erp_customers').select('*'),
        this.supabase.from('erp_sales_orders').select('*')
      ]);

      const totalRevenue = salesOrders.data?.reduce((sum: number, order: any) => sum + (order.grand_total || 0), 0) || 0;
      const pendingOrders = salesOrders.data?.filter((order: any) => 
        order.status === 'Draft' || order.status === 'To Deliver and Bill'
      ).length || 0;

      return {
        totalItems: items.data?.length || 0,
        totalCustomers: customers.data?.length || 0,
        totalOrders: salesOrders.data?.length || 0,
        totalRevenue,
        pendingOrders,
        lowStockAlerts: items.data?.filter((item: any) => (item.opening_stock || 0) < 10).length || 0
      };
    } catch (error) {
      console.error('Error getting dashboard summary:', error);
      throw error;
    }
  }

  // CRUD Operations
  async getItems(filters?: any): Promise<any[]> {
    try {
      let query = this.supabase
        .from('erp_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.search) {
        query = query.or(`item_name.ilike.%${filters.search}%,item_code.ilike.%${filters.search}%`);
      }

      if (filters?.item_group) {
        query = query.eq('item_group', filters.item_group);
      }

      if (filters?.is_stock_item !== undefined) {
        query = query.eq('is_stock_item', filters.is_stock_item);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
    }
  }

  async getCustomers(filters?: any): Promise<any[]> {
    try {
      let query = this.supabase
        .from('erp_customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.search) {
        query = query.or(`customer_name.ilike.%${filters.search}%,email_id.ilike.%${filters.search}%`);
      }

      if (filters?.customer_group) {
        query = query.eq('customer_group', filters.customer_group);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }

  async getSalesOrders(filters?: any): Promise<any[]> {
    try {
      let query = this.supabase
        .from('erp_sales_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.customer) {
        query = query.eq('customer', filters.customer);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.from_date) {
        query = query.gte('transaction_date', filters.from_date);
      }

      if (filters?.to_date) {
        query = query.lte('transaction_date', filters.to_date);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching sales orders:', error);
      throw error;
    }
  }

  async createItem(itemData: any): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('erp_items')
        .insert([{
          ...itemData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  }

  async updateItem(id: string, updates: any): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('erp_items')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  }

  async deleteItem(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('erp_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }

  async createCustomer(customerData: any): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('erp_customers')
        .insert([{
          ...customerData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  async updateCustomer(id: string, updates: any): Promise<any> {
    try {
      const { data, error } = await this.supabase
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
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  }

  async deleteCustomer(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('erp_customers')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  }

  async createSalesOrder(orderData: any): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('erp_sales_orders')
        .insert([{
          ...orderData,
          name: `SO-${Date.now()}`,
          status: 'Draft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating sales order:', error);
      throw error;
    }
  }

  async updateSalesOrder(id: string, updates: any): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('erp_sales_orders')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating sales order:', error);
      throw error;
    }
  }

  async deleteSalesOrder(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('erp_sales_orders')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting sales order:', error);
      throw error;
    }
  }
  // Sales Order Workflow Methods with comprehensive stock validation
  async validateStockAvailability(items: any[]): Promise<{ valid: boolean; errors: string[] }> {
    try {
      const errors: string[] = [];
      
      for (const item of items) {
        const available = await this.checkStockAvailability(
          item.item_code, 
          item.warehouse || 'Main Warehouse', 
          item.qty
        );
        
        if (!available) {
          const balance = await this.getStockBalance(item.item_code, item.warehouse || 'Main Warehouse');
          errors.push(`Insufficient stock for ${item.item_code}. Available: ${balance}, Required: ${item.qty}`);
        }
      }

      return {
        valid: errors.length === 0,
        errors
      };
    } catch (error) {
      console.error('Error validating stock availability:', error);
      return {
        valid: false,
        errors: ['Failed to validate stock availability']
      };
    }
  }

  async submitSalesOrder(id: string): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('erp_sales_orders')
        .update({
          status: 'To Deliver and Bill',
          docstatus: 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error submitting sales order:', error);
      throw error;
    }
  }

  async cancelSalesOrder(id: string): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('erp_sales_orders')
        .update({
          status: 'Cancelled',
          docstatus: 2,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error cancelling sales order:', error);
      throw error;
    }
  }

  async deliverSalesOrder(id: string, deliveryDetails: any): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('erp_sales_orders')
        .update({
          status: 'Delivered',
          delivery_status: 'Fully Delivered',
          per_delivered: 100,
          delivery_date: deliveryDetails.delivery_date || new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error delivering sales order:', error);
      throw error;
    }  }

  async checkStockAvailability(itemCode: string, warehouse: string, requiredQty: number): Promise<boolean> {
    try {
      // Check actual stock balance for the item in the warehouse
      const { data: stockData, error } = await this.supabase
        .from('erp_stock_ledger')
        .select('qty_after_transaction')
        .eq('item_code', itemCode)
        .eq('warehouse', warehouse)
        .order('posting_date', { ascending: false })
        .order('posting_time', { ascending: false })
        .limit(1);

      if (error) throw error;

      const actualQty = stockData?.[0]?.qty_after_transaction || 0;

      // Check reserved quantities
      const { data: reservedData, error: reservedError } = await this.supabase
        .from('erp_stock_reservation')
        .select('reserved_qty')
        .eq('item_code', itemCode)
        .eq('warehouse', warehouse)
        .eq('status', 'Active');

      if (reservedError) throw reservedError;

      const reservedQty = reservedData?.reduce((sum, item) => sum + (item.reserved_qty || 0), 0) || 0;
      const availableQty = actualQty - reservedQty;

      return availableQty >= requiredQty;
    } catch (error) {
      console.error('Error checking stock availability:', error);
      return false;
    }
  }

  async getStockBalance(itemCode: string, warehouse: string): Promise<number> {
    try {
      const { data, error } = await this.supabase
        .from('erp_stock_ledger')
        .select('qty_after_transaction')
        .eq('item_code', itemCode)
        .eq('warehouse', warehouse)
        .order('posting_date', { ascending: false })
        .order('posting_time', { ascending: false })
        .limit(1);

      if (error) throw error;
      return data?.[0]?.qty_after_transaction || 0;
    } catch (error) {
      console.error('Error getting stock balance:', error);
      return 0;
    }
  }

  // Report Generation Methods
  async generateSalesReport(options: {
    startDate?: string;
    endDate?: string;
    format?: 'json' | 'csv' | 'pdf';
    groupBy?: 'daily' | 'weekly' | 'monthly';
  } = {}): Promise<any> {
    try {
      let query = this.supabase
        .from('erp_sales_orders')
        .select(`
          *,
          erp_sales_order_items(*)
        `);

      if (options.startDate) {
        query = query.gte('transaction_date', options.startDate);
      }

      if (options.endDate) {
        query = query.lte('transaction_date', options.endDate);
      }

      const { data: orders, error } = await query.order('transaction_date', { ascending: false });
      if (error) throw error;

      const report = {
        reportTitle: 'Sales Report',
        generatedAt: new Date().toISOString(),
        dateRange: {
          from: options.startDate,
          to: options.endDate
        },
        summary: {
          totalOrders: orders?.length || 0,
          totalRevenue: orders?.reduce((sum: number, order: any) => sum + (order.grand_total || 0), 0) || 0,
          averageOrderValue: orders?.length ? (orders.reduce((sum: number, order: any) => sum + (order.grand_total || 0), 0) / orders.length) : 0
        },
        orders: orders || [],
        format: options.format || 'json'
      };

      if (options.format === 'csv') {
        return this.formatReportAsCSV(report);
      }

      return report;
    } catch (error) {
      console.error('Error generating sales report:', error);
      throw error;
    }
  }

  async generateInventoryReport(options: {
    includeValuation?: boolean;
    lowStockOnly?: boolean;
    format?: 'json' | 'csv' | 'pdf';
  } = {}): Promise<any> {
    try {
      let query = this.supabase
        .from('erp_items')
        .select('*');

      if (options.lowStockOnly) {
        query = query.lt('opening_stock', 10);
      }

      const { data: items, error } = await query.order('item_name');
      if (error) throw error;

      const report = {
        reportTitle: 'Inventory Report',
        generatedAt: new Date().toISOString(),
        summary: {
          totalItems: items?.length || 0,
          totalValue: options.includeValuation ? 
            items?.reduce((sum: number, item: any) => sum + ((item.opening_stock || 0) * (item.valuation_rate || 0)), 0) || 0 : 0,
          lowStockItems: items?.filter((item: any) => (item.opening_stock || 0) < (item.safety_stock || 10)).length || 0
        },
        items: items || [],
        format: options.format || 'json'
      };

      if (options.format === 'csv') {
        return this.formatReportAsCSV(report);
      }

      return report;
    } catch (error) {
      console.error('Error generating inventory report:', error);
      throw error;
    }
  }

  async generateCustomerReport(options: {
    includeTransactions?: boolean;
    activeOnly?: boolean;
    format?: 'json' | 'csv' | 'pdf';
  } = {}): Promise<any> {
    try {
      let query = this.supabase
        .from('erp_customers')
        .select('*');

      if (options.activeOnly) {
        query = query.eq('disabled', false).eq('is_frozen', false);
      }

      const { data: customers, error } = await query.order('customer_name');
      if (error) throw error;

      const report = {
        reportTitle: 'Customer Report',
        generatedAt: new Date().toISOString(),
        summary: {
          totalCustomers: customers?.length || 0,
          activeCustomers: customers?.filter((c: any) => !c.disabled && !c.is_frozen).length || 0,
          inactiveCustomers: customers?.filter((c: any) => c.disabled || c.is_frozen).length || 0
        },
        customers: customers || [],
        format: options.format || 'json'
      };

      if (options.format === 'csv') {
        return this.formatReportAsCSV(report);
      }

      return report;
    } catch (error) {
      console.error('Error generating customer report:', error);
      throw error;
    }
  }

  async generateProfitabilityReport(options: {
    startDate?: string;
    endDate?: string;
    groupBy?: 'item' | 'customer' | 'territory';
    format?: 'json' | 'csv' | 'pdf';
  } = {}): Promise<any> {
    try {
      let query = this.supabase
        .from('erp_sales_orders')
        .select(`
          *,
          erp_sales_order_items(*)
        `);

      if (options.startDate) {
        query = query.gte('transaction_date', options.startDate);
      }

      if (options.endDate) {
        query = query.lte('transaction_date', options.endDate);
      }

      const { data: orders, error } = await query;
      if (error) throw error;

      const totalRevenue = orders?.reduce((sum: number, order: any) => sum + (order.grand_total || 0), 0) || 0;
      const totalTaxes = orders?.reduce((sum: number, order: any) => sum + (order.total_taxes_and_charges || 0), 0) || 0;
      const estimatedCosts = totalRevenue * 0.7; // Assuming 30% margin
      const grossProfit = totalRevenue - estimatedCosts;
      const netProfit = grossProfit - totalTaxes;

      const report = {
        reportTitle: 'Profitability Report',
        generatedAt: new Date().toISOString(),
        dateRange: {
          from: options.startDate,
          to: options.endDate
        },
        summary: {
          totalRevenue,
          totalCosts: estimatedCosts,
          grossProfit,
          netProfit,
          grossMargin: totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0,
          netMargin: totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0
        },
        orders: orders || [],
        format: options.format || 'json'
      };

      if (options.format === 'csv') {
        return this.formatReportAsCSV(report);
      }

      return report;
    } catch (error) {
      console.error('Error generating profitability report:', error);
      throw error;
    }
  }

  async generatePerformanceReport(options: {
    startDate?: string;
    endDate?: string;
    format?: 'json' | 'csv' | 'pdf';
  } = {}): Promise<any> {
    try {
      const [salesData, inventoryData, customerData] = await Promise.all([
        this.getSalesAnalytics('', options),
        this.getInventoryAnalytics(''),
        this.getCustomerAnalytics('', options)
      ]);

      const report = {
        reportTitle: 'Performance Report',
        generatedAt: new Date().toISOString(),
        dateRange: {
          from: options.startDate,
          to: options.endDate
        },
        kpis: {
          salesPerformance: {
            totalOrders: salesData.totalOrders,
            completedOrders: salesData.completedOrders,
            completionRate: salesData.totalOrders > 0 ? (salesData.completedOrders / salesData.totalOrders) * 100 : 0
          },
          inventoryPerformance: {
            totalItems: inventoryData.totalItems,
            stockItems: inventoryData.stockItems,
            lowStockItems: inventoryData.lowStockItems,
            stockEfficiency: inventoryData.totalItems > 0 ? ((inventoryData.totalItems - inventoryData.lowStockItems) / inventoryData.totalItems) * 100 : 0
          },
          customerPerformance: {
            totalCustomers: customerData.totalCustomers,
            activeCustomers: customerData.activeCustomers,
            retentionRate: customerData.totalCustomers > 0 ? (customerData.activeCustomers / customerData.totalCustomers) * 100 : 0
          }
        },
        format: options.format || 'json'
      };

      if (options.format === 'csv') {
        return this.formatReportAsCSV(report);
      }

      return report;
    } catch (error) {
      console.error('Error generating performance report:', error);
      throw error;
    }
  }

  async generateTaxReport(options: {
    startDate?: string;
    endDate?: string;
    taxType?: 'VAT' | 'all';
    format?: 'json' | 'csv' | 'pdf';
  } = {}): Promise<any> {
    try {
      let query = this.supabase
        .from('erp_sales_orders')
        .select('*');

      if (options.startDate) {
        query = query.gte('transaction_date', options.startDate);
      }

      if (options.endDate) {
        query = query.lte('transaction_date', options.endDate);
      }

      const { data: orders, error } = await query;
      if (error) throw error;

      const totalTaxableAmount = orders?.reduce((sum: number, order: any) => sum + (order.base_net_total || 0), 0) || 0;
      const totalTaxAmount = orders?.reduce((sum: number, order: any) => sum + (order.total_taxes_and_charges || 0), 0) || 0;
      const effectiveTaxRate = totalTaxableAmount > 0 ? (totalTaxAmount / totalTaxableAmount) * 100 : 0;

      const report = {
        reportTitle: 'Tax Report',
        generatedAt: new Date().toISOString(),
        dateRange: {
          from: options.startDate,
          to: options.endDate
        },
        summary: {
          totalTaxableAmount,
          totalTaxAmount,
          effectiveTaxRate,
          numberOfTransactions: orders?.length || 0
        },
        transactions: orders || [],
        format: options.format || 'json'
      };

      if (options.format === 'csv') {
        return this.formatReportAsCSV(report);
      }

      return report;
    } catch (error) {
      console.error('Error generating tax report:', error);
      throw error;
    }
  }

  // Helper method to format reports as CSV
  private formatReportAsCSV(report: any): string {
    const csvRows: string[] = [];
    
    // Add header
    csvRows.push(`Report: ${report.reportTitle}`);
    csvRows.push(`Generated: ${report.generatedAt}`);
    csvRows.push('');

    // Add summary
    if (report.summary) {
      csvRows.push('Summary:');
      Object.entries(report.summary).forEach(([key, value]) => {
        csvRows.push(`${key},${value}`);
      });
      csvRows.push('');
    }

    // Add data based on report type
    if (report.orders && report.orders.length > 0) {
      csvRows.push('Order ID,Date,Customer,Amount,Status');
      report.orders.forEach((order: any) => {
        csvRows.push(`${order.id},${order.transaction_date},${order.customer_name},${order.grand_total},${order.status}`);
      });
    }

    if (report.items && report.items.length > 0) {
      csvRows.push('Item Code,Item Name,Stock,Valuation Rate,Stock Value');
      report.items.forEach((item: any) => {
        csvRows.push(`${item.item_code},${item.item_name},${item.opening_stock},${item.valuation_rate},${(item.opening_stock || 0) * (item.valuation_rate || 0)}`);
      });
    }

    if (report.customers && report.customers.length > 0) {
      csvRows.push('Customer Name,Customer Group,Territory,Status');
      report.customers.forEach((customer: any) => {
        csvRows.push(`${customer.customer_name},${customer.customer_group},${customer.territory},${customer.disabled ? 'Inactive' : 'Active'}`);
      });
    }

    return csvRows.join('\n');
  }

  // Advanced ERP Features
  async getItemDetails(itemCode: string): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('erp_items')
        .select('*')
        .eq('item_code', itemCode)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting item details:', error);
      throw error;
    }
  }

  async getItemPrice(itemCode: string, priceList?: string, currency?: string): Promise<number> {
    try {
      // For now, return the standard rate from the item
      const { data, error } = await this.supabase
        .from('erp_items')
        .select('standard_rate, valuation_rate')
        .eq('item_code', itemCode)
        .single();

      if (error) throw error;
      return data?.standard_rate || data?.valuation_rate || 0;
    } catch (error) {
      console.error('Error getting item price:', error);
      return 0;
    }  }

  async checkCreditLimit(customer: string, additionalAmount: number): Promise<{ allowed: boolean; availableCredit: number }> {
    try {
      const { data: customerData, error } = await this.supabase
        .from('erp_customers')
        .select('customer_credit_limit, bypass_credit_limit_check')
        .eq('name', customer)
        .single();

      if (error) throw error;

      if (customerData?.bypass_credit_limit_check) {
        return { allowed: true, availableCredit: Infinity };
      }

      const creditLimit = customerData?.customer_credit_limit || 0;
      
      // Get outstanding amount (simplified - would need proper calculation)
      const { data: outstandingOrders } = await this.supabase
        .from('erp_sales_orders')
        .select('grand_total')
        .eq('customer', customer)
        .in('status', ['Draft', 'To Deliver and Bill']);

      const outstandingAmount = outstandingOrders?.reduce((sum: number, order: any) => sum + (order.grand_total || 0), 0) || 0;
      const availableCredit = creditLimit - outstandingAmount;

      return {
        allowed: availableCredit >= additionalAmount,
        availableCredit: Math.max(0, availableCredit)
      };
    } catch (error) {
      console.error('Error checking credit limit:', error);
      return { allowed: false, availableCredit: 0 };
    }
  }

  async calculateTaxes(items: any[], taxTemplate: string): Promise<any[]> {
    try {
      // Simplified tax calculation - 15% VAT
      const vatRate = 0.15;
      const taxes = [];

      let totalTaxableAmount = 0;
      items.forEach(item => {
        totalTaxableAmount += (item.amount || 0);
      });

      if (totalTaxableAmount > 0) {
        taxes.push({
          charge_type: 'On Net Total',
          account_head: 'VAT 15%',
          rate: vatRate * 100,
          tax_amount: totalTaxableAmount * vatRate,
          total: totalTaxableAmount * vatRate
        });
      }

      return taxes;
    } catch (error) {
      console.error('Error calculating taxes:', error);
      return [];
    }
  }

  async processOrderWorkflow(orderId: string, action: string): Promise<any> {
    try {
      switch (action) {
        case 'Submit':
          return await this.submitSalesOrder(orderId);
        case 'Cancel':
          return await this.cancelSalesOrder(orderId);
        case 'Deliver':
          return await this.deliverSalesOrder(orderId, { delivery_date: new Date().toISOString() });
        default:
          throw new Error(`Unknown workflow action: ${action}`);
      }
    } catch (error) {
      console.error('Error processing order workflow:', error);
      throw error;
    }
  }
}

export default ERPIntegrationServiceCore;
