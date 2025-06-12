#!/usr/bin/env node

/**
 * Check Tables and Create Performance Indexes Script
 * This script will:
 * 1. Check which tables exist
 * 2. Only create indexes for existing tables
 * 3. Create missing tables if needed
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Tables and their required indexes
const tableIndexes = {
  projects: [
    {
      name: 'idx_projects_user_status',
      columns: '(user_id, status)',
      description: 'User projects filtering'
    }
  ],
  orders: [
    {
      name: 'idx_orders_status_date',
      columns: '(status, created_at)',
      description: 'Order status queries'
    },
    {
      name: 'idx_orders_user_status',
      columns: '(user_id, status)',
      description: 'User dashboard stats'
    }
  ],
  transactions: [
    {
      name: 'idx_transactions_store_date',
      columns: '(store_id, created_at)',
      description: 'Store transaction history'
    }
  ],
  user_invite_analytics: [
    {
      name: 'idx_user_invite_analytics_user_event',
      columns: '(user_id, event_type)',
      description: 'User analytics dashboard'
    }
  ],
  store_invite_analytics: [
    {
      name: 'idx_store_invite_analytics_store_event',
      columns: '(store_id, event_type)',
      description: 'Store analytics dashboard'
    }
  ],
  stores: [
    {
      name: 'idx_stores_user_verified',
      columns: '(user_id, sijil_verified)',
      description: 'Store profile verification'
    }
  ]
};

async function checkTableExists(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    return !error; // If no error, table exists
  } catch (error) {
    return false;
  }
}

async function createIndexForTable(tableName, indexes) {
  console.log(`\n📋 Creating indexes for table: ${tableName}`);
  
  for (const index of indexes) {
    try {
      console.log(`  Creating: ${index.name}`);
      console.log(`  Purpose: ${index.description}`);
      
      // Use direct SQL execution through rpc or create a simple index first
      const sql = `CREATE INDEX IF NOT EXISTS ${index.name} ON ${tableName}${index.columns}`;
      
      // Try to execute via Supabase (non-concurrent first for testing)
      const { error } = await supabase.rpc('exec_sql', { sql });
      
      if (error) {
        console.log(`  ⚠️ RPC failed, trying direct connection method...`);
        console.log(`  SQL to run manually: ${sql}`);
      } else {
        console.log(`  ✅ Created successfully: ${index.name}`);
      }
      
    } catch (error) {
      console.error(`  ❌ Error creating ${index.name}:`, error.message);
    }
  }
}

async function createMissingTables() {
  console.log('\n🔧 Checking for missing essential tables...');
  
  // Check if orders table exists
  const ordersExists = await checkTableExists('orders');
  if (!ordersExists) {
    console.log('❌ Orders table missing - creating basic structure...');
    
    const createOrdersSQL = `
      CREATE TABLE IF NOT EXISTS orders (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id),
        store_id UUID REFERENCES stores(id),
        project_id UUID REFERENCES projects(id),
        order_number TEXT UNIQUE NOT NULL,
        status TEXT DEFAULT 'pending',
        payment_status TEXT DEFAULT 'pending',
        total_amount DECIMAL(10,2) DEFAULT 0,
        subtotal DECIMAL(10,2) DEFAULT 0,
        tax_amount DECIMAL(10,2) DEFAULT 0,
        shipping_amount DECIMAL(10,2) DEFAULT 0,
        discount_amount DECIMAL(10,2) DEFAULT 0,
        currency TEXT DEFAULT 'SAR',
        delivery_type TEXT DEFAULT 'standard',
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: createOrdersSQL });
      if (error) {
        console.log('⚠️ Could not create orders table via RPC. SQL to run manually:');
        console.log(createOrdersSQL);
      } else {
        console.log('✅ Orders table created');
      }
    } catch (error) {
      console.log('⚠️ Error creating orders table:', error.message);
    }
  }
  
  // Check if order_items table exists
  const orderItemsExists = await checkTableExists('order_items');
  if (!orderItemsExists) {
    console.log('❌ Order items table missing - creating basic structure...');
    
    const createOrderItemsSQL = `
      CREATE TABLE IF NOT EXISTS order_items (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
        product_id UUID REFERENCES products(id),
        quantity INTEGER NOT NULL DEFAULT 1,
        price DECIMAL(10,2) NOT NULL,
        total_price DECIMAL(10,2) GENERATED ALWAYS AS (quantity * price) STORED,
        has_warranty BOOLEAN DEFAULT FALSE,
        warranty_duration_months INTEGER,
        warranty_notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: createOrderItemsSQL });
      if (error) {
        console.log('⚠️ Could not create order_items table via RPC. SQL to run manually:');
        console.log(createOrderItemsSQL);
      } else {
        console.log('✅ Order items table created');
      }
    } catch (error) {
      console.log('⚠️ Error creating order_items table:', error.message);
    }
  }
  
  // Check if transactions table exists (if you need it)
  const transactionsExists = await checkTableExists('transactions');
  if (!transactionsExists) {
    console.log('❌ Transactions table missing - will skip transactions indexes');
  }
}

async function main() {
  console.log('🚀 Starting table check and index creation...\n');
  
  // First, create missing essential tables
  await createMissingTables();
  
  console.log('\n📊 Checking existing tables and creating indexes...\n');
  
  for (const [tableName, indexes] of Object.entries(tableIndexes)) {
    const tableExists = await checkTableExists(tableName);
    
    if (tableExists) {
      console.log(`✅ Table exists: ${tableName}`);
      await createIndexForTable(tableName, indexes);
    } else {
      console.log(`❌ Table missing: ${tableName} - skipping indexes`);
    }
    
    // Small delay between tables
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n🎉 Table check and index creation completed!');
  console.log('\n📝 Summary:');
  console.log('- Checked all required tables');
  console.log('- Created indexes for existing tables only');
  console.log('- Provided SQL for manual execution where needed');
  console.log('\n💡 If any indexes failed, run the SQL commands manually in Supabase Dashboard');
}

// Export SQL commands for manual execution
function exportManualSQL() {
  console.log('\n📋 MANUAL SQL COMMANDS (for Supabase Dashboard):');
  console.log('='.repeat(50));
  
  for (const [tableName, indexes] of Object.entries(tableIndexes)) {
    console.log(`\n-- Indexes for ${tableName} table:`);
    for (const index of indexes) {
      console.log(`CREATE INDEX IF NOT EXISTS ${index.name} ON ${tableName}${index.columns}; -- ${index.description}`);
    }
  }
  
  console.log('\n-- Run these commands in Supabase > SQL Editor');
  console.log('-- Note: Remove CONCURRENTLY for initial testing');
}

// Run the script
if (process.argv.includes('--sql-only')) {
  exportManualSQL();
} else {
  main().catch(console.error);
}
