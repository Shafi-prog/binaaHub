/**
 * Simple Project Loading Test with Authentication
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lqhopwohuddhapkhhikf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwaHBkYnh3anpmbXF5eHFybnpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MzI1MzEsImV4cCI6MjA1MTQwODUzMX0.xqJ1_S7WC6-PBLxJf6pD4OBHjOXy_SuEDFBo6s8LUgQ'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('🔍 Starting simple project loading test...\n')

async function simpleProjectTest() {
  try {
    // Step 1: Create and sign in test user
    console.log('📋 Step 1: Creating test user...')
    const testEmail = `debug_test_${Date.now()}@example.com`
    const testPassword = 'testpassword123'

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    })

    if (signUpError) {
      console.error('❌ Sign up error:', signUpError.message)
      return
    }

    console.log('✅ Test user created, signing in...')

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    })

    if (signInError) {
      console.error('❌ Sign in error:', signInError.message)
      return
    }

    console.log('✅ User signed in:', signInData.user.id)

    // Step 2: Create test project
    console.log('\n📋 Step 2: Creating test project...')
    const testProject = {
      user_id: signInData.user.id,
      name: 'Debug Test Project',
      description: 'A project to test loading functionality',
      project_type: 'residential',
      status: 'planning',
      priority: 'medium',
      budget: 100000,
      currency: 'SAR',
      is_active: true
    }

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert(testProject)
      .select()
      .single()

    if (projectError) {
      console.error('❌ Project creation error:', projectError.message)
      return
    }

    console.log('✅ Test project created:', project.name, `(ID: ${project.id})`)

    // Step 3: Test the exact getProjectById query simulation
    console.log('\n📋 Step 3: Testing getProjectById query simulation...')
    
    // Get current auth user (should be the same)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('❌ Auth check failed:', authError?.message || 'No user')
      return
    }

    console.log('👤 Auth user ID:', user.id)
    console.log('📁 Project user ID:', project.user_id)
    console.log('🔗 ID Match:', user.id === project.user_id ? '✅ YES' : '❌ NO')

    // Test the exact query that getProjectById uses
    console.log('\n🔍 Testing exact getProjectById query...')
    const { data: queryResult, error: queryError } = await supabase
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

    if (queryError) {
      console.error('❌ Query error:', queryError.message)
      console.error('   Error code:', queryError.code)
      
      if (queryError.code === 'PGRST116') {
        console.log('🔍 PGRST116 means no rows returned - investigating...')
        
        // Check if project exists without user_id filter
        const { data: projectCheck, error: checkError } = await supabase
          .from('projects')
          .select('id, user_id, name')
          .eq('id', project.id)
          .single()
        
        if (checkError) {
          console.error('   ❌ Project doesn\'t exist at all:', checkError.message)
        } else {
          console.log('   ✅ Project exists with user_id:', projectCheck.user_id)
          console.log('   🔍 Current user_id:', user.id)
          console.log('   🔍 Match:', projectCheck.user_id === user.id ? 'YES' : 'NO')
        }
      }
    } else {
      console.log('✅ Query successful:', queryResult.name)
    }

    // Step 4: Test browser scenario
    console.log('\n📋 Step 4: Browser test scenario...')
    console.log(`🌐 Test in browser at: http://localhost:3000/user/projects/${project.id}`)
    console.log(`📧 Login credentials: ${testEmail} / ${testPassword}`)
    console.log('ℹ️  Check the browser console for enhanced logging output')

    // Cleanup
    console.log('\n🧹 Cleaning up...')
    await supabase.from('projects').delete().eq('id', project.id)
    await supabase.auth.signOut()
    console.log('✅ Cleanup completed')

  } catch (error) {
    console.error('💥 Unexpected error:', error)
  }
}

simpleProjectTest().then(() => {
  console.log('\n🎉 Test completed!')
})
