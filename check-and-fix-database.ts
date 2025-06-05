// Quick test to verify database state and create test data if needed
import { createClient } from '@supabase/supabase-js';

// Correct URL from .env.local
const supabaseUrl = 'https://lqhopwohuddhapkhhikf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxaG9wd29odWRkaGFwa2hoaWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5Njc1NjQsImV4cCI6MjA1OTU0MzU2NH0.Zze96fAMkynERwRFhyMF-F6_ds5WcwGckLD0qGQD9JQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndFixDatabase() {
  console.log('🔍 Checking and fixing database state...\n');
  
  try {
    // 1. Check users table
    console.log('1️⃣ Checking users table...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'user@user.com');
    
    let targetUserId = null;
    
    if (usersError) {
      console.error('❌ Users query failed:', usersError.message);
      return;
    }
    
    if (!users || users.length === 0) {
      console.log('⚠️ User user@user.com not found, attempting to create...');
      
      // Try to sign up the user
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: 'user@user.com',
        password: '123456'
      });
      
      if (signupError) {
        console.error('❌ Signup failed:', signupError.message);
        return;
      }
      
      targetUserId = signupData.user?.id;
      console.log('✅ User created with ID:', targetUserId);
    } else {
      targetUserId = users[0].id;
      console.log('✅ User found with ID:', targetUserId);
    }
    
    if (!targetUserId) {
      console.error('❌ Could not get user ID');
      return;
    }
    
    // 2. Check projects for this user
    console.log('\n2️⃣ Checking projects for user:', targetUserId);
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', targetUserId);
    
    if (projectsError) {
      console.error('❌ Projects query failed:', projectsError.message);
      return;
    }
    
    console.log('📊 Existing projects:', projects?.length || 0);
    
    if (!projects || projects.length === 0) {
      console.log('⚠️ No projects found, creating test projects...');
      
      // Create test projects
      const testProjects = [
        {
          user_id: targetUserId,
          name: 'Test Project 1',
          description: 'First test project',
          project_type: 'residential',
          status: 'planning',
          priority: 'medium',
          budget: 50000,
          actual_cost: 0,
          currency: 'SAR',
          progress_percentage: 10,
          is_active: true,
          location: 'Riyadh',
          city: 'Riyadh',
          region: 'Riyadh',
          start_date: '2025-01-01',
          address: 'Test Address 1'
        },
        {
          user_id: targetUserId,
          name: 'Test Project 2', 
          description: 'Second test project',
          project_type: 'commercial',
          status: 'construction',
          priority: 'high',
          budget: 100000,
          actual_cost: 25000,
          currency: 'SAR',
          progress_percentage: 35,
          is_active: true,
          location: 'Jeddah',
          city: 'Jeddah',
          region: 'Makkah',
          start_date: '2025-02-01',
          address: 'Test Address 2'
        },
        {
          user_id: targetUserId,
          name: 'Test Project 3',
          description: 'Third test project',
          project_type: 'industrial',
          status: 'completed',
          priority: 'low',
          budget: 75000,
          actual_cost: 73000,
          currency: 'SAR',
          progress_percentage: 100,
          is_active: false,
          location: 'Dammam',
          city: 'Dammam',
          region: 'Eastern',
          start_date: '2024-12-01',
          address: 'Test Address 3'
        }
      ];
      
      const { data: createdProjects, error: createError } = await supabase
        .from('projects')
        .insert(testProjects)
        .select();
      
      if (createError) {
        console.error('❌ Failed to create test projects:', createError.message);
        console.error('Error details:', createError);
      } else {
        console.log('✅ Created', createdProjects?.length || 0, 'test projects');
      }
    } else {
      console.log('✅ Projects already exist for this user');
    }
    
    // 3. Final verification
    console.log('\n3️⃣ Final verification...');
    const { data: finalProjects, error: finalError } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', targetUserId);
    
    if (finalError) {
      console.error('❌ Final verification failed:', finalError.message);
    } else {
      console.log('✅ Final count of projects:', finalProjects?.length || 0);
      finalProjects?.forEach((project, i) => {
        console.log(`   ${i + 1}. ${project.name} - ${project.status}`);
      });
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

checkAndFixDatabase();
