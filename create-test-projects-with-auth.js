// Script to create test projects with proper authentication flow

const { createClient } = require('@supabase/supabase-js');

// Use the correct Supabase URL from .env.local
const supabaseUrl = 'https://lqhopwohuddhapkhhikf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxaG9wd29odWRkaGFwa2hoaWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5Njc1NjQsImV4cCI6MjA1OTU0MzU2NH0.Zze96fAMkynERwRFhyMF-F6_ds5WcwGckLD0qGQD9JQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createUserAndProjects() {
  console.log('🧪 Starting Test User and Projects Creation');
  console.log('🌐 Supabase URL:', supabaseUrl);

  try {
    // Step 1: Create/Sign in test user
    console.log('\n1️⃣ Creating test user account...');
    
    const testEmail = 'test@example.com';
    const testPassword = 'testpassword123';
    
    // Try to sign up the user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });
    
    let user = null;
    
    if (signUpError) {
      if (signUpError.message.includes('User already registered')) {
        console.log('📝 User already exists, trying to sign in...');
        
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: testEmail,
          password: testPassword,
        });
        
        if (signInError) {
          console.error('❌ Error signing in user:', signInError);
          return;
        }
        
        user = signInData.user;
        console.log('✅ User signed in successfully:', user.id);
      } else {
        console.error('❌ Error signing up user:', signUpError);
        return;
      }
    } else {
      user = signUpData.user;
      console.log('✅ User signed up successfully:', user.id);
    }

    if (!user) {
      console.error('❌ No user object available');
      return;
    }

    // Step 2: Check existing projects
    console.log('\n2️⃣ Checking existing projects...');
    const { data: existingProjects, error: checkError } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id);

    if (checkError) {
      console.error('❌ Error checking existing projects:', checkError);
      return;
    }

    console.log(`📊 Found ${existingProjects?.length || 0} existing projects for user ${user.id}`);
    
    if (existingProjects && existingProjects.length > 0) {
      console.log('📋 Existing projects:');
      existingProjects.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.name} (${p.id}) - Status: ${p.status}`);
      });
      
      console.log('\n✅ User already has projects! The dashboard should show them.');
      return;
    }

    // Step 3: Create test projects (removing actual_cost column)
    console.log('\n3️⃣ Creating test projects...');
    
    const testProjects = [
      {
        user_id: user.id,
        name: 'E-commerce Platform',
        description: 'Modern online shopping platform with React and Node.js',
        status: 'completed',
        budget: 15000,
        client_name: 'TechCorp Solutions',
        project_type: 'web_development',
        created_at: new Date('2024-01-15').toISOString()
      },
      {
        user_id: user.id,
        name: 'Mobile Banking App',
        description: 'Secure mobile banking application for iOS and Android',
        status: 'in_progress',
        budget: 25000,
        client_name: 'SecureBank Ltd',
        project_type: 'mobile_development',
        created_at: new Date('2024-02-01').toISOString()
      },
      {
        user_id: user.id,
        name: 'CRM Dashboard',
        description: 'Customer relationship management dashboard',
        status: 'completed',
        budget: 8000,
        client_name: 'BusinessFlow Inc',
        project_type: 'web_development',
        created_at: new Date('2024-01-10').toISOString()
      },
      {
        user_id: user.id,
        name: 'Data Analytics Platform',
        description: 'Real-time data analytics and visualization platform',
        status: 'in_progress',
        budget: 30000,
        client_name: 'DataTech Analytics',
        project_type: 'data_analytics',
        created_at: new Date('2024-02-15').toISOString()
      },
      {
        user_id: user.id,
        name: 'Inventory Management System',
        description: 'Comprehensive inventory tracking and management system',
        status: 'completed',
        budget: 12000,
        client_name: 'LogiFlow Systems',
        project_type: 'enterprise_software',
        created_at: new Date('2024-01-20').toISOString()
      },
      {
        user_id: user.id,
        name: 'Social Media Campaign Tool',
        description: 'Social media management and campaign optimization tool',
        status: 'planning',
        budget: 18000,
        client_name: 'MarketReach Agency',
        project_type: 'marketing_automation',
        created_at: new Date('2024-03-01').toISOString()
      }
    ];

    console.log(`📝 Creating ${testProjects.length} test projects...`);

    const { data: insertedProjects, error: insertError } = await supabase
      .from('projects')
      .insert(testProjects)
      .select();

    if (insertError) {
      console.error('❌ Error inserting projects:', insertError);
      console.error('Error details:', JSON.stringify(insertError, null, 2));
      return;
    }

    console.log(`✅ Successfully created ${insertedProjects?.length || 0} test projects!`);
    
    if (insertedProjects && insertedProjects.length > 0) {
      console.log('📋 Created projects:');
      insertedProjects.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.name} (${p.id}) - Status: ${p.status}`);
      });
    }

    console.log('\n🎉 Test data creation completed!');
    console.log(`🔧 Test user credentials:`);
    console.log(`   Email: ${testEmail}`);
    console.log(`   Password: ${testPassword}`);
    console.log(`   User ID: ${user.id}`);
    console.log('\n🚀 Now you can:');
    console.log('   1. Go to http://localhost:3000');
    console.log('   2. Sign in with the test credentials');
    console.log('   3. Navigate to /user/projects to see the projects');

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

// Run the creation script
createUserAndProjects()
  .then(() => {
    console.log('\n🎉 Script completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error);
    process.exit(1);
  });
