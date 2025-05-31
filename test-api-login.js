// Quick API test for login endpoint
async function testLoginAPI() {
  const baseUrl = 'http://localhost:3004';

  console.log('🔐 Testing login API endpoints...\n');

  // Test user login
  console.log('👤 Testing user@user.com...');
  try {
    const userResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'user@user.com',
        password: '123456',
      }),
    });

    const userResult = await userResponse.json();
    console.log('Status:', userResponse.status);
    console.log('Response:', userResult);

    if (userResult.success) {
      console.log('✅ User login API working! Redirect to:', userResult.redirectTo);
    } else {
      console.log('❌ User login failed:', userResult.error);
    }
  } catch (error) {
    console.log('❌ User login error:', error.message);
  }

  console.log('\n🏪 Testing store@store.com...');
  try {
    const storeResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'store@store.com',
        password: '123456',
      }),
    });

    const storeResult = await storeResponse.json();
    console.log('Status:', storeResponse.status);
    console.log('Response:', storeResult);

    if (storeResult.success) {
      console.log('✅ Store login API working! Redirect to:', storeResult.redirectTo);
    } else {
      console.log('❌ Store login failed:', storeResult.error);
    }
  } catch (error) {
    console.log('❌ Store login error:', error.message);
  }
}

testLoginAPI();
