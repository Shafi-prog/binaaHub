// Debug script to test project details functionality
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testProjectDetails() {
  console.log('🔍 Testing Project Details Functionality...\n');
  
  try {
    // 1. Check if we can connect to database
    console.log('1. Testing database connection...');
    const { data: testData, error: testError } = await supabase
      .from('projects')
      .select('count(*)')
      .limit(1);
    
    if (testError) {
      console.error('❌ Database connection failed:', testError);
      return;
    }
    console.log('✅ Database connected successfully\n');
    
    // 2. List all available projects
    console.log('2. Listing all projects...');
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, name, user_id, status, created_at')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (projectsError) {
      console.error('❌ Error fetching projects:', projectsError);
      return;
    }
    
    if (!projects || projects.length === 0) {
      console.log('⚠️ No projects found in database');
      console.log('💡 You may need to create test projects first');
      return;
    }
    
    console.log(`✅ Found ${projects.length} projects:`);
    projects.forEach((project, index) => {
      console.log(`   ${index + 1}. ID: ${project.id} | Name: ${project.name} | Status: ${project.status}`);
    });
    console.log('');
    
    // 3. Test getProjectById function for each project
    console.log('3. Testing getProjectById function...');
    const testProjectId = projects[0].id;
    console.log(`   Testing with project ID: ${testProjectId}`);
    
    // Simulate the getProjectById function
    const { data: projectDetail, error: detailError } = await supabase
      .from('projects')
      .select(`
        id, user_id, name, description, project_type, location, 
        address, status, start_date, end_date, budget, 
        created_at, updated_at
      `)
      .eq('id', testProjectId)
      .single();
    
    if (detailError) {
      console.error('❌ Error fetching project details:', detailError);
      console.log('🔍 This might be the source of your "missing required error components" issue');
      return;
    }
    
    console.log('✅ Project details fetched successfully:');
    console.log('   Project:', JSON.stringify(projectDetail, null, 2));
    console.log('');
    
    // 4. Test URLs you can use in browser
    console.log('4. 🌐 Test URLs for your browser:');
    console.log('   Main app: http://localhost:3000');
    console.log('   Projects list: http://localhost:3000/user/projects');
    projects.slice(0, 3).forEach((project, index) => {
      console.log(`   Project ${index + 1}: http://localhost:3000/user/projects/${project.id}`);
    });
    console.log('');
    
    console.log('✅ All tests completed successfully!');
    console.log('💡 Try opening the URLs above in your browser to test the UI');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Check if .env file exists and has required variables
function checkEnvironment() {
  console.log('🔧 Environment Check:');
  console.log('   NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing');
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
  console.log('');
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log('⚠️ Please check your .env.local file has the required Supabase credentials');
    console.log('');
  }
}

// Run the tests
checkEnvironment();
testProjectDetails();
