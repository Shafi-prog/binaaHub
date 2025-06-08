import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTestUserViaSignup() {
  console.log('🔧 Creating test user via signup...');

  try {
    const testUser = {
      email: 'user@user.com',
      password: 'password123',
      name: 'Test User',
      account_type: 'user' as const,
    };

    console.log(`📝 Attempting to sign up: ${testUser.email}`);

    // Attempt signup
    const { data, error } = await supabase.auth.signUp({
      email: testUser.email,
      password: testUser.password,
    });

    if (error) {
      if (error.message.includes('already registered')) {
        console.log(`ℹ️  User ${testUser.email} already exists`);
        console.log('✅ You can now test login with this user');
        return;
      } else {
        throw error;
      }
    }

    if (data.user) {
      console.log(`✅ Auth user created: ${testUser.email}`);

      // Insert user data
      const { error: insertError } = await supabase.from('users').insert([
        {
          id: data.user.id,
          name: testUser.name,
          email: testUser.email,
          account_type: testUser.account_type,
        },
      ]);

      if (insertError) {
        console.error('❌ Error inserting user data:', insertError);
      } else {
        console.log(`✅ User data inserted: ${testUser.email}`);
      }
    }
  } catch (error) {
    console.error('❌ Error creating user:', error);
  }

  // Test if we can now fetch the user
  console.log('\n🔍 Testing user data fetch...');
  const { data: users, error: fetchError } = await supabase
    .from('users')
    .select('email, account_type, name')
    .eq('email', 'user@user.com');

  if (fetchError) {
    console.error('❌ Error fetching user:', fetchError);
  } else {
    console.log('✅ User found in database:', users);
  }
}

createTestUserViaSignup().catch(console.error);
