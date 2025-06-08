#!/usr/bin/env node

/**
 * Direct Database Schema Fix Script
 * This script connects directly to your Supabase database and fixes schema issues
 */

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function getCurrentSchema() {
  console.log('🔍 Checking current projects table structure...\n');
  
  try {
    // Try to get a sample project to understand the current schema
    const { data: sampleProject, error } = await supabase
      .from('projects')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error;
    }

    if (sampleProject) {
      console.log('📋 Current project record structure:');
      console.log('=====================================');
      Object.keys(sampleProject).forEach(key => {
        console.log(`✓ ${key}: ${typeof sampleProject[key]} (${sampleProject[key] === null ? 'NULL' : 'has value'})`);
      });
    } else {
      console.log('📋 No existing projects found. Will check table structure differently.');
      
      // Try to create a test project to understand required fields
      const testProjectData = {
        name: 'Schema Test Project',
        description: 'Test project to understand schema',
        project_type: 'residential',
        status: 'planning'
      };

      console.log('\n🧪 Testing project creation with minimal fields...');
      const { data: testProject, error: createError } = await supabase
        .from('projects')
        .insert(testProjectData)
        .select()
        .single();

      if (createError) {
        console.log('❌ Error creating test project:', createError.message);
        console.log('   This helps us understand what fields are required/missing');
        
        // Parse the error to understand missing fields
        if (createError.message.includes('column') && createError.message.includes('does not exist')) {
          const missingColumn = createError.message.match(/column "([^"]+)"/);
          if (missingColumn) {
            console.log(`   Missing column detected: ${missingColumn[1]}`);
          }
        }
      } else {
        console.log('✅ Test project created successfully');
        console.log('📋 Test project structure:');
        Object.keys(testProject).forEach(key => {
          console.log(`✓ ${key}: ${typeof testProject[key]}`);
        });
        
        // Clean up test project
        await supabase.from('projects').delete().eq('id', testProject.id);
        console.log('🧹 Test project cleaned up');
      }
    }

    return true;
  } catch (error) {
    console.error('❌ Error checking schema:', error.message);
    return false;
  }
}

async function testProjectCreation() {
  console.log('\n🧪 Testing project creation with expected schema...\n');
  
  // Test with the schema we expect based on our code
  const testProjects = [
    {
      name: 'Test Project 1',
      description: 'Testing with minimal fields',
      project_type: 'residential',
      status: 'planning'
    },
    {
      name: 'Test Project 2', 
      description: 'Testing with all expected fields',
      project_type: 'commercial',
      status: 'planning',
      address: '123 Test Street, Riyadh',
      budget: 500000,
      start_date: '2025-07-01',
      end_date: '2025-12-31',
      currency: 'SAR',
      priority: 'medium'
    }
  ];

  for (let i = 0; i < testProjects.length; i++) {
    const testData = testProjects[i];
    console.log(`Testing project ${i + 1}: ${testData.name}`);
    
    try {
      const { data: project, error } = await supabase
        .from('projects')
        .insert(testData)
        .select()
        .single();

      if (error) {
        console.log(`❌ Failed: ${error.message}`);
        
        // Try to identify the specific issue
        if (error.message.includes('column') && error.message.includes('does not exist')) {
          const match = error.message.match(/column "([^"]+)"/);
          if (match) {
            console.log(`   Problem: Column "${match[1]}" does not exist in database`);
          }
        } else if (error.message.includes('null value')) {
          const match = error.message.match(/column "([^"]+)"/);
          if (match) {
            console.log(`   Problem: Column "${match[1]}" requires a value`);
          }
        }
      } else {
        console.log(`✅ Success: Project created with ID ${project.id}`);
        
        // Clean up
        await supabase.from('projects').delete().eq('id', project.id);
        console.log('   🧹 Test project cleaned up');
      }
    } catch (error) {
      console.log(`❌ Unexpected error: ${error.message}`);
    }
    
    console.log('');
  }
}

async function testWithCorrectSchema() {
  console.log('🔧 Testing with database-correct schema...\n');
  
  // Based on the error we saw earlier, the database expects these fields
  const correctedTestData = {
    name: 'Schema Corrected Test Project',
    description: 'Testing with corrected schema',
    project_type: 'residential',
    status: 'planning',
    // Using old field names that the database actually has
    location: '123 Test Street, Riyadh',  // instead of address
    expected_completion_date: '2025-12-31', // instead of end_date
    budget_estimate: 500000, // instead of budget
    priority: 'medium',
    start_date: '2025-07-01',
    progress_percentage: 0,
    is_active: true,
    currency: 'SAR'
  };

  try {
    console.log('Testing with corrected field names...');
    const { data: project, error } = await supabase
      .from('projects')
      .insert(correctedTestData)
      .select()
      .single();

    if (error) {
      console.log(`❌ Still failed: ${error.message}`);
      
      // Let's try without the problematic fields
      const minimalData = {
        name: 'Minimal Test Project',
        description: 'Testing with absolute minimal fields',
        project_type: 'residential',
        status: 'planning'
      };
      
      console.log('\nTrying with absolute minimal data...');
      const { data: minProject, error: minError } = await supabase
        .from('projects')
        .insert(minimalData)
        .select()
        .single();

      if (minError) {
        console.log(`❌ Minimal test failed: ${minError.message}`);
      } else {
        console.log(`✅ Minimal test succeeded! Project ID: ${minProject.id}`);
        console.log('📋 Successful project structure:');
        Object.keys(minProject).forEach(key => {
          console.log(`   ${key}: ${minProject[key]}`);
        });
        
        // Clean up
        await supabase.from('projects').delete().eq('id', minProject.id);
        console.log('🧹 Minimal test project cleaned up');
      }
      
    } else {
      console.log(`✅ Corrected schema test succeeded! Project ID: ${project.id}`);
      console.log('📋 Working project structure:');
      Object.keys(project).forEach(key => {
        console.log(`   ${key}: ${project[key]}`);
      });
      
      // Clean up
      await supabase.from('projects').delete().eq('id', project.id);
      console.log('🧹 Corrected test project cleaned up');
    }

  } catch (error) {
    console.error('❌ Unexpected error in corrected schema test:', error.message);
  }
}

async function main() {
  console.log('🔧 Binna Database Schema Diagnostic Tool');
  console.log('========================================\n');

  try {
    // Step 1: Check current schema
    await getCurrentSchema();
    
    // Step 2: Test project creation with expected schema
    await testProjectCreation();
    
    // Step 3: Test with corrected schema
    await testWithCorrectSchema();
    
    console.log('\n📝 Summary and Recommendations:');
    console.log('================================');
    console.log('1. Use the working field names identified above in your code');
    console.log('2. Update your TypeScript interfaces to match the actual database schema');
    console.log('3. Ensure all API calls use the correct field names');
    console.log('4. Consider creating a migration to standardize field names');
    
  } catch (error) {
    console.error('❌ Diagnostic failed:', error.message);
  }
}

// Run the diagnostic
main().catch(error => {
  console.error('❌ Script failed:', error.message);
  process.exit(1);
});
