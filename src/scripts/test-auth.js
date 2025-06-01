// Test script to verify store login functionality
const testStoreLogin = async () => {
  const loginData = {
    email: 'teststore@store.com',
    password: '123456',
    remember_me: false,
  };

  try {
    console.log('🧪 Testing store login...');

    const response = await fetch('http://localhost:3000/api/auth/sync-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    const result = await response.json();

    console.log('📊 Login Response Status:', response.status);
    console.log('📊 Login Response:', result);

    if (result.success) {
      console.log('✅ Store login successful!');
      console.log('🚀 Redirect URL:', result.redirect_to);
      console.log('👤 User Account Type:', result.user?.account_type);
    } else {
      console.log('❌ Store login failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
};

// Also test regular user login
const testUserLogin = async () => {
  const loginData = {
    email: 'user@user.com',
    password: '123456',
    remember_me: false,
  };

  try {
    console.log('🧪 Testing user login...');

    const response = await fetch('http://localhost:3000/api/auth/sync-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    const result = await response.json();

    console.log('📊 User Login Response Status:', response.status);
    console.log('📊 User Login Response:', result);

    if (result.success) {
      console.log('✅ User login successful!');
      console.log('🚀 Redirect URL:', result.redirect_to);
      console.log('👤 User Account Type:', result.user?.account_type);
    } else {
      console.log('❌ User login failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
};

// Run tests
console.log('🔬 Starting authentication tests...\n');
testStoreLogin()
  .then(() => {
    console.log('\n');
    return testUserLogin();
  })
  .then(() => {
    console.log('\n🎉 Authentication tests completed!');
  });
