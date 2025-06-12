// ERPNext-inspired features for Stores Platform
// Advanced business logic and workflows

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// ERPNext-inspired Item Management
export interface ERPItem {
  id: string;
  item_code: string;
  item_name: string;
  item_group: string;
  stock_uom: string;
  has_variants: boolean;
  is_stock_item: boolean;
  is_purchase_item: boolean;
  is_sales_item: boolean;
  standard_rate: number;
  valuation_rate: number;
  min_order_qty: number;
  safety_stock: number;
  lead_time_days: number;
  warranty_period: number;
  has_batch_no: boolean;
  has_serial_no: boolean;
  shelf_life_in_days?: number;
  end_of_life?: string;
  brand?: string;
  manufacturer?: string;
  country_of_origin?: string;
  customs_tariff_number?: string;
  item_defaults: ERPItemDefault[];
  supplier_items: ERPSupplierItem[];
  reorder_levels: ERPReorderLevel[];
  created_at: string;
  updated_at: string;
}

export interface ERPItemDefault {
  id: string;
  item_id: string;
  company: string;
  default_warehouse: string;
  default_price_list: string;
  default_supplier: string;
  expense_account: string;
  income_account: string;
  buying_cost_center: string;
  selling_cost_center: string;
}

export interface ERPSupplierItem {
  id: string;
  item_id: string;
  supplier_id: string;
  supplier_part_no: string;
  min_order_qty: number;
  lead_time_days: number;
  is_default: boolean;
}

export interface ERPReorderLevel {
  id: string;
  item_id: string;
  warehouse: string;
  warehouse_reorder_level: number;
  warehouse_reorder_qty: number;
  material_request_type: 'Purchase' | 'Material Transfer' | 'Material Issue';
}

// ERPNext-inspired Sales Order with Advanced Features
export interface ERPSalesOrder {
  id: string;
  naming_series: string;
  customer: string;
  customer_name: string;
  project: string;
  order_type: 'Sales' | 'Maintenance' | 'Shopping Cart';
  transaction_date: string;
  delivery_date: string;
  currency: string;
  conversion_rate: number;
  selling_price_list: string;
  price_list_currency: string;
  plc_conversion_rate: number;
  ignore_pricing_rule: boolean;
  apply_discount_on: 'Grand Total' | 'Net Total';
  base_discount_amount: number;
  discount_amount: number;
  base_grand_total: number;
  grand_total: number;
  base_net_total: number;
  net_total: number;
  base_total_taxes_and_charges: number;
  total_taxes_and_charges: number;
  base_rounding_adjustment: number;
  rounding_adjustment: number;
  in_words: string;
  base_in_words: string;
  status: 'Draft' | 'To Deliver and Bill' | 'To Bill' | 'To Deliver' | 'Completed' | 'Cancelled' | 'Closed';
  per_delivered: number;
  per_billed: number;
  billing_status: 'Not Billed' | 'Partly Billed' | 'Fully Billed';
  delivery_status: 'Not Delivered' | 'Partly Delivered' | 'Fully Delivered';
  items: ERPSalesOrderItem[];
  taxes: ERPSalesTaxesAndCharges[];
  payment_schedule: ERPPaymentSchedule[];
  sales_team: ERPSalesTeam[];
  created_at: string;
  updated_at: string;
}

export interface ERPSalesOrderItem {
  id: string;
  item_code: string;
  item_name: string;
  description: string;
  item_group: string;
  brand: string;
  image: string;
  qty: number;
  stock_uom: string;
  uom: string;
  conversion_factor: number;
  stock_qty: number;
  price_list_rate: number;
  base_price_list_rate: number;
  margin_type: 'Percentage' | 'Amount';
  margin_rate_or_amount: number;
  rate_with_margin: number;
  discount_percentage: number;
  discount_amount: number;
  base_rate_with_margin: number;
  rate: number;
  base_rate: number;
  amount: number;
  base_amount: number;
  pricing_rules: string;
  stock_reserved_qty: number;
  delivered_qty: number;
  returned_qty: number;
  billed_qty: number;
  planned_qty: number;
  work_order_qty: number;
  delivery_date: string;
  warehouse: string;
  against_blanket_order: boolean;
  blanket_order: string;
  blanket_order_rate: number;
  bom_no: string;
  projected_qty: number;
  actual_qty: number;
  ordered_qty: number;
  reserved_qty: number;
  page_break: boolean;
}

