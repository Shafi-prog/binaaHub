// Test script to verify authentication issues are fixed
console.log('🧪 Starting authentication fix verification...');

async function testAuthFlow() {
  try {
    // Test 1: Login API
    console.log('\n1️⃣ Testing login API...');
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'user@user.com',
        password: '123456',
      }),
      credentials: 'include',
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }

    const loginResult = await loginResponse.json();
    console.log('✅ Login successful:', loginResult.user.email);
    console.log('🎯 Redirect URL:', loginResult.redirectTo);

    // Test 2: Protected route access
    console.log('\n2️⃣ Testing protected route access...');

    // Wait a moment for cookies to be set
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const protectedResponse = await fetch('http://localhost:3001/user/dashboard', {
      credentials: 'include',
      redirect: 'manual',
    });

    console.log('🔐 Dashboard response status:', protectedResponse.status);

    if (protectedResponse.status === 200) {
      console.log('✅ Protected route accessible - authentication working!');
    } else if (protectedResponse.status === 302 || protectedResponse.status === 307) {
      const redirectLocation = protectedResponse.headers.get('location');
      console.log('🔄 Redirected to:', redirectLocation);
      if (redirectLocation && redirectLocation.includes('/login')) {
        console.log('❌ Still redirecting to login - authentication issue exists');
      }
    }

    // Test 3: New project page
    console.log('\n3️⃣ Testing new project page...');
    const newProjectResponse = await fetch('http://localhost:3001/user/projects/new', {
      credentials: 'include',
      redirect: 'manual',
    });

    console.log('📋 New project response status:', newProjectResponse.status);

    if (newProjectResponse.status === 200) {
      console.log('✅ New project page accessible');
    } else if (newProjectResponse.status === 302 || newProjectResponse.status === 307) {
      const redirectLocation = newProjectResponse.headers.get('location');
      console.log('🔄 New project redirected to:', redirectLocation);
    }

    // Test 4: Profile page
    console.log('\n4️⃣ Testing profile page...');
    const profileResponse = await fetch('http://localhost:3001/user/profile', {
      credentials: 'include',
      redirect: 'manual',
    });

    console.log('👤 Profile response status:', profileResponse.status);

    if (profileResponse.status === 200) {
      console.log('✅ Profile page accessible');
    } else if (profileResponse.status === 302 || profileResponse.status === 307) {
      const redirectLocation = profileResponse.headers.get('location');
      console.log('🔄 Profile redirected to:', redirectLocation);
    }

    console.log('\n🎉 Authentication test completed!');
  } catch (error) {
    console.error('❌ Authentication test failed:', error.message);
  }
}

// Run the test
testAuthFlow();
