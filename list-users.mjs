import { supabase } from './src/lib/supabaseClient.js';

async function listUsers() {
  console.log('🔍 Listing all users in database...');
  
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('email, account_type, name');
    
    if (error) {
      console.error('❌ Error fetching users:', error);
      return;
    }
    
    console.log('📊 Users found:', users.length);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} - ${user.account_type} (${user.name})`);
    });
    
    // Check if we need to create a store user
    const storeUser = users.find(u => u.account_type === 'store');
    if (!storeUser) {
      console.log('\n🏪 No store user found. Creating one...');
      
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
      } else {
        console.log('✅ Store user created:', newUser[0]);
      }
    } else {
      console.log('✅ Store user already exists:', storeUser);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

listUsers();
