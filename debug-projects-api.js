// Use dynamic import for ES modules
async function loadSupabase() {
  const { createClient } = await import('@supabase/supabase-js');
  return createClient;
}

// Initialize Supabase client
const supabaseUrl = 'https://rboicnbxrsirqvbdssxr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJib2ljbmJ4cnNpcnF2YmRzc3hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIwNDIyODksImV4cCI6MjA0NzYxODI4OX0.2hOWmKsN82nM0GLMZ78VRD5W_iVkJEvHfQ7QqXzUr_Y';
const supabase = createClient(supabaseUrl, supabaseKey);

async function debugProjectsAPI() {
  console.log('🔍 Starting comprehensive projects API debugging...\n');
  
  // Load Supabase client
  const createClient = await loadSupabase();
  
  // Initialize Supabase client
  const supabaseUrl = 'https://rboicnbxrsirqvbdssxr.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJib2ljbmJ4cnNpcnF2YmRzc3hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIwNDIyODksImV4cCI6MjA0NzYxODI4OX0.2hOWmKsN82nM0GLMZ78VRD5W_iVkJEvHfQ7QqXzUr_Y';
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const userId = '416d0ef0-ffa0-4999-b9af-870a6f00bed0';
  
  try {
    // 1. Test direct database query for projects count
    console.log('📊 Step 1: Direct database count query');
    const { count: totalCount, error: countError } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    if (countError) {
      console.error('❌ Count query error:', countError);
    } else {
      console.log('✅ Total projects count:', totalCount);
    }
    
    // 2. Test direct database query for projects data
    console.log('\n📊 Step 2: Direct database data query');
    const { data: allProjects, error: dataError } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId);
    
    if (dataError) {
      console.error('❌ Data query error:', dataError);
    } else {
      console.log('✅ Projects data:', JSON.stringify(allProjects, null, 2));
    }
    
    // 3. Test paginated query (like in getRecentProjects)
    console.log('\n📊 Step 3: Paginated query test (page 1, limit 20)');
    const page = 1;
    const PAGE_SIZE = 20;
    const start = (page - 1) * PAGE_SIZE;
    
    const { data: paginatedProjects, error: paginatedError } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(start, start + PAGE_SIZE - 1);
    
    if (paginatedError) {
      console.error('❌ Paginated query error:', paginatedError);
    } else {
      console.log('✅ Paginated projects:', JSON.stringify(paginatedProjects, null, 2));
    }
    
    // 4. Test the exact same queries as getRecentProjects function
    console.log('\n📊 Step 4: Exact getRecentProjects simulation');
    
    // Count query
    const { count, error: err1 } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    console.log('Count result:', count, 'Error:', err1);
    
    // Data query
    const { data, error: err2 } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(start, start + PAGE_SIZE - 1);
    
    console.log('Data result length:', data?.length, 'Error:', err2);
    console.log('Data result:', JSON.stringify(data, null, 2));
    
    // 5. Test API endpoint directly
    console.log('\n📊 Step 5: Testing API endpoint directly');
    try {
      const response = await fetch('http://localhost:3000/api/projects', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const apiResult = await response.json();
      console.log('API Response status:', response.status);
      console.log('API Response:', JSON.stringify(apiResult, null, 2));
    } catch (fetchError) {
      console.error('❌ API fetch error:', fetchError);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

debugProjectsAPI();
