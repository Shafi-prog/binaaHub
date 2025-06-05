// Test script: Debug getRecentProjects function
// This script tests the getRecentProjects function directly to see why it's returning 0 projects

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lqhopwohuddhapkhhikf.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxaG9wd29odWRkaGFwa2hoaWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5Njc1NjQsImV4cCI6MjA1OTU0MzU2NH0.Zze96fAMkynERwRFhyMF-F6_ds5WcwGckLD0qGQD9JQ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test credentials
const TEST_EMAIL = 'user@user.com';
const TEST_PASSWORD = '123456';

// Simulate the getRecentProjects function
async function testGetRecentProjects(userId, page = 1) {
  const PAGE_SIZE = 5;
  const start = (page - 1) * PAGE_SIZE;

  try {
    console.log(`🔍 Testing getRecentProjects for userId: ${userId}`);
    console.log(`📄 Page: ${page}, Start index: ${start}, Page size: ${PAGE_SIZE}`);

    // Get total count
    console.log('\n1️⃣ Getting total count...');
    const { count, error: countError } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (countError) {
      console.error('❌ Count error:', countError);
      return { items: [], hasMore: false, total: 0, page };
    }

    console.log(`✅ Total count: ${count}`);

    // Get paginated data
    console.log('\n2️⃣ Getting paginated projects...');
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(start, start + PAGE_SIZE - 1);

    if (error) {
      console.error('❌ Projects fetch error:', error);
      return { items: [], hasMore: false, total: 0, page };
    }

    console.log(`✅ Projects fetched: ${projects?.length || 0}`);
    if (projects && projects.length > 0) {
      console.log('📋 Sample project:', {
        id: projects[0].id,
        name: projects[0].name,
        user_id: projects[0].user_id,
        created_at: projects[0].created_at
      });
    }

    const result = {
      items: projects || [],
      hasMore: count ? start + PAGE_SIZE < count : false,
      total: count || 0,
      page,
    };

    console.log(`\n📊 Final result:`, {
      itemsCount: result.items.length,
      hasMore: result.hasMore,
      total: result.total,
      page: result.page
    });

    return result;

  } catch (error) {
    console.error('💥 Unexpected error in getRecentProjects:', error);
    return { items: [], hasMore: false, total: 0, page };
  }
}

async function debugProjectsIssue() {
  console.log('🔍 Debugging Projects Issue...\n');
  
  try {
    // 1. Login first
    console.log('1️⃣ Logging in...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    if (signInError || !signInData.user) {
      console.error('❌ Login failed:', signInError?.message);
      return;
    }

    const userId = signInData.user.id;
    console.log('✅ Logged in successfully');
    console.log('🆔 User ID:', userId);

    // 2. Direct database query to verify projects exist
    console.log('\n2️⃣ Direct database verification...');
    const { data: allProjects, error: directError } = await supabase
      .from('projects')
      .select('id, name, user_id, created_at')
      .eq('user_id', userId);

    if (directError) {
      console.error('❌ Direct query error:', directError);
    } else {
      console.log(`✅ Direct query found ${allProjects.length} projects`);
      if (allProjects.length > 0) {
        console.log('📋 Projects from direct query:');
        allProjects.forEach((p, i) => {
          console.log(`   ${i + 1}. ${p.name} (${p.id}) - Created: ${p.created_at}`);
        });
      }
    }

    // 3. Test the getRecentProjects logic
    console.log('\n3️⃣ Testing getRecentProjects function logic...');
    const projectsResult = await testGetRecentProjects(userId, 1);

    // 4. Check if there's a session issue
    console.log('\n4️⃣ Checking current session...');
    const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !currentUser) {
      console.error('❌ Session check failed:', userError?.message);
    } else {
      console.log('✅ Current session user:', currentUser.id);
      console.log('🔗 User ID match:', userId === currentUser.id ? 'YES ✅' : 'NO ❌');
    }

    // 5. Test with different page limits
    console.log('\n5️⃣ Testing with different limits...');
    const { data: projectsLimit20, error: limit20Error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (limit20Error) {
      console.error('❌ Limit 20 query error:', limit20Error);
    } else {
      console.log(`✅ Limit 20 query found ${projectsLimit20.length} projects`);
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run the debug
console.log('🧪 Starting Projects Debug Test\n');
debugProjectsIssue()
  .then(() => {
    console.log('\n🎉 Debug test completed!');
  })
  .catch((error) => {
    console.error('\n💥 Debug test failed:', error);
  });
