// Test script to verify the login fix works properly
// This tests the new client-side authentication approach

const testLoginFix = async () => {
  console.log('🧪 Testing Login Fix - Client-Side Authentication');
  console.log('='.repeat(60));

  // Test configuration
  const testUser = {
    email: 'admin@binna.com',
    password: 'admin123',
  };

  const testStore = {
    email: 'store@binna.com',
    password: 'store123',
  };

  // Helper function to simulate form submission
  const simulateLogin = async (credentials, expectedRedirect) => {
    console.log(`\n🔐 Testing login for: ${credentials.email}`);
    console.log(`📍 Expected redirect: ${expectedRedirect}`);

    try {
      // This simulates what happens in the browser
      const response = await fetch('http://localhost:3003/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include', // Important for cookies
      });

      const result = await response.json();

      console.log(`📊 API Response Status: ${response.status}`);
      console.log(`📊 API Response:`, result);

      if (response.ok && result.success) {
        console.log(`✅ API authentication successful`);
        console.log(`📋 Account Type: ${result.accountType}`);
        console.log(`🎯 Redirect URL: ${result.redirectTo}`);

        // Verify redirect matches expectation
        if (result.redirectTo === expectedRedirect) {
          console.log(`✅ Correct redirect path`);
        } else {
          console.log(
            `❌ Incorrect redirect path. Expected: ${expectedRedirect}, Got: ${result.redirectTo}`,
          );
        }
      } else {
        console.log(`❌ API authentication failed: ${result.error}`);
      }

      return { success: response.ok && result.success, result };
    } catch (error) {
      console.error(`❌ Login test failed:`, error.message);
      return { success: false, error: error.message };
    }
  };

  // Test Cases
  console.log('\n🔍 Test Case 1: User Account Login');
  const userTest = await simulateLogin(testUser, '/user/dashboard');

  console.log('\n🔍 Test Case 2: Store Account Login');
  const storeTest = await simulateLogin(testStore, '/store/dashboard');

  // Test invalid credentials
  console.log('\n🔍 Test Case 3: Invalid Credentials');
  const invalidTest = await simulateLogin(
    { email: 'invalid@test.com', password: 'wrongpass' },
    null,
  );

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📋 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`User Login: ${userTest.success ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Store Login: ${storeTest.success ? '✅ PASS' : '❌ FAIL'}`);
  console.log(
    `Invalid Login: ${!invalidTest.success ? '✅ PASS (correctly rejected)' : '❌ FAIL (should have been rejected)'}`,
  );

  const allPassed = userTest.success && storeTest.success && !invalidTest.success;
  console.log(`\n🎯 Overall Result: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);

  if (allPassed) {
    console.log('\n🎉 Authentication fix appears to be working correctly!');
    console.log('🚀 Next step: Test the actual login flow in the browser');
  } else {
    console.log('\n⚠️  Some issues detected. Check the individual test results above.');
  }
};

// Run the test
testLoginFix().catch(console.error);
