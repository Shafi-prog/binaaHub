// Test the updated project creation function
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lqhopwohuddhapkhhikf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxaG9wd29odWRkaGFwa2hoaWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5Njc1NjQsImV4cCI6MjA1OTU0MzU2NH0.Zze96fAMkynERwRFhyMF-F6_ds5WcwGckLD0qGQD9JQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testCorrectedProjectCreation() {
  try {
    console.log('🔍 Testing corrected project creation with proper schema...\n');
    
    // Check session
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      console.log('❌ No active session found');
      return;
    }
    
    console.log('✅ Active session found for:', sessionData.session.user.email);
    
    // Test with data that matches the actual database schema
    const properProjectData = {
      user_id: sessionData.session.user.id,
      name: 'Schema-Correct Test Project',
      description: 'Testing with proper database schema fields',
      project_type: 'residential',
      status: 'planning',
      address: '123 Test Street',
      budget: 75000.00,
      start_date: '2025-07-01',
      end_date: '2025-12-31',
      location_lat: 24.7136,
      location_lng: 46.6753,
      metadata: {
        city: 'Riyadh',
        region: 'Riyadh Region',
        priority: 'high',
        contractor: 'Test Contractor',
        notes: 'This is a test project with proper schema'
      }
    };
    
    console.log('📝 Creating project with proper schema fields...');
    
    const { data, error } = await supabase
      .from('projects')
      .insert(properProjectData)
      .select()
      .single();
      
    if (error) {
      console.log('❌ Project creation failed:', error.message);
      console.log('Error details:', error);
      
      // Try with minimal required fields only
      console.log('\n📝 Trying with minimal required fields...');
      const minimalProject = {
        user_id: sessionData.session.user.id,
        name: 'Minimal Test Project',
        project_type: 'residential'
      };
      
      const { data: minData, error: minError } = await supabase
        .from('projects')
        .insert(minimalProject)
        .select()
        .single();
        
      if (minError) {
        console.log('❌ Minimal project creation also failed:', minError.message);
        console.log('This indicates a deeper schema or permissions issue');
      } else {
        console.log('✅ Minimal project created successfully!');
        console.log('Project:', minData);
        
        // Test reading the project back
        const { data: readData, error: readError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', minData.id)
          .single();
          
        if (readError) {
          console.log('❌ Could not read project back:', readError.message);
        } else {
          console.log('✅ Project read back successfully:', readData);
        }
        
        // Clean up
        await supabase.from('projects').delete().eq('id', minData.id);
        console.log('✅ Cleaned up minimal test project');
      }
    } else {
      console.log('✅ Project created successfully with proper schema!');
      console.log('Project ID:', data.id);
      console.log('Project name:', data.name);
      console.log('Full project data:', JSON.stringify(data, null, 2));
      
      // Test reading the project back
      console.log('\n📖 Reading project back...');
      const { data: readData, error: readError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', data.id)
        .single();
        
      if (readError) {
        console.log('❌ Could not read project back:', readError.message);
      } else {
        console.log('✅ Project read back successfully!');
        console.log('Read data matches:', JSON.stringify(readData, null, 2));
      }
      
      // Test updating the project
      console.log('\n📝 Testing project update...');
      const { data: updateData, error: updateError } = await supabase
        .from('projects')
        .update({
          description: 'Updated description - testing project updates',
          status: 'in_progress'
        })
        .eq('id', data.id)
        .select()
        .single();
        
      if (updateError) {
        console.log('❌ Project update failed:', updateError.message);
      } else {
        console.log('✅ Project updated successfully!');
        console.log('Updated data:', updateData);
      }
      
      // Clean up
      console.log('\n🧹 Cleaning up...');
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', data.id);
        
      if (deleteError) {
        console.log('⚠️ Could not delete test project:', deleteError.message);
      } else {
        console.log('✅ Test project deleted successfully');
      }
    }
    
    console.log('\n🎉 Project creation test completed!');
    
  } catch (error) {
    console.error('❌ Unexpected error during testing:', error);
  }
}

// Also test the projects listing
async function testProjectsListing() {
  try {
    console.log('\n📋 Testing projects listing...');
    
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      console.log('❌ No active session for listing test');
      return;
    }
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', sessionData.session.user.id)
      .limit(5);
      
    if (error) {
      console.log('❌ Projects listing failed:', error.message);
    } else {
      console.log('✅ Projects listing successful!');
      console.log(`Found ${data.length} existing projects for user`);
      if (data.length > 0) {
        console.log('Sample project:', data[0]);
      }
    }
    
  } catch (error) {
    console.error('❌ Error in projects listing test:', error);
  }
}

// Main test execution
async function main() {
  console.log('🚀 Testing Corrected Project Creation & Database Operations');
  console.log('=========================================================\n');
  
  await testCorrectedProjectCreation();
  await testProjectsListing();
  
  console.log('\n✅ All tests completed!');
}

main().catch(console.error);
