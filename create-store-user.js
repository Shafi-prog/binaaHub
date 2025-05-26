// Import using dynamic import for TypeScript file
async function getSupabase() {
  const module = await import('./src/lib/supabaseClient.js');
  return module.supabase;
}

async function createStoreUser() {
  console.log('🏪 Creating store user for testing...');
  
  const supabase = await getSupabase();
  
  try {
    // Check if store user already exists
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('email, account_type')
      .eq('email', 'store@store.com');
    
    if (checkError) {
      console.error('❌ Error checking existing users:', checkError);
      return;
    }
    
    if (existingUsers && existingUsers.length > 0) {
      console.log('✅ Store user already exists:', existingUsers[0]);
      return;
    }
    
    // Create store user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        email: 'store@store.com',
        password: '123456',
        name: 'Store User',
        account_type: 'store'
      })
      .select();
    
    if (insertError) {
      console.error('❌ Error creating store user:', insertError);
      return;
    }
    
    console.log('✅ Store user created successfully:', newUser[0]);
    
    // Test authentication for store user
    console.log('🔐 Testing store user authentication...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'store@store.com',
      password: '123456'
    });
    
    if (authError) {
      console.error('❌ Store user auth failed:', authError);
    } else {
      console.log('✅ Store user authentication successful:', authData.user.email);
      
      // Sign out to clean up
      await supabase.auth.signOut();
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createStoreUser();
