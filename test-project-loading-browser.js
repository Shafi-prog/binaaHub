/**
 * Test the project loading after fixing the error handling
 */
const testUrl = 'http://localhost:3000/user/projects';

async function testProjectLoading() {
  console.log('🧪 Testing Project Loading with Improved Error Handling');
  console.log('======================================================');

  try {
    // Step 1: Test the main projects page
    console.log('\n1️⃣ Testing projects list page...');
    const response = await fetch(testUrl);
    
    if (response.ok) {
      console.log('✅ Projects page loads successfully');
      const html = await response.text();
      
      // Look for project links in the HTML
      const projectLinkPattern = /href="\/user\/projects\/([^"]+)"/g;
      const matches = [...html.matchAll(projectLinkPattern)];
      
      if (matches.length > 0) {
        console.log(`✅ Found ${matches.length} project links`);
        
        // Test the first project
        const firstProjectId = matches[0][1];
        console.log(`\n2️⃣ Testing individual project page: ${firstProjectId}`);
        
        const projectResponse = await fetch(`http://localhost:3000/user/projects/${firstProjectId}`);
        
        if (projectResponse.ok) {
          console.log('✅ Individual project page loads successfully');
          const projectHtml = await projectResponse.text();
          
          // Check for error indicators
          if (projectHtml.includes('حدث خطأ في تحميل بيانات المشروع')) {
            console.log('❌ Arabic error message still present');
          } else {
            console.log('✅ No Arabic error message found');
          }
          
          if (projectHtml.includes('Error loading project data')) {
            console.log('❌ English error message present');
          } else {
            console.log('✅ No English error message found');
          }
          
        } else {
          console.log(`❌ Individual project page failed: ${projectResponse.status}`);
          const errorText = await projectResponse.text();
          console.log('Error response:', errorText.slice(0, 500));
        }
        
      } else {
        console.log('⚠️  No project links found in the page');
      }
      
    } else {
      console.log(`❌ Projects page failed: ${response.status}`);
    }

    // Step 3: Test API endpoints directly
    console.log('\n3️⃣ Testing API endpoints...');
    
    // Get cookies from the main page for authentication
    const mainPageResponse = await fetch('http://localhost:3000/');
    const cookies = mainPageResponse.headers.get('set-cookie');
    
    const apiHeaders = {
      'Content-Type': 'application/json',
    };
    
    if (cookies) {
      apiHeaders['Cookie'] = cookies;
    }
    
    // Test projects API
    const apiResponse = await fetch('http://localhost:3000/api/projects', {
      headers: apiHeaders
    });
    
    if (apiResponse.ok) {
      const projects = await apiResponse.json();
      console.log(`✅ API returned ${projects.length || 0} projects`);
      
      if (projects.length > 0) {
        // Test individual project API
        const testProject = projects[0];
        const projectApiResponse = await fetch(`http://localhost:3000/api/projects/${testProject.id}`, {
          headers: apiHeaders
        });
        
        if (projectApiResponse.ok) {
          console.log('✅ Individual project API works');
        } else {
          console.log(`❌ Individual project API failed: ${projectApiResponse.status}`);
        }
      }
      
    } else {
      console.log(`❌ Projects API failed: ${apiResponse.status}`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Browser environment check
if (typeof window !== 'undefined') {
  // Running in browser
  testProjectLoading().then(() => {
    console.log('\n🎉 Browser test completed');
  });
} else {
  // Running in Node.js
  console.log('ℹ️  This test is designed for browser environment');
  console.log('Please open the browser console at http://localhost:3000 and run this script');
}
