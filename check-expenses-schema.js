const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lqhopwohuddhapkhhikf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nYmxndnFtbXl6dnp5anBubmVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1MDUwNzksImV4cCI6MjA0OTA4MTA3OX0.8-MYQ3h5rVpepdfqaOPNMoHRSE1lE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkExpensesSchema() {
  try {
    console.log('=== Checking Construction Expenses Schema ===');
    
    // Try to insert a test expense to see which columns exist
    const { data: testInsert, error: insertError } = await supabase
      .from('construction_expenses')
      .insert({
        project_id: '00000000-0000-0000-0000-000000000001', // Dummy project ID
        category_id: (await supabase.from('construction_categories').select('id').limit(1).single()).data?.id,
        amount: 1,
        description: 'Test expense',
        expense_date: '2025-01-01'
      })
      .select()
      .single();
    
    if (insertError) {
      console.log('Insert error (shows column requirements):', insertError.message);
    } else {
      console.log('✅ Test insert successful - columns available:', Object.keys(testInsert));
      
      // Delete the test record
      await supabase.from('construction_expenses').delete().eq('id', testInsert.id);
    }
    
    // Try to query to see what columns are available
    const { data: sample, error: queryError } = await supabase
      .from('construction_expenses')
      .select('*')
      .limit(1);
    
    if (queryError) {
      console.error('Query error:', queryError.message);
    } else {
      console.log('✅ Available columns in construction_expenses:', 
        sample && sample.length > 0 ? Object.keys(sample[0]) : 'No records found, but table exists');
    }
    
  } catch (error) {
    console.error('❌ Schema check error:', error);
  }
}

checkExpensesSchema();
