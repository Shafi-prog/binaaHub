// Test Supabase connection directly
// Run this with: node test-supabase-connection.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔗 Testing Supabase Connection...');
console.log('URL:', supabaseUrl);
console.log('Has Anon Key:', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('🔍 Testing basic connection...');
    
    // Test 1: Check if we can reach Supabase
    const { data, error } = await supabase
      .from('stores')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Connection failed:');
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error hint:', error.hint);
      console.error('Error details:', error.details);
      
      // Check if it's a table not found error
      if (error.code === 'PGRST116' || error.message.includes('relation "public.stores" does not exist')) {
        console.log('\n💡 This error means the stores table doesn\'t exist yet.');
        console.log('👉 Please apply the SQL migration from MINIMAL_STORES_SETUP.sql');
        console.log('👉 Go to: https://supabase.com/dashboard/project/lqhopwohuddhapkhhikf/sql');
      }
      return;
    } else {
      console.log('✅ Connection successful!');
      console.log('Data:', data);
    }
    
    // Test 2: Try to fetch actual stores
    console.log('\n🔍 Testing stores query...');
    const { data: stores, error: storesError } = await supabase
      .from('stores')
      .select('*')
      .eq('is_active', true)
      .limit(5);
    
    if (storesError) {
      console.error('❌ Stores query failed:');
      console.error('Error:', storesError.message);
    } else {
      console.log('✅ Stores query successful!');
      console.log(`Found ${stores.length} stores`);
      stores.forEach(store => {
        console.log(`- ${store.store_name} (${store.city})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testConnection().catch(console.error);
