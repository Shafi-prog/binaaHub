/**
 * Quick User Creation Instructions
 * 
 * Since we don't have admin access to Supabase, we need to create users manually.
 * Follow these steps:
 * 
 * 1. Open the signup page: http://localhost:3001/signup
 * 2. Create these test users:
 * 
 *    User 1:
 *    - Name: Test User
 *    - Email: user@user.com
 *    - Password: password123
 *    - Account Type: User
 * 
 *    User 2:
 *    - Name: Test Store
 *    - Email: store@store.com
 *    - Password: password123
 *    - Account Type: Store
 * 
 * 3. After creating users, test the login:
 *    - Go to http://localhost:3001/login
 *    - Try logging in with user@user.com / password123
 * 
 * Note: The login API has been updated to automatically create user records
 * if they exist in auth but not in the users table.
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testExistingUsers() {
  console.log('🔍 Checking for existing users...');
  
  const { data: users, error } = await supabase
    .from('users')
    .select('email, account_type, name, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching users:', error);
  } else if (users.length === 0) {
    console.log('📝 No users found in database. Please create users via signup form.');
  } else {
    console.log('✅ Found users in database:');
    users.forEach(user => {
      console.log(`  - ${user.email} (${user.account_type}) - ${user.name}`);
    });
  }
}

testExistingUsers().catch(console.error);
