// Test complete authentication flow with proper cookie handling
async function testCompleteAuthFlow() {
  console.log('🧪 Testing Complete Authentication Flow');
  console.log('='.repeat(50));

  try {
    // Step 1: Login and capture cookies
    console.log('\n📝 Step 1: Logging in...');
    const loginResponse = await fetch('http://localhost:3002/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'store@store.com',
        password: '123456'
      }),
    });

    console.log(`Login Status: ${loginResponse.status}`);
    
    if (!loginResponse.ok) {
      const error = await loginResponse.text();
      console.error('❌ Login failed:', error);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login Response:', {
      success: loginData.success,
      redirectTo: loginData.redirectTo,
      userEmail: loginData.user?.email,
      accountType: loginData.user?.account_type
    });

    // Extract all Set-Cookie headers
    const setCookieHeaders = [];
    for (const [key, value] of loginResponse.headers) {
      if (key.toLowerCase() === 'set-cookie') {
        setCookieHeaders.push(value);
      }
    }
    
    console.log('🍪 Cookies from login:', setCookieHeaders.length ? 'Present' : 'None');
    if (setCookieHeaders.length > 0) {
      setCookieHeaders.forEach((cookie, i) => {
        const cookieName = cookie.split('=')[0];
        console.log(`  Cookie ${i + 1}: ${cookieName}`);
      });
    }

    // Step 2: Test middleware with protected route
    console.log('\n🛡️ Step 2: Testing middleware with protected route...');
    
    const cookieHeader = setCookieHeaders.map(cookie => cookie.split(';')[0]).join('; ');
    console.log('🍪 Sending cookies:', cookieHeader ? 'Yes' : 'No');

    const protectedResponse = await fetch(`http://localhost:3002${loginData.redirectTo}`, {
      headers: {
        'Cookie': cookieHeader
      },
      redirect: 'manual'
    });

    console.log(`Protected route status: ${protectedResponse.status}`);
    
    if (protectedResponse.status === 307 || protectedResponse.status === 302) {
      const redirectLocation = protectedResponse.headers.get('location');
      console.log(`Redirect to: ${redirectLocation}`);
      
      if (redirectLocation?.includes('/login')) {
        console.error('❌ MIDDLEWARE FAILED: Redirected back to login');
        console.error('   This means the Supabase auth helpers are not working properly');
        
        // Step 3: Debug what cookies the server sees
        console.log('\n🔍 Step 3: Debugging server-side cookies...');
        const debugResponse = await fetch('http://localhost:3002/api/check-cookies', {
          headers: {
            'Cookie': cookieHeader
          }
        });

        if (debugResponse.ok) {
          const debugData = await debugResponse.json();
          console.log('Server sees cookies:', {
            total: debugData.total,
            names: debugData.cookies.map(c => c.name)
          });
        }
      } else {
        console.log('🔄 Middleware redirect (possibly normal)');
      }
    } else if (protectedResponse.status === 200) {
      console.log('✅ SUCCESS: Protected route accessible!');
      console.log('✅ Authentication flow is working correctly');
    } else {
      console.log(`🤔 Unexpected status: ${protectedResponse.status}`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run test if this file is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  const { fetch } = await import('node-fetch');
  global.fetch = fetch;
  testCompleteAuthFlow();
} else {
  // Browser environment
  testCompleteAuthFlow();
}
