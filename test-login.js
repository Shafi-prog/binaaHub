// Test authentication flows
const testStore = async () => {
  try {
    console.log('Testing store authentication...');
    const response = await fetch('http://localhost:3000/api/auth/sync-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'teststore@store.com', password: '123456' })
    });
    const result = await response.json();
    console.log('Store auth result:', result.success ? '✅ SUCCESS' : '❌ FAILED');
    if (!result.success) console.log('Error:', result.error);
  } catch (error) {
    console.log('Store auth error:', error.message);
  }
};

const testUser = async () => {
  try {
    console.log('Testing user authentication...');
    const response = await fetch('http://localhost:3000/api/auth/sync-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@user.com', password: '123456' })
    });
    const result = await response.json();
    console.log('User auth result:', result.success ? '✅ SUCCESS' : '❌ FAILED');
    if (!result.success) console.log('Error:', result.error);
    else console.log('Redirect to:', result.redirect_to);
  } catch (error) {
    console.log('User auth error:', error.message);
  }
};

// Run tests
testStore().then(() => testUser());
