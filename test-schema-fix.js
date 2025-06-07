// Simple test to verify schema fix
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSchemaFix() {
  console.log('🧪 Testing Schema Fix...\n');

  try {
    // Test the exact query from getProjectById function
    console.log('1️⃣ Testing getProjectById query structure...');
    
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select(`
        id, user_id, name, description, project_type, location, 
        address, city, region, district, country, status, priority, start_date, 
        expected_completion_date, actual_completion_date, budget, metadata, is_active, created_at, updated_at,
        location_lat, location_lng, image_url, progress_percentage, actual_cost, currency
      `)
      .limit(1);

    if (projectsError) {
      console.error('❌ Schema query failed:', projectsError.message);
      console.error('🔍 Error details:', projectsError);
      return false;
    }

    console.log('✅ Schema query successful!');
    console.log(`📊 Retrieved ${projects?.length || 0} projects`);
    
    if (projects && projects.length > 0) {
      const project = projects[0];
      console.log('\n📋 Project fields verification:');
      console.log(`  ✅ expected_completion_date: ${project.expected_completion_date}`);
      console.log(`  ✅ actual_completion_date: ${project.actual_completion_date}`);
      console.log(`  ✅ progress_percentage: ${project.progress_percentage}`);
      console.log(`  ✅ actual_cost: ${project.actual_cost}`);
      console.log(`  ✅ All required fields present!`);
    }

    console.log('\n🎉 Schema fix test completed successfully!');
    console.log('💡 The getProjectById function should now work correctly.');
    
    return true;

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

// Run the test
testSchemaFix().then(console.log);
