// Simple test to check project details page functionality
const { createClient } = require('@supabase/supabase-js');

// Use your existing Supabase credentials
const supabaseUrl = 'https://xphpdbxwjzfmqyxqrnzf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwaHBkYnh3anpmbXF5eHFybnpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MzI1MzEsImV4cCI6MjA1MTQwODUzMX0.xqJ1_S7WC6-PBLxJf6pD4OBHjOXy_SuEDFBo6s8LUgQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testProjectDetails() {
  console.log('🔍 Testing Project Details Page...\n');
  
  try {
    // 1. Check database connection
    console.log('1. Testing database connection...');
    const { data: testConnection, error: connectionError } = await supabase
      .from('projects')
      .select('count')
      .limit(1);
    
    if (connectionError) {
      console.error('❌ Database connection failed:', connectionError.message);
      return;
    }
    console.log('✅ Database connection successful\n');
    
    // 2. List all projects
    console.log('2. Fetching all projects...');
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, name, user_id, status, created_at')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (projectsError) {
      console.error('❌ Error fetching projects:', projectsError.message);
      return;
    }
    
    if (!projects || projects.length === 0) {
      console.log('⚠️ No projects found in database');
      
      // Create a test project
      console.log('💡 Creating a test project...');
      const { data: newProject, error: createError } = await supabase
        .from('projects')
        .insert([{
          name: 'Test Project for Details Page',
          description: 'This is a test project to verify project details functionality',
          project_type: 'residential',
          location: 'Test Location',
          address: 'Test Address',
          status: 'planning',
          budget: 50000
        }])
        .select()
        .single();
      
      if (createError) {
        console.error('❌ Error creating test project:', createError.message);
        return;
      }
      
      console.log('✅ Test project created:', newProject);
      projects.push(newProject);
    }
    
    console.log(`✅ Found ${projects.length} projects:`);
    projects.forEach((project, index) => {
      console.log(`   ${index + 1}. ID: ${project.id}`);
      console.log(`      Name: ${project.name}`);
      console.log(`      Status: ${project.status}`);
      console.log(`      Created: ${new Date(project.created_at).toLocaleDateString()}`);
      console.log('');
    });
    
    // 3. Test project details fetch (simulate getProjectById)
    const testProjectId = projects[0].id;
    console.log(`3. Testing project details fetch for ID: ${testProjectId}`);
    
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
      console.error('❌ Error fetching project details:', detailError.message);
      console.log('🔍 This is likely the source of your "missing required error components" issue');
      console.log('🔍 Error details:', JSON.stringify(detailError, null, 2));
      return;
    }
    
    console.log('✅ Project details fetched successfully!');
    console.log('📊 Project Data:');
    console.log(JSON.stringify(projectDetail, null, 2));
    console.log('');
    
    // 4. Provide browser test URLs
    console.log('4. 🌐 Test these URLs in your browser:');
    console.log('');
    console.log('   📍 Main Application:');
    console.log('      http://localhost:3000');
    console.log('');
    console.log('   📍 Projects List:');
    console.log('      http://localhost:3000/user/projects');
    console.log('');
    console.log('   📍 Project Details (test these):');
    projects.slice(0, 3).forEach((project, index) => {
      console.log(`      Project ${index + 1}: http://localhost:3000/user/projects/${project.id}`);
    });
    console.log('');
    
    // 5. Instructions for manual testing
    console.log('5. 📋 Manual Testing Steps:');
    console.log('   1. Make sure your development server is running (npm run dev)');
    console.log('   2. Open http://localhost:3000 in your browser');
    console.log('   3. Navigate to the projects section');
    console.log('   4. Click on "تفاصيل المشروع" (Project Details) for any project');
    console.log('   5. Check if you see the Arabic error "حدث خطأ في تحميل بيانات المشروع"');
    console.log('   6. Open browser console (F12) to see any JavaScript errors');
    console.log('');
    
    console.log('✅ All database tests passed! The backend appears to be working correctly.');
    console.log('💡 If you still see errors in the browser, they might be frontend-related.');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

testProjectDetails();
