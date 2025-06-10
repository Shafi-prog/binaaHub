// Test script to verify getProjectById fix
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testGetProjectById() {
  try {
    console.log('🔍 Testing getProjectById with project ID: d85a1908-ab4e-4ea0-9892-9493cdd52e27');
    
    // First, let's check if this project exists at all
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, name, user_id')
      .eq('id', 'd85a1908-ab4e-4ea0-9892-9493cdd52e27');
    
    console.log('📊 Projects found:', projects);
    
    if (projectsError) {
      console.error('❌ Error fetching projects:', projectsError);
      return;
    }
    
    if (!projects || projects.length === 0) {
      console.log('❌ Project not found in database');
      return;
    }
    
    const project = projects[0];
    console.log('✅ Project found:', {
      id: project.id,
      name: project.name,
      user_id: project.user_id
    });
    
    // Now test the full query with the correct columns
    const { data, error } = await supabase
      .from('projects')
      .select(`
        id, user_id, name, description, project_type, location, 
        address, status, start_date, end_date,
        budget, is_active, created_at, updated_at
      `)
      .eq('id', 'd85a1908-ab4e-4ea0-9892-9493cdd52e27')
      .single();
    
    if (error) {
      console.error('❌ Error with full query:', error);
      return;
    }
    
    console.log('✅ Full project data:', data);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testGetProjectById();
