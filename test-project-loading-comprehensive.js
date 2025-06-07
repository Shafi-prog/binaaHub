/**
 * Comprehensive Project Loading Test Script
 * This script tests the project loading functionality from multiple angles
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xphpdbxwjzfmqyxqrnzf.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwaHBkYnh3anpmbXF5eHFybnpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MzI1MzEsImV4cCI6MjA1MTQwODUzMX0.xqJ1_S7WC6-PBLxJf6pD4OBHjOXy_SuEDFBo6s8LUgQ'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('🔍 Starting comprehensive project loading test...\n')

async function testProjectLoading() {
  try {
    // Step 1: Check authentication
    console.log('📋 Step 1: Checking authentication...')
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.error('❌ Authentication error:', authError)
      return
    }
    
    if (!user) {
      console.log('⚠️  No authenticated user found')
      
      // Try to sign in for testing
      console.log('🔑 Attempting to sign in with test credentials...')
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'testpassword123'
      })
      
      if (signInError) {
        console.error('❌ Sign in failed:', signInError)
        console.log('ℹ️  You need to be signed in to test project loading')
        return
      }
      
      console.log('✅ Signed in successfully')
      user = signInData.user
    } else {
      console.log('✅ User authenticated:', {
        id: user.id,
        email: user.email
      })
    }

    // Step 2: List all projects for this user
    console.log('\n📋 Step 2: Listing all projects for user...')
    const { data: allProjects, error: listError } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
    
    if (listError) {
      console.error('❌ Error listing projects:', listError)
    } else {
      console.log(`✅ Found ${allProjects.length} projects:`)
      allProjects.forEach((project, index) => {
        console.log(`   ${index + 1}. ${project.title} (ID: ${project.id})`)
      })
    }

    if (allProjects.length === 0) {
      console.log('\n🔧 No projects found. Creating a test project...')
      const { data: newProject, error: createError } = await supabase
        .from('projects')
        .insert([
          {
            title: 'Test Project',
            description: 'A test project for debugging',
            user_id: user.id,
            status: 'active'
          }
        ])
        .select()
        .single()
      
      if (createError) {
        console.error('❌ Error creating test project:', createError)
        return
      }
      
      console.log('✅ Test project created:', newProject)
      allProjects.push(newProject)
    }

    // Step 3: Test getProjectById for each project
    console.log('\n📋 Step 3: Testing getProjectById for each project...')
    
    for (const project of allProjects) {
      console.log(`\n🔍 Testing project: ${project.title} (ID: ${project.id})`)
      
      // Test direct database query
      console.log('   📊 Direct database query...')
      const { data: directData, error: directError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', project.id)
        .eq('user_id', user.id)
        .single()
      
      if (directError) {
        console.error('   ❌ Direct query error:', directError)
      } else {
        console.log('   ✅ Direct query successful:', directData.title)
      }

      // Test with RLS enabled query
      console.log('   🔒 RLS-enabled query...')
      const { data: rlsData, error: rlsError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', project.id)
        .single()
      
      if (rlsError) {
        console.error('   ❌ RLS query error:', rlsError)
      } else {
        console.log('   ✅ RLS query successful:', rlsData.title)
      }
    }    // Step 4: Test the actual getProjectById function
    console.log('\n📋 Step 4: Testing actual getProjectById function...')
    
    // We'll simulate the function logic since we can't easily import it
    try {
      console.log('ℹ️  Simulating getProjectById function logic...')
      
      for (const project of allProjects) {
        console.log(`\n🔍 Simulating getProjectById for: ${project.title}`)
        
        // This simulates the exact query from getProjectById function
        const { data: projectData, error: getError } = await supabase
          .from('projects')
          .select(`
            id, user_id, name, description, project_type, location, 
            address, city, region, status, priority, start_date, 
            expected_completion_date, actual_completion_date,
            budget, actual_cost, currency, progress_percentage, 
            is_active, created_at, updated_at, rooms_count, bathrooms_count,
            floors_count, plot_area, building_area
          `)
          .eq('id', project.id)
          .eq('user_id', user.id)
          .single()
        
        if (getError) {
          if (getError.code === 'PGRST116') {
            console.log('   ❌ getProjectById simulation returned: No rows (PGRST116)')
          } else {
            console.log('   ❌ getProjectById simulation error:', getError.message)
          }
        } else {
          console.log('   ✅ getProjectById simulation successful:', projectData.name)
        }
      }
    } catch (importError) {
      console.error('❌ Could not simulate getProjectById function:', importError)
    }

    // Step 5: Check RLS policies
    console.log('\n📋 Step 5: Checking RLS policies...')
    const { data: policies, error: policyError } = await supabase
      .rpc('get_table_policies', { table_name: 'projects' })
    
    if (policyError) {
      console.log('⚠️  Could not check RLS policies:', policyError)
    } else {
      console.log('✅ RLS policies found:', policies?.length || 0)
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Run the test
testProjectLoading().then(() => {
  console.log('\n🎉 Test completed!')
}).catch(error => {
  console.error('💥 Test failed:', error)
})
