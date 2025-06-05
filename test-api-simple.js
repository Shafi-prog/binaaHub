// Simple test using fetch to check the API endpoint
async function testProjectsAPI() {
  console.log('🔍 Testing projects API endpoint...\n');
  
  try {
    console.log('📊 Making request to /api/projects');
    const response = await fetch('http://localhost:3000/api/projects', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Response:', JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('❌ API Error:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Fetch error:', error);
  }
}

testProjectsAPI();
