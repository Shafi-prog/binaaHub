#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lqhopwohuddhapkhhikf.supabase.co';
const supabase = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function testColumns() {
  console.log('🧪 Testing which columns exist in projects table...');
  
  // Test basic columns first
  const basicColumns = ['id', 'name', 'user_id', 'description', 'project_type', 'status', 'created_at'];
  
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(basicColumns.join(', '))
      .limit(1);
    
    if (error) {
      console.log('❌ Basic query failed:', error.message);
      return;
    }
    
    console.log('✅ Basic columns work');
    
    // Now test additional columns one by one
    const additionalColumns = [
      'budget', 'start_date', 'location', 'address', 'city', 'region', 
      'priority', 'is_active', 'updated_at', 'progress_percentage',
      'actual_cost', 'currency', 'location_lat', 'location_lng',
      'expected_completion_date', 'actual_completion_date', 
      'district', 'country', 'image_url', 'metadata'
    ];
    
    const workingColumns = [...basicColumns];
    
    for (const col of additionalColumns) {
      try {
        const { data: testData, error: testError } = await supabase
          .from('projects')
          .select(`id, ${col}`)
          .limit(1);
        
        if (testError) {
          console.log(`❌ Column '${col}' does not exist`);
        } else {
          console.log(`✅ Column '${col}' exists`);
          workingColumns.push(col);
        }
      } catch (err) {
        console.log(`❌ Column '${col}' test failed:`, err.message);
      }
    }
    
    console.log('\n📊 WORKING COLUMNS:');
    console.log('==================');
    console.log(workingColumns.join(', '));
    
  } catch (err) {
    console.error('❌ Script error:', err);
  }
}

testColumns().then(() => process.exit(0));
