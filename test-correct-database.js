const { createClient } = require('@supabase/supabase-js');

// Use the CORRECT Supabase URL from .env.local
const supabaseUrl = 'https://lqhopwohuddhapkhhikf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxaG9wd29odWRkaGFwa2hoaWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5Njc1NjQsImV4cCI6MjA1OTU0MzU2NH0.Zze96fAMkynERwRFhyMF-F6_ds5WcwGckLD0qGQD9JQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCorrectDatabase() {
  console.log('🔍 Checking the CORRECT Supabase database...\n');
  console.log('🌐 URL:', supabaseUrl);
  
  try {
    // 1. Try to authenticate
    console.log('1️⃣ Testing authentication...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'user@user.com',
      password: '123456'
    });
    
    if (loginError) {
      console.error('❌ Login failed:', loginError.message);
      
      // Check if user exists at all
      console.log('\n📊 Checking users table...');
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*')
        .limit(10);
      
      if (usersError) {
        console.error('❌ Users query failed:', usersError.message);
      } else {
        console.log('✅ Users found:', users?.length || 0);
        if (users && users.length > 0) {
          users.forEach((user, i) => {
            console.log(`   ${i + 1}. ${user.email} (${user.id})`);
          });
        }
      }
      return;
    }
    
    console.log('✅ Login successful!');
    console.log('🆔 User ID:', loginData.user.id);
    console.log('📧 Email:', loginData.user.email);
    
    // 2. Check projects for this user
    console.log('\n2️⃣ Checking projects for this user...');
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', loginData.user.id);
    
    if (projectsError) {
      console.error('❌ Projects query failed:', projectsError.message);
    } else {
      console.log('✅ Projects found:', projects?.length || 0);
      if (projects && projects.length > 0) {
        projects.forEach((project, i) => {
          console.log(`   ${i + 1}. ${project.name} (${project.id})`);
        });
      } else {
        console.log('   No projects found for this user');
      }
    }
    
    // 3. Check all projects in the database
    console.log('\n3️⃣ Checking all projects in database...');
    const { data: allProjects, error: allProjectsError } = await supabase
      .from('projects')
      .select('*')
      .limit(10);
    
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
    
    // 4. Test the exact getRecentProjects flow
    console.log('\n4️⃣ Testing getRecentProjects flow...');
    const PAGE_SIZE = 5;
    const page = 1;
    const start = (page - 1) * PAGE_SIZE;
    
    const { count, error: countError } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', loginData.user.id);
    
    console.log('📊 Count result:', count, 'Error:', countError?.message || 'None');
    
    const { data: paginatedProjects, error: paginatedError } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', loginData.user.id)
      .order('created_at', { ascending: false })
      .range(start, start + PAGE_SIZE - 1);
    
    console.log('📋 Paginated result:', paginatedProjects?.length || 0, 'Error:', paginatedError?.message || 'None');
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

checkCorrectDatabase();