export interface ERPSalesTaxesAndCharges {
  id: string;
  charge_type: 'On Net Total' | 'On Previous Row Amount' | 'On Previous Row Total' | 'Actual';
  account_head: string;
  description: string;
  included_in_print_rate: boolean;
  cost_center: string;
  rate: number;
  account_currency: string;
  tax_amount: number;
  base_tax_amount: number;
  tax_amount_after_discount_amount: number;
  base_tax_amount_after_discount_amount: number;
  total: number;
  base_total: number;
  item_wise_tax_detail: string; // JSON string
}

export interface ERPPaymentSchedule {
  id: string;
  due_date: string;
  invoice_portion: number;
  discount_type: 'Percentage' | 'Amount';
  discount_date: string;
  discount: number;
  payment_amount: number;
  base_payment_amount: number;
  outstanding: number;
  paid_amount: number;
  discounted_amount: number;
}

export interface ERPSalesTeam {
  id: string;
  sales_person: string;
  allocated_percentage: number;
  allocated_amount: number;
  incentives: number;
}

// ERPNext-inspired Stock Management
export interface ERPStockEntry {
  id: string;
  naming_series: string;
  stock_entry_type: 'Material Issue' | 'Material Receipt' | 'Material Transfer' | 'Manufacture' | 'Repack' | 'Send to Subcontractor';
  work_order: string;
  bom_no: string;
  use_multi_level_bom: boolean;
  fg_completed_qty: number;
  from_bom: boolean;
  posting_date: string;
  posting_time: string;
  set_posting_time: boolean;
  inspection_required: boolean;
  apply_putaway_rule: boolean;
  from_warehouse: string;
  to_warehouse: string;
  scan_barcode: string;
  total_outgoing_value: number;
  total_incoming_value: number;
  value_difference: number;
  total_additional_costs: number;
  supplier: string;
  supplier_name: string;
  supplier_address: string;
  address_display: string;
  project: string;
  select_print_heading: string;
  letter_head: string;
  is_opening: 'No' | 'Yes';
  remarks: string;
  per_transferred: number;
  total_amount: number;
  job_card: string;
  amended_from: string;
  credit_note: string;
  is_return: boolean;
  return_against: string;
  items: ERPStockEntryDetail[];
  additional_costs: ERPLandedCostTaxesAndCharges[];
  created_at: string;
  updated_at: string;
}

export interface ERPStockEntryDetail {
  id: string;
  barcode: string;
  has_item_scanned: boolean;
  item_code: string;
  item_name: string;
  description: string;
  item_group: string;
  image: string;
  qty: number;
  transfer_qty: number;
  retain_sample: boolean;
  sample_quantity: number;
  uom: string;
  stock_uom: string;
  conversion_factor: number;
  s_warehouse: string;
  t_warehouse: string;
  finished_item: string;
  is_finished_item: boolean;
  is_scrap_item: boolean;
  original_item: string;
  expense_account: string;
  cost_center: string;
  project: string;
  actual_qty: number;
  basic_rate: number;
  basic_amount: number;
  additional_cost: number;
  valuation_rate: number;
  amount: number;
  gl_account: string;
  is_process_loss: boolean;
  job_card_item: string;
  material_request: string;
  material_request_item: string;
  batch_no: string;
  serial_no: string;
  inventory_type: string;
  use_serial_batch_fields: boolean;
  serial_and_batch_bundle: string;
  allow_zero_valuation_rate: boolean;
  set_basic_rate_manually: boolean;
  allow_alternative_item: boolean;
  subcontracted_item: string;
  bom_no: string;
  against_stock_entry: string;
  ste_detail: string;
  po_detail: string;
  original_item_qty: number;
  picked_qty: number;
}

export interface ERPLandedCostTaxesAndCharges {
  id: string;
  expense_account: string;
  description: string;
  amount: number;
  base_amount: number;
}

