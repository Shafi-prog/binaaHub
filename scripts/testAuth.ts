/**
 * Authentication Test Script
 * Run this after creating a test user through the signup form
 */

async function testLogin(email: string, password: string) {
  console.log(`🔐 Testing login for: ${email}`);
  
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Login successful!');
      console.log('📄 Response:', result);
      return result;
    } else {
      console.log('❌ Login failed');
      console.log('📄 Error:', result);
      return null;
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    return null;
  }
}

// Test cases
async function runTests() {
  console.log('🚀 Starting authentication tests...\n');
  
  // Test with common test credentials
  const testCredentials = [
    { email: 'user@user.com', password: 'password123' },
    { email: 'test@test.com', password: 'password123' },
    { email: 'store@store.com', password: 'password123' }
  ];
  
  for (const creds of testCredentials) {
    await testLogin(creds.email, creds.password);
    console.log('---\n');
  }
}

if (typeof window !== 'undefined') {
  // Browser environment
  (window as any).testLogin = testLogin;
  (window as any).runTests = runTests;
  console.log('🔧 Test functions loaded. Use testLogin("email", "password") or runTests() in console.');
} else {
  // Node environment
  runTests();
}
