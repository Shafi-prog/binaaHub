// Test database connection and project creation
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lqhopwohuddhapkhhikf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxaG9wd29odWRkaGFwa2hoaWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5Njc1NjQsImV4cCI6MjA1OTU0MzU2NH0.Zze96fAMkynERwRFhyMF-F6_ds5WcwGckLD0qGQD9JQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...');
  
  try {
    // Test 1: Check if we can connect to the database
    console.log('\n1. Testing basic database connectivity...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, account_type')
      .limit(1);
      
    if (usersError) {
      console.error('❌ Database connection failed:', usersError.message);
      return;
    }
    
    console.log('✅ Database connection successful');
    console.log('Found users:', users?.length || 0);
    
    // Test 2: Check projects table structure
    console.log('\n2. Testing projects table...');
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .limit(1);
      
    if (projectsError) {
      console.error('❌ Projects table error:', projectsError.message);
      return;
    }
    
    console.log('✅ Projects table accessible');
    console.log('Found projects:', projects?.length || 0);
    
    // Test 3: Check RLS policies by trying to create a test user
    console.log('\n3. Testing user creation and authentication...');
    
    // First, try to sign up a test user
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';
    
    console.log('Creating test user:', testEmail);
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });
    
    if (authError) {
      console.error('❌ Auth signup failed:', authError.message);
      return;
    }
    
    if (!authData.user) {
      console.error('❌ No user returned from signup');
      return;
    }
    
    console.log('✅ Test user created:', authData.user.id);
    
    // Test 4: Try to create a project with the authenticated user
    console.log('\n4. Testing project creation...');
      const testProject = {
      name: 'Test Project',
      description: 'This is a test project to verify database operations',
      project_type: 'residential',
      status: 'planning',
      address: 'Test Address',
      budget: 50000,
      start_date: '2025-07-01',
      end_date: '2025-12-31',
      location_lat: 24.7136,
      location_lng: 46.6753,
      metadata: {
        city: 'Test City',
        region: 'Test Region',
        priority: 'medium',
        notes: 'Database connectivity test project'
      }
    };
    
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .insert({
        ...testProject,
        user_id: authData.user.id
      })
      .select()
      .single();
      
    if (projectError) {
      console.error('❌ Project creation failed:', projectError.message);
      console.error('Error details:', projectError);
      
      // Check if it's an RLS policy issue
      if (projectError.message.includes('new row violates row-level security policy')) {
        console.log('\n🔍 RLS Policy Issue detected. Checking policies...');
        
        // Check what policies exist
        const { data: policies, error: policiesError } = await supabase
          .rpc('pg_policies', { schemaname: 'public', tablename: 'projects' });
          
        if (policiesError) {
          console.log('Could not fetch RLS policies:', policiesError.message);
        } else {
          console.log('RLS Policies for projects table:', policies);
        }
      }
      
      return;
    }
    
    console.log('✅ Project created successfully:', projectData.id);
    
    // Test 5: Try to read the project back
    console.log('\n5. Testing project retrieval...');
    
    const { data: retrievedProject, error: retrieveError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectData.id)
      .single();
      
    if (retrieveError) {
      console.error('❌ Project retrieval failed:', retrieveError.message);
      return;
    }
    
    console.log('✅ Project retrieved successfully:', retrievedProject.name);
    
    // Cleanup: Delete the test project and user
    console.log('\n6. Cleaning up...');
    
    const { error: deleteProjectError } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectData.id);
      
    if (deleteProjectError) {
      console.error('⚠️ Could not delete test project:', deleteProjectError.message);
    } else {
      console.log('✅ Test project deleted');
    }
    
    console.log('\n🎉 All database tests passed! The database is working correctly.');
    
  } catch (error) {
    console.error('❌ Unexpected error during testing:', error);
  }
}

// Test authentication without signup
async function testExistingAuth() {
  console.log('\n🔍 Testing existing authentication...');
  
  try {
    // Check current session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Session error:', sessionError.message);
      return;
    }
    
    if (sessionData.session) {
      console.log('✅ Active session found for user:', sessionData.session.user.email);
        // Try to create a project with the existing session
      const testProject = {
        name: 'Test Project with Session',
        description: 'Testing with existing session',
        project_type: 'residential',
        status: 'planning',
        address: 'Test Location',
        user_id: sessionData.session.user.id
      };
      
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert(testProject)
        .select()
        .single();
        
      if (projectError) {
        console.error('❌ Project creation with session failed:', projectError.message);
      } else {
        console.log('✅ Project created with session:', projectData.id);
        
        // Clean up
        await supabase.from('projects').delete().eq('id', projectData.id);
        console.log('✅ Test project cleaned up');
      }
    } else {
      console.log('ℹ️ No active session found');
    }
    
  } catch (error) {
    console.error('❌ Error testing existing auth:', error);
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting Binna Database Tests');
  console.log('=====================================');
  
  await testDatabaseConnection();
  await testExistingAuth();
  
  console.log('\n✅ Testing completed');
}

main().catch(console.error);
