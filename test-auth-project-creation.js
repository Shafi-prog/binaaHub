// Test script that mimics the exact browser environment to test project creation

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lqhopwohuddhapkhhikf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxaG9wd29odWRkaGFwa2hoaWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5Njc1NjQsImV4cCI6MjA1OTU0MzU2NH0.Zze96fAMkynERwRFhyMF-F6_ds5WcwGckLD0qGQD9JQ';

async function testProjectsWithAuth() {
  console.log('🧪 Testing projects with authentication simulation...');
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // First, let's try to get projects without authentication (this should fail due to RLS)
    console.log('\n1️⃣ Testing projects query without authentication...');
    const { data: unauthProjects, error: unauthError } = await supabase
      .from('projects')
      .select('*');
    
    if (unauthError) {
      console.log('❌ Expected error (RLS blocking):', unauthError.message);
    } else {
      console.log('✅ Unexpected success:', unauthProjects?.length || 0, 'projects');
    }

    // Check if there's a way to see the table structure by looking at auth users
    console.log('\n2️⃣ Checking if we can access auth users...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.log('❌ Cannot access auth users (expected):', authError.message);
    } else {
      console.log('✅ Found auth users:', authUsers?.users?.length || 0);
    }

    // Let's see what we can discover about the projects table structure
    console.log('\n3️⃣ Checking projects table metadata...');
    
    // Try using a very basic query that might bypass RLS or give us schema info
    const { data: emptyResult, error: metadataError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', 'non-existent-id'); // This should return empty but show us the structure
    
    if (metadataError) {
      console.log('❌ Metadata query error:', metadataError.message);
    } else {
      console.log('✅ Metadata query success (empty result):', emptyResult);
    }

    // Check if we can access the public schema info
    console.log('\n4️⃣ Trying to get table information...');
    
    // Use a raw SQL query to get column information if possible
    const { data: columnInfo, error: columnError } = await supabase
      .rpc('get_table_columns', { table_name: 'projects' });
    
    if (columnError) {
      console.log('❌ Column info error (expected):', columnError.message);
    } else {
      console.log('✅ Column info:', columnInfo);
    }

    // Let's also check what happens when we try to create a project with minimal data
    console.log('\n5️⃣ Testing project creation with minimal required fields...');
    
    const testProject = {
      name: 'Test Project for Schema Discovery',
      user_id: '416d0ef0-ffa0-4999-b9af-870a6f00bed0',
      project_type: 'test',
      location: 'Test'
    };

    const { data: createResult, error: createError } = await supabase
      .from('projects')
      .insert(testProject)
      .select();

    if (createError) {
      console.log('❌ Create error:', createError.message);
      console.log('Error code:', createError.code);
      console.log('Error details:', JSON.stringify(createError, null, 2));
      
      // This will help us understand what's required
      if (createError.message.includes('row-level security')) {
        console.log('\n🔒 RLS is blocking the insert. This means:');
        console.log('   1. User needs to be authenticated');
        console.log('   2. RLS policy only allows users to insert their own projects');
        console.log('   3. The user ID 416d0ef0-ffa0-4999-b9af-870a6f00bed0 might not exist in auth.users');
      }
    } else {
      console.log('✅ Create success:', createResult);
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

console.log('🧪 Starting Projects Authentication Test\n');
testProjectsWithAuth()
  .then(() => {
    console.log('\n🎉 Authentication test completed!');
  })
  .catch((error) => {
    console.error('\n💥 Authentication test failed:', error);
  });
