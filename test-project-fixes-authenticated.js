// Test script to verify project management fixes with proper authentication
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lqhopwohuddhapkhhikf.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxaG9wd29odWRkaGFwa2hoaWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5Njc1NjQsImV4cCI6MjA1OTU0MzU2NH0.Zze96fAMkynERwRFhyMF-F6_ds5WcwGckLD0qGQD9JQ';
const BASE_URL = 'http://localhost:3001';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test user credentials
const TEST_USER = {
  email: 'user@user.com',
  password: '123456'
};

// Helper function to make authenticated requests
async function makeAuthenticatedRequest(endpoint, options = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('No active session');
  }

  return fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
}

async function authenticateUser() {
  console.log('🔐 Step 1: Authenticating user...');
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: TEST_USER.email,
      password: TEST_USER.password
    });

    if (error || !data.user) {
      console.error('❌ Authentication failed:', error?.message);
      return false;
    }

    console.log('✅ Authentication successful');
    console.log(`📧 User: ${data.user.email}`);
    console.log(`🆔 User ID: ${data.user.id}`);
    return data.user;
  } catch (error) {
    console.error('❌ Authentication error:', error.message);
    return false;
  }
}

async function testProjectCreation(userId) {
  console.log('\n📋 Step 2: Testing project creation...');
  
  try {    const testProject = {
      name: 'Test Project - Schema Fix Validation',
      description: 'Testing the fixed schema mapping and project creation',
      project_type: 'residential',
      status: 'planning',
      address: 'Test Location, City',
      budget: 150000,
      end_date: '2024-06-01', // Use actual database column name
      user_id: userId
    };

    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .insert(testProject)
      .select()
      .single();

    if (projectError) {
      console.error('❌ Project creation failed:', projectError.message);
      return null;
    }

    console.log('✅ Project created successfully');
    console.log(`🆔 Project ID: ${projectData.id}`);
    console.log(`📝 Project Name: ${projectData.name}`);
    return projectData;
  } catch (error) {
    console.error('❌ Project creation error:', error.message);
    return null;
  }
}

