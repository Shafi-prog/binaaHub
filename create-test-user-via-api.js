const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function createTestUserAndProjects() {
  const testEmail = 'testuser@example.com';
  const testPassword = 'testpassword123';

  try {
    console.log('1. Creating test user via signup...');
    
    // First, try to sign up the user
    const signupResponse = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        name: 'Test User',
        account_type: 'individual'
      })
    });

    const signupResult = await signupResponse.json();
    console.log('Signup result:', signupResult);

    if (!signupResult.success && signupResult.error !== 'User already registered') {
      console.error('❌ Failed to create user:', signupResult.error);
      return;
    }

    console.log('2. Logging in to get session...');
    
    // Login to get session
    const loginResponse = await fetch(`${BASE_URL}/api/auth/sync-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });

    const loginResult = await loginResponse.json();
    console.log('Login result:', loginResult);

    if (!loginResult.success) {
      console.error('❌ Failed to login:', loginResult.error);
      return;
    }

    console.log('✅ User authenticated successfully');

    // Extract cookies from response
    const cookies = loginResponse.headers.get('set-cookie');
    console.log('Cookies received:', cookies);

    console.log('3. Creating test projects...');

    const testProjects = [
      {
        name: 'E-commerce Platform',
        description: 'Full-stack e-commerce solution with Next.js and Supabase',
        status: 'active',
        budget: 50000
      },
      {
        name: 'Mobile App Development',
        description: 'React Native mobile application for iOS and Android',
        status: 'active',
        budget: 35000
      },
      {
        name: 'Data Analytics Dashboard',
        description: 'Business intelligence dashboard with real-time analytics',
        status: 'completed',
        budget: 25000
      },
      {
        name: 'AI Chatbot Integration',
        description: 'Custom AI chatbot for customer support automation',
        status: 'active',
        budget: 40000
      },
      {
        name: 'Cloud Infrastructure Setup',
        description: 'AWS cloud infrastructure and DevOps automation',
        status: 'planning',
        budget: 30000
      },
      {
        name: 'API Gateway Development',
        description: 'Microservices API gateway with authentication and rate limiting',
        status: 'active',
        budget: 45000
      }
    ];

    for (let i = 0; i < testProjects.length; i++) {
      const project = testProjects[i];
      console.log(`Creating project ${i + 1}: ${project.name}`);

      const projectResponse = await fetch(`${BASE_URL}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookies || ''
        },
        body: JSON.stringify(project)
      });

      const projectResult = await projectResponse.json();
      console.log(`Project ${i + 1} result:`, projectResult);

      if (projectResult.success) {
        console.log(`✅ Project "${project.name}" created successfully`);
      } else {
        console.error(`❌ Failed to create project "${project.name}":`, projectResult.error);
      }
    }

    console.log('4. Verifying projects were created...');
    
    // Get projects to verify
    const getProjectsResponse = await fetch(`${BASE_URL}/api/projects`, {
      method: 'GET',
      headers: {
        'Cookie': cookies || ''
      }
    });

    const projectsResult = await getProjectsResponse.json();
    console.log('Projects verification:', projectsResult);

    if (projectsResult.success) {
      console.log(`✅ Total projects found: ${projectsResult.data?.length || 0}`);
      projectsResult.data?.forEach((project, index) => {
        console.log(`  ${index + 1}. ${project.name} (${project.status})`);
      });
    }

  } catch (error) {
    console.error('❌ Error creating test data:', error);
  }
}

if (require.main === module) {
  createTestUserAndProjects();
}

module.exports = { createTestUserAndProjects };
