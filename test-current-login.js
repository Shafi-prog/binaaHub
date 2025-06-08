// Test script to verify login API and redirection
const testLoginFlow = async () => {
  console.log('🔐 Testing login flow...');

  // Test user login
  try {
    console.log('👤 Testing user login...');
    const userResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'user@user.com',
        password: '123456',
      }),
    });

    const userResult = await userResponse.json();
    console.log('User login result:', userResult);

    if (userResult.success) {
      console.log('✅ User login successful');
      console.log('🎯 Redirect to:', userResult.redirectTo);
      console.log('👤 Account type:', userResult.user.account_type);
    } else {
      console.log('❌ User login failed:', userResult.error);
    }
  } catch (error) {
    console.log('❌ User login error:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test store login
  try {
    console.log('🏪 Testing store login...');
    const storeResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'store@store.com',
        password: '123456',
      }),
    });

    const storeResult = await storeResponse.json();
    console.log('Store login result:', storeResult);

    if (storeResult.success) {
      console.log('✅ Store login successful');
      console.log('🎯 Redirect to:', storeResult.redirectTo);
      console.log('🏪 Account type:', storeResult.user.account_type);
    } else {
      console.log('❌ Store login failed:', storeResult.error);
    }
  } catch (error) {
    console.log('❌ Store login error:', error.message);
  }

  console.log('\n🎉 Login API test completed!');
};

testLoginFlow();
