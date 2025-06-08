import { createProject } from "./lib/api/dashboard";

async function testCreateProject() {
  try {
    const projectData = {
      name: "Test Project",
      description: "A test project for Supabase schema validation.",
      project_type: "residential",
      status: "planning",
      address: "123 Test St",
      budget: 10000,
      start_date: "2025-06-03",
      end_date: "2025-12-31",
      city: "Test City",
      region: "Test Region",
      district: "Test District",
      country: "Test Country",
      priority: "medium",
      is_active: true,
    };
    console.log("Creating project with data:", projectData);
    const result = await createProject(projectData);
    if (result && result.id) {
      console.log("Project created successfully:", result);
    } else {
      console.error("Project creation failed:", result);
    }
  } catch (error) {
    console.error("Error during project creation:", error);
  }
}

testCreateProject();
