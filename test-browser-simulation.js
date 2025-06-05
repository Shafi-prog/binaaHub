// Browser environment simulation test
// This simulates what happens in the browser when projects page loads

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rboicnbxrsirqvbdssxr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJib2ljbmJ4cnNpcnF2YmRzc3hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIwNDIyODksImV4cCI6MjA0NzYxODI4OX0.2hOWmKsN82nM0GLMZ78VRD5W_iVkJEvHfQ7QqXzUr_Y';

async function simulateBrowserProjectsFlow() {
  console.log('🌐 Simulating browser projects page flow...\n');
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  const userId = '416d0ef0-ffa0-4999-b9af-870a6f00bed0';
  
  try {
    // Step 1: Simulate user login (as would happen before reaching projects page)
    console.log('1️⃣ Simulating user login...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'user@user.com',
      password: '123456'
    });
    
    if (loginError) {
      console.error('❌ Login failed:', loginError);
      return;
    }
    
    console.log('✅ Login successful');
    console.log('🆔 Session user ID:', loginData.user.id);
    
    // Step 2: Simulate what verifyAuthWithRetry does
    console.log('\n2️⃣ Simulating verifyAuthWithRetry...');
    
    let authUser = null;
    for (let attempt = 1; attempt <= 5; attempt++) {
      console.log(`   Attempt ${attempt}/5`);
      
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionData?.session?.user && !sessionError) {
        console.log(`   ✅ Session found on attempt ${attempt}`);
        authUser = sessionData.session.user;
        break;
      }
      
      console.log(`   ⚠️ Session attempt ${attempt} failed`);
      if (attempt < 5) {
        await new Promise(resolve => setTimeout(resolve, 500 * attempt));
      }
    }
    
    if (!authUser) {
      console.error('❌ Auth verification failed');
      return;
    }
    
    console.log('✅ Auth verification successful');
    console.log('🆔 Auth user ID:', authUser.id);
    
    // Step 3: Simulate getRecentProjects call exactly as it happens
    console.log('\n3️⃣ Simulating getRecentProjects call...');
    
    const PAGE_SIZE = 5;
    const page = 1;
    const start = (page - 1) * PAGE_SIZE;
    
    console.log('📊 Parameters:', { userId: authUser.id, page, start, PAGE_SIZE });
    
    // Count query (exactly as in the function)
    console.log('\n   📊 Getting total count...');
    const { count, error: countError } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', authUser.id);
    
    console.log('   Count result:', { count, countError });
    
    if (countError) {
      console.error('   ❌ Count error:', countError);
      return;
    }
    
    // Data query (exactly as in the function)
    console.log('\n   📋 Getting paginated data...');
    const { data: projects, error: dataError } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', authUser.id)
      .order('created_at', { ascending: false })
      .range(start, start + PAGE_SIZE - 1);
    
    console.log('   Projects result:', { 
      projectsCount: projects?.length || 0, 
      error: dataError,
      sampleProject: projects?.[0] ? {
        id: projects[0].id,
        name: projects[0].name,
        user_id: projects[0].user_id
      } : null
    });
    
    if (dataError) {
      console.error('   ❌ Projects error:', dataError);
      return;
    }
    
    // Final result (exactly as in the function)
    const result = {
      items: projects || [],
      hasMore: count ? start + PAGE_SIZE < count : false,
      total: count || 0,
      page,
    };
    
    console.log('\n   ✅ Final getRecentProjects result:', result);
    
    // Step 4: Check for any user ID mismatches
    console.log('\n4️⃣ Checking for user ID consistency...');
    console.log('   Login user ID:     ', loginData.user.id);
    console.log('   Session user ID:   ', authUser.id);
    console.log('   Expected user ID:  ', userId);
    console.log('   Match with expected:', authUser.id === userId ? '✅ YES' : '❌ NO');
    
    if (authUser.id !== userId) {
      console.error('🚨 USER ID MISMATCH DETECTED!');
      console.error('   This could be the root cause of the 0 projects issue');
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

simulateBrowserProjectsFlow();
