-- ERPNext-inspired database schema for enhanced store management
-- This migration adds comprehensive business management features

-- Items and Inventory Management
CREATE TABLE IF NOT EXISTS erp_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_code VARCHAR UNIQUE NOT NULL,
    item_name VARCHAR NOT NULL,
    item_group VARCHAR NOT NULL DEFAULT 'All Item Groups',
    stock_uom VARCHAR NOT NULL DEFAULT 'Nos',
    has_variants BOOLEAN DEFAULT false,
    is_stock_item BOOLEAN DEFAULT true,
    is_purchase_item BOOLEAN DEFAULT true,
    is_sales_item BOOLEAN DEFAULT true,
    standard_rate DECIMAL(15,2) DEFAULT 0,
    valuation_rate DECIMAL(15,2) DEFAULT 0,
    min_order_qty DECIMAL(15,3) DEFAULT 0,
    safety_stock DECIMAL(15,3) DEFAULT 0,
    lead_time_days INTEGER DEFAULT 0,
    warranty_period INTEGER DEFAULT 0,
    has_batch_no BOOLEAN DEFAULT false,
    has_serial_no BOOLEAN DEFAULT false,
    shelf_life_in_days INTEGER,
    end_of_life DATE,
    brand VARCHAR,
    manufacturer VARCHAR,
    country_of_origin VARCHAR,
    customs_tariff_number VARCHAR,
    description TEXT,
    image_url VARCHAR,
    disabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Item Defaults
