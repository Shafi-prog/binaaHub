const fetch = require('node-fetch');

async function testCreateProject() {
  try {
    const projectData = {
      user_id: "416d0ef0-ffa0-4999-b9af-870a6f00bed0",
      name: "Test Project",
      description: "Test project to verify save functionality",
      project_type: "renovation",
      budget: 50000,
      address: "Test Location, Lagos",
      status: "planning"
    };

    const response = await fetch('http://localhost:54321/rest/v1/projects', {
      method: 'POST',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(projectData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Project created successfully:', JSON.stringify(result, null, 2));
    } else {
      const error = await response.text();
      console.error('Error creating project:', response.status, error);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

testCreateProject();
