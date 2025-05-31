// Test database connection and check existing tables
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lqhopwohuddhapkhhikf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxaG9wd29odWRkaGFwa2hoaWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5Njc1NjQsImV4cCI6MjA1OTU0MzU2NH0.Zze96fAMkynERwRFhyMF-F6_ds5WcwGckLD0qGQD9JQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('stores')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Stores table error:', error.message);
      console.log('📋 Error details:', error);
      
      // Check if it's a table doesn't exist error
      if (error.message.includes('relation "stores" does not exist')) {
        console.log('🔧 The stores table does not exist. Need to run migrations.');
        return 'tables_missing';
      } else if (error.message.includes('policy')) {
        console.log('🔒 RLS policy issue detected. Need to fix policies.');
        return 'rls_policy_issue';
      }
    } else {
      console.log('✅ Stores table exists and accessible');
      console.log('📊 Query result:', data);
      return 'success';
    }
  } catch (err) {
    console.log('💥 Connection error:', err.message);
    return 'connection_error';
  }
}

testConnection().then(result => {
  console.log('🎯 Test result:', result);
  process.exit(0);
});
