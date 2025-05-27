// Test complete authentication flow with Supabase auth helpers
const BASE_URL = 'http://localhost:3002';

async function testCompleteAuthFlow() {
  console.log('🧪 Testing Complete Authentication Flow with Supabase Auth Helpers');
  console.log('='.repeat(80));

  try {
    // Step 1: Test login API
    console.log('\n📝 Step 1: Testing login API...');
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'user@example.com',
        password: 'password123'
      }),
    });

    console.log(`Login API Status: ${loginResponse.status}`);
    
    if (!loginResponse.ok) {
      const error = await loginResponse.text();
      console.error('❌ Login API failed:', error);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login API Response:', {
      success: loginData.success,
      redirectTo: loginData.redirectTo,
      userEmail: loginData.user?.email,
      accountType: loginData.user?.account_type
    });

    // Extract cookies from login response
    const setCookieHeaders = loginResponse.headers.get('set-cookie') || '';
    console.log('🍪 Set-Cookie headers from login:', setCookieHeaders ? 'Present' : 'None');

    // Step 2: Test middleware by accessing protected route
    console.log('\n🛡️ Step 2: Testing middleware with protected route...');
    
    // Make request to protected route with cookies
    const protectedResponse = await fetch(`${BASE_URL}${loginData.redirectTo}`, {
      headers: {
        'Cookie': setCookieHeaders
      },
      redirect: 'manual' // Don't follow redirects automatically
    });

    console.log(`Protected route status: ${protectedResponse.status}`);
    console.log(`Protected route location: ${protectedResponse.headers.get('location') || 'none'}`);

    if (protectedResponse.status === 307 || protectedResponse.status === 302) {
      const redirectLocation = protectedResponse.headers.get('location');
      if (redirectLocation?.includes('/login')) {
        console.error('❌ Middleware redirected to login - authentication failed');
        console.error('This means cookies are not being transmitted properly to middleware');
      } else {
        console.log('🔄 Middleware redirect to:', redirectLocation);
      }
    } else if (protectedResponse.status === 200) {
      console.log('✅ Protected route accessible - authentication successful!');
    }

    // Step 3: Test check-cookies API to see what middleware sees
    console.log('\n🍪 Step 3: Testing what cookies middleware receives...');
    const cookieCheckResponse = await fetch(`${BASE_URL}/api/check-cookies`, {
      headers: {
        'Cookie': setCookieHeaders
      }
    });

    if (cookieCheckResponse.ok) {
      const cookieData = await cookieCheckResponse.json();
      console.log('Server-side cookies:', {
        total: cookieData.total,
        supabaseRelated: cookieData.cookies.filter(c => 
          c.name.includes('supabase') || 
          c.name.includes('sb-') ||
          c.name.includes('auth')
        ).length,
        hasAuthTokens: cookieData.cookies.some(c => 
          c.name.includes('access') || 
          c.name.includes('refresh') ||
          c.name.includes('sb-')
        )
      });
    }

    // Step 4: Test verification page flow
    console.log('\n✅ Step 4: Testing verification page...');
    const verifyResponse = await fetch(`${BASE_URL}/verify-auth`, {
      headers: {
        'Cookie': setCookieHeaders
      },
      redirect: 'manual'
    });

    console.log(`Verify page status: ${verifyResponse.status}`);
    if (verifyResponse.status === 307 || verifyResponse.status === 302) {
      console.log(`Verify page redirect: ${verifyResponse.headers.get('location')}`);
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testCompleteAuthFlow();
