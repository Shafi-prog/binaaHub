#!/usr/bin/env node

/**
 * Quick Database Column Check
 * Check what columns actually exist in the projects table
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabaseColumns() {
  console.log('🔍 Checking Database Columns');
  console.log('============================');
  
  try {    // Try to get a sample project to see what columns exist
    const { data: sampleProjects, error: sampleError } = await supabase
      .from('projects')
      .select('*')
      .limit(1);    
    if (sampleError) {
      console.error('❌ Sample query failed:', sampleError.message);
      return;
    }
    
    if (sampleProjects && sampleProjects.length > 0) {
      const sampleProject = sampleProjects[0];
      console.log('📊 Available columns in projects table:');
      console.log('=====================================');
      
      const columns = Object.keys(sampleProject);
      columns.forEach((col, index) => {
        const value = sampleProject[col];
        const type = typeof value;
        console.log(`${(index + 1).toString().padStart(2)}. ${col.padEnd(25)} | ${type.padEnd(15)} | ${value === null ? 'NULL' : 'HAS_VALUE'}`);
      });
      
      // Check for key date columns
      const dateColumns = columns.filter(col => col.includes('date'));
      console.log('\n📅 Date-related columns:');
      dateColumns.forEach(col => {
        console.log(`  - ${col}: ${typeof sampleProject[col]} = ${sampleProject[col]}`);
      });
    } else {
      console.log('📊 No projects found in database');
    }
    
    // Test a simple query to verify access
    console.log('\n🧪 Testing simple projects query...');
    const { data: testData, error: testError } = await supabase
      .from('projects')
      .select('id, name, user_id, created_at')
      .limit(1);
    
    if (testError) {
      console.error('❌ Simple query failed:', testError.message);
    } else {
      console.log('✅ Simple query successful');
      console.log(`📊 Found ${testData?.length || 0} projects`);
    }
    
    // Test query with the fields our code expects
    console.log('\n🧪 Testing getProjectById field query...');
    const { data: fieldTest, error: fieldError } = await supabase
      .from('projects')
      .select(`
        id, user_id, name, description, project_type, location, 
        address, city, region, district, country, status, priority, start_date, 
        expected_completion_date, actual_completion_date, budget, metadata, is_active, created_at, updated_at,
        location_lat, location_lng, image_url, progress_percentage, actual_cost, currency
      `)
      .limit(1);
    
    if (fieldError) {
      console.error('❌ Field query failed:', fieldError.message);
      console.error('   This explains why getProjectById is failing!');
      
      // Find the problematic fields
      const queryFields = [
        'id', 'user_id', 'name', 'description', 'project_type', 'location', 
        'address', 'city', 'region', 'district', 'country', 'status', 'priority', 'start_date', 
        'expected_completion_date', 'actual_completion_date', 'budget', 'metadata', 'is_active', 'created_at', 'updated_at',
        'location_lat', 'location_lng', 'image_url', 'progress_percentage', 'actual_cost', 'currency'
      ];
      
      const existingFields = columns.map(col => col.column_name);
      const missingFields = queryFields.filter(field => !existingFields.includes(field));
      
      console.log('\n❌ Missing fields in database:');
      missingFields.forEach(field => {
        console.log(`  - ${field}`);
      });
      
      console.log('\n🔧 Available alternatives:');
      existingFields.filter(field => field.includes('date')).forEach(field => {
        console.log(`  - ${field}`);
      });
      
    } else {
      console.log('✅ Field query successful');
      console.log('📊 All expected fields exist in database');
    }
    
  } catch (error) {
    console.error('\n❌ Unexpected error:', error.message);
  }
}

checkDatabaseColumns().catch(console.error);
