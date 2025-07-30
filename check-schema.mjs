import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log('🔍 Checking table schemas...\n');
  
  // Check construction_projects
  console.log('📋 CONSTRUCTION_PROJECTS TABLE:');
  const { data: projects, error: projectsError } = await supabase
    .from('construction_projects')
    .select('*')
    .limit(1);
  
  if (projectsError) {
    console.log('❌ Error accessing construction_projects:', projectsError.message);
  } else {
    console.log('✅ Sample row columns:', projects[0] ? Object.keys(projects[0]) : 'No data');
  }
  
  // Check orders  
  console.log('\n📋 ORDERS TABLE:');
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .limit(1);
    
  if (ordersError) {
    console.log('❌ Error accessing orders:', ordersError.message);
  } else {
    console.log('✅ Sample row columns:', orders[0] ? Object.keys(orders[0]) : 'No data');
  }
  
  // Check warranties
  console.log('\n📋 WARRANTIES TABLE:');
  const { data: warranties, error: warrantiesError } = await supabase
    .from('warranties')
    .select('*')
    .limit(1);
    
  if (warrantiesError) {
    console.log('❌ Error accessing warranties:', warrantiesError.message);
  } else {
    console.log('✅ Sample row columns:', warranties[0] ? Object.keys(warranties[0]) : 'No data');
  }
  
  // Check user_profiles
  console.log('\n📋 USER_PROFILES TABLE:');
  const { data: profiles, error: profilesError } = await supabase
    .from('user_profiles')
    .select('*')
    .limit(1);
    
  if (profilesError) {
    console.log('❌ Error accessing user_profiles:', profilesError.message);
  } else {
    console.log('✅ Sample row columns:', profiles[0] ? Object.keys(profiles[0]) : 'No data');
  }
}

checkSchema().catch(console.error);
