const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Service Key exists:', !!supabaseServiceKey);

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTestUserAndProjects() {
  const testEmail = 'test@example.com';
  const testPassword = 'testpassword123';

  try {
    console.log('1. Creating test user...');
    
    // Create user using admin auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true
    });

    if (authError) {
      console.error('Error creating user:', authError);
      return;
    }

    console.log('✓ User created successfully:', authData.user.id);
    const userId = authData.user.id;

    console.log('2. Creating test projects...');

    const testProjects = [
      {
        name: 'E-commerce Platform',
        description: 'Full-stack e-commerce solution with Next.js and Supabase',
        status: 'active',
        budget: 50000,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        name: 'Mobile App Development',
        description: 'React Native mobile application for iOS and Android',
        status: 'active',
        budget: 35000,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        name: 'AI Chatbot Integration',
        description: 'Integrate AI-powered chatbot into existing website',
        status: 'completed',
        budget: 15000,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        name: 'Database Migration',
        description: 'Migrate legacy database to modern PostgreSQL setup',
        status: 'active',
        budget: 25000,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        name: 'API Development',
        description: 'RESTful API development with Node.js and Express',
        status: 'active',
        budget: 20000,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        name: 'UI/UX Redesign',
        description: 'Complete redesign of user interface and experience',
        status: 'completed',
        budget: 30000,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    for (let i = 0; i < testProjects.length; i++) {
      const project = testProjects[i];
      console.log(`Creating project ${i + 1}: ${project.name}`);
      
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert(project)
        .select()
        .single();

      if (projectError) {
        console.error(`Error creating project ${project.name}:`, projectError);
      } else {
        console.log(`✓ Project created: ${project.name} (ID: ${projectData.id})`);
      }
    }

    console.log('\n3. Verifying created data...');
    
    // Check user exists
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId);
    
    if (userError) {
      console.log('User profile not found, creating...');
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: testEmail,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (profileError) {
        console.error('Error creating profile:', profileError);
      } else {
        console.log('✓ User profile created');
      }
    } else {
      console.log('✓ User profile exists');
    }

    // Check projects
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId);

    if (projectsError) {
      console.error('Error fetching projects:', projectsError);
    } else {
      console.log(`✓ Total projects created: ${projectsData.length}`);
      console.log('Projects:', projectsData.map(p => ({ id: p.id, name: p.name, status: p.status })));
    }

    console.log('\n✓ Test data creation completed successfully!');
    console.log('\nLogin credentials:');
    console.log('Email:', testEmail);
    console.log('Password:', testPassword);
    console.log('\nYou can now login and check the dashboard at http://localhost:3000/user/projects');

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createTestUserAndProjects();
