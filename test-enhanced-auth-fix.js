/**
 * Enhanced Authentication Fix Test
 * Tests the complete authentication flow including the problematic new project route
 */

const BASE_URL = 'http://localhost:3005';

// Test user credentials (replace with actual test user)
const TEST_USER = {
  email: 'hadi@test.com',
  password: 'Admin@123',
};

async function testEnhancedAuthFix() {
  console.log('🧪 ENHANCED AUTHENTICATION FIX TEST');
  console.log('====================================');

  try {
    // Step 1: Test login API with enhanced cookies
    console.log('\n1️⃣ Testing enhanced login API...');
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(TEST_USER),
    });

    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);

    if (!loginData.success) {
      throw new Error(`Login failed: ${loginData.error}`);
    }

    // Get cookies from login response
    const setCookieHeaders = loginResponse.headers.get('set-cookie');
    console.log('Set-Cookie headers:', setCookieHeaders ? 'Present' : 'Missing');

    // Step 2: Test server-side auth debugging
    console.log('\n2️⃣ Testing server-side auth state...');
    const debugResponse = await fetch(`${BASE_URL}/api/debug-auth`, {
      headers: {
        Cookie: setCookieHeaders || '',
      },
    });

    const debugData = await debugResponse.json();
    console.log('Server-side auth state:', debugData);

    // Step 3: Test the problematic new project route
    console.log('\n3️⃣ Testing /user/projects/new route...');
    const newProjectResponse = await fetch(`${BASE_URL}/user/projects/new`, {
      method: 'GET',
      headers: {
        Cookie: setCookieHeaders || '',
      },
      redirect: 'manual', // Don't follow redirects to see what happens
    });

    console.log('New project route response:', {
      status: newProjectResponse.status,
      statusText: newProjectResponse.statusText,
      redirected: newProjectResponse.redirected,
      location: newProjectResponse.headers.get('location'),
    });

    // Step 4: Check if middleware logs are working
    console.log('\n4️⃣ Middleware should show enhanced logging in the dev server console');

    if (newProjectResponse.status === 200) {
      console.log('✅ SUCCESS: /user/projects/new is accessible!');
    } else if (
      newProjectResponse.status === 307 &&
      newProjectResponse.headers.get('location')?.includes('/login')
    ) {
      console.log('❌ STILL REDIRECTING: The route is still redirecting to login');
    } else {
      console.log('⚠️ UNEXPECTED: Got unexpected response:', newProjectResponse.status);
    }

    // Step 5: Test dashboard access (should still work)
    console.log('\n5️⃣ Testing dashboard access...');
    const dashboardResponse = await fetch(`${BASE_URL}/user/dashboard`, {
      method: 'GET',
      headers: {
        Cookie: setCookieHeaders || '',
      },
      redirect: 'manual',
    });

    console.log('Dashboard response:', {
      status: dashboardResponse.status,
      redirected: dashboardResponse.redirected,
    });

    console.log('\n📊 TEST SUMMARY:');
    console.log('================');
    console.log('Login API:', loginData.success ? '✅ Working' : '❌ Failed');
    console.log('Server auth state:', debugData.hasSession ? '✅ Has session' : '❌ No session');
    console.log(
      'New project route:',
      newProjectResponse.status === 200 ? '✅ Accessible' : '❌ Blocked'
    );
    console.log('Dashboard access:', dashboardResponse.status === 200 ? '✅ Working' : '❌ Issues');
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testEnhancedAuthFix();
