// Test minimal project creation to understand actual database schema
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lqhopwohuddhapkhhikf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxaG9wd29odWRkaGFwa2hoaWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5Njc1NjQsImV4cCI6MjA1OTU0MzU2NH0.Zze96fAMkynERwRFhyMF-F6_ds5WcwGckLD0qGQD9JQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testMinimalProject() {
  try {
    console.log('🔍 Testing minimal project creation...');
    
    // Check session
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      console.log('❌ No active session found');
      return;
    }
    
    console.log('✅ Active session found for:', sessionData.session.user.email);
    
    // Test with minimal project based on migration schema
    const minimalProject = {
      user_id: sessionData.session.user.id,
      name: 'Minimal Test Project',
      description: 'Testing actual database schema',
      project_type: 'residential',
      status: 'planning'
    };
    
    console.log('\n📝 Attempting to create project with minimal fields:', JSON.stringify(minimalProject, null, 2));
    
    const { data, error } = await supabase
      .from('projects')
      .insert(minimalProject)
      .select()
      .single();
      
    if (error) {
      console.log('❌ Minimal project creation failed:', error.message);
      console.log('Error details:', error);
      
      // Now try with even fewer fields
      console.log('\n📝 Trying with just required fields...');
      const bareMinimal = {
        user_id: sessionData.session.user.id,
        name: 'Bare Minimal Test'
      };
      
      const { data: data2, error: error2 } = await supabase
        .from('projects')
        .insert(bareMinimal)
        .select()
        .single();
        
      if (error2) {
        console.log('❌ Bare minimal project creation failed:', error2.message);
        console.log('This suggests the actual required fields for projects table');
      } else {
        console.log('✅ Bare minimal project created successfully!');
        console.log('Project data:', data2);
        
        // Clean up
        await supabase.from('projects').delete().eq('id', data2.id);
        console.log('✅ Cleaned up test project');
      }
    } else {
      console.log('✅ Minimal project created successfully!');
      console.log('Project data:', data);
      
      // Clean up
      await supabase.from('projects').delete().eq('id', data.id);
      console.log('✅ Cleaned up test project');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testMinimalProject().catch(console.error);
