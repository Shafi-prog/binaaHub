// Script to fix store user in database
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lqhopwohuddhapkhhikf.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxaG9wd29odWRkaGFwa2hoaWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5Njc1NjQsImV4cCI6MjA1OTU0MzU2NH0.Zze96fAMkynERwRFhyMF-F6_ds5WcwGckLD0qGQD9JQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixStoreUser() {
  try {
    console.log('🔍 Checking for teststore@store.com user...');

    // First, check if user exists in auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) {
      console.error('❌ Error fetching auth users:', authError);
      return;
    }

    const existingAuthUser = authUsers.users.find((user) => user.email === 'teststore@store.com');

    if (!existingAuthUser) {
      console.log('📝 Creating auth user for teststore@store.com...');
      // Create auth user
      const { data: newAuthUser, error: createAuthError } = await supabase.auth.admin.createUser({
        email: 'teststore@store.com',
        password: '123456',
        email_confirm: true,
      });

      if (createAuthError) {
        console.error('❌ Error creating auth user:', createAuthError);
        return;
      }

      console.log('✅ Auth user created:', newAuthUser.user.id);
    } else {
      console.log('✅ Auth user already exists:', existingAuthUser.id);
    }

    // Now check/create user in public.users table
    const userId = existingAuthUser?.id || newAuthUser?.user?.id;

    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'teststore@store.com')
      .single();

    if (fetchError && fetchError.code === 'PGRST116') {
      console.log('📝 Creating user record in users table...');
      // Create user record
      const { error: insertError } = await supabase.from('users').insert([
        {
          id: userId,
          email: 'teststore@store.com',
          account_type: 'store',
          name: 'Test Store',
          is_verified: true,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

      if (insertError) {
        console.error('❌ Error creating user record:', insertError);
        return;
      }

      console.log('✅ User record created in users table');
    } else if (existingUser) {
      console.log('✅ User record exists:', existingUser);

      // Update account_type if it's not 'store'
      if (existingUser.account_type !== 'store') {
        console.log('🔧 Updating account_type to store...');
        const { error: updateError } = await supabase
          .from('users')
          .update({ account_type: 'store' })
          .eq('email', 'teststore@store.com');

        if (updateError) {
          console.error('❌ Error updating account_type:', updateError);
          return;
        }

        console.log('✅ Account type updated to store');
      }
    } else {
      console.error('❌ Error fetching user:', fetchError);
      return;
    }

    console.log('🎉 Store user setup completed successfully!');
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

fixStoreUser();
