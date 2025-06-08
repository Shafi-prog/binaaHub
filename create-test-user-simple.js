// Create a test user for authentication testing
const BASE_URL = 'http://localhost:3005';

// Try existing test credentials first
const TEST_USERS = [
  { email: 'user@user.com', password: '123456', description: 'Standard test user' },
  { email: 'store@store.com', password: '123456', description: 'Store test user' },
  { email: 'test@binna.com', password: 'Test123!', description: 'Custom test user' },
];

async function testExistingUsers() {
  console.log('🔧 Testing existing user credentials...');

  for (const user of TEST_USERS) {
    console.log(`\n👤 Testing ${user.description}: ${user.email}`);

    try {
      const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          password: user.password,
        }),
      });

      const loginData = await loginResponse.json();
      console.log('Login Response Status:', loginResponse.status);
      console.log('Login Response:', loginData);

      if (loginData.success) {
        console.log(`✅ ${user.description} login SUCCESSFUL!`);
        console.log('Email:', user.email);
        console.log('Password:', user.password);
        console.log('Account Type:', loginData.user.account_type);
        console.log('Redirect To:', loginData.redirectTo);

        // This user works, we can use it for testing
        return user;
      } else {
        console.log(`❌ ${user.description} login failed:`, loginData.error);
      }
    } catch (error) {
      console.error(`❌ Error testing ${user.description}:`, error.message);
    }
  }

  console.log('\n❌ No working test users found. You may need to create a user via signup page.');
  return null;
}

async function testWithWorkingUser(user) {
  if (!user) {
    console.log('❌ No working user to test with');
    return;
  }

  console.log(`\n🧪 Running authentication flow test with ${user.email}...`);

  try {
    // Step 1: Login
    console.log('1️⃣ Testing login...');
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        password: user.password,
      }),
    });

    const loginData = await loginResponse.json();

    if (!loginData.success) {
      throw new Error(`Login failed: ${loginData.error}`);
    }

    console.log('✅ Login successful');

    // Step 2: Test middleware with new project route
    console.log('\n2️⃣ Testing /user/projects/new access...');

    // Wait a moment for session to propagate
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newProjectResponse = await fetch(`${BASE_URL}/user/projects/new`, {
      method: 'GET',
      redirect: 'manual',
    });

    console.log('New Project Route Response:', {
      status: newProjectResponse.status,
      statusText: newProjectResponse.statusText,
      location: newProjectResponse.headers.get('location'),
    });

    if (newProjectResponse.status === 200) {
      console.log('🎉 SUCCESS! /user/projects/new is accessible!');
      console.log('✅ Authentication fix is working!');
    } else if (newProjectResponse.status === 307) {
      console.log('❌ STILL BLOCKED: Route redirects to login');
      console.log('🔧 Enhanced middleware needs more work');
    } else {
      console.log(`⚠️ Unexpected status: ${newProjectResponse.status}`);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

async function main() {
  console.log('🚀 Enhanced Authentication Fix Test');
  console.log('===================================');

  const workingUser = await testExistingUsers();
  await testWithWorkingUser(workingUser);

  console.log('\n📋 Next Steps:');
  console.log('1. If no users work, create one via: http://localhost:3005/signup');
  console.log('2. Update this script with the new credentials');
  console.log('3. Re-run the test');
}

main();
