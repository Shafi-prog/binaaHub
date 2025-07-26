const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '✅ Set' : '❌ Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Expected schema definition
const expectedSchema = {
  material_prices: {
    columns: [
      { name: 'id', type: 'SERIAL PRIMARY KEY' },
      { name: 'product_name', type: 'VARCHAR(255) NOT NULL' },
      { name: 'category', type: 'VARCHAR(100) NOT NULL' },
      { name: 'price', type: 'DECIMAL(10,2) NOT NULL' },
      { name: 'price_change_percentage', type: 'DECIMAL(5,2) DEFAULT 0' },
      { name: 'store_name', type: 'VARCHAR(255) NOT NULL' },
      { name: 'city', type: 'VARCHAR(100) NOT NULL' },
      { name: 'last_updated', type: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()' },
      { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()' }
    ],
    sampleData: [
      { product_name: "طن حديد", category: "معادن", price: 450, price_change_percentage: 12.5, store_name: "شركة الخليج للحديد", city: "الرياض" },
      { product_name: "كيلو نحاس", category: "معادن", price: 8.75, price_change_percentage: -3.2, store_name: "عالم المعادن", city: "دبي" },
      { product_name: "طن ألمونيوم", category: "معادن", price: 2100, price_change_percentage: 5.8, store_name: "المنارة للمعادن", city: "الكويت" },
      { product_name: "كيس إسمنت 50كغ", category: "مواد بناء", price: 18.5, price_change_percentage: 3.4, store_name: "أساتذة البناء", city: "الرياض" },
      { product_name: "طن رمل", category: "مواد بناء", price: 45, price_change_percentage: 5.2, store_name: "البناء بلس", city: "دبي" }
    ]
  },
  user_profiles: {
    columns: [
      { name: 'id', type: 'SERIAL PRIMARY KEY' },
      { name: 'user_id', type: 'VARCHAR(255) UNIQUE NOT NULL' },
      { name: 'email', type: 'VARCHAR(255) UNIQUE NOT NULL' },
      { name: 'display_name', type: 'VARCHAR(255) NOT NULL' },
      { name: 'city', type: 'VARCHAR(100)' },
      { name: 'account_type', type: 'VARCHAR(50) DEFAULT \'free\'' },
      { name: 'loyalty_points', type: 'INTEGER DEFAULT 0' },
      { name: 'current_level', type: 'INTEGER DEFAULT 1' },
      { name: 'total_spent', type: 'DECIMAL(12,2) DEFAULT 0' },
      { name: 'role', type: 'VARCHAR(50) DEFAULT \'user\'' },
      { name: 'member_since', type: 'DATE DEFAULT CURRENT_DATE' },
      { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()' },
      { name: 'updated_at', type: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()' }
    ],
    sampleData: [
      { user_id: 'test-user-1', email: 'user@binna.com', display_name: 'مستخدم تجريبي', city: 'الرياض', account_type: 'free', loyalty_points: 1250, current_level: 3, total_spent: 15750, role: 'user' },
      { user_id: 'test-admin-1', email: 'admin@binna.com', display_name: 'المسئول تجريبي', city: 'الرياض', account_type: 'premium', loyalty_points: 5000, current_level: 5, total_spent: 50000, role: 'admin' }
    ]
  },
  stores: {
    columns: [
      { name: 'id', type: 'SERIAL PRIMARY KEY' },
      { name: 'user_id', type: 'VARCHAR(255)' },
      { name: 'store_name', type: 'VARCHAR(255) NOT NULL' },
      { name: 'owner_name', type: 'VARCHAR(255)' },
      { name: 'email', type: 'VARCHAR(255)' },
      { name: 'phone', type: 'VARCHAR(20)' },
      { name: 'business_type', type: 'VARCHAR(100)' },
      { name: 'description', type: 'TEXT' },
      { name: 'rating', type: 'DECIMAL(3,2) DEFAULT 0' },
      { name: 'review_count', type: 'INTEGER DEFAULT 0' },
      { name: 'total_sales', type: 'DECIMAL(15,2) DEFAULT 0' },
      { name: 'total_orders', type: 'INTEGER DEFAULT 0' },
      { name: 'verification_status', type: 'VARCHAR(50) DEFAULT \'pending\'' },
      { name: 'location', type: 'JSONB' },
      { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()' },
      { name: 'updated_at', type: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()' }
    ],
    sampleData: [
      { user_id: 'test-store-1', store_name: 'متجر مواد البناء الحديث', owner_name: 'متجر تجريبي', email: 'store@binna.com', phone: '+966501234567', business_type: 'building_materials', description: 'متجر متخصص في بيع مواد البناء والتشطيب', rating: 4.5, review_count: 234, total_sales: 1250000.00, total_orders: 567, verification_status: 'verified', location: { city: 'الرياض', area: 'الصناعية' } }
    ]
  },
  orders: {
    columns: [
      { name: 'id', type: 'SERIAL PRIMARY KEY' },
      { name: 'user_id', type: 'VARCHAR(255)' },
      { name: 'order_number', type: 'VARCHAR(100) UNIQUE NOT NULL' },
      { name: 'status', type: 'VARCHAR(50) DEFAULT \'pending\'' },
      { name: 'total_amount', type: 'DECIMAL(12,2) NOT NULL' },
      { name: 'currency', type: 'VARCHAR(3) DEFAULT \'SAR\'' },
      { name: 'items', type: 'JSONB' },
      { name: 'payment_method', type: 'VARCHAR(50)' },
      { name: 'payment_status', type: 'VARCHAR(50) DEFAULT \'pending\'' },
      { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()' },
      { name: 'updated_at', type: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()' }
    ],
    sampleData: [
      { user_id: 'test-user-1', order_number: 'ORD-2025-001', status: 'delivered', total_amount: 1250.00, currency: 'SAR', items: [{ name: 'إسمنت أبيض', quantity: 10, price: 125.00 }], payment_method: 'card', payment_status: 'paid' },
      { user_id: 'test-user-1', order_number: 'ORD-2025-002', status: 'processing', total_amount: 850.00, currency: 'SAR', items: [{ name: 'رمل ناعم', quantity: 5, price: 170.00 }], payment_method: 'transfer', payment_status: 'paid' }
    ]
  }
};

async function checkCurrentSchema() {
  console.log('📊 Checking current database schema...');
  const results = {
    currentSchema: {},
    missingTables: [],
    missingColumns: {},
    errors: []
  };

  for (const tableName of Object.keys(expectedSchema)) {
    try {
      // Check if table exists by trying to select from it
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      if (error) {
        if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
          results.missingTables.push(tableName);
          console.log(`❌ Table '${tableName}' does not exist`);
        } else {
          results.errors.push(`Error checking table ${tableName}: ${error.message}`);
        }
      } else {
        results.currentSchema[tableName] = {
          exists: true,
          recordCount: count || 0
        };
        console.log(`✅ Table '${tableName}' exists with ${count || 0} records`);

        // Check columns by trying to select specific columns
        await checkTableColumns(tableName, results);
      }
    } catch (error) {
      results.missingTables.push(tableName);
      console.log(`❌ Error checking table '${tableName}': ${error.message}`);
    }
  }

  return results;
}

async function checkTableColumns(tableName, results) {
  const expectedColumns = expectedSchema[tableName].columns;
  const missingColumns = [];

  for (const column of expectedColumns) {
    try {
      // Try to select the specific column
      const { error } = await supabase
        .from(tableName)
        .select(column.name)
        .limit(1);

      if (error && error.message.includes('column') && error.message.includes('does not exist')) {
        missingColumns.push(column);
        console.log(`❌ Column '${column.name}' missing from table '${tableName}'`);
      }
    } catch (error) {
      // Column might be missing
      missingColumns.push(column);
    }
  }

  if (missingColumns.length > 0) {
    results.missingColumns[tableName] = missingColumns;
  }
}

async function insertSampleData(schemaResults) {
  console.log('📊 Inserting sample data...');
  const results = [];

  for (const [tableName, schema] of Object.entries(expectedSchema)) {
    if (schemaResults.currentSchema[tableName]?.exists) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .upsert(schema.sampleData.map(item => ({
            ...item,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })));

        if (!error) {
          console.log(`✅ Sample data inserted into '${tableName}'`);
          results.push({ table: tableName, status: 'success', records: schema.sampleData.length });
        } else {
          console.log(`❌ Error inserting data into ${tableName}: ${error.message}`);
          results.push({ table: tableName, status: 'error', error: error.message });
        }
      } catch (error) {
        console.log(`❌ Error inserting sample data into ${tableName}: ${error.message}`);
        results.push({ table: tableName, status: 'error', error: error.message });
      }
    } else {
      console.log(`⚠️ Skipping ${tableName} - table does not exist`);
      results.push({ table: tableName, status: 'skipped', reason: 'table does not exist' });
    }
  }

  return results;
}

async function fetchDataSamples(schemaResults) {
  console.log('🔍 Fetching data samples...');
  const results = {};

  for (const tableName of Object.keys(expectedSchema)) {
    if (schemaResults.currentSchema[tableName]?.exists) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(5);

        if (!error && data) {
          results[tableName] = data;
          console.log(`✅ Fetched ${data.length} records from '${tableName}'`);
          
          // Display sample data
          if (data.length > 0) {
            console.log(`📋 Sample from ${tableName}:`);
            data.slice(0, 2).forEach((row, index) => {
              console.log(`   ${index + 1}. ${JSON.stringify(row, null, 2).substring(0, 200)}...`);
            });
          }
        } else if (error) {
          console.log(`❌ Error fetching from ${tableName}: ${error.message}`);
        }
      } catch (error) {
        console.log(`❌ Error fetching sample data from ${tableName}: ${error.message}`);
      }
    }
  }

  return results;
}

function generateCreateTableSQL() {
  console.log('📝 Generating CREATE TABLE SQL statements...');
  let sql = '-- Binna Platform Database Schema\n';
  sql += '-- Generated on: ' + new Date().toISOString() + '\n\n';
  
  for (const [tableName, schema] of Object.entries(expectedSchema)) {
    sql += `-- Create ${tableName} table\n`;
    sql += `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;
    sql += schema.columns.map(col => `  ${col.name} ${col.type}`).join(',\n');
    sql += '\n);\n\n';
  }
  
  return sql;
}

async function main() {
  console.log('🚀 Starting Binna Database Management...');
  console.log('='.repeat(50));

  try {
    // Step 1: Check current schema
    const schemaResults = await checkCurrentSchema();
    
    console.log('\n📊 Schema Analysis Results:');
    console.log(`✅ Existing tables: ${Object.keys(schemaResults.currentSchema).length}`);
    console.log(`❌ Missing tables: ${schemaResults.missingTables.length}`);
    console.log(`⚠️ Tables with missing columns: ${Object.keys(schemaResults.missingColumns).length}`);

    if (schemaResults.missingTables.length > 0) {
      console.log('\n❌ Missing Tables:');
      schemaResults.missingTables.forEach(table => {
        console.log(`   - ${table}`);
      });
    }

    if (Object.keys(schemaResults.missingColumns).length > 0) {
      console.log('\n⚠️ Missing Columns:');
      Object.entries(schemaResults.missingColumns).forEach(([table, columns]) => {
        console.log(`   ${table}:`);
        columns.forEach(col => {
          console.log(`     - ${col.name} (${col.type})`);
        });
      });
    }

    // Step 2: Insert sample data
    const insertResults = await insertSampleData(schemaResults);

    // Step 3: Fetch data samples
    const sampleData = await fetchDataSamples(schemaResults);

    // Step 4: Generate SQL for missing tables
    if (schemaResults.missingTables.length > 0) {
      console.log('\n📝 SQL Script for Missing Tables:');
      console.log('='.repeat(50));
      const sql = generateCreateTableSQL();
      console.log(sql);
      console.log('='.repeat(50));
      console.log('\n🔧 To create missing tables:');
      console.log('1. Go to https://qghcdswwagbwqqqtcrfq.supabase.co');
      console.log('2. Open SQL Editor');
      console.log('3. Copy the SQL above and execute it');
    }

    // Summary
    console.log('\n📈 Final Summary:');
    console.log('='.repeat(50));
    console.log(`✅ Working tables: ${Object.keys(sampleData).length}`);
    console.log(`📊 Total records found: ${Object.values(sampleData).reduce((sum, data) => sum + data.length, 0)}`);
    
    if (schemaResults.errors.length > 0) {
      console.log(`❌ Errors encountered: ${schemaResults.errors.length}`);
      schemaResults.errors.forEach(error => {
        console.log(`   - ${error}`);
      });
    }

    console.log('\n🎉 Database management completed!');
    console.log('💡 Tip: Visit http://localhost:3000/database-management for a detailed web interface');

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  checkCurrentSchema,
  insertSampleData,
  fetchDataSamples,
  generateCreateTableSQL,
  expectedSchema
};
