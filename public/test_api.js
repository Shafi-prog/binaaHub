// Test API endpoint for creating project
const projectData = {
  name: "Test Project from API",
  description: "Testing project creation through API endpoint",
  project_type: "renovation",
  address: "Test Location, Lagos",
  start_date: "2024-06-01",
  end_date: "2024-12-31",
  budget: 50000
};

async function testAPI() {
  try {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Project created successfully:', result);
    } else {
      const error = await response.text();
      console.error('Error:', response.status, error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testAPI();
