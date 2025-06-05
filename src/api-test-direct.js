// =============================================================================
// DIRECT API TEST FOR PROJECT CREATION
// =============================================================================
// This will test the project creation API directly

const testData = {
  name: "API Test Project - " + new Date().toLocaleString(),
  description: "Testing project creation via direct API call",
  project_type: "residential",
  status: "planning",
  budget: 175000,
  start_date: "2025-08-01",
  end_date: "2025-12-15",
  city: "Jeddah",
  region: "Makkah Region",
  district: "Al Hamra",
  country: "Saudi Arabia",
  lat: 21.4858,
  lng: 39.1925,
  priority: "high",
  is_active: true
};

async function testAPIDirectly() {
  console.log("🔧 TESTING PROJECT CREATION API");
  console.log("===============================");
  
  try {
    // Simulate calling the API endpoint
    const apiUrl = 'http://localhost:3003/api/projects/create';
    
    console.log("📤 Sending request to:", apiUrl);
    console.log("📝 Test data:", JSON.stringify(testData, null, 2));
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    console.log("📨 Response status:", response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log("✅ SUCCESS! Project created:");
      console.log(JSON.stringify(result, null, 2));
    } else {
      const error = await response.text();
      console.log("❌ FAILED! Error:", error);
    }
    
  } catch (error) {
    console.log("❌ NETWORK ERROR:", error.message);
  }
}

// Test form submission data
function testFormData() {
  console.log("📋 FORM DATA TEST");
  console.log("=================");
  
  const formData = new FormData();
  Object.keys(testData).forEach(key => {
    formData.append(key, testData[key]);
  });
  
  console.log("✅ Form data prepared with keys:", Array.from(formData.keys()));
  
  // Convert to object for display
  const formObject = {};
  formData.forEach((value, key) => {
    formObject[key] = value;
  });
  
  console.log("📄 Form object:", JSON.stringify(formObject, null, 2));
}

// Test database compatibility
function testDatabaseCompatibility() {
  console.log("🗄️ DATABASE COMPATIBILITY TEST");
  console.log("==============================");
  
  // Fields that should work with current schema
  const basicFields = {
    name: testData.name,
    description: testData.description,
    project_type: testData.project_type,
    status: testData.status,
    budget: testData.budget,
    start_date: testData.start_date,
    end_date: testData.end_date,
    location_lat: testData.lat,
    location_lng: testData.lng,
    address: `${testData.country} - ${testData.region} - ${testData.city} - ${testData.district}`
  };
  
  console.log("✅ Basic compatible fields:");
  console.log(JSON.stringify(basicFields, null, 2));
  
  // Fields that need database migration
  const enhancedFields = {
    city: testData.city,
    region: testData.region,
    district: testData.district,
    country: testData.country,
    priority: testData.priority,
    is_active: testData.is_active
  };
  
  console.log("⚠️  Enhanced fields (need migration):");
  console.log(JSON.stringify(enhancedFields, null, 2));
}

// Run all tests
console.log("🧪 PROJECT CREATION API TESTS");
console.log("=============================");
console.log("Date:", new Date().toISOString());
console.log();

testFormData();
console.log();
testDatabaseCompatibility();
console.log();

console.log("🎯 MANUAL TESTING STEPS:");
console.log("========================");
console.log("1. Open your browser developer tools");
console.log("2. Navigate to: http://localhost:3003/user/projects/new");
console.log("3. Fill the form with the test data above");
console.log("4. Submit and check the Network tab for API calls");
console.log("5. Check Console for any JavaScript errors");
console.log();

console.log("📋 TEST DATA FOR MANUAL ENTRY:");
console.log("==============================");
Object.keys(testData).forEach(key => {
  console.log(`${key}: ${testData[key]}`);
});

console.log();
console.log("✅ Test preparation complete!");

export { testData, testAPIDirectly, testFormData, testDatabaseCompatibility };
