const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3006';

async function testCompleteAuthFlow() {
  console.log('🚀 Complete Authentication Flow Test - Port 3006');
  console.log('=================================================');

  try {
    // Step 1: Test login
    console.log('\n1️⃣ Testing login API...');
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'user@user.com',
        password: '123456',
      }),
    });

    const loginData = await loginResponse.json();
    console.log('Login Response Status:', loginResponse.status);
    console.log('Login Response Data:', loginData);

    // Extract cookies from login response
    const setCookieHeaders = loginResponse.headers.raw()['set-cookie'] || [];
    console.log('Set-Cookie Headers:', setCookieHeaders);

    // Parse cookies for subsequent requests
    const cookies = setCookieHeaders.map((cookie) => cookie.split(';')[0]).join('; ');
    console.log('Parsed Cookies:', cookies);

    if (!loginData.success) {
      console.log('❌ Login failed, stopping test');
      return;
    }

    console.log('✅ Login successful!');

    // Step 2: Test dashboard access (should work)
    console.log('\n2️⃣ Testing dashboard access...');
    const dashboardResponse = await fetch(`${BASE_URL}/user/dashboard`, {
      headers: {
        Cookie: cookies,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    console.log('Dashboard Status:', dashboardResponse.status);
    console.log('Dashboard Headers:', Object.fromEntries(dashboardResponse.headers.entries()));

    if (dashboardResponse.status === 200) {
      console.log('✅ Dashboard accessible');
    } else {
      console.log('❌ Dashboard not accessible');
    }

    // Step 3: Test new project route (the problematic one)
    console.log('\n3️⃣ Testing /user/projects/new access...');
    const newProjectResponse = await fetch(`${BASE_URL}/user/projects/new`, {
      headers: {
        Cookie: cookies,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      redirect: 'manual', // Don't follow redirects automatically
    });

    console.log('New Project Status:', newProjectResponse.status);
    console.log('New Project Headers:', Object.fromEntries(newProjectResponse.headers.entries()));

    if (newProjectResponse.status === 200) {
      console.log('✅ New Project route accessible');
    } else if (newProjectResponse.status === 307 || newProjectResponse.status === 302) {
      const location = newProjectResponse.headers.get('location');
      console.log(`❌ Redirected to: ${location}`);
      console.log('🔍 This indicates middleware is still blocking the route');
    }

    // Step 4: Test projects list page
    console.log('\n4️⃣ Testing /user/projects access...');
    const projectsResponse = await fetch(`${BASE_URL}/user/projects`, {
      headers: {
        Cookie: cookies,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      redirect: 'manual',
    });

    console.log('Projects List Status:', projectsResponse.status);
    if (projectsResponse.status === 200) {
      console.log('✅ Projects list accessible');
    } else if (projectsResponse.status === 307 || projectsResponse.status === 302) {
      const location = projectsResponse.headers.get('location');
      console.log(`❌ Projects list redirected to: ${location}`);
    }

    // Step 5: Test with just_logged_in cookie explicitly
    console.log('\n5️⃣ Testing with just_logged_in cookie...');
    const cookiesWithFlag = cookies + '; just_logged_in=true';
    const flaggedResponse = await fetch(`${BASE_URL}/user/projects/new`, {
      headers: {
        Cookie: cookiesWithFlag,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      redirect: 'manual',
    });

    console.log('With Flag Status:', flaggedResponse.status);
    if (flaggedResponse.status === 200) {
      console.log('✅ Route accessible with just_logged_in flag');
    } else if (flaggedResponse.status === 307 || flaggedResponse.status === 302) {
      const location = flaggedResponse.headers.get('location');
      console.log(`❌ Still redirected to: ${location}`);
    }
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testCompleteAuthFlow();
