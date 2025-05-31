import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listUsers() {
  try {
    console.log('📋 Fetching users from database...');

    const { data: users, error } = await supabase
      .from('users')
      .select('email, account_type, created_at')
      .limit(10);

    if (error) {
      console.error('❌ Error fetching users:', error);
      return;
    }

    console.log('👥 Users in database:', users?.length || 0);

    if (users && users.length > 0) {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email} (${user.account_type}) - ${user.created_at}`);
      });
    } else {
      console.log('No users found in database');
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

listUsers();
