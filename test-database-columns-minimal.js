#!/usr/bin/env node

/**
 * Minimal Database Column Test
 * Find out exactly what columns exist and test the getProjectById fix
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

async function testMinimal() {
  console.log('🔍 Minimal Database Test');
  console.log('========================');
  
  try {
    // Step 1: Sign in
    console.log('1️⃣ Authenticating...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'test.user.binna.projects@gmail.com',
      password: 'TestPassword123!'
    });
    
    if (authError) {
      console.error('❌ Authentication failed:', authError.message);
      return;
    }
    
    console.log('✅ Authentication successful');
    
    // Step 2: Test the exact query from getProjectById (updated version)
    console.log('\n2️⃣ Testing getProjectById query (fixed version)...');
    
    const { data: projects, error: queryError } = await supabase
      .from('projects')
      .select(`
        id, user_id, name, description, project_type, 
        address, city, region, status, priority, start_date, 
        budget, is_active, created_at, updated_at,
        progress_percentage, actual_cost, currency
      `)
      .limit(1);
    
    if (queryError) {
      console.error('❌ Query failed:', queryError.message);
      console.log('💡 This tells us which columns are missing');
      
      // Test with even more basic columns
      console.log('\n3️⃣ Testing with basic columns only...');
      const { data: basicProjects, error: basicError } = await supabase
        .from('projects')
        .select('id, name, user_id, status, budget, created_at')
        .limit(1);
        
      if (basicError) {
        console.error('❌ Even basic query failed:', basicError.message);
      } else {
        console.log('✅ Basic query successful');
        console.log(`📊 Found ${basicProjects?.length || 0} projects with basic columns`);
        
        if (basicProjects && basicProjects.length > 0) {
          console.log('Available columns:', Object.keys(basicProjects[0]).join(', '));
        }
      }
    } else {
      console.log('✅ getProjectById query successful');
      console.log(`📊 Found ${projects?.length || 0} projects`);
      
      if (projects && projects.length > 0) {
        console.log('Available columns:', Object.keys(projects[0]).join(', '));
      }
    }
    
    // Step 3: Test project creation with minimal data
    console.log('\n4️⃣ Testing minimal project creation...');
    
    const { data: newProject, error: createError } = await supabase
      .from('projects')
      .insert({
        user_id: authData.user.id,
        name: 'Minimal Test Project',
        description: 'Testing minimal schema',
        project_type: 'residential',
        status: 'planning',
        budget: 100000
      })
      .select('*')
      .single();
      
    if (createError) {
      console.error('❌ Project creation failed:', createError.message);
    } else {
      console.log('✅ Project creation successful');
      console.log('📋 All available columns in created project:');
      const allColumns = Object.keys(newProject);
      allColumns.forEach((col, i) => {
        console.log(`  ${(i+1).toString().padStart(2)}. ${col}: ${typeof newProject[col]}`);
      });
      
      // Clean up
      await supabase.from('projects').delete().eq('id', newProject.id);
      console.log('🧹 Test project cleaned up');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  } finally {
    // Sign out
    await supabase.auth.signOut();
    console.log('\n🚪 Signed out');
  }
}

testMinimal().catch(console.error);
