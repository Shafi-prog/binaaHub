/**
 * Quick diagnostic for the getProjectById error
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iuyzxfnvgpvhxrxnlkdh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1eXp4Zm52Z3B2aHhyeG5sa2RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMzMDkyMjksImV4cCI6MjA0ODg4NTIyOX0.6XnMIjbsWTZj6nSvyLBQNEFLbNMQrMzlsUHWrJzJhJ4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function quickDiagnostic() {
  console.log('🔍 Quick Diagnostic for getProjectById Error');
  console.log('============================================');

  try {
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.log('❌ Not authenticated');
      console.log('Please log in at http://localhost:3000/login first');
      return;
    }
    
    console.log('✅ User authenticated:', user.email);

    // Get the user's projects
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, name, user_id')
      .eq('user_id', user.id)
      .limit(3);

    if (projectsError) {
      console.error('❌ Error fetching projects:', {
        message: projectsError.message,
        code: projectsError.code,
        details: projectsError.details
      });
      return;
    }

    console.log(`✅ Found ${projects.length} projects`);

    if (projects.length === 0) {
      console.log('ℹ️  No projects found. Creating a test project...');
      
      const { data: newProject, error: createError } = await supabase
        .from('projects')
        .insert([{
          user_id: user.id,
          name: 'Test Project - ' + new Date().toISOString().slice(0, 10),
          description: 'Diagnostic test project',
          project_type: 'residential',
          location: 'Test Location',
          status: 'planning',
          priority: 'medium',
          start_date: new Date().toISOString().slice(0, 10),
          expected_completion_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
          budget: 50000,
          currency: 'SAR',
          is_active: true
        }])
        .select()
        .single();

      if (createError) {
        console.error('❌ Error creating test project:', {
          message: createError.message,
          code: createError.code,
          details: createError.details
        });
        return;
      }

      console.log('✅ Created test project:', newProject.name);
      projects.push(newProject);
    }

    // Test the exact query from getProjectById
    for (const project of projects) {
      console.log(`\n🔍 Testing project: ${project.name} (ID: ${project.id})`);
      
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id, user_id, name, description, project_type, location, 
          address, city, region, district, country, status, priority, start_date, 
          expected_completion_date, actual_completion_date, budget, metadata, is_active, created_at, updated_at,
          location_lat, location_lng, image_url, progress_percentage, actual_cost, currency
        `)
        .eq('id', project.id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('❌ getProjectById simulation error:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          full_error: error
        });
      } else {
        console.log('✅ getProjectById simulation successful');
        console.log('📊 Project data keys:', Object.keys(data));
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
  }
}

// Run the diagnostic
quickDiagnostic();
