// Simple test for environment variables and database connectivity
console.log('🧪 Starting simple API test...\n');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

console.log('Environment variables:');
console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing');
console.log('SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing');
console.log('');

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function simpleTest() {
  try {
    console.log('Testing database connection...');

    // Test basic connectivity
    const { data, error } = await supabase
      .from('projects')
      .select('count', { count: 'exact', head: true });

    if (error) {
      console.error('❌ Database error:', error.message);
      return;
    }

    console.log('✅ Database connection successful!');
    console.log('📊 Projects table exists and is accessible');
    console.log('');

    // Test the projects table structure
    console.log('Testing projects table structure...');
    const { data: tableTest, error: tableError } = await supabase
      .from('projects')
      .select('id, name, user_id, project_type, location, status, created_at')
      .limit(1);

    if (tableError) {
      console.error('❌ Table structure error:', tableError.message);
      return;
    }

    console.log('✅ Projects table structure is correct!');
    console.log('');

    console.log('🎉 All basic tests passed!');
    console.log('✅ Environment variables: OK');
    console.log('✅ Database connection: OK');
    console.log('✅ Projects table: OK');
    console.log('');
    console.log('🚀 Project management system is ready!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

simpleTest();
