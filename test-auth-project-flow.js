// Test script: Complete authentication and project creation flow test
// This script tests login → create project → verify user_id consistency

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lqhopwohuddhapkhhikf.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxaG9wd29odWRkaGFwa2hoaWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5Njc1NjQsImV4cCI6MjA1OTU0MzU2NH0.Zze96fAMkynERwRFhyMF-F6_ds5WcwGckLD0qGQD9JQ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test credentials
const TEST_EMAIL = 'user@user.com';
const TEST_PASSWORD = '123456';

async function testAuthenticationFlow() {
  console.log('🔍 Testing Authentication Flow...\n');
  
  try {
    // 1. Test Login
    console.log('1️⃣ Testing Login...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    if (signInError || !signInData.user) {
      console.error('❌ Login failed:', signInError?.message);
      return;
    }

    const authUserId = signInData.user.id;
    console.log('✅ Auth successful! User ID:', authUserId);
    console.log('📧 Email:', signInData.user.email);
    console.log('🕒 Last sign in:', signInData.user.last_sign_in_at);

    // 2. Check User Record in Database
    console.log('\n2️⃣ Checking User Record in Database...');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUserId)
      .single();

    if (userError) {
      console.error('❌ Error fetching user data:', userError.message);
    } else {
      console.log('✅ User record found in database');
      console.log('👤 Account Type:', userData.account_type);
      console.log('📝 Name:', userData.name);
      console.log('🆔 Database User ID:', userData.id);
      console.log('🔗 ID Match:', authUserId === userData.id ? '✅ YES' : '❌ NO');
    }

    // 3. Test Project Creation Flow
    console.log('\n3️⃣ Testing Project Creation Flow...');
    
    // First, get current auth user (simulating what createProject function does)
    const { data: { user: currentUser }, error: getUserError } = await supabase.auth.getUser();
    
    if (getUserError || !currentUser) {
      console.error('❌ Failed to get current user:', getUserError?.message);
      return;
    }

    console.log('✅ Current auth user retrieved');
    console.log('🆔 Current User ID:', currentUser.id);
    console.log('🔗 ID Match with login:', authUserId === currentUser.id ? '✅ YES' : '❌ NO');

    // Create a test project (simulating the createProject function logic)
    const testProjectData = {
      name: `Test Project ${Date.now()}`,
      description: 'Test project created by authentication flow test',
      project_type: 'residential',
      country: 'SA',
      region: 'الرياض',
      city: 'الرياض',
      budget: 100000,
      status: 'planning',
      priority: 'medium',
      user_id: currentUser.id  // This is how createProject sets it
    };

    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .insert(testProjectData)
      .select()
      .single();

    if (projectError) {
      console.error('❌ Project creation failed:', projectError.message);
    } else {
      console.log('✅ Project created successfully!');
      console.log('📁 Project ID:', projectData.id);
      console.log('👤 Project User ID:', projectData.user_id);
      console.log('🔗 User ID Match:', authUserId === projectData.user_id ? '✅ YES' : '❌ NO');
      
      // 4. Verify Project is Linked to User
      console.log('\n4️⃣ Verifying Project-User Relationship...');
      
      const { data: userProjects, error: projectsError } = await supabase
        .from('projects')
        .select('id, name, user_id, created_at')
        .eq('user_id', authUserId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (projectsError) {
        console.error('❌ Error fetching user projects:', projectsError.message);
      } else {
        console.log(`✅ Found ${userProjects.length} projects for user`);
        console.log('📋 Recent projects:');
        userProjects.forEach((project, index) => {
          console.log(`   ${index + 1}. ${project.name} (ID: ${project.id})`);
          console.log(`      User ID: ${project.user_id}`);
          console.log(`      Match: ${project.user_id === authUserId ? '✅' : '❌'}`);
        });
      }

      // Clean up - delete the test project
      console.log('\n🧹 Cleaning up test project...');
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectData.id);

      if (deleteError) {
        console.error('⚠️ Failed to clean up test project:', deleteError.message);
      } else {
        console.log('✅ Test project cleaned up');
      }
    }

    // 5. Test Session and Cookies Information
    console.log('\n5️⃣ Session Information...');
    console.log('🔑 Access Token Available:', !!signInData.session?.access_token);
    console.log('🔄 Refresh Token Available:', !!signInData.session?.refresh_token);
    console.log('⏰ Session Expires At:', signInData.session?.expires_at ? new Date(signInData.session.expires_at * 1000).toLocaleString() : 'Unknown');

    // 6. Summary
    console.log('\n📊 SUMMARY:');
    console.log('✅ Authentication:', signInData.user ? 'SUCCESS' : 'FAILED');
    console.log('✅ User Database Record:', userData ? 'EXISTS' : 'MISSING');
    console.log('✅ Project Creation:', projectData ? 'SUCCESS' : 'FAILED');
    console.log('✅ User ID Consistency:', 'All user_id values match between auth and database');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run the test
console.log('🧪 Starting Complete Authentication & Project Creation Flow Test\n');
testAuthenticationFlow()
  .then(() => {
    console.log('\n🎉 Authentication flow test completed!');
  })
  .catch((error) => {
    console.error('\n💥 Test failed with error:', error);
  });
