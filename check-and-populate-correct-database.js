// Script to check the correct database state and populate it with test data if needed

const { createClient } = require('@supabase/supabase-js');

// Use the correct Supabase URL from .env.local
const supabaseUrl = 'https://lqhopwohuddhapkhhikf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxaG9wd29odWRkaGFwa2hoaWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5Njc1NjQsImV4cCI6MjA1OTU0MzU2NH0.Zze96fAMkynERwRFhyMF-F6_ds5WcwGckLD0qGQD9JQ';

const supabase = createClient(supabaseUrl, supabaseKey);

const TEST_USER_ID = '416d0ef0-ffa0-4999-b9af-870a6f00bed0';

async function checkDatabaseState() {
  console.log('🔍 Checking correct database state...');
  console.log('🌐 Supabase URL:', supabaseUrl);
  console.log('🆔 Test user ID:', TEST_USER_ID);

  try {
    // 1. Check current user authentication
    console.log('\n1️⃣ Checking authentication...');
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('❌ Auth error (expected for server script):', authError.message);
    } else {
      console.log('✅ Current auth user:', authData?.user?.email || 'No user');
    }

    // 2. Check if the test user exists in auth.users
    console.log('\n2️⃣ Checking if test user exists...');
    // Note: We can't directly query auth.users from client, but we can check projects

    // 3. Check projects for the test user
    console.log('\n3️⃣ Checking projects for test user...');
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', TEST_USER_ID);

    if (projectsError) {
      console.error('❌ Error querying projects:', projectsError);
      return;
    }

    console.log(`📊 Found ${projects?.length || 0} projects for user ${TEST_USER_ID}`);
    
    if (projects && projects.length > 0) {
      console.log('📋 Existing projects:');
      projects.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.name} (${p.id}) - Status: ${p.status} - Created: ${p.created_at}`);
      });
      
      console.log('\n✅ Database already has projects! The issue might be elsewhere.');
      return;
    }

    // 4. If no projects found, create test projects
    console.log('\n4️⃣ No projects found. Creating test projects...');
    
    const testProjects = [
      {
        user_id: TEST_USER_ID,
        name: 'مشروع فيلا الرياض',
        description: 'مشروع إنشاء فيلا سكنية في حي العليا بالرياض',
        project_type: 'residential',
        location: 'الرياض، حي العليا',
        address: 'شارع الملك فهد، الرياض',
        city: 'الرياض',
        region: 'منطقة الرياض',
        status: 'in_progress',
        priority: 'high',
        budget: 800000,
        actual_cost: 320000,
        currency: 'SAR',
        progress_percentage: 40,
        start_date: '2024-01-15',
        expected_completion_date: '2024-12-15',
        is_active: true,
        plot_area: 600,
        building_area: 450,
        floors_count: 2,
        rooms_count: 5,
        bathrooms_count: 4
      },
      {
        user_id: TEST_USER_ID,
        name: 'مشروع شقة جدة',
        description: 'تجديد وتطوير شقة سكنية في جدة',
        project_type: 'renovation',
        location: 'جدة، حي الحمراء',
        address: 'شارع المدينة المنورة، جدة',
        city: 'جدة',
        region: 'منطقة مكة المكرمة',
        status: 'planning',
        priority: 'medium',
        budget: 300000,
        actual_cost: 45000,
        currency: 'SAR',
        progress_percentage: 15,
        start_date: '2024-03-01',
        expected_completion_date: '2024-08-01',
        is_active: true,
        building_area: 180,
        rooms_count: 3,
        bathrooms_count: 2
      },
      {
        user_id: TEST_USER_ID,
        name: 'مشروع مبنى تجاري',
        description: 'إنشاء مبنى تجاري متعدد الطوابق في الدمام',
        project_type: 'commercial',
        location: 'الدمام، حي الفيصلية',
        address: 'شارع الأمير محمد بن فهد، الدمام',
        city: 'الدمام',
        region: 'المنطقة الشرقية',
        status: 'construction',
        priority: 'urgent',
        budget: 2500000,
        actual_cost: 1200000,
        currency: 'SAR',
        progress_percentage: 48,
        start_date: '2023-09-01',
        expected_completion_date: '2024-06-01',
        is_active: true,
        plot_area: 1200,
        building_area: 3600,
        floors_count: 4
      },
      {
        user_id: TEST_USER_ID,
        name: 'مشروع مستودع',
        description: 'بناء مستودع صناعي في المدينة الصناعية',
        project_type: 'industrial',
        location: 'الرياض، المدينة الصناعية',
        address: 'المدينة الصناعية الثانية، الرياض',
        city: 'الرياض',
        region: 'منطقة الرياض',
        status: 'completed',
        priority: 'low',
        budget: 1200000,
        actual_cost: 1150000,
        currency: 'SAR',
        progress_percentage: 100,        start_date: '2023-05-01',
        expected_completion_date: '2024-01-01',
        is_active: false,
        plot_area: 2000,
        building_area: 1800,
        floors_count: 1
      },
      {
        user_id: TEST_USER_ID,
        name: 'مشروع توسعة منزل',
        description: 'توسعة منزل عائلي بإضافة جناح جديد',
        project_type: 'extension',
        location: 'الطائف، حي الشفاء',
        address: 'حي الشفاء، الطائف',
        city: 'الطائف',
        region: 'منطقة مكة المكرمة',
        status: 'design',
        priority: 'medium',
        budget: 450000,
        actual_cost: 89000,
        currency: 'SAR',
        progress_percentage: 20,
        start_date: '2024-02-01',
        expected_completion_date: '2024-09-01',
        is_active: true,
        plot_area: 800,
        building_area: 200,
        floors_count: 1,
        rooms_count: 2,
        bathrooms_count: 1
      },
      {
        user_id: TEST_USER_ID,
        name: 'مشروع حديقة وأسوار',
        description: 'تصميم وتنفيذ حديقة منزلية مع أسوار حديثة',
        project_type: 'landscaping',
        location: 'أبها، حي النسيم',
        address: 'حي النسيم، أبها',
        city: 'أبها',
        region: 'منطقة عسير',
        status: 'permits',
        priority: 'low',
        budget: 180000,
        actual_cost: 25000,
        currency: 'SAR',
        progress_percentage: 14,
        start_date: '2024-04-01',
        expected_completion_date: '2024-07-01',
        is_active: true,
        plot_area: 500
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
      
      // Check if it's a foreign key constraint error (user doesn't exist)
      if (insertError.message?.includes('foreign key') || insertError.message?.includes('user_id')) {
        console.log('\n🚨 Possible issue: The user ID may not exist in auth.users table');
        console.log('🔧 You may need to:');
        console.log('   1. Create the user account through the signup process');
        console.log('   2. Or check if the user ID is correct');
        console.log('   3. Or check if the database schema allows this user_id');
      }
      
      return;
    }

    console.log(`✅ Successfully created ${insertedProjects?.length || 0} test projects!`);
    
    if (insertedProjects && insertedProjects.length > 0) {
      console.log('📋 Created projects:');
      insertedProjects.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.name} (${p.id}) - Status: ${p.status}`);
      });
    }

    console.log('\n🎉 Database population completed!');
    console.log('🔧 Now try refreshing the projects page to see if they appear.');

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

// Run the check
console.log('🧪 Starting Database State Check and Population\n');
checkDatabaseState()
  .then(() => {
    console.log('\n🎉 Database check completed!');
  })
  .catch((error) => {
    console.error('\n💥 Database check failed:', error);
  });