// ERPNext-inspired Customer Management
export interface ERPCustomer {
  id: string;
  naming_series: string;
  customer_name: string;
  customer_type: 'Company' | 'Individual';
  customer_group: string;
  territory: string;
  gender: string;
  lead_name: string;
  opportunity_name: string;
  prospect_name: string;
  account_manager: string;
  image: string;
  default_currency: string;
  default_bank_account: string;
  default_price_list: string;
  is_internal_customer: boolean;
  is_frozen: boolean;
  disabled: boolean;
  customer_details: string;
  market_segment: string;
  industry: string;
  customer_pos_id: string;
  website: string;
  language: string;
  customer_primary_contact: string;
  mobile_no: string;
  email_id: string;
  customer_primary_address: string;
  primary_address: string;
  payment_terms: string;
  default_sales_partner: string;
  default_commission_rate: number;
  so_required: boolean;
  dn_required: boolean;
  is_pos: boolean;
  loyalty_program: string;
  loyalty_program_tier: string;
  default_discount_account: string;
  tax_id: string;
  tax_category: string;
  tax_withholding_category: string;
  accounts: ERPPartyAccount[];
  credit_limits: ERPCustomerCreditLimit[];
  sales_team: ERPSalesTeam[];
  created_at: string;
  updated_at: string;
}

export interface ERPPartyAccount {
  id: string;
  company: string;
  account: string;
  is_default: boolean;
}

export interface ERPCustomerCreditLimit {
  id: string;
  company: string;
  credit_limit: number;
  bypass_credit_limit_check: boolean;
}

// ERPNext-inspired Project Integration
export interface ERPProject {
  id: string;
  naming_series: string;
  project_name: string;
  status: 'Open' | 'Completed' | 'Cancelled';
  project_type: string;
  is_active: 'Yes' | 'No';
  percent_complete_method: 'Manual' | 'Task Completion' | 'Task Progress' | 'Task Weight';
  percent_complete: number;
  expected_start_date: string;
  expected_end_date: string;
  actual_start_date: string;
  actual_end_date: string;
  priority: 'Medium' | 'Low' | 'High';
  customer: string;
  sales_order: string;
  project_template: string;
  notes: string;
  company: string;
  cost_center: string;
  department: string;
  estimated_costing: number;
  total_costing_amount: number;
  total_billable_amount: number;
  total_billed_amount: number;
  total_consumed_material_cost: number;
  total_sales_amount: number;
  gross_margin: number;
  per_gross_margin: number;
  project_users: ERPProjectUser[];
  tasks: ERPTask[];
  timesheets: ERPTimesheet[];
  created_at: string;
  updated_at: string;
}

export interface ERPProjectUser {
  id: string;
  user: string;
  view_attachments: boolean;
}

export interface ERPTask {
  id: string;
  subject: string;
  status: 'Open' | 'Working' | 'Pending Review' | 'Overdue' | 'Template' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  task_weight: number;
  description: string;
  expected_time: number;
  actual_time: number;
  progress: number;
  is_group: boolean;
  is_template: boolean;
  issue: string;
  project: string;
  parent_task: string;
  completed_by: string;
  completed_on: string;
  assigned_to: string;
  exp_start_date: string;
  exp_end_date: string;
  act_start_date: string;
  act_end_date: string;
  depends_on: ERPTaskDepends[];
}

export interface ERPTaskDepends {
  id: string;
  task: string;
}

export interface ERPTimesheet {
  id: string;
  naming_series: string;
  company: string;
  employee: string;
  employee_name: string;
  start_date: string;
  end_date: string;
  total_hours: number;
  total_billable_hours: number;
  total_billed_hours: number;
  total_costing_amount: number;
  total_billable_amount: number;
  total_billed_amount: number;
  per_billed: number;
  status: 'Draft' | 'Submitted' | 'Payslip' | 'Billed' | 'Cancelled';
  time_logs: ERPTimesheetDetail[];
}