CREATE TABLE IF NOT EXISTS erp_item_defaults (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_id UUID REFERENCES erp_items(id) ON DELETE CASCADE,
    company VARCHAR NOT NULL DEFAULT 'Main Company',
    default_warehouse VARCHAR,
    default_price_list VARCHAR,
    default_supplier VARCHAR,
    expense_account VARCHAR,
    income_account VARCHAR,
    buying_cost_center VARCHAR,
    selling_cost_center VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Supplier Items
CREATE TABLE IF NOT EXISTS erp_supplier_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_id UUID REFERENCES erp_items(id) ON DELETE CASCADE,
    supplier_id UUID,
    supplier_part_no VARCHAR,
    min_order_qty DECIMAL(15,3) DEFAULT 0,
    lead_time_days INTEGER DEFAULT 0,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reorder Levels
CREATE TABLE IF NOT EXISTS erp_reorder_levels (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_id UUID REFERENCES erp_items(id) ON DELETE CASCADE,
    warehouse VARCHAR NOT NULL,
    warehouse_reorder_level DECIMAL(15,3) DEFAULT 0,
    warehouse_reorder_qty DECIMAL(15,3) DEFAULT 0,
    material_request_type VARCHAR DEFAULT 'Purchase',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers
CREATE TABLE IF NOT EXISTS erp_customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    naming_series VARCHAR NOT NULL,
    customer_name VARCHAR NOT NULL,
    customer_type VARCHAR NOT NULL DEFAULT 'Individual',
    customer_group VARCHAR DEFAULT 'All Customer Groups',
    territory VARCHAR DEFAULT 'All Territories',
    gender VARCHAR,
    lead_name VARCHAR,
    opportunity_name VARCHAR,
    prospect_name VARCHAR,
    account_manager VARCHAR,
    image_url VARCHAR,
    default_currency VARCHAR DEFAULT 'SAR',
    default_bank_account VARCHAR,
    default_price_list VARCHAR DEFAULT 'Standard Selling',
    is_internal_customer BOOLEAN DEFAULT false,
    is_frozen BOOLEAN DEFAULT false,
    disabled BOOLEAN DEFAULT false,
    customer_details TEXT,
    market_segment VARCHAR,
    industry VARCHAR,
    customer_pos_id VARCHAR,
    website VARCHAR,
    language VARCHAR DEFAULT 'ar',
    customer_primary_contact VARCHAR,
    mobile_no VARCHAR,
    email_id VARCHAR,
    customer_primary_address VARCHAR,
    primary_address TEXT,
    payment_terms VARCHAR,
    default_sales_partner VARCHAR,
    default_commission_rate DECIMAL(8,3) DEFAULT 0,
    so_required BOOLEAN DEFAULT false,
    dn_required BOOLEAN DEFAULT false,
    is_pos BOOLEAN DEFAULT false,
    loyalty_program VARCHAR,
    loyalty_program_tier VARCHAR,
    default_discount_account VARCHAR,
    tax_id VARCHAR,
    tax_category VARCHAR,
    tax_withholding_category VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer Credit Limits
CREATE TABLE IF NOT EXISTS erp_customer_credit_limits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer UUID REFERENCES erp_customers(id) ON DELETE CASCADE,
    company VARCHAR NOT NULL DEFAULT 'Main Company',
    credit_limit DECIMAL(15,2) DEFAULT 0,
    bypass_credit_limit_check BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sales Orders
CREATE TABLE IF NOT EXISTS erp_sales_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    naming_series VARCHAR NOT NULL,
    customer UUID REFERENCES erp_customers(id),
    customer_name VARCHAR NOT NULL,
    project UUID,
    order_type VARCHAR DEFAULT 'Sales',
    transaction_date DATE NOT NULL,
    delivery_date DATE,
    currency VARCHAR DEFAULT 'SAR',
    conversion_rate DECIMAL(9,6) DEFAULT 1,
    selling_price_list VARCHAR DEFAULT 'Standard Selling',
    price_list_currency VARCHAR DEFAULT 'SAR',
    plc_conversion_rate DECIMAL(9,6) DEFAULT 1,
    ignore_pricing_rule BOOLEAN DEFAULT false,
    apply_discount_on VARCHAR DEFAULT 'Grand Total',
    base_discount_amount DECIMAL(15,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    base_grand_total DECIMAL(15,2) DEFAULT 0,
    grand_total DECIMAL(15,2) DEFAULT 0,
    base_net_total DECIMAL(15,2) DEFAULT 0,
    net_total DECIMAL(15,2) DEFAULT 0,
    base_total_taxes_and_charges DECIMAL(15,2) DEFAULT 0,
    total_taxes_and_charges DECIMAL(15,2) DEFAULT 0,
    base_rounding_adjustment DECIMAL(15,2) DEFAULT 0,
    rounding_adjustment DECIMAL(15,2) DEFAULT 0,
    in_words TEXT,
    base_in_words TEXT,
    status VARCHAR DEFAULT 'Draft',
    per_delivered DECIMAL(6,3) DEFAULT 0,
    per_billed DECIMAL(6,3) DEFAULT 0,
    billing_status VARCHAR DEFAULT 'Not Billed',
    delivery_status VARCHAR DEFAULT 'Not Delivered',
    source VARCHAR,
    campaign VARCHAR,
    territory VARCHAR,
    customer_group VARCHAR,
    taxes_and_charges VARCHAR,
    payment_terms_template VARCHAR,
    tc_name VARCHAR,
    terms TEXT,
    docstatus INTEGER DEFAULT 0, -- 0: Draft, 1: Submitted, 2: Cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sales Order Items
CREATE TABLE IF NOT EXISTS erp_sales_order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sales_order_id UUID REFERENCES erp_sales_orders(id) ON DELETE CASCADE,
    item_code VARCHAR NOT NULL,
    item_name VARCHAR NOT NULL,
    description TEXT,
    item_group VARCHAR,
    brand VARCHAR,
    image_url VARCHAR,
    qty DECIMAL(15,3) NOT NULL DEFAULT 0,
    stock_uom VARCHAR NOT NULL,
    uom VARCHAR NOT NULL,
    conversion_factor DECIMAL(9,6) DEFAULT 1,
    stock_qty DECIMAL(15,3) DEFAULT 0,
    price_list_rate DECIMAL(15,2) DEFAULT 0,
    base_price_list_rate DECIMAL(15,2) DEFAULT 0,
    margin_type VARCHAR,
    margin_rate_or_amount DECIMAL(15,3) DEFAULT 0,
    rate_with_margin DECIMAL(15,2) DEFAULT 0,
    discount_percentage DECIMAL(6,3) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    base_rate_with_margin DECIMAL(15,2) DEFAULT 0,
    rate DECIMAL(15,2) DEFAULT 0,
    base_rate DECIMAL(15,2) DEFAULT 0,
    amount DECIMAL(15,2) DEFAULT 0,
    base_amount DECIMAL(15,2) DEFAULT 0,
    pricing_rules TEXT, -- JSON array
    stock_reserved_qty DECIMAL(15,3) DEFAULT 0,
    delivered_qty DECIMAL(15,3) DEFAULT 0,
    returned_qty DECIMAL(15,3) DEFAULT 0,
    billed_qty DECIMAL(15,3) DEFAULT 0,
    planned_qty DECIMAL(15,3) DEFAULT 0,
    work_order_qty DECIMAL(15,3) DEFAULT 0,
    delivery_date DATE,
    warehouse VARCHAR,
    against_blanket_order BOOLEAN DEFAULT false,
    blanket_order VARCHAR,
    blanket_order_rate DECIMAL(15,2) DEFAULT 0,
    bom_no VARCHAR,
    projected_qty DECIMAL(15,3) DEFAULT 0,
    actual_qty DECIMAL(15,3) DEFAULT 0,
    ordered_qty DECIMAL(15,3) DEFAULT 0,
    reserved_qty DECIMAL(15,3) DEFAULT 0,
    page_break BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sales Taxes and Charges
CREATE TABLE IF NOT EXISTS erp_sales_taxes_and_charges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sales_order_id UUID REFERENCES erp_sales_orders(id) ON DELETE CASCADE,
    charge_type VARCHAR NOT NULL,
    account_head VARCHAR NOT NULL,
    description VARCHAR,
    included_in_print_rate BOOLEAN DEFAULT false,
    cost_center VARCHAR,
    rate DECIMAL(6,3) DEFAULT 0,
    account_currency VARCHAR DEFAULT 'SAR',
    tax_amount DECIMAL(15,2) DEFAULT 0,
    base_tax_amount DECIMAL(15,2) DEFAULT 0,
    tax_amount_after_discount_amount DECIMAL(15,2) DEFAULT 0,
    base_tax_amount_after_discount_amount DECIMAL(15,2) DEFAULT 0,
    total DECIMAL(15,2) DEFAULT 0,
    base_total DECIMAL(15,2) DEFAULT 0,
    item_wise_tax_detail TEXT, -- JSON
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment Schedule
CREATE TABLE IF NOT EXISTS erp_payment_schedule (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sales_order_id UUID REFERENCES erp_sales_orders(id) ON DELETE CASCADE,
    due_date DATE NOT NULL,
    invoice_portion DECIMAL(6,3) DEFAULT 0,
    discount_type VARCHAR,
    discount_date DATE,
    discount DECIMAL(15,2) DEFAULT 0,
    payment_amount DECIMAL(15,2) DEFAULT 0,
    base_payment_amount DECIMAL(15,2) DEFAULT 0,
    outstanding DECIMAL(15,2) DEFAULT 0,
    paid_amount DECIMAL(15,2) DEFAULT 0,
    discounted_amount DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stock Entries
CREATE TABLE IF NOT EXISTS erp_stock_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    naming_series VARCHAR NOT NULL,
    stock_entry_type VARCHAR NOT NULL,
    work_order VARCHAR,
    bom_no VARCHAR,
    use_multi_level_bom BOOLEAN DEFAULT false,
    fg_completed_qty DECIMAL(15,3) DEFAULT 0,
    from_bom BOOLEAN DEFAULT false,
    posting_date DATE NOT NULL,
    posting_time TIME NOT NULL,
    set_posting_time BOOLEAN DEFAULT false,
    inspection_required BOOLEAN DEFAULT false,
    apply_putaway_rule BOOLEAN DEFAULT false,
    from_warehouse VARCHAR,
    to_warehouse VARCHAR,
    scan_barcode VARCHAR,
    total_outgoing_value DECIMAL(15,2) DEFAULT 0,
    total_incoming_value DECIMAL(15,2) DEFAULT 0,
    value_difference DECIMAL(15,2) DEFAULT 0,
    total_additional_costs DECIMAL(15,2) DEFAULT 0,
    supplier VARCHAR,
    supplier_name VARCHAR,
    supplier_address VARCHAR,
    address_display TEXT,
    project UUID,
    select_print_heading VARCHAR,
    letter_head VARCHAR,
    is_opening BOOLEAN DEFAULT false,
    remarks TEXT,
    per_transferred DECIMAL(6,3) DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0,
    job_card VARCHAR,
    amended_from VARCHAR,
    credit_note VARCHAR,
    is_return BOOLEAN DEFAULT false,
    return_against VARCHAR,
    docstatus INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stock Entry Details
CREATE TABLE IF NOT EXISTS erp_stock_entry_details (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stock_entry_id UUID REFERENCES erp_stock_entries(id) ON DELETE CASCADE,
    barcode VARCHAR,
    has_item_scanned BOOLEAN DEFAULT false,
    item_code VARCHAR NOT NULL,
    item_name VARCHAR NOT NULL,
    description TEXT,
    item_group VARCHAR,
    image_url VARCHAR,
    qty DECIMAL(15,3) NOT NULL DEFAULT 0,
    transfer_qty DECIMAL(15,3) DEFAULT 0,
    retain_sample BOOLEAN DEFAULT false,
    sample_quantity DECIMAL(15,3) DEFAULT 0,
    uom VARCHAR NOT NULL,
    stock_uom VARCHAR NOT NULL,
    conversion_factor DECIMAL(9,6) DEFAULT 1,
    s_warehouse VARCHAR, -- Source warehouse
    t_warehouse VARCHAR, -- Target warehouse
    finished_item VARCHAR,
    is_finished_item BOOLEAN DEFAULT false,
    is_scrap_item BOOLEAN DEFAULT false,
    original_item VARCHAR,
    expense_account VARCHAR,
    cost_center VARCHAR,
    project UUID,
    actual_qty DECIMAL(15,3) DEFAULT 0,
    basic_rate DECIMAL(15,2) DEFAULT 0,
    basic_amount DECIMAL(15,2) DEFAULT 0,
    additional_cost DECIMAL(15,2) DEFAULT 0,
    valuation_rate DECIMAL(15,2) DEFAULT 0,
    amount DECIMAL(15,2) DEFAULT 0,
    gl_account VARCHAR,
    is_process_loss BOOLEAN DEFAULT false,
    job_card_item VARCHAR,
    material_request VARCHAR,
    material_request_item VARCHAR,
    batch_no VARCHAR,
    serial_no TEXT,
    inventory_type VARCHAR,
    use_serial_batch_fields BOOLEAN DEFAULT false,
    serial_and_batch_bundle VARCHAR,
    allow_zero_valuation_rate BOOLEAN DEFAULT false,
    set_basic_rate_manually BOOLEAN DEFAULT false,
    allow_alternative_item BOOLEAN DEFAULT false,
    subcontracted_item VARCHAR,
    bom_no VARCHAR,
    against_stock_entry VARCHAR,
    ste_detail VARCHAR,
    po_detail VARCHAR,
    original_item_qty DECIMAL(15,3) DEFAULT 0,
    picked_qty DECIMAL(15,3) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stock Ledger Entries
CREATE TABLE IF NOT EXISTS stock_ledger_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_code VARCHAR NOT NULL,
    warehouse VARCHAR NOT NULL,
    posting_date DATE NOT NULL,
    posting_time TIME NOT NULL,
    voucher_type VARCHAR NOT NULL,
    voucher_no VARCHAR NOT NULL,
    voucher_detail_no VARCHAR,
    actual_qty DECIMAL(15,3) DEFAULT 0,
    qty_after_transaction DECIMAL(15,3) DEFAULT 0,
    incoming_rate DECIMAL(15,2) DEFAULT 0,
    outgoing_rate DECIMAL(15,2) DEFAULT 0,
    valuation_rate DECIMAL(15,2) DEFAULT 0,
    stock_value DECIMAL(15,2) DEFAULT 0,
    stock_value_difference DECIMAL(15,2) DEFAULT 0,
    voucher_created_by UUID,
    batch_no VARCHAR,
    serial_no TEXT,
    project UUID,
    is_cancelled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Warehouses
CREATE TABLE IF NOT EXISTS warehouses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR UNIQUE NOT NULL,
    warehouse_name VARCHAR NOT NULL,
    warehouse_type VARCHAR,
    is_group BOOLEAN DEFAULT false,
    parent_warehouse VARCHAR,
    company VARCHAR NOT NULL DEFAULT 'Main Company',
    email_id VARCHAR,
    phone_no VARCHAR,
    mobile_no VARCHAR,
    address_line_1 VARCHAR,
    address_line_2 VARCHAR,
    city VARCHAR,
    state VARCHAR,
    pin VARCHAR,
    warehouse_contact_info TEXT,
    default_in_transit_warehouse VARCHAR,
    account VARCHAR,
    disabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Price Lists
CREATE TABLE IF NOT EXISTS price_lists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR UNIQUE NOT NULL,
    currency VARCHAR NOT NULL DEFAULT 'SAR',
    buying BOOLEAN DEFAULT false,
    selling BOOLEAN DEFAULT true,
    price_not_uom_dependent BOOLEAN DEFAULT false,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Item Prices
CREATE TABLE IF NOT EXISTS item_prices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_code VARCHAR NOT NULL,
    price_list VARCHAR NOT NULL,
    price_list_rate DECIMAL(15,2) NOT NULL DEFAULT 0,
    currency VARCHAR NOT NULL DEFAULT 'SAR',
    uom VARCHAR,
    min_qty DECIMAL(15,3) DEFAULT 0,
    max_qty DECIMAL(15,3) DEFAULT 0,
    valid_from DATE,
    valid_upto DATE,
    lead_time_days INTEGER DEFAULT 0,
    note TEXT,
    reference VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sales Taxes and Charges Templates
CREATE TABLE IF NOT EXISTS sales_taxes_and_charges_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR UNIQUE NOT NULL,
    title VARCHAR NOT NULL,
    is_default BOOLEAN DEFAULT false,
    tax_category VARCHAR,
    company VARCHAR NOT NULL DEFAULT 'Main Company',
    disabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sales Taxes and Charges Template Details
CREATE TABLE IF NOT EXISTS sales_taxes_and_charges_template_details (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    template_id UUID REFERENCES sales_taxes_and_charges_templates(id) ON DELETE CASCADE,
    charge_type VARCHAR NOT NULL,
    account_head VARCHAR NOT NULL,
    description VARCHAR,
    included_in_print_rate BOOLEAN DEFAULT false,
    cost_center VARCHAR,
    rate DECIMAL(6,3) DEFAULT 0,
    account_currency VARCHAR DEFAULT 'SAR',
    row_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects (Enhanced)
CREATE TABLE IF NOT EXISTS erp_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    naming_series VARCHAR NOT NULL,
    project_name VARCHAR NOT NULL,
    status VARCHAR DEFAULT 'Open',
    project_type VARCHAR,
    is_active BOOLEAN DEFAULT true,
    percent_complete_method VARCHAR DEFAULT 'Manual',
    percent_complete DECIMAL(6,3) DEFAULT 0,
    expected_start_date DATE,
    expected_end_date DATE,
    actual_start_date DATE,
    actual_end_date DATE,
    priority VARCHAR DEFAULT 'Medium',
    customer UUID REFERENCES erp_customers(id),
    sales_order UUID REFERENCES erp_sales_orders(id),
    project_template VARCHAR,
    notes TEXT,
    company VARCHAR NOT NULL DEFAULT 'Main Company',
    cost_center VARCHAR,
    department VARCHAR,
    estimated_costing DECIMAL(15,2) DEFAULT 0,
    total_costing_amount DECIMAL(15,2) DEFAULT 0,
    total_billable_amount DECIMAL(15,2) DEFAULT 0,
    total_billed_amount DECIMAL(15,2) DEFAULT 0,
    total_consumed_material_cost DECIMAL(15,2) DEFAULT 0,
    total_sales_amount DECIMAL(15,2) DEFAULT 0,
    gross_margin DECIMAL(15,2) DEFAULT 0,
    per_gross_margin DECIMAL(6,3) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Naming Series
CREATE TABLE IF NOT EXISTS naming_series (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    prefix VARCHAR NOT NULL,
    year INTEGER NOT NULL,
    current INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(prefix, year)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_erp_items_item_code ON erp_items(item_code);
CREATE INDEX IF NOT EXISTS idx_erp_items_item_group ON erp_items(item_group);
CREATE INDEX IF NOT EXISTS idx_erp_items_disabled ON erp_items(disabled);

CREATE INDEX IF NOT EXISTS idx_erp_customers_customer_name ON erp_customers(customer_name);
CREATE INDEX IF NOT EXISTS idx_erp_customers_disabled ON erp_customers(disabled);

CREATE INDEX IF NOT EXISTS idx_erp_sales_orders_customer ON erp_sales_orders(customer);
CREATE INDEX IF NOT EXISTS idx_erp_sales_orders_project ON erp_sales_orders(project);
CREATE INDEX IF NOT EXISTS idx_erp_sales_orders_status ON erp_sales_orders(status);
CREATE INDEX IF NOT EXISTS idx_erp_sales_orders_transaction_date ON erp_sales_orders(transaction_date);

CREATE INDEX IF NOT EXISTS idx_stock_ledger_item_warehouse ON stock_ledger_entries(item_code, warehouse);
CREATE INDEX IF NOT EXISTS idx_stock_ledger_posting_date ON stock_ledger_entries(posting_date);
CREATE INDEX IF NOT EXISTS idx_stock_ledger_voucher ON stock_ledger_entries(voucher_type, voucher_no);

CREATE INDEX IF NOT EXISTS idx_item_prices_item_price_list ON item_prices(item_code, price_list);
CREATE INDEX IF NOT EXISTS idx_item_prices_valid_dates ON item_prices(valid_from, valid_upto);

-- Insert default data
INSERT INTO price_lists (name, currency, selling) VALUES 
('Standard Selling', 'SAR', true),
('Standard Buying', 'SAR', false)
ON CONFLICT (name) DO NOTHING;

INSERT INTO sales_taxes_and_charges_templates (name, title, is_default) VALUES 
('Saudi Arabia VAT 15%', 'ضريبة القيمة المضافة 15%', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO sales_taxes_and_charges_template_details (template_id, charge_type, account_head, description, rate) 
SELECT id, 'On Net Total', 'VAT 15%', 'ضريبة القيمة المضافة', 15.0
FROM sales_taxes_and_charges_templates 
WHERE name = 'Saudi Arabia VAT 15%'
ON CONFLICT DO NOTHING;

INSERT INTO warehouses (name, warehouse_name, company) VALUES 
('Main Warehouse - MC', 'المستودع الرئيسي', 'Main Company'),
('Stores - MC', 'المخازن', 'Main Company')
ON CONFLICT (name) DO NOTHING;

-- Update existing orders table to link with ERP
ALTER TABLE orders ADD COLUMN IF NOT EXISTS erp_sales_order_id UUID REFERENCES erp_sales_orders(id);
ALTER TABLE products ADD COLUMN IF NOT EXISTS erp_item_code VARCHAR REFERENCES erp_items(item_code);

-- Create views for easier querying
CREATE OR REPLACE VIEW erp_order_summary AS
SELECT 
    so.id,
    so.naming_series,
    so.customer_name,
    so.transaction_date,
    so.delivery_date,
    so.status,
    so.grand_total,
    so.currency,
    c.customer_type,
    c.territory,
    COUNT(soi.id) as item_count,
    SUM(soi.qty) as total_qty
FROM erp_sales_orders so
LEFT JOIN erp_customers c ON so.customer = c.id
LEFT JOIN erp_sales_order_items soi ON so.id = soi.sales_order_id
GROUP BY so.id, c.customer_type, c.territory;

CREATE OR REPLACE VIEW stock_balance AS
SELECT 
    item_code,
    warehouse,
    SUM(actual_qty) as qty_after_transaction,
    AVG(valuation_rate) as valuation_rate,
    SUM(stock_value) as stock_value
FROM stock_ledger_entries 
WHERE is_cancelled = false
GROUP BY item_code, warehouse;

-- Add functions for business logic
CREATE OR REPLACE FUNCTION calculate_order_totals(order_id UUID)
RETURNS TABLE(
    net_total DECIMAL(15,2),
    tax_total DECIMAL(15,2),
    grand_total DECIMAL(15,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(soi.amount), 0) as net_total,
        COALESCE(SUM(stc.tax_amount), 0) as tax_total,
        COALESCE(SUM(soi.amount), 0) + COALESCE(SUM(stc.tax_amount), 0) as grand_total
    FROM erp_sales_orders so
    LEFT JOIN erp_sales_order_items soi ON so.id = soi.sales_order_id
    LEFT JOIN erp_sales_taxes_and_charges stc ON so.id = stc.sales_order_id
    WHERE so.id = order_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_stock_ledger()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert stock ledger entry for stock movements
    IF TG_OP = 'INSERT' THEN
        -- Handle stock entry details
        IF NEW.s_warehouse IS NOT NULL THEN
            INSERT INTO stock_ledger_entries (
                item_code, warehouse, posting_date, posting_time,
                voucher_type, voucher_no, actual_qty, valuation_rate, stock_value
            ) VALUES (
                NEW.item_code, NEW.s_warehouse, 
                (SELECT posting_date FROM erp_stock_entries WHERE id = NEW.stock_entry_id),
                (SELECT posting_time FROM erp_stock_entries WHERE id = NEW.stock_entry_id),
                'Stock Entry', NEW.stock_entry_id::text,
                -NEW.qty, NEW.valuation_rate, -NEW.amount
            );
        END IF;
        
        IF NEW.t_warehouse IS NOT NULL THEN
            INSERT INTO stock_ledger_entries (
                item_code, warehouse, posting_date, posting_time,
                voucher_type, voucher_no, actual_qty, valuation_rate, stock_value
            ) VALUES (
                NEW.item_code, NEW.t_warehouse,
                (SELECT posting_date FROM erp_stock_entries WHERE id = NEW.stock_entry_id),
                (SELECT posting_time FROM erp_stock_entries WHERE id = NEW.stock_entry_id),
                'Stock Entry', NEW.stock_entry_id::text,
                NEW.qty, NEW.valuation_rate, NEW.amount
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for stock ledger updates
DROP TRIGGER IF EXISTS trigger_update_stock_ledger ON erp_stock_entry_details;
CREATE TRIGGER trigger_update_stock_ledger
    AFTER INSERT ON erp_stock_entry_details
    FOR EACH ROW
    EXECUTE FUNCTION update_stock_ledger();

-- Add audit logging
CREATE OR REPLACE FUNCTION audit_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Log changes to important tables
    IF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, record_id, operation, old_values, new_values, changed_by, changed_at)
        VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', row_to_json(OLD), row_to_json(NEW), current_user, NOW());
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (table_name, record_id, operation, new_values, changed_by, changed_at)
        VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', row_to_json(NEW), current_user, NOW());
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (table_name, record_id, operation, old_values, changed_by, changed_at)
        VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', row_to_json(OLD), current_user, NOW());
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    table_name VARCHAR NOT NULL,
    record_id UUID,
    operation VARCHAR NOT NULL,
    old_values JSONB,
    new_values JSONB,
    changed_by VARCHAR,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add audit triggers to important tables
CREATE TRIGGER audit_erp_sales_orders
    AFTER INSERT OR UPDATE OR DELETE ON erp_sales_orders
    FOR EACH ROW EXECUTE FUNCTION audit_changes();

CREATE TRIGGER audit_erp_customers
    AFTER INSERT OR UPDATE OR DELETE ON erp_customers
    FOR EACH ROW EXECUTE FUNCTION audit_changes();

CREATE TRIGGER audit_stock_ledger_entries
    AFTER INSERT OR UPDATE OR DELETE ON stock_ledger_entries
    FOR EACH ROW EXECUTE FUNCTION audit_changes();

-- Grant permissions (adjust as needed for your user roles)
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE erp_items IS 'Master table for all items/products in the system';
COMMENT ON TABLE erp_sales_orders IS 'Sales orders with full ERP functionality';
COMMENT ON TABLE stock_ledger_entries IS 'All stock movements are recorded here';
COMMENT ON TABLE erp_customers IS 'Customer master with full business information';

-- Performance optimization - consider partitioning for large tables
-- CREATE TABLE stock_ledger_entries_2024 PARTITION OF stock_ledger_entries 
-- FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
