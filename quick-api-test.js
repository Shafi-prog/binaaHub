// Test script to verify login API
async function testLoginAPI() {
  console.log('🔧 Testing login API...');
  
  try {
    console.log('👤 Testing user@user.com...');
    const userResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'user@user.com',
        password: '123456'
      }),
    });
    
    console.log('Response status:', userResponse.status);
    const userResult = await userResponse.json();
    console.log('Response data:', userResult);
    
    if (userResult.success) {
      console.log('✅ User login API working!');
      console.log('👤 User:', userResult.user.email);
      console.log('🎯 Account Type:', userResult.user.account_type);
      console.log('🚀 Redirect to:', userResult.redirectTo);
    } else {
      console.log('❌ User login failed:', userResult.error);
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error);
  }
}

testLoginAPI();
