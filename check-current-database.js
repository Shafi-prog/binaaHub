console.log('Starting database check...');

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Anon Key exists:', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabase() {
  try {
    console.log('1. Checking projects table...');
    
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('*');

    if (projectsError) {
      console.error('Error fetching projects:', projectsError);
    } else {
      console.log(`Total projects in database: ${projectsData.length}`);
      if (projectsData.length > 0) {
        console.log('Sample projects:', projectsData.slice(0, 3).map(p => ({ 
          id: p.id, 
          name: p.name, 
          user_id: p.user_id, 
          status: p.status 
        })));
      }
    }

    console.log('\n2. Checking profiles table...');
    
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*');

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
    } else {
      console.log(`Total profiles in database: ${profilesData.length}`);
      if (profilesData.length > 0) {
        console.log('Sample profiles:', profilesData.slice(0, 3).map(p => ({ 
          id: p.id, 
          email: p.email 
        })));
      }
    }

    console.log('\n3. Checking auth.users (if accessible)...');
    
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
      console.log('Cannot access auth.users (expected without service role key):', usersError.message);
    } else {
      console.log(`Total users: ${users.length}`);
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkDatabase();
