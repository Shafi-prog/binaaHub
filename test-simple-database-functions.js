// Simple test to verify authentication and dashboard functions work
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lqhopwohuddhapkhhikf.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxaG9wd29odWRkaGFwa2hoaWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5Njc1NjQsImV4cCI6MjA1OTU0MzU2NH0.Zze96fAMkynERwRFhyMF-F6_ds5WcwGckLD0qGQD9JQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const TEST_USER = {
  email: 'user@user.com',
  password: '123456'
};

async function runSimpleTest() {
  console.log('🚀 Starting simple authentication and database test...');
  console.log('=' .repeat(60));
  
  let testProject = null;

  try {
    // Step 1: Authenticate
    console.log('🔐 Step 1: Authenticating user...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: TEST_USER.email,
      password: TEST_USER.password
    });

    if (error || !data.user) {
      console.error('❌ Authentication failed:', error?.message);
      return;
    }

    console.log('✅ Authentication successful');
    console.log(`📧 User: ${data.user.email}`);
    console.log(`🆔 User ID: ${data.user.id}`);

    // Step 2: Create test project
    console.log('\n📋 Step 2: Creating test project...');
    const testProjectData = {
      name: 'Simple Test Project',
      description: 'Testing basic project creation and retrieval',
      project_type: 'residential',
      status: 'planning',
      address: 'Test Location',
      budget: 100000,
      user_id: data.user.id
    };

    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .insert(testProjectData)
      .select()
      .single();

    if (projectError) {
      console.error('❌ Project creation failed:', projectError.message);
      return;
    }

    testProject = projectData;
    console.log('✅ Project created successfully');
    console.log(`🆔 Project ID: ${testProject.id}`);
    console.log(`📝 Project Name: ${testProject.name}`);

    // Step 3: Test direct retrieval
    console.log('\n🔍 Step 3: Testing direct project retrieval...');
    const { data: retrievedProject, error: retrieveError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', testProject.id)
      .eq('user_id', data.user.id)
      .single();

    if (retrieveError) {
      console.error('❌ Project retrieval failed:', retrieveError.message);
      return;
    }

    console.log('✅ Project retrieved successfully');
    console.log(`📝 Retrieved name: ${retrievedProject.name}`);
    console.log(`📊 Status: ${retrievedProject.status}`);
    console.log(`💰 Budget: ${retrievedProject.budget}`);

    // Step 4: Test update
    console.log('\n✏️ Step 4: Testing project update...');
    const { data: updatedProject, error: updateError } = await supabase
      .from('projects')
      .update({ 
        description: 'Updated description via direct query',
        status: 'in_progress'
      })
      .eq('id', testProject.id)
      .eq('user_id', data.user.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Project update failed:', updateError.message);
      return;
    }

    console.log('✅ Project updated successfully');
    console.log(`📝 New description: ${updatedProject.description}`);
    console.log(`📊 New status: ${updatedProject.status}`);

    // Step 5: Test listing user projects
    console.log('\n📋 Step 5: Testing project listing...');
    const { data: userProjects, error: listError } = await supabase
      .from('projects')
      .select('id, name, status, budget, created_at')
      .eq('user_id', data.user.id)
      .order('created_at', { ascending: false });

    if (listError) {
      console.error('❌ Project listing failed:', listError.message);
      return;
    }

    console.log(`✅ Found ${userProjects.length} projects for user`);
    userProjects.forEach((project, index) => {
      console.log(`  ${index + 1}. ${project.name} (${project.status}) - ${project.budget} SAR`);
    });

    console.log('\n' + '='.repeat(60));
    console.log('🎉 ALL TESTS PASSED! Core functionality verified:');
    console.log('✅ User authentication - WORKING');
    console.log('✅ Project creation - WORKING');
    console.log('✅ Project retrieval - WORKING');
    console.log('✅ Project update - WORKING');
    console.log('✅ Project listing - WORKING');
    console.log('=' .repeat(60));

  } catch (error) {
    console.error('\n❌ Test suite error:', error.message);
  } finally {
    // Cleanup
    console.log('\n🧹 Cleaning up...');
    if (testProject) {
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', testProject.id);

      if (deleteError) {
        console.error('❌ Failed to delete test project:', deleteError.message);
      } else {
        console.log('✅ Test project deleted');
      }
    }

    await supabase.auth.signOut();
    console.log('✅ User signed out');
  }
}

runSimpleTest().catch(console.error);
