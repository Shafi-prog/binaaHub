console.log('🧪 MINIMAL DATABASE TEST');
console.log('========================');

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lqhopwohuddhapkhhikf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nYmxndnFtbXl6dnp5anBubmVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1MDUwNzksImV4cCI6MjA0OTA4MTA3OX0.8-MYQ3h5rVpepdfqaOPNMoHRSE1lE';

async function minimalTest() {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Test projects
  console.log('\n1️⃣ Testing projects...');
  try {
    const { data, error } = await supabase.from('projects').select('id, name').limit(1);
    console.log('Projects result:', error ? `Error: ${error.message}` : `Success: ${data.length} records`);
  } catch (e) {
    console.log('Projects error:', e.message);
  }
  
  // Test categories  
  console.log('\n2️⃣ Testing construction_categories...');
  try {
    const { data, error } = await supabase.from('construction_categories').select('id, name').limit(1);
    console.log('Categories result:', error ? `Error: ${error.message}` : `Success: ${data.length} records`);
  } catch (e) {
    console.log('Categories error:', e.message);
  }
  
  console.log('\n✅ Minimal test completed');
}

minimalTest().catch(console.error);
