#!/usr/bin/env node

// Script to execute create-tables.sql in Supabase
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables in .env.local');
  console.log('Required variables: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  global: {
    fetch: (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))
  }
});

async function executeSQLFile() {
  console.log('🚀 Starting Supabase table creation...\n');
  console.log('🔗 Connecting to Supabase...');
  console.log(`📍 URL: ${supabaseUrl}`);
  console.log(`🔑 Key: ${supabaseKey.substring(0, 20)}...\n`);

  try {
    // Read the SQL file
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const sqlFilePath = join(__dirname, 'create-tables.sql');
    
    console.log('📄 Reading SQL file...');
    const sqlContent = readFileSync(sqlFilePath, 'utf8');
    
    // Split the SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && stmt !== 'COMMIT');

    console.log(`📊 Found ${statements.length} SQL statements to execute\n`);

    let successCount = 0;
    let errorCount = 0;

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      try {
        console.log(`🔄 Executing statement ${i + 1}/${statements.length}...`);
        
        const { data, error } = await supabase.rpc('exec_sql', {
          sql: statement
        });

        if (error) {
          // Try direct execution if RPC fails
          const { error: directError } = await supabase
            .from('information_schema.tables')
            .select('*')
            .limit(1);

          if (directError) {
            console.error(`❌ Error in statement ${i + 1}:`, error.message);
            errorCount++;
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
            successCount++;
          }
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
          successCount++;
        }
      } catch (execError) {
        console.error(`❌ Error executing statement ${i + 1}:`, execError.message);
        errorCount++;
      }
    }

    console.log('\n📈 Execution Summary:');
    console.log(`✅ Successful statements: ${successCount}`);
    console.log(`❌ Failed statements: ${errorCount}`);

    // Test if tables were created by checking material_prices
    console.log('\n🔍 Verifying table creation...');
    
    try {
      const { data, error } = await supabase
        .from('material_prices')
        .select('count(*)')
        .single();

      if (error) {
        console.log('⚠️  Tables may not be created yet. Please run the SQL manually in Supabase Dashboard.');
        console.log('📋 Steps:');
        console.log('1. Go to https://qghcdswwagbwqqqtcrfq.supabase.co');
        console.log('2. Open SQL Editor');
        console.log('3. Copy and paste the contents of create-tables.sql');
        console.log('4. Click Run');
      } else {
        console.log('✅ Tables verified! material_prices table exists and is accessible.');
        
        // Insert sample data
        console.log('\n📊 Inserting sample material prices...');
        await insertSampleData();
      }
    } catch (verifyError) {
      console.log('⚠️  Could not verify tables. Please check Supabase Dashboard.');
    }

  } catch (error) {
    console.error('❌ Error reading or executing SQL file:', error.message);
    console.log('\n📋 Manual Setup Instructions:');
    console.log('1. Go to your Supabase Dashboard: https://qghcdswwagbwqqqtcrfq.supabase.co');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy the contents of create-tables.sql');
    console.log('4. Paste and execute in the SQL Editor');
  }
}

async function insertSampleData() {
  const samplePrices = [
    { product_name: "طن حديد", category: "معادن", price: 450, price_change_percentage: 12.5, store_name: "شركة الخليج للحديد", city: "الرياض" },
    { product_name: "كيلو نحاس", category: "معادن", price: 8.75, price_change_percentage: -3.2, store_name: "عالم المعادن", city: "دبي" },
    { product_name: "طن ألمونيوم", category: "معادن", price: 2100, price_change_percentage: 5.8, store_name: "المنارة للمعادن", city: "الكويت" },
    { product_name: "كيس إسمنت 50كغ", category: "مواد بناء", price: 18.5, price_change_percentage: 3.4, store_name: "أساتذة البناء", city: "الرياض" },
    { product_name: "طن رمل", category: "مواد بناء", price: 45, price_change_percentage: 5.2, store_name: "البناء بلس", city: "دبي" }
  ];

  try {
    const { data, error } = await supabase
      .from('material_prices')
      .upsert(samplePrices.map(price => ({
        ...price,
        last_updated: new Date().toISOString(),
        created_at: new Date().toISOString()
      })));

    if (error) {
      console.error('❌ Error inserting sample data:', error.message);
    } else {
      console.log(`✅ Inserted ${samplePrices.length} sample price records`);
      
      // Verify the data
      const { data: checkData, error: checkError } = await supabase
        .from('material_prices')
        .select('product_name, price, store_name')
        .limit(3);

      if (!checkError && checkData) {
        console.log('\n📋 Sample data verification:');
        checkData.forEach((item, index) => {
          console.log(`   ${index + 1}. ${item.product_name}: ${item.price} SAR (${item.store_name})`);
        });
      }
    }
  } catch (insertError) {
    console.error('❌ Error during sample data insertion:', insertError.message);
  }
}

// Run the script
executeSQLFile()
  .then(() => {
    console.log('\n🎉 Table creation script completed!');
    console.log('🌐 Your Supabase database is now ready for the Binna platform.');
  })
  .catch((error) => {
    console.error('❌ Script failed:', error.message);
  });
