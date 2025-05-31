// Quick test script to verify login redirection fix
const testLoginRedirection = async () => {
  console.log('🧪 Testing Login Redirection Fix...\n');

  const baseUrl = 'http://localhost:3001';

  // Test credentials
  const credentials = [
    {
      email: 'user@user.com',
      password: '123456',
      expectedRedirect: '/user/dashboard',
      type: 'User',
    },
    {
      email: 'store@store.com',
      password: '123456',
      expectedRedirect: '/store/dashboard',
      type: 'Store',
    },
  ];

  for (const cred of credentials) {
    console.log(`🔐 Testing ${cred.type} login (${cred.email})...`);

    try {
      // Test API login
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cred.email,
          password: cred.password,
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log(`✅ API Login Success`);
        console.log(`   User: ${result.user.email}`);
        console.log(`   Account Type: ${result.user.account_type}`);
        console.log(`   Expected Redirect: ${cred.expectedRedirect}`);
        console.log(`   Actual Redirect: ${result.redirectTo}`);
        console.log(`   Session Present: ${result.session ? 'Yes' : 'No'}`);

        if (result.redirectTo === cred.expectedRedirect) {
          console.log(`✅ Redirect URL matches expected!`);
        } else {
          console.log(`❌ Redirect URL mismatch!`);
        }

        // Test if dashboard page is accessible
        try {
          const dashboardResponse = await fetch(`${baseUrl}${result.redirectTo}`);
          console.log(
            `   Dashboard Access: ${dashboardResponse.status === 200 ? 'Accessible' : `HTTP ${dashboardResponse.status}`}`,
          );
        } catch (dashError) {
          console.log(`   Dashboard Access: Error - ${dashError.message}`);
        }
      } else {
        console.log(`❌ API Login Failed: ${result.error}`);
      }
    } catch (error) {
      console.log(`❌ Test Error: ${error.message}`);
    }

    console.log(''); // Empty line for readability
  }

  console.log('🎯 Next Steps:');
  console.log('1. Manual test: Go to http://localhost:3001/login');
  console.log('2. Login with user@user.com / 123456');
  console.log('3. Verify redirection to /user/dashboard');
  console.log('4. Test store login: store@store.com / 123456');
  console.log('5. Verify redirection to /store/dashboard');
};

// Run the test
testLoginRedirection().catch(console.error);
