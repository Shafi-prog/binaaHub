// Quick test to check users in database
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUsers() {
  try {
    console.log('🔍 Checking users in database...');

    const { data: users, error } = await supabase
      .from('users')
      .select('email, account_type')
      .limit(10);

    if (error) {
      console.error('❌ Error fetching users:', error.message);
      return;
    }

    console.log('👥 Found users:', users.length);
    users.forEach((user) => {
      console.log(`  - ${user.email} (${user.account_type})`);
    });

    if (users.length === 0) {
      console.log('📝 No users found. You might need to create a test user first.');
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

checkUsers();
