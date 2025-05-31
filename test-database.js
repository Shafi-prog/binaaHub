const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Testing database connection...');
console.log('URL:', supabaseUrl);
console.log('Key exists:', !!supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabase() {
  try {
    // Test 1: Check if projects table exists
    console.log('\n📋 Testing projects table...');
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, name, user_id')
      .limit(1);

    if (projectsError) {
      console.log('❌ Projects table error:', projectsError.message);
      if (projectsError.message.includes('relation "projects" does not exist')) {
        console.log('📝 Projects table does not exist - needs to be created');
      }
    } else {
      console.log('✅ Projects table exists');
      console.log('📊 Sample data:', projects);
    }

    // Test 2: Check users table
    console.log('\n👥 Testing users table...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, account_type')
      .limit(3);

    if (usersError) {
      console.log('❌ Users table error:', usersError.message);
    } else {
      console.log('✅ Users table exists');
      console.log('📊 Sample users:', users);
    }
  } catch (error) {
    console.error('❌ Database test error:', error);
  }
}

testDatabase()
  .then(() => {
    console.log('\n✅ Database test completed');
  })
  .catch(console.error);
