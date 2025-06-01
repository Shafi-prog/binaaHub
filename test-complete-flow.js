// Comprehensive test for logout/login flow
const testCompleteFlow = async () => {
  console.log('🧪 Testing complete logout/login flow...\n');

  try {
    // Step 1: Login as user
    console.log('1. Testing user login...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/sync-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@user.com', password: '123456' })
    });
    const loginResult = await loginResponse.json();
    
    if (loginResult.success) {
      console.log('✅ User login successful - redirects to:', loginResult.redirect_to);
    } else {
      console.log('❌ User login failed:', loginResult.error);
      return;
    }

    // Step 2: Verify session is active
    console.log('\n2. Checking session status...');
    const sessionResponse = await fetch('http://localhost:3000/api/auth/sync-login', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const sessionResult = await sessionResponse.json();
    
    if (sessionResult.success) {
      console.log('✅ Session is active for:', sessionResult.user.email);
    } else {
      console.log('❌ Session check failed:', sessionResult.error);
    }

    // Step 3: Logout
    console.log('\n3. Testing logout...');
    const logoutResponse = await fetch('http://localhost:3000/api/auth/sync-login', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    const logoutResult = await logoutResponse.json();
    
    if (logoutResult.success) {
      console.log('✅ Logout successful');
    } else {
      console.log('❌ Logout failed:', logoutResult.error);
    }

    // Step 4: Verify session is cleared
    console.log('\n4. Verifying session is cleared...');
    const sessionResponse2 = await fetch('http://localhost:3000/api/auth/sync-login', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const sessionResult2 = await sessionResponse2.json();
    
    if (!sessionResult2.success) {
      console.log('✅ Session properly cleared');
    } else {
      console.log('❌ Session still active - potential issue');
    }

    // Step 5: Test login again
    console.log('\n5. Testing login again after logout...');
    const loginResponse2 = await fetch('http://localhost:3000/api/auth/sync-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'teststore@store.com', password: '123456' })
    });
    const loginResult2 = await loginResponse2.json();
    
    if (loginResult2.success) {
      console.log('✅ Store login successful after logout - redirects to:', loginResult2.redirect_to);
      console.log('✅ Account type:', loginResult2.user.account_type);
    } else {
      console.log('❌ Store login failed after logout:', loginResult2.error);
    }

    console.log('\n🎉 Complete flow test finished!');

  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
};

// Run the test
testCompleteFlow();
