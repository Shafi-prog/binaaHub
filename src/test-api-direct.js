const { createClient } = require('../node_modules/@supabase/supabase-js/dist/main');

// Test project creation API directly
async function testProjectCreationAPI() {
  console.log('🧪 Testing Project Creation API...\n');
  
  try {    // Connect to local Supabase
    const supabase = createClient(
      'http://127.0.0.1:54321',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
    );
      const testProject = {
      name: 'Direct API Test Project - ' + new Date().toLocaleString(),
      description: 'Testing project creation through direct API call',
      project_type: 'residential',
      status: 'planning',
      location: 'الرياض، منطقة الرياض، المملكة العربية السعودية', // Add required location field
      city: 'الرياض',
      region: 'منطقة الرياض',
      district: 'العليا',
      country: 'Saudi Arabia',
      priority: 'medium',
      start_date: '2025-07-01',
      end_date: '2025-12-31',
      budget: 200000,
      location_lat: 24.7136,
      location_lng: 46.6753,
      is_active: true,
      address: 'Saudi Arabia - منطقة الرياض - الرياض - العليا'
    };

    console.log('📝 Creating project with data:');
    console.log(JSON.stringify(testProject, null, 2));
    console.log('\n🔄 Inserting into database...');

    const { data, error } = await supabase
      .from('projects')
      .insert(testProject)
      .select()
      .single();

    if (error) {
      console.error('❌ Project creation failed:', error.message);
      console.error('🔍 Error details:', error);
      return false;
    }

    console.log('✅ Project created successfully!');
    console.log('📋 Project details:');
    console.log('   ID:', data.id);
    console.log('   Name:', data.name);
    console.log('   City:', data.city);
    console.log('   Region:', data.region);
    console.log('   Priority:', data.priority);
    console.log('   Status:', data.status);
    console.log('   Created:', data.created_at);

    // Test 2: Verify the project can be retrieved
    console.log('\n🔍 Verifying project retrieval...');
    const { data: retrieved, error: retrieveError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', data.id)
      .single();

    if (retrieveError) {
      console.error('❌ Project retrieval failed:', retrieveError.message);
      return false;
    }

    console.log('✅ Project retrieved successfully!');
    console.log('📋 All fields present:', Object.keys(retrieved).length, 'columns');

    // Clean up - delete test project
    console.log('\n🧹 Cleaning up test project...');
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', data.id);

    if (deleteError) {
      console.error('⚠️  Warning: Could not delete test project:', deleteError.message);
    } else {
      console.log('✅ Test project cleaned up successfully');
    }

    return true;

  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return false;
  }
}

testProjectCreationAPI().then(success => {
  if (success) {
    console.log('\n🎉 PROJECT CREATION API TEST PASSED!');
    console.log('✅ Database schema is working correctly');
    console.log('✅ All required columns are available');
    console.log('✅ Project creation and retrieval works');
    console.log('\n💡 Next steps:');
    console.log('1. Test the web form at http://localhost:3003/user/projects/new');
    console.log('2. The project creation should now work without errors');
  } else {
    console.log('\n❌ PROJECT CREATION API TEST FAILED');
    console.log('💡 Check the error messages above for issues');
  }
});
