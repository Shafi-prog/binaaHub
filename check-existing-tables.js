/**
 * Check what tables actually exist in the Supabase database
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read environment variables from .env.local
const envPath = path.join(__dirname, '.env.local');
let supabaseUrl, supabaseAnonKey;

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envLines = envContent.split('\n');
  
  for (const line of envLines) {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1];
    }
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      supabaseAnonKey = line.split('=')[1];
    }
  }
} catch (error) {
  console.error('❌ Could not read .env.local file:', error.message);
  process.exit(1);
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkExistingTables() {
  console.log('🔍 Checking Existing Database Tables');
  console.log('===================================');
  console.log('Database URL:', supabaseUrl);

  try {
    // Method 1: Try to list some common table names we know should exist
    const tablesToCheck = [
      'projects',
      'profiles', 
      'orders',
      'order_items',
      'warranties',
      'user_addresses',
      'construction_categories',
      'construction_expenses',
      'spending_categories',
      'expenses',
      'notifications'
    ];

    console.log('\n📋 Checking for expected tables...');
    
    for (const tableName of tablesToCheck) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (error) {
          if (error.code === '42P01') {
            console.log(`❌ ${tableName}: Does not exist`);
          } else {
            console.log(`⚠️ ${tableName}: Error - ${error.message}`);
          }
        } else {
          console.log(`✅ ${tableName}: Exists (${data?.length || 0} sample records)`);
        }
      } catch (err) {
        console.log(`❌ ${tableName}: Error - ${err.message}`);
      }
    }

    // Method 2: Try to get basic auth info
    console.log('\n👤 Checking authentication...');
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('⚠️ No authenticated user');
    } else {
      console.log('✅ User session exists:', authData.user?.email || 'anonymous');
    }

    // Method 3: Try a simple projects query to test basic functionality
    console.log('\n🏗️ Testing projects table (main functionality)...');
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, name, status')
      .limit(3);

    if (projectsError) {
      console.error('❌ Projects table error:', projectsError);
    } else {
      console.log('✅ Projects table works:', projects?.length || 0, 'projects found');
      if (projects && projects.length > 0) {
        console.log('📊 Sample projects:', projects);
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

console.log('Starting database tables check...');
checkExistingTables().then(() => {
  console.log('\n✅ Check completed');
}).catch(error => {
  console.error('❌ Check failed:', error);
});
