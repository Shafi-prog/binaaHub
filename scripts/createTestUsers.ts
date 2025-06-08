import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createTestUsers() {
  console.log('🔧 Creating test users...');

  const testUsers = [
    {
      email: 'user@user.com',
      password: 'password123',
      userData: {
        name: 'Test User',
        account_type: 'user' as const,
        email: 'user@user.com',
        phone: '+966501234567',
        address: 'Test Address',
        city: 'Riyadh',
        region: 'Riyadh Region',
        is_verified: true,
        status: 'active',
      },
    },
    {
      email: 'store@store.com',
      password: 'password123',
      userData: {
        name: 'Test Store',
        account_type: 'store' as const,
        email: 'store@store.com',
        phone: '+966501234568',
        address: 'Test Store Address',
        city: 'Jeddah',
        region: 'Makkah Region',
        is_verified: true,
        status: 'active',
      },
    },
  ];

  for (const testUser of testUsers) {
    try {
      console.log(`📝 Creating user: ${testUser.email}`);

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: testUser.email,
        password: testUser.password,
        email_confirm: true,
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          console.log(`ℹ️  User ${testUser.email} already exists in auth`);

          // Get existing user
          const {
            data: { users },
            error: listError,
          } = await supabase.auth.admin.listUsers();
          if (listError) throw listError;

          const existingUser = users.find((u) => u.email === testUser.email);
          if (!existingUser) throw new Error('User not found after creation');

          // Check if user data exists
          const { data: existingUserData, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('id', existingUser.id)
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') {
            throw fetchError;
          }

          if (!existingUserData) {
            // Insert user data
            const { error: insertError } = await supabase.from('users').insert([
              {
                id: existingUser.id,
                ...testUser.userData,
              },
            ]);

            if (insertError) throw insertError;
            console.log(`✅ Added user data for existing auth user: ${testUser.email}`);
          } else {
            console.log(`✅ User data already exists for: ${testUser.email}`);
          }
        } else {
          throw authError;
        }
      } else {
        console.log(`✅ Auth user created: ${testUser.email}`);

        // Insert user data
        const { error: insertError } = await supabase.from('users').insert([
          {
            id: authData.user.id,
            ...testUser.userData,
          },
        ]);

        if (insertError) throw insertError;
        console.log(`✅ User data inserted: ${testUser.email}`);
      }
    } catch (error) {
      console.error(`❌ Error creating user ${testUser.email}:`, error);
    }
  }

  // Verify users were created
  console.log('\n🔍 Verifying created users...');
  const { data: users, error: fetchError } = await supabase
    .from('users')
    .select('email, account_type, name')
    .in('email', ['user@user.com', 'store@store.com']);

  if (fetchError) {
    console.error('❌ Error fetching users:', fetchError);
  } else {
    console.log('✅ Users in database:', users);
  }
}

createTestUsers().catch(console.error);
