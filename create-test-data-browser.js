// Simple script to create test user and projects using the browser environment

async function createTestUserAndProjects() {
    console.log('🧪 Starting Test User and Projects Creation via Browser API');
    
    const testEmail = 'test@example.com';
    const testPassword = 'testpassword123';
    
    try {
        // Step 1: Sign up the test user
        console.log('1️⃣ Creating test user account...');
        
        const signupResponse = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: testEmail,
                password: testPassword,
                name: 'Test User',
                account_type: 'user'
            })
        });
        
        if (!signupResponse.ok) {
            const signupError = await signupResponse.json();
            console.log('ℹ️ Signup response:', signupError.message);
            
            // If user already exists, try to sign in
            if (signupError.message && signupError.message.includes('already')) {
                console.log('📝 User exists, trying to sign in...');
            }
        } else {
            console.log('✅ User created successfully');
        }
        
        // Step 2: Sign in to get authenticated session
        console.log('2️⃣ Signing in...');
        
        const signinResponse = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: testEmail,
                password: testPassword
            })
        });
        
        const signinResult = await signinResponse.json();
        
        if (!signinResponse.ok) {
            console.error('❌ Signin failed:', signinResult.error);
            return;
        }
        
        console.log('✅ Signin successful');
        
        // Step 3: Create test projects
        console.log('3️⃣ Creating test projects...');
        
        const testProjects = [
            {
                name: 'E-commerce Platform',
                description: 'Modern online shopping platform with React and Node.js',
                status: 'completed',
                budget: 15000,
                client_name: 'TechCorp Solutions',
                project_type: 'web_development'
            },
            {
                name: 'Mobile Banking App',
                description: 'Secure mobile banking application for iOS and Android',
                status: 'in_progress',
                budget: 25000,
                client_name: 'SecureBank Ltd',
                project_type: 'mobile_development'
            },
            {
                name: 'CRM Dashboard',
                description: 'Customer relationship management dashboard',
                status: 'completed',
                budget: 8000,
                client_name: 'BusinessFlow Inc',
                project_type: 'web_development'
            },
            {
                name: 'Data Analytics Platform',
                description: 'Real-time data analytics and visualization platform',
                status: 'in_progress',
                budget: 30000,
                client_name: 'DataTech Analytics',
                project_type: 'data_analytics'
            },
            {
                name: 'Inventory Management System',
                description: 'Comprehensive inventory tracking and management system',
                status: 'completed',
                budget: 12000,
                client_name: 'LogiFlow Systems',
                project_type: 'enterprise_software'
            },
            {
                name: 'Social Media Campaign Tool',
                description: 'Social media management and campaign optimization tool',
                status: 'planning',
                budget: 18000,
                client_name: 'MarketReach Agency',
                project_type: 'marketing_automation'
            }
        ];
        
        // Create projects one by one
        for (let i = 0; i < testProjects.length; i++) {
            const project = testProjects[i];
            console.log(`📝 Creating project ${i + 1}: ${project.name}`);
            
            const projectResponse = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(project)
            });
            
            if (projectResponse.ok) {
                const createdProject = await projectResponse.json();
                console.log(`✅ Project created: ${createdProject.id}`);
            } else {
                const error = await projectResponse.json();
                console.error(`❌ Failed to create project ${project.name}:`, error);
            }
        }
        
        console.log('🎉 Test data creation completed!');
        console.log(`📧 Test credentials: ${testEmail} / ${testPassword}`);
        console.log('🔗 Now visit: http://localhost:3000/user/projects');
        
    } catch (error) {
        console.error('💥 Unexpected error:', error);
    }
}

// Run the function
createTestUserAndProjects();
