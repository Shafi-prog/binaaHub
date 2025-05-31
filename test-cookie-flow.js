// Simple cookie test for authentication flow
async function testAuthFlow() {
  console.log('🧪 Testing authentication flow with cookies...');

  const baseUrl = 'http://localhost:3002';

  try {
    // Step 1: Login and get cookies
    console.log('1. Attempting login...');
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'user@example.com',
        password: 'password123',
      }),
    });

    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);

    // Extract cookies
    const cookies = loginResponse.headers.get('set-cookie');
    console.log('Set-Cookie header:', cookies);

    if (!loginData.success) {
      console.error('❌ Login failed:', loginData.error);
      return;
    }

    // Step 2: Try to access dashboard with cookies
    console.log('2. Accessing dashboard with cookies...');
    const dashboardResponse = await fetch(`${baseUrl}/user/dashboard`, {
      method: 'GET',
      headers: {
        Cookie: cookies || '',
      },
      redirect: 'manual',
    });

    console.log('Dashboard response status:', dashboardResponse.status);
    console.log('Dashboard response headers:', Object.fromEntries(dashboardResponse.headers));

    if (dashboardResponse.status === 307 || dashboardResponse.status === 302) {
      const location = dashboardResponse.headers.get('location');
      console.log('Redirected to:', location);
    } else {
      console.log('Dashboard accessed successfully');
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAuthFlow();