async function testGetProjectById(projectId) {
  console.log('\n🔍 Step 3: Testing getProjectById function...');
  
  try {
    const response = await makeAuthenticatedRequest(`/api/dashboard/projects/${projectId}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ getProjectById API failed:', response.status, errorText);
      return false;
    }

    const result = await response.json();
    
    if (result.success && result.project) {
      console.log('✅ getProjectById successful');      console.log(`📝 Project retrieved: ${result.project.name}`);
      console.log(`📅 Expected completion: ${result.project.expected_completion_date || 'Not set'}`);
      console.log(`📅 Actual completion: ${result.project.actual_completion_date || 'Not set'}`);
      console.log(`💰 Budget: ${result.project.budget}`);
      return result.project;
    } else {
      console.error('❌ getProjectById returned error:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ getProjectById error:', error.message);
    return false;
  }
}

async function testUpdateProject(projectId) {
  console.log('\n✏️ Step 4: Testing updateProject function...');
  try {
    const updateData = {
      description: 'Updated test project with enhanced details',
      status: 'in_progress',
      expected_completion_date: '2024-07-01' // API should handle mapping to end_date
    };

    const response = await makeAuthenticatedRequest(`/api/dashboard/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ updateProject API failed:', response.status, errorText);
      return false;
    }

    const result = await response.json();
      if (result.success) {
      console.log('✅ updateProject successful');
      console.log(`📝 Description updated to: ${updateData.description}`);
      console.log(`📊 Status updated to: ${updateData.status}`);
      console.log(`📅 Expected completion updated to: ${updateData.expected_completion_date}`);
      return true;
    } else {
      console.error('❌ updateProject returned error:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ updateProject error:', error.message);
    return false;
  }
}

async function testNotificationCreation(projectId, userId) {
  console.log('\n🔔 Step 5: Testing notification creation...');
  
  try {
    const notificationData = {
      user_id: userId,
      project_id: projectId,
      title: 'Project Updated Successfully',
      message: 'Your project progress has been updated to 25%',
      notification_type: 'project_update',
      link: `/user/projects/${projectId}`
    };

    const response = await makeAuthenticatedRequest('/api/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Notification creation API failed:', response.status, errorText);
      return false;
    }

    const result = await response.json();
    
    if (result.success && result.notification) {
      console.log('✅ Notification created successfully');
      console.log(`🔔 Notification ID: ${result.notification.id}`);
      console.log(`📝 Title: ${result.notification.title}`);
      console.log(`🔗 Link: ${result.notification.link}`);
      return result.notification;
    } else {
      console.error('❌ Notification creation returned error:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Notification creation error:', error.message);
    return false;
  }
}

async function testProjectPageAccess(projectId) {
  console.log('\n🌐 Step 6: Testing project page access...');
  
  try {
    const response = await makeAuthenticatedRequest(`/user/projects/${projectId}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Project page access failed:', response.status, errorText);
      return false;
    }

    const pageContent = await response.text();
    
    // Check if the page contains the Arabic error message
    if (pageContent.includes('حدث خطأ في تحميل بيانات المشروع')) {
      console.error('❌ Project page still shows error: "حدث خطأ في تحميل بيانات المشروع"');
      return false;
    }

    console.log('✅ Project page loads successfully');
    console.log('✅ No "حدث خطأ في تحميل بيانات المشروع" error found');
    return true;
  } catch (error) {
    console.error('❌ Project page access error:', error.message);
    return false;
  }
}

async function cleanup(projectId) {
  console.log('\n🧹 Step 7: Cleaning up test data...');
  
  try {
    // Delete test project
    if (projectId) {
      const { error: projectDeleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (projectDeleteError) {
        console.error('❌ Failed to delete test project:', projectDeleteError.message);
      } else {
        console.log('✅ Test project deleted');
      }
    }

    // Sign out
    await supabase.auth.signOut();
    console.log('✅ User signed out');
  } catch (error) {
    console.error('❌ Cleanup error:', error.message);
  }
}

async function runCompleteTest() {
  console.log('🚀 Starting comprehensive project management fix verification...');
  console.log('=' .repeat(70));
  
  let testProject = null;
  let userId = null;

  try {
    // Step 1: Authenticate
    const user = await authenticateUser();
    if (!user) {
      console.log('\n❌ Test failed: Authentication required');
      return;
    }
    userId = user.id;

    // Step 2: Create test project
    testProject = await testProjectCreation(userId);
    if (!testProject) {
      console.log('\n❌ Test failed: Could not create test project');
      return;
    }

    // Step 3: Test getProjectById
    const retrievedProject = await testGetProjectById(testProject.id);
    if (!retrievedProject) {
      console.log('\n❌ Test failed: getProjectById function broken');
      return;
    }

    // Step 4: Test updateProject
    const updateSuccess = await testUpdateProject(testProject.id);
    if (!updateSuccess) {
      console.log('\n❌ Test failed: updateProject function broken');
      return;
    }

    // Step 5: Test notification creation
    const notification = await testNotificationCreation(testProject.id, userId);
    if (!notification) {
      console.log('\n❌ Test failed: Notification creation broken');
      return;
    }

    // Step 6: Test project page access
    const pageAccess = await testProjectPageAccess(testProject.id);
    if (!pageAccess) {
      console.log('\n❌ Test failed: Project page shows error');
      return;
    }

    // Final summary
    console.log('\n' + '='.repeat(70));
    console.log('🎉 ALL TESTS PASSED! Project management system fixes verified:');
    console.log('✅ getProjectById function - FIXED');
    console.log('✅ updateProject function - FIXED');  
    console.log('✅ Notification creation - FIXED');
    console.log('✅ Project page display - FIXED');
    console.log('✅ No "حدث خطأ في تحميل بيانات المشروع" error');
    console.log('=' .repeat(70));

  } catch (error) {
    console.error('\n❌ Test suite error:', error.message);
  } finally {
    // Always cleanup
    await cleanup(testProject?.id);
  }
}

// Run the test
runCompleteTest().catch(console.error);
