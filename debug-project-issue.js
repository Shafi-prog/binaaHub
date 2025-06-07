#!/usr/bin/env node

/**
 * Debug Project Loading Issue
 * Reproduces the "حدث خطأ في تحميل بيانات المشروع" error
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase Key:', supabaseAnonKey ? 'Present' : 'Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugProjectIssue() {
  console.log('🐛 Debugging Project Loading Issue');
  console.log('=' .repeat(50));

  try {
    // Step 1: Create or use existing test user
    console.log('\n1️⃣ Setting up test user...');
    
    const testEmail = 'debug@test.com';
    const testPassword = 'debug123456';
    
    // Try to sign in first
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    let userId;
    
    if (signInError) {
      console.log('🆕 User does not exist, creating new test user...');
      
      // Create new user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
      });

      if (signUpError) {
        console.error('❌ Failed to create test user:', signUpError.message);
        return;
      }
      
      userId = signUpData.user?.id;
      console.log('✅ Test user created:', testEmail);
    } else {
      userId = signInData.user?.id;
      console.log('✅ Test user signed in:', testEmail);
    }

    if (!userId) {
      console.error('❌ No user ID available');
      return;
    }

    console.log('👤 User ID:', userId);

    // Step 2: Create a test project
    console.log('\n2️⃣ Creating test project...');
      const testProject = {
      user_id: userId,
      name: 'Debug Test Project',
      description: 'Project created to debug loading issue',
      project_type: 'residential',
      status: 'planning',
      priority: 'medium',
      budget: 100000,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert(testProject)
      .select()
      .single();

    if (projectError) {
      console.error('❌ Failed to create test project:', projectError.message);
      return;
    }

    console.log('✅ Test project created:', project.name);
    console.log('📁 Project ID:', project.id);

    // Step 3: Test getProjectById function simulation
    console.log('\n3️⃣ Testing getProjectById simulation...');
    
    // Get current auth user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    console.log('🔍 Auth check result:');
    console.log('  - User from auth:', user ? { id: user.id, email: user.email } : 'null');
    console.log('  - Auth error:', authError ? authError.message : 'none');
    console.log('  - User ID match:', user?.id === userId ? '✅ YES' : '❌ NO');

    if (!user) {
      console.error('❌ User not authenticated in getUser() call');
      return;
    }    // Test the exact query from getProjectById
    console.log('\n4️⃣ Testing exact getProjectById query...');
    
    const { data: projectData, error: getError } = await supabase
      .from('projects')
      .select(`
        id, user_id, name, description, project_type, location, 
        address, city, region, district, country, status, priority, start_date, 
        end_date, budget, metadata, is_active, created_at, updated_at,
        location_lat, location_lng, image_url
      `)
      .eq('id', project.id)
      .eq('user_id', user.id)
      .single();

    console.log('📊 Query result:');
    console.log('  - Data:', projectData ? { id: projectData.id, name: projectData.name } : 'null');
    console.log('  - Error:', getError ? getError.message : 'none');
    console.log('  - Error code:', getError?.code || 'none');

    // Step 4: Test without user_id filter to see if RLS is the issue
    console.log('\n5️⃣ Testing query without user_id filter...');
    
    const { data: projectNoFilter, error: noFilterError } = await supabase
      .from('projects')
      .select('id, user_id, name')
      .eq('id', project.id)
      .single();

    console.log('📊 Query without user filter result:');
    console.log('  - Data:', projectNoFilter ? { id: projectNoFilter.id, name: projectNoFilter.name, user_id: projectNoFilter.user_id } : 'null');
    console.log('  - Error:', noFilterError ? noFilterError.message : 'none');

    // Step 5: Check user's all projects
    console.log('\n6️⃣ Checking user\'s all projects...');
    
    const { data: allProjects, error: allProjectsError } = await supabase
      .from('projects')
      .select('id, name, user_id')
      .eq('user_id', user.id);

    console.log('📊 All user projects:');
    console.log('  - Count:', allProjects?.length || 0);
    console.log('  - Error:', allProjectsError ? allProjectsError.message : 'none');
    
    if (allProjects && allProjects.length > 0) {
      allProjects.forEach((p, index) => {
        console.log(`    ${index + 1}. ${p.name} (${p.id}) - User: ${p.user_id}`);
      });
    }

    // Step 6: Simulate opening project detail page
    console.log('\n7️⃣ Simulate project detail page access...');
    console.log(`🌐 You can test this in browser at: http://localhost:3000/user/projects/${project.id}`);
    console.log(`📧 Login with: ${testEmail} / ${testPassword}`);

    // Cleanup
    console.log('\n🧹 Cleaning up test data...');
    
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', project.id);

    if (deleteError) {
      console.error('⚠️ Failed to cleanup test project:', deleteError.message);
    } else {
      console.log('✅ Test project cleaned up');
    }

    // Sign out
    await supabase.auth.signOut();
    console.log('✅ Signed out');

    console.log('\n🎯 Summary:');
    console.log('- Test user created and authenticated');
    console.log('- Test project created successfully');
    console.log('- getProjectById query simulation completed');
    console.log('- Check console logs above for any issues');
    console.log('- Test the project detail page in browser with provided URL');

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

debugProjectIssue().catch(console.error);
