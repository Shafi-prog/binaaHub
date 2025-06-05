// Script to check the actual database schema for the projects table

console.log('Starting script...');

const { createClient } = require('@supabase/supabase-js');

// Use the correct Supabase URL from .env.local
const supabaseUrl = 'https://lqhopwohuddhapkhhikf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxaG9wd29odWRkaGFwa2hoaWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5Njc1NjQsImV4cCI6MjA1OTU0MzU2NH0.Zze96fAMkynERwRFhyMF-F6_ds5WcwGckLD0qGQD9JQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log('🔍 Checking database schema...');
  console.log('🌐 Supabase URL:', supabaseUrl);

  try {
    // Try to get any existing project to see the schema
    console.log('\n1️⃣ Checking if projects table exists and getting structure...');
    
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .limit(1);

    if (projectsError) {
      console.error('❌ Error accessing projects table:', projectsError);
      
      // Check if it's a table not found error
      if (projectsError.message?.includes('relation') && projectsError.message?.includes('does not exist')) {
        console.log('🚨 Projects table does not exist!');
        console.log('🔧 You may need to create the projects table first.');
        return;
      }
      
      return;
    }

    console.log('✅ Projects table exists');
    console.log(`📊 Found ${projects?.length || 0} existing projects`);

    if (projects && projects.length > 0) {
      console.log('\n📋 Sample project structure:');
      const sampleProject = projects[0];
      console.log('Available columns:');
      Object.keys(sampleProject).forEach(key => {
        console.log(`   - ${key}: ${typeof sampleProject[key]} (${sampleProject[key]})`);
      });
    } else {
      console.log('\n📝 No existing projects found. Let me try a minimal insert to understand the schema...');
      
      // Try inserting a very minimal project to see what's required
      const minimalProject = {
        user_id: '416d0ef0-ffa0-4999-b9af-870a6f00bed0',
        name: 'Test Project Schema Check',
        project_type: 'residential',
        location: 'Test Location'
      };

      console.log('🧪 Trying minimal project insert...');
      const { data: insertResult, error: insertError } = await supabase
        .from('projects')
        .insert(minimalProject)
        .select();

      if (insertError) {
        console.error('❌ Minimal insert failed:', insertError);
        console.log('\nThis error helps us understand the required schema:');
        
        if (insertError.message?.includes('column') && insertError.message?.includes('does not exist')) {
          console.log('🔧 Column missing in database schema');
        } else if (insertError.message?.includes('violates not-null constraint')) {
          console.log('🔧 Required column is null');
        } else if (insertError.message?.includes('foreign key')) {
          console.log('🔧 Foreign key constraint issue (user may not exist)');
        }
      } else {
        console.log('✅ Minimal insert successful!');
        console.log('📋 Inserted project structure:');
        if (insertResult && insertResult[0]) {
          Object.keys(insertResult[0]).forEach(key => {
            console.log(`   - ${key}: ${typeof insertResult[0][key]} (${insertResult[0][key]})`);
          });
        }

        // Clean up the test project
        if (insertResult && insertResult[0]) {
          await supabase
            .from('projects')
            .delete()
            .eq('id', insertResult[0].id);
          console.log('🧹 Cleaned up test project');
        }
      }
    }

    // Also check what tables exist
    console.log('\n2️⃣ Checking available tables...');
    
    // Try to access common tables to see what exists
    const tablesToCheck = ['projects', 'users', 'orders', 'warranties'];
    
    for (const table of tablesToCheck) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (!error) {
          console.log(`✅ Table '${table}' exists (${data?.length || 0} records)`);
        } else {
          console.log(`❌ Table '${table}' issue: ${error.message}`);
        }
      } catch (e) {
        console.log(`❌ Table '${table}' error: ${e.message}`);
      }
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

// Run the schema check
console.log('🧪 Starting Database Schema Check\n');
checkSchema()
  .then(() => {
    console.log('\n🎉 Schema check completed!');
  })
  .catch((error) => {
    console.error('\n💥 Schema check failed:', error);
  });