export interface ERPTimesheetDetail {
  id: string;
  activity_type: string;
  description: string;
  from_time: string;
  to_time: string;
  hours: number;
  is_billable: boolean;
  billable_hours: number;
  billing_hours: number;
  costing_rate: number;
  costing_amount: number;
  billing_rate: number;
  billing_amount: number;
  project: string;
  task: string;
  completed: number;
}

// Business Logic Classes
export class ERPIntegrationService {
  private supabase;

  constructor(supabaseClient?: any) {
    this.supabase = supabaseClient || createClientComponentClient();
  }

  // Item Management
  async createItem(itemData: Partial<ERPItem>): Promise<ERPItem> {
    const { data, error } = await this.supabase
      .from('erp_items')
      .insert(itemData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getItemDetails(itemCode: string): Promise<ERPItem | null> {
    const { data, error } = await this.supabase
      .from('erp_items')
      .select(`
        *,
        item_defaults (*),
        supplier_items (*),
        reorder_levels (*)
      `)
      .eq('item_code', itemCode)
      .single();

    if (error) return null;
    return data;
  }
  async checkStockAvailability(itemCode: string, warehouse: string, qty: number): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('stock_ledger_entries')
      .select('actual_qty')
      .eq('item_code', itemCode)
      .eq('warehouse', warehouse);

    if (error) throw error;

    const totalStock = data.reduce((sum: number, entry: any) => sum + entry.actual_qty, 0);
    return totalStock >= qty;
  }

  // Sales Order Management
  async createSalesOrder(orderData: Partial<ERPSalesOrder>): Promise<ERPSalesOrder> {
    // Generate naming series
    const namingSeries = await this.generateNamingSeries('SO', new Date().getFullYear());
    
    const orderWithSeries = {
      ...orderData,
      naming_series: namingSeries,
      status: 'Draft' as const,
      per_delivered: 0,
      per_billed: 0,
      billing_status: 'Not Billed' as const,
      delivery_status: 'Not Delivered' as const,
    };

    const { data, error } = await this.supabase
      .from('erp_sales_orders')
      .insert(orderWithSeries)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async calculateTaxes(items: ERPSalesOrderItem[], taxTemplate: string): Promise<ERPSalesTaxesAndCharges[]> {
    // Implement tax calculation logic based on tax template
    // This would integrate with your tax configuration
    return [];
  }

  async validatePricingRules(items: ERPSalesOrderItem[], customer: string, priceList: string): Promise<ERPSalesOrderItem[]> {
    // Implement pricing rule validation and application
    return items;
  }

  // Stock Entry Management
  async createStockEntry(entryData: Partial<ERPStockEntry>): Promise<ERPStockEntry> {
    const namingSeries = await this.generateNamingSeries('STE', new Date().getFullYear());
    
    const entryWithSeries = {
      ...entryData,
      naming_series: namingSeries,
      posting_date: entryData.posting_date || new Date().toISOString(),
      posting_time: entryData.posting_time || new Date().toTimeString(),
    };

    const { data, error } = await this.supabase
      .from('erp_stock_entries')
      .insert(entryWithSeries)
      .select()
      .single();

    if (error) throw error;

    // Update stock ledger
    await this.updateStockLedger(data);

    return data;
  }

  private async updateStockLedger(stockEntry: ERPStockEntry): Promise<void> {
    for (const item of stockEntry.items) {
      // Create stock ledger entries for each item movement
      if (item.s_warehouse) {
        await this.createStockLedgerEntry({
          item_code: item.item_code,
          warehouse: item.s_warehouse,
          posting_date: stockEntry.posting_date,
          posting_time: stockEntry.posting_time,
          voucher_type: 'Stock Entry',
          voucher_no: stockEntry.id,
          actual_qty: -item.qty,
          qty_after_transaction: 0, // This would be calculated
          valuation_rate: item.valuation_rate,
          stock_value: -item.amount,
          stock_value_difference: -item.amount,
        });
      }

      if (item.t_warehouse) {
        await this.createStockLedgerEntry({
          item_code: item.item_code,
          warehouse: item.t_warehouse,
          posting_date: stockEntry.posting_date,
          posting_time: stockEntry.posting_time,
          voucher_type: 'Stock Entry',
          voucher_no: stockEntry.id,
          actual_qty: item.qty,
          qty_after_transaction: 0, // This would be calculated
          valuation_rate: item.valuation_rate,
          stock_value: item.amount,
          stock_value_difference: item.amount,
        });
      }
    }
  }

  private async createStockLedgerEntry(entry: any): Promise<void> {
    const { error } = await this.supabase
      .from('stock_ledger_entries')
      .insert(entry);

    if (error) throw error;
  }

  // Customer Management
  async createCustomer(customerData: Partial<ERPCustomer>): Promise<ERPCustomer> {
    const namingSeries = await this.generateNamingSeries('CUST', new Date().getFullYear());
    
    const customerWithSeries = {
      ...customerData,
      naming_series: namingSeries,
      customer_type: customerData.customer_type || 'Individual',
      is_internal_customer: customerData.is_internal_customer || false,
      is_frozen: customerData.is_frozen || false,
      disabled: customerData.disabled || false,
    };

    const { data, error } = await this.supabase
      .from('erp_customers')
      .insert(customerWithSeries)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async checkCreditLimit(customer: string, company: string, grandTotal: number): Promise<boolean> {
    const { data: creditLimits, error } = await this.supabase
      .from('erp_customer_credit_limits')
      .select('credit_limit, bypass_credit_limit_check')
      .eq('customer', customer)
      .eq('company', company);

    if (error) throw error;

    if (!creditLimits.length) return true; // No credit limit set

    const creditLimit = creditLimits[0];
    if (creditLimit.bypass_credit_limit_check) return true;

    // Get customer's outstanding amount
    const { data: outstandingData, error: outstandingError } = await this.supabase
      .from('erp_sales_invoices')
      .select('outstanding_amount')
      .eq('customer', customer)
      .eq('company', company)
      .eq('docstatus', 1);

    if (outstandingError) throw outstandingError;

    const totalOutstanding = outstandingData.reduce((sum, inv) => sum + inv.outstanding_amount, 0);
    return (totalOutstanding + grandTotal) <= creditLimit.credit_limit;
  }

  // Project Integration
  async createProjectFromSalesOrder(salesOrder: ERPSalesOrder): Promise<ERPProject> {
    const projectData: Partial<ERPProject> = {
      project_name: `Project for ${salesOrder.customer_name}`,
      status: 'Open',
      is_active: 'Yes',
      percent_complete_method: 'Manual',
      percent_complete: 0,
      expected_start_date: salesOrder.delivery_date,
      customer: salesOrder.customer,
      sales_order: salesOrder.id,
      estimated_costing: salesOrder.grand_total,
    };

    const { data, error } = await this.supabase
      .from('erp_projects')
      .insert(projectData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateProjectProgress(projectId: string, progress: number): Promise<void> {
    const { error } = await this.supabase
      .from('erp_projects')
      .update({ 
        percent_complete: progress,
        status: progress >= 100 ? 'Completed' : 'Open'
      })
      .eq('id', projectId);

    if (error) throw error;
  }

  // Utility Methods
  private async generateNamingSeries(prefix: string, year: number): Promise<string> {
    const { data, error } = await this.supabase
      .from('naming_series')
      .select('current')
      .eq('prefix', prefix)
      .eq('year', year)
      .single();

    if (error) {
      // Create new naming series entry
      await this.supabase
        .from('naming_series')
        .insert({ prefix, year, current: 1 });
      return `${prefix}-${year}-00001`;
    }

    const nextNumber = data.current + 1;
    await this.supabase
      .from('naming_series')
      .update({ current: nextNumber })
      .eq('prefix', prefix)
      .eq('year', year);

    return `${prefix}-${year}-${nextNumber.toString().padStart(5, '0')}`;
  }

  async getItemPrice(itemCode: string, priceList: string, qty: number = 1): Promise<number> {
    const { data, error } = await this.supabase
      .from('item_prices')
      .select('price_list_rate')
      .eq('item_code', itemCode)
      .eq('price_list', priceList)
      .lte('min_qty', qty)
      .order('min_qty', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;
    return data.price_list_rate;
  }

  async validateWarehouse(warehouse: string, company: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('warehouses')
      .select('id')
      .eq('name', warehouse)
      .eq('company', company)
      .eq('is_group', false)
      .eq('disabled', false)
      .single();

    return !error && !!data;
  }

  async getStockBalance(itemCode: string, warehouse: string): Promise<number> {
    const { data, error } = await this.supabase
      .from('stock_ledger_entries')
      .select('actual_qty')
      .eq('item_code', itemCode)
      .eq('warehouse', warehouse)
      .order('posting_date', { ascending: false });

    if (error) throw error;

    return data.reduce((sum, entry) => sum + entry.actual_qty, 0);
  }

  // Advanced Business Logic
  async processOrderWorkflow(orderId: string, action: string): Promise<void> {
    // Implement state machine for order processing
    const validTransitions: Record<string, string[]> = {
      'Draft': ['Submit', 'Cancel'],
      'To Deliver and Bill': ['Create Delivery Note', 'Create Sales Invoice', 'Cancel'],
      'To Bill': ['Create Sales Invoice', 'Cancel'],
      'To Deliver': ['Create Delivery Note', 'Cancel'],
      'Completed': ['Close'],
      'Cancelled': [],
      'Closed': ['Reopen'],
    };

    const { data: order, error } = await this.supabase
      .from('erp_sales_orders')
      .select('status')
      .eq('id', orderId)
      .single();

    if (error) throw error;

    if (!validTransitions[order.status]?.includes(action)) {
      throw new Error(`Invalid transition: ${action} from ${order.status}`);
    }

    // Process the action
    switch (action) {
      case 'Submit':
        await this.submitSalesOrder(orderId);
        break;
      case 'Create Delivery Note':
        await this.createDeliveryNoteFromSalesOrder(orderId);
        break;
      case 'Create Sales Invoice':
        await this.createSalesInvoiceFromSalesOrder(orderId);
        break;
      case 'Cancel':
        await this.cancelSalesOrder(orderId);
        break;
      // Add more actions as needed
    }
  }

  private async submitSalesOrder(orderId: string): Promise<void> {
    // Validate stock availability, pricing, etc.
    const { data: order, error } = await this.supabase
      .from('erp_sales_orders')
      .select(`
        *,
        items:erp_sales_order_items(*)
      `)
      .eq('id', orderId)
      .single();

    if (error) throw error;

    // Check stock for each item
    for (const item of order.items) {
      const available = await this.checkStockAvailability(
        item.item_code, 
        item.warehouse, 
        item.qty
      );

      if (!available) {
        throw new Error(`Insufficient stock for item ${item.item_code}`);
      }
    }

    // Update status
    await this.supabase
      .from('erp_sales_orders')
      .update({ 
        status: 'To Deliver and Bill',
        docstatus: 1
      })
      .eq('id', orderId);
  }

  private async createDeliveryNoteFromSalesOrder(orderId: string): Promise<string> {
    // Implementation for creating delivery note
    // This would create a new delivery note with items from sales order
    throw new Error('Not implemented');
  }

  private async createSalesInvoiceFromSalesOrder(orderId: string): Promise<string> {
    // Implementation for creating sales invoice
    // This would create a new sales invoice with items from sales order
    throw new Error('Not implemented');
  }

  private async cancelSalesOrder(orderId: string): Promise<void> {
    await this.supabase
      .from('erp_sales_orders')
      .update({ 
        status: 'Cancelled',
        docstatus: 2
      })
      .eq('id', orderId);
  }

  // Additional methods needed by API endpoints
  async getStoreAnalytics(storeId: string, options?: {
    startDate?: string;
    endDate?: string;
    currency?: string;
  }): Promise<any> {
    try {
      // Get sales data
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

      // Calculate metrics
      const totalRevenue = salesOrders?.reduce((sum, order) => sum + (order.grand_total || 0), 0) || 0;
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
  }): Promise<any> {
    try {
      // Get financial data from sales orders
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

      const totalRevenue = orders?.reduce((sum, order) => sum + (order.grand_total || 0), 0) || 0;
      const totalTaxes = orders?.reduce((sum, order) => sum + (order.total_taxes_and_charges || 0), 0) || 0;
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
  }): Promise<any> {
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

      // Group by status
      const statusDistribution = orders?.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Group by customer
      const customerDistribution = orders?.reduce((acc, order) => {
        acc[order.customer_name] = (acc[order.customer_name] || 0) + (order.grand_total || 0);
        return acc;
      }, {} as Record<string, number>) || {};

      return {
        statusDistribution,
        customerDistribution,
        totalOrders: orders?.length || 0,
        completedOrders: orders?.filter(o => o.status === 'Completed').length || 0,
        pendingOrders: orders?.filter(o => o.status === 'Draft' || o.status === 'To Deliver and Bill').length || 0
      };
    } catch (error) {
      console.error('Error getting sales analytics:', error);
      throw error;
    }
  }

  async getInventoryAnalytics(storeId: string): Promise<any> {
    try {
      const { data: items, error } = await this.supabase
        .from('erp_items')
        .select('*');

      if (error) throw error;

      const totalItems = items?.length || 0;
      const stockItems = items?.filter(item => item.is_stock_item).length || 0;
      const lowStockItems = items?.filter(item => (item.opening_stock || 0) < (item.safety_stock || 10)).length || 0;
      const totalInventoryValue = items?.reduce((sum, item) => {
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
  }): Promise<any> {
    try {
      const { data: customers, error } = await this.supabase
        .from('erp_customers')
        .select('*');

      if (error) throw error;

      const totalCustomers = customers?.length || 0;
      const activeCustomers = customers?.filter(c => !c.disabled && !c.is_frozen).length || 0;

      // Group by customer group
      const groupDistribution = customers?.reduce((acc, customer) => {
        acc[customer.customer_group] = (acc[customer.customer_group] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      return {
        totalCustomers,
        activeCustomers,
        groupDistribution,
        customerGrowthRate: 0 // Placeholder - would need historical data
      };
    } catch (error) {
      console.error('Error getting customer analytics:', error);
      throw error;
    }
  }

  async getDashboardSummary(storeId: string): Promise<any> {
    try {
      const [items, customers, salesOrders] = await Promise.all([
        this.supabase.from('erp_items').select('*'),
        this.supabase.from('erp_customers').select('*'),
        this.supabase.from('erp_sales_orders').select('*')
      ]);

      const totalRevenue = salesOrders.data?.reduce((sum, order) => sum + (order.grand_total || 0), 0) || 0;
      const pendingOrders = salesOrders.data?.filter(order => 
        order.status === 'Draft' || order.status === 'To Deliver and Bill'
      ).length || 0;

      return {
        totalItems: items.data?.length || 0,
        totalCustomers: customers.data?.length || 0,
        totalOrders: salesOrders.data?.length || 0,
        totalRevenue,
        pendingOrders,
        lowStockAlerts: items.data?.filter(item => (item.opening_stock || 0) < 10).length || 0
      };
    } catch (error) {
      console.error('Error getting dashboard summary:', error);
      throw error;
    }
  }

  // CRUD operations with proper error handling
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
      // Generate naming series
      const namingSeries = await this.generateNamingSeries('SO', 'Sales Order');
      
      const { data, error } = await this.supabase
        .from('erp_sales_orders')
        .insert([{
          ...orderData,
          name: namingSeries,
          naming_series: 'SO-YYYY-',
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

  private async generateNamingSeries(prefix: string, docType: string): Promise<string> {
    const year = new Date().getFullYear();
    const { data, error } = await this.supabase
      .from('erp_naming_series')
      .select('current')
      .eq('prefix', prefix)
      .eq('year', year)
      .single();

    let nextNumber = 1;
    if (data) {
      nextNumber = data.current + 1;
      await this.supabase
        .from('erp_naming_series')
        .update({ current: nextNumber })
        .eq('prefix', prefix)
        .eq('year', year);
    } else {
      await this.supabase
        .from('erp_naming_series')
        .insert([{ prefix, year, current: nextNumber }]);
    }

    return `${prefix}-${year}-${String(nextNumber).padStart(5, '0')}`;
  }
}

// Export service instance
export const erpService = new ERPIntegrationService();
