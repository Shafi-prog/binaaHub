#!/usr/bin/env node

/**
 * Test script to verify end-to-end project creation flow
 * This simulates the UI form submission process
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

async function testUIProjectCreation() {
  console.log('🧪 Testing UI Project Creation Flow');
  console.log('=====================================');

  try {
    // Step 1: Create a test user and sign in
    console.log('1. Creating test user...');
    const testEmail = `ui_test_${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });

    if (authError) {
      console.error('❌ Auth error:', authError.message);
      return false;
    }

    console.log('✅ Test user created:', authData.user?.id);

    // Step 2: Sign in the user
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (signInError) {
      console.error('❌ Sign in error:', signInError.message);
      return false;
    }

    console.log('✅ User signed in successfully');

    // Step 3: Test project creation with UI form data
    console.log('2. Testing project creation with UI form data...');

    const projectFormData = {
      name: 'UI Test Villa Project',
      description: 'A luxury villa project created via UI simulation',
      project_type: 'residential',
      address: '123 Test Street, Riyadh',
      budget: 750000,
      start_date: '2025-06-15',
      end_date: '2025-12-15',
      status: 'planning',
      priority: 'high'
    };

    // Simulate the API call that would be made from the UI
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .insert({
        user_id: signInData.user.id,
        name: projectFormData.name,
        description: projectFormData.description,
        project_type: projectFormData.project_type,
        address: projectFormData.address,
        budget: projectFormData.budget,
        start_date: projectFormData.start_date,
        end_date: projectFormData.end_date,
        status: projectFormData.status,
        priority: projectFormData.priority,
        currency: 'SAR',
        progress_percentage: 0,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (projectError) {
      console.error('❌ Project creation error:', projectError.message);
      return false;
    }

    console.log('✅ Project created successfully:', projectData.id);
    console.log(`   Name: ${projectData.name}`);
    console.log(`   Budget: ${projectData.budget} ${projectData.currency}`);
    console.log(`   Address: ${projectData.address}`);
    console.log(`   Status: ${projectData.status}`);

    // Step 4: Test project retrieval (simulating dashboard view)
    console.log('3. Testing project retrieval...');

    const { data: retrievedProject, error: retrieveError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectData.id)
      .eq('user_id', signInData.user.id)
      .single();

    if (retrieveError) {
      console.error('❌ Project retrieval error:', retrieveError.message);
      return false;
    }

    console.log('✅ Project retrieved successfully');
    console.log(`   Retrieved: ${retrievedProject.name}`);
    console.log(`   Budget field: ${retrievedProject.budget}`);
    console.log(`   Address field: ${retrievedProject.address}`);
    console.log(`   End date field: ${retrievedProject.end_date}`);

    // Step 5: Test project update (simulating edit form)
    console.log('4. Testing project update...');

    const updateData = {
      budget: 850000,
      description: 'Updated: A luxury villa project with additional features',
      status: 'in_progress',
      updated_at: new Date().toISOString(),
    };

    const { data: updatedProject, error: updateError } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', projectData.id)
      .eq('user_id', signInData.user.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Project update error:', updateError.message);
      return false;
    }

    console.log('✅ Project updated successfully');
    console.log(`   New budget: ${updatedProject.budget}`);
    console.log(`   New status: ${updatedProject.status}`);

    // Step 6: Test project listing (simulating projects page)
    console.log('5. Testing project listing...');

    const { data: projectsList, error: listError } = await supabase
      .from('projects')
      .select('id, name, budget, address, status, project_type, created_at')
      .eq('user_id', signInData.user.id)
      .order('created_at', { ascending: false });

    if (listError) {
      console.error('❌ Project listing error:', listError.message);
      return false;
    }

    console.log('✅ Project listing successful');
    console.log(`   Found ${projectsList.length} project(s)`);
    
    projectsList.forEach((project, index) => {
      console.log(`   ${index + 1}. ${project.name} - ${project.budget} SAR`);
    });

    // Step 7: Cleanup
    console.log('6. Cleaning up...');

    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectData.id)
      .eq('user_id', signInData.user.id);

    if (deleteError) {
      console.error('❌ Project deletion error:', deleteError.message);
    } else {
      console.log('✅ Test project deleted');
    }

    // Sign out
    await supabase.auth.signOut();
    console.log('✅ User signed out');

    console.log('\n🎉 All UI project creation tests passed!');
    console.log('📋 Summary:');
    console.log('   ✅ User authentication works');
    console.log('   ✅ Project creation with correct schema fields works');
    console.log('   ✅ Project retrieval works');
    console.log('   ✅ Project updates work');
    console.log('   ✅ Project listing works');
    console.log('   ✅ Data persistence verified');

    return true;

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

// Run the test
testUIProjectCreation()
  .then((success) => {
    if (success) {
      console.log('\n✅ UI Project Creation Test: PASSED');
      process.exit(0);
    } else {
      console.log('\n❌ UI Project Creation Test: FAILED');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
  });
