// Simple test to check projects directly
// Usage: Open browser console and run this script

console.log('🔍 Starting direct database test...');

// This simulates what should happen in the browser
async function testProjectsInBrowser() {
  try {
    // Test if we can access the projects API directly
    const response = await fetch('/api/projects', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Projects API response:', data);
    } else {
      console.log('❌ Projects API failed:', response.status);
    }
  } catch (error) {
    console.error('❌ Error testing projects API:', error);
  }
}

// You can run this in the browser console
console.log('📝 To test projects API, run: testProjectsInBrowser()');
window.testProjectsInBrowser = testProjectsInBrowser;
