import { createClient } from '@supabase/supabase-js';

// Use the CORRECT Supabase URL from .env.local
const supabaseUrl = 'https://lqhopwohuddhapkhhikf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxaG9wd29odWRkaGFwa2hoaWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5Njc1NjQsImV4cCI6MjA1OTU0MzU2NH0.Zze96fAMkynERwRFhyMF-F6_ds5WcwGckLD0qGQD9JQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCorrectDatabase() {
  console.log('🔍 Checking the CORRECT Supabase database...\n');
  console.log('🌐 URL:', supabaseUrl);
  
  try {
    // 1. Check if projects table exists and is accessible
    console.log('1️⃣ Testing projects table access...');
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('count(*)')
      .limit(1);
    
    if (projectsError) {
      console.error('❌ Projects table access failed:', projectsError.message);
      console.error('Error details:', projectsError);
      return;
    }
    
    console.log('✅ Projects table accessible');
    
    // 2. Try to authenticate
    console.log('\n2️⃣ Testing authentication...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'user@user.com',
      password: '123456'
    });
    
    if (loginError) {
      console.error('❌ Login failed:', loginError.message);
      
      // Check if user exists
      console.log('\n📊 Checking if user exists in users table...');
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('email')
        .eq('email', 'user@user.com')
        .limit(1);
      
      if (usersError) {
        console.error('❌ Users query failed:', usersError.message);
      } else {
        console.log('User exists:', users?.length > 0 ? 'YES' : 'NO');
      }
      return;
    }
    
    console.log('✅ Login successful!');
    console.log('🆔 User ID:', loginData.user.id);
    
    // 3. Check projects for this user
    console.log('\n3️⃣ Checking projects for user:', loginData.user.id);
    const { data: userProjects, error: userProjectsError } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', loginData.user.id);
    
    if (userProjectsError) {
      console.error('❌ User projects query failed:', userProjectsError.message);
    } else {
      console.log('✅ User projects found:', userProjects?.length || 0);
      if (userProjects && userProjects.length > 0) {
        userProjects.forEach((project, i) => {
          console.log(`   ${i + 1}. ${project.name} (${project.id})`);
        });
      }
    }
    
    // 4. Check total projects in database
    console.log('\n4️⃣ Checking total projects in database...');
    const { data: allProjects, error: allProjectsError } = await supabase
      .from('projects')
      .select('id, name, user_id')
      .limit(20);
    
    if (allProjectsError) {
      console.error('❌ All projects query failed:', allProjectsError.message);
    } else {
      console.log('✅ Total projects in database:', allProjects?.length || 0);
      if (allProjects && allProjects.length > 0) {
        allProjects.forEach((project, i) => {
          console.log(`   ${i + 1}. ${project.name} (user: ${project.user_id})`);
        });
      }
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

checkCorrectDatabase();
