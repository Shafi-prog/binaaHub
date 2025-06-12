import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create client with anon key
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: NextRequest) {
  try {
    // ERP Items table creation
    const createErpItemsTable = `
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
    `;

    // ERP Sales Orders table
    const createErpSalesOrdersTable = `
      CREATE TABLE IF NOT EXISTS erp_sales_orders (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR UNIQUE NOT NULL,
        customer_id UUID REFERENCES users(id),
        store_id UUID REFERENCES stores(id),
        naming_series VARCHAR DEFAULT 'SO-',
        transaction_date DATE DEFAULT CURRENT_DATE,
        delivery_date DATE,
        po_no VARCHAR,
        po_date DATE,
        company VARCHAR NOT NULL DEFAULT 'Main Company',
        currency VARCHAR DEFAULT 'USD',
        conversion_rate DECIMAL(15,6) DEFAULT 1,
        selling_price_list VARCHAR,
        price_list_currency VARCHAR,
        plc_conversion_rate DECIMAL(15,6) DEFAULT 1,
        ignore_pricing_rule BOOLEAN DEFAULT false,
        scan_barcode VARCHAR,
        total_qty DECIMAL(15,3) DEFAULT 0,
        base_total DECIMAL(15,2) DEFAULT 0,
        base_net_total DECIMAL(15,2) DEFAULT 0,
        total DECIMAL(15,2) DEFAULT 0,
        net_total DECIMAL(15,2) DEFAULT 0,
        tax_category VARCHAR,
        taxes_and_charges VARCHAR,
        base_total_taxes_and_charges DECIMAL(15,2) DEFAULT 0,
        total_taxes_and_charges DECIMAL(15,2) DEFAULT 0,
        base_grand_total DECIMAL(15,2) DEFAULT 0,
        base_rounding_adjustment DECIMAL(15,2) DEFAULT 0,
        base_rounded_total DECIMAL(15,2) DEFAULT 0,
        grand_total DECIMAL(15,2) DEFAULT 0,
        rounding_adjustment DECIMAL(15,2) DEFAULT 0,
        rounded_total DECIMAL(15,2) DEFAULT 0,
        in_words VARCHAR,
        advance_paid DECIMAL(15,2) DEFAULT 0,
        status VARCHAR DEFAULT 'Draft',
        delivery_status VARCHAR DEFAULT 'Not Delivered',
        billing_status VARCHAR DEFAULT 'Not Billed',
        per_delivered DECIMAL(6,2) DEFAULT 0,
        per_billed DECIMAL(6,2) DEFAULT 0,
        per_picked DECIMAL(6,2) DEFAULT 0,
        workflow_state VARCHAR,
        apply_discount_on VARCHAR DEFAULT 'Grand Total',
        base_discount_amount DECIMAL(15,2) DEFAULT 0,
        discount_amount DECIMAL(15,2) DEFAULT 0,
        additional_discount_percentage DECIMAL(6,2) DEFAULT 0,
        customer_address VARCHAR,
        shipping_address_name VARCHAR,
        customer_group VARCHAR,
        territory VARCHAR,
        source VARCHAR,
        campaign VARCHAR,
        order_type VARCHAR DEFAULT 'Sales',
        project VARCHAR,
        cost_center VARCHAR,
        is_internal_customer BOOLEAN DEFAULT false,
        represents_company VARCHAR,
        inter_company_order_reference VARCHAR,
        customer_po_details TEXT,
        terms TEXT,
        tc_name VARCHAR,
        letter_head VARCHAR,
        group_same_items BOOLEAN DEFAULT false,
        language VARCHAR DEFAULT 'en',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // ERP Customers table
    const createErpCustomersTable = `
      CREATE TABLE IF NOT EXISTS erp_customers (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR UNIQUE NOT NULL,
        customer_name VARCHAR NOT NULL,
        customer_type VARCHAR DEFAULT 'Individual',
        customer_group VARCHAR DEFAULT 'All Customer Groups',
        territory VARCHAR DEFAULT 'All Territories',
        gender VARCHAR,
        lead_name VARCHAR,
        opportunity_name VARCHAR,
        account_manager VARCHAR,
        customer_primary_contact VARCHAR,
        customer_primary_address VARCHAR,
        default_currency VARCHAR DEFAULT 'USD',
        default_bank_account VARCHAR,
        default_price_list VARCHAR,
        is_internal_customer BOOLEAN DEFAULT false,
        represents_company VARCHAR,
        is_frozen BOOLEAN DEFAULT false,
        disabled BOOLEAN DEFAULT false,
        customer_details TEXT,
        market_segment VARCHAR,
        industry VARCHAR,
        customer_pos_id VARCHAR,
        website VARCHAR,
        language VARCHAR DEFAULT 'en',
        loyalty_program VARCHAR,
        loyalty_program_tier VARCHAR,
        default_commission_rate DECIMAL(6,2) DEFAULT 0,
        so_required BOOLEAN DEFAULT false,
        dn_required BOOLEAN DEFAULT false,
        customer_credit_limit DECIMAL(15,2) DEFAULT 0,
        bypass_credit_limit_check BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // ERP Stock Ledger table
    const createErpStockLedgerTable = `
      CREATE TABLE IF NOT EXISTS erp_stock_ledger (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR UNIQUE NOT NULL,
        posting_date DATE DEFAULT CURRENT_DATE,
        posting_time TIME DEFAULT CURRENT_TIME,
        voucher_type VARCHAR NOT NULL,
        voucher_no VARCHAR NOT NULL,
        voucher_detail_no VARCHAR,
        item_code VARCHAR NOT NULL,
        warehouse VARCHAR NOT NULL,
        against_stock_entry VARCHAR,
        actual_qty DECIMAL(15,3) DEFAULT 0,
        qty_after_transaction DECIMAL(15,3) DEFAULT 0,
        incoming_rate DECIMAL(15,6) DEFAULT 0,
        outgoing_rate DECIMAL(15,6) DEFAULT 0,
        stock_value DECIMAL(15,2) DEFAULT 0,
        stock_value_difference DECIMAL(15,2) DEFAULT 0,
        batch_no VARCHAR,
        serial_no TEXT,
        project VARCHAR,
        company VARCHAR NOT NULL DEFAULT 'Main Company',
        fiscal_year VARCHAR,
        stock_uom VARCHAR,
        has_batch_no BOOLEAN DEFAULT false,
        has_serial_no BOOLEAN DEFAULT false,
        is_cancelled BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    const tables = [
      { name: 'erp_items', sql: createErpItemsTable },
      { name: 'erp_sales_orders', sql: createErpSalesOrdersTable },
      { name: 'erp_customers', sql: createErpCustomersTable },
      { name: 'erp_stock_ledger', sql: createErpStockLedgerTable }
    ];

    const results = [];

    for (const table of tables) {
      try {
        const { error } = await supabase.rpc('execute_sql', { sql: table.sql });
        if (error) {
          results.push({ table: table.name, success: false, error: error.message });
        } else {
          results.push({ table: table.name, success: true });
        }
      } catch (err) {
        // Try direct table creation if RPC fails
        results.push({ 
          table: table.name, 
          success: false, 
          error: 'Table creation will need manual migration via Supabase dashboard'
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'ERP schema migration attempted',
      results
    });

  } catch (error) {
    console.error('Migration Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to execute schema migration',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
