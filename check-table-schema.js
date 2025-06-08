// Check actual table schema
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lqhopwohuddhapkhhikf.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxaG9wd29odWRkaGFwa2hoaWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5Njc1NjQsImV4cCI6MjA1OTU0MzU2NH0.Zze96fAMkynERwRFhyMF-F6_ds5WcwGckLD0qGQD9JQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkTableSchema() {
  console.log('🔍 Checking projects table schema...');
  
  // Try to get schema information
  const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'projects' }).single();
  
  if (error) {
    console.log('❌ Could not get schema via RPC, trying direct query...');
    
    // Try a select with limit 0 to get column info
    const { data: testData, error: testError } = await supabase
      .from('projects')
      .select('*')
      .limit(0);
      
    if (testError) {
      console.error('❌ Test query failed:', testError.message);
    } else {
      console.log('✅ Test query successful - columns available');
    }
    
    // Try individual known columns
    const knownColumns = [
      'id', 'user_id', 'name', 'description', 'project_type', 
      'location', 'address', 'status', 'start_date', 'end_date',
      'expected_completion_date', 'budget', 'actual_cost', 
      'is_active', 'created_at', 'updated_at'
    ];
    
    console.log('\n📋 Testing individual columns:');
    for (const column of knownColumns) {
      try {
        const { error: colError } = await supabase
          .from('projects')
          .select(column)
          .limit(0);
          
        if (colError) {
          console.log(`❌ ${column}: ${colError.message}`);
        } else {
          console.log(`✅ ${column}: exists`);
        }
      } catch (e) {
        console.log(`❌ ${column}: ${e.message}`);
      }
    }
  } else {
    console.log('✅ Schema data:', data);
  }
}

checkTableSchema().catch(console.error);
