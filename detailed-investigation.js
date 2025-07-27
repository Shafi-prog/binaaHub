require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function detailedInvestigation() {
  console.log('🕵️ Detailed RLS Investigation...');
  console.log('📍 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  
  // Test 1: Try to query policies directly
  console.log('\n=== 1. CHECKING RLS POLICIES ===');
  try {
    const { data, error } = await supabase
      .rpc('get_policies_info');
    
    if (error) {
      console.log('❌ Cannot call get_policies_info RPC:', error.message);
    } else {
      console.log('✅ RPC available:', data);
    }
  } catch (err) {
    console.log('❌ RPC call failed:', err.message);
  }

  // Test 2: Try raw SQL to see policies
  console.log('\n=== 2. RAW SQL POLICY CHECK ===');
  try {
    const { data, error } = await supabase
      .from('pg_policies')
      .select('tablename, policyname, qual')
      .eq('schemaname', 'public');
    
    if (error) {
      console.log('❌ Cannot access pg_policies:', error.message);
    } else {
      console.log('✅ Current policies found:', data?.length || 0);
      data?.forEach(policy => {
        console.log(`  📋 ${policy.tablename}.${policy.policyname}: ${policy.qual}`);
      });
    }
  } catch (err) {
    console.log('❌ pg_policies access failed:', err.message);
  }

  // Test 3: Check table structure
  console.log('\n=== 3. TABLE STRUCTURE CHECK ===');
  const tables = ['user_profiles', 'orders', 'construction_projects', 'warranties', 'invoices'];
  
  for (const table of tables) {
    try {
      // Try to insert test data to see what happens
      const testData = {
        user_id: 'user@binna',
        display_name: 'Test User',
        email: 'test@binna.com'
      };
      
      if (table === 'user_profiles') {
        const { error: insertError } = await supabase
          .from(table)
          .insert(testData);
        
        if (insertError) {
          console.log(`❌ ${table} INSERT ERROR: ${insertError.message}`);
          console.log(`   Details: ${insertError.details || 'No details'}`);
          console.log(`   Hint: ${insertError.hint || 'No hint'}`);
        } else {
          console.log(`✅ ${table}: Insert successful`);
        }
      }

      // Try to select with different filters
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact' })
        .limit(1);
      
      if (error) {
        console.log(`❌ ${table} SELECT ERROR: ${error.message}`);
        console.log(`   Code: ${error.code || 'No code'}`);
        console.log(`   Details: ${error.details || 'No details'}`);
        console.log(`   Hint: ${error.hint || 'No hint'}`);
      } else {
        console.log(`✅ ${table}: Query successful, count=${count}, data length=${data?.length || 0}`);
      }
    } catch (err) {
      console.log(`❌ ${table} EXCEPTION: ${err.message}`);
    }
  }

  // Test 4: Check auth status
  console.log('\n=== 4. AUTH STATUS CHECK ===');
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.log('❌ Auth error:', error.message);
    } else {
      console.log('✅ Auth user:', user ? user.id : 'No user (anonymous)');
    }
  } catch (err) {
    console.log('❌ Auth check failed:', err.message);
  }

  // Test 5: Try direct SQL query
  console.log('\n=== 5. DIRECT SQL TEST ===');
  try {
    const { data, error } = await supabase
      .rpc('sql', { 
        query: "SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('user_profiles', 'orders', 'construction_projects', 'warranties', 'invoices')" 
      });
    
    if (error) {
      console.log('❌ SQL RPC error:', error.message);
    } else {
      console.log('✅ RLS status:', data);
    }
  } catch (err) {
    console.log('❌ SQL RPC failed:', err.message);
  }
}

detailedInvestigation();
