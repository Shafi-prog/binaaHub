/**
 * Test script to verify construction_expenses and construction_categories tables
 * and debug the getSpendingByCategory error
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read environment variables from .env.local
const envPath = path.join(__dirname, '.env.local');
let supabaseUrl, supabaseAnonKey;

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envLines = envContent.split('\n');
  
  for (const line of envLines) {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1];
    }
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      supabaseAnonKey = line.split('=')[1];
    }
  }
} catch (error) {
  console.error('❌ Could not read .env.local file:', error.message);
  process.exit(1);
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConstructionTables() {
  console.log('🔧 Testing Construction Tables and getSpendingByCategory Fix');
  console.log('============================================================');

  try {
    // Step 1: Test authentication (using a test user)
    console.log('\n1️⃣ Testing authentication...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'password123'
    });

    if (authError) {
      console.log('⚠️ Auth failed, will test anonymously:', authError.message);
    } else {
      console.log('✅ Authenticated as:', authData.user?.email);
    }

    // Step 2: Check if construction_categories table exists
    console.log('\n2️⃣ Testing construction_categories table...');
    const { data: categories, error: categoriesError } = await supabase
      .from('construction_categories')
      .select('id, name, name_ar, color')
      .limit(5);

    if (categoriesError) {
      console.error('❌ construction_categories error:', categoriesError);
      console.log('Table may not exist or have incorrect structure');
    } else {
      console.log('✅ construction_categories exists');
      console.log('📊 Sample categories:', categories);
    }

    // Step 3: Check if construction_expenses table exists
    console.log('\n3️⃣ Testing construction_expenses table...');
    const { data: expenses, error: expensesError } = await supabase
      .from('construction_expenses')
      .select('id, title, amount, category_id, created_by')
      .limit(3);

    if (expensesError) {
      console.error('❌ construction_expenses error:', expensesError);
      console.log('Table may not exist or have incorrect structure');
    } else {
      console.log('✅ construction_expenses exists');
      console.log('📊 Sample expenses:', expenses);
    }

    // Step 4: Test the fixed join query
    console.log('\n4️⃣ Testing fixed join query...');
    const testUserId = authData?.user?.id || 'test-user-id';
    
    const { data: joinData, error: joinError } = await supabase
      .from('construction_expenses')
      .select(`
        id, amount, category_id,
        construction_categories!category_id(id, name, name_ar, color)
      `)
      .eq('created_by', testUserId)
      .limit(3);

    if (joinError) {
      console.error('❌ Join query error:', joinError);
      console.log('The getSpendingByCategory fix may need further adjustment');
    } else {
      console.log('✅ Join query works');
      console.log('📊 Join result:', JSON.stringify(joinData, null, 2));
    }

    // Step 5: Test alternative join syntax
    console.log('\n5️⃣ Testing alternative join syntax...');
    const { data: altJoinData, error: altJoinError } = await supabase
      .from('construction_expenses')
      .select(`
        id, amount, category_id,
        construction_categories(id, name, name_ar, color)
      `)
      .eq('created_by', testUserId)
      .limit(3);

    if (altJoinError) {
      console.error('❌ Alternative join error:', altJoinError);
    } else {
      console.log('✅ Alternative join works');
      console.log('📊 Alternative join result:', JSON.stringify(altJoinData, null, 2));
    }

    // Step 6: Check table schemas
    console.log('\n6️⃣ Checking table schemas...');
    
    // Check what tables exist
    const { data: tableList, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .like('table_name', '%construction%');

    if (tableError) {
      console.error('❌ Cannot check tables:', tableError);
    } else {
      console.log('📋 Construction tables found:');
      tableList?.forEach(table => console.log(`  - ${table.table_name}`));
    }

    // Step 7: Simulate the exact getSpendingByCategory logic
    console.log('\n7️⃣ Simulating getSpendingByCategory logic...');
    
    if (authData?.user) {
      console.log('Testing with authenticated user:', authData.user.id);
      
      const { data: mockData, error: mockError } = await supabase
        .from('construction_expenses')
        .select(`
          id, amount, category_id,
          construction_categories!category_id(id, name, name_ar, color)
        `)
        .eq('created_by', authData.user.id);

      if (mockError) {
        console.error('❌ Mock getSpendingByCategory error:', mockError);
        console.log('The original error in the app is likely this one');
      } else {
        console.log('✅ Mock getSpendingByCategory works');
        console.log('📊 Would return', mockData?.length || 0, 'expenses');
        
        // Simulate the grouping logic
        const categoryMap = new Map();
        for (const expense of mockData || []) {
          const categoryId = expense.category_id;
          const categoryData = expense.construction_categories;
          
          if (categoryData) {
            if (categoryMap.has(categoryId)) {
              const existing = categoryMap.get(categoryId);
              existing.total_amount += expense.amount;
              existing.transaction_count += 1;
            } else {
              categoryMap.set(categoryId, {
                category_id: categoryId,
                category_name: categoryData.name || 'Unknown',
                category_name_ar: categoryData.name_ar || 'غير معروف',
                total_amount: expense.amount,
                transaction_count: 1,
                color: categoryData.color || '#999999'
              });
            }
          }
        }
        
        const result = Array.from(categoryMap.values());
        console.log('📈 Grouped spending result:', result);
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  } finally {
    // Cleanup
    try {
      await supabase.auth.signOut();
      console.log('\n🧹 Signed out');
    } catch (signOutError) {
      console.log('⚠️ Sign out error (might not have been signed in)');
    }
  }
}

console.log('Starting construction tables test...');
testConstructionTables().then(() => {
  console.log('\n✅ Test completed');
}).catch(error => {
  console.error('❌ Test failed:', error);
});
