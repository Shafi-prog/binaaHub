/**
 * Live Form Validation Test Suite
 * Tests actual form submissions through the web interface
 * Validates schema alignment between forms and database
 */

const BASE_URL = 'http://localhost:3000';

// Test data for different forms
const testData = {
  project: {
    name: "Test Construction Project",
    description: "Live testing project creation with complete schema validation",
    project_type: "construction",
    status: "planning",
    address: "123 Test Street, Riyadh",
    budget: 150000,
    start_date: "2025-06-15",
    end_date: "2025-12-15",
    city: "Riyadh",
    region: "Riyadh Region",
    district: "Al Olaya",
    country: "Saudi Arabia",
    priority: "high",
    location_lat: 24.7136,
    location_lng: 46.6753
  },
  
  order: {
    store_id: "test-store-123",
    items: [
      {
        product_id: "prod-123",
        product_name: "Test Product",
        quantity: 2,
        unit_price: 250.00,
        total_price: 500.00
      }
    ],
    total_amount: 500.00,
    status: "pending",
    delivery_address: "456 Delivery St, Jeddah",
    delivery_city: "Jeddah",
    delivery_region: "Makkah Region",
    payment_method: "card",
    notes: "Test order for schema validation"
  },
  
  warranty: {
    product_name: "Test Warranty Product",
    product_model: "TWP-2025",
    serial_number: "SN123456789",
    purchase_date: "2025-01-15",
    warranty_period_months: 24,
    store_name: "Test Store",
    purchase_price: 1500.00,
    category: "electronics",
    description: "Testing warranty creation with full schema validation",
    issue_type: "defect",
    issue_description: "Product malfunction for testing",
    priority: "medium",
    status: "pending"
  },
  
  userProfile: {
    full_name: "John Test User",
    phone: "+966501234567",
    occupation: "Software Developer",
    company_name: "Test Company Ltd",
    preferred_language: "en",
    notification_preferences: {
      email: true,
      sms: false,
      push: true
    }
  },
  
  storeProfile: {
    store_name: "Test Hardware Store",
    description: "A comprehensive hardware store for testing",
    category: "hardware",
    phone: "+966501234567",
    email: "test@hardwarestore.com",
    address: "789 Business District",
    city: "Dammam",
    region: "Eastern Province",
    website: "https://testhardware.com",
    working_hours: {
      sunday: { open: "08:00", close: "22:00" },
      monday: { open: "08:00", close: "22:00" },
      tuesday: { open: "08:00", close: "22:00" },
      wednesday: { open: "08:00", close: "22:00" },
      thursday: { open: "08:00", close: "22:00" },
      friday: { open: "14:00", close: "22:00" },
      saturday: { open: "08:00", close: "22:00" }
    },
    payment_methods: ["cash", "card", "bank_transfer"],
    delivery_areas: ["Dammam", "Khobar", "Dhahran"]
  }
};

// API Testing Functions
async function testAPI(endpoint, method, data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(`${BASE_URL}/api${endpoint}`, options);
    const result = await response.json();
    
    return {
      success: response.ok,
      status: response.status,
      data: result,
      endpoint,
      method
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      endpoint,
      method
    };
  }
}

// Test Suite Functions
async function testProjectCreation() {
  console.log('🏗️ Testing Project Creation API...');
  const result = await testAPI('/projects', 'POST', testData.project);
  console.log('Project Creation Result:', result);
  return result;
}

async function testOrderCreation() {
  console.log('🛒 Testing Order Creation API...');
  const result = await testAPI('/orders/create', 'POST', testData.order);
  console.log('Order Creation Result:', result);
  return result;
}

async function testWarrantyCreation() {
  console.log('🛡️ Testing Warranty Creation API...');
  const result = await testAPI('/warranty-claims', 'POST', testData.warranty);
  console.log('Warranty Creation Result:', result);
  return result;
}

async function testStoreCreation() {
  console.log('🏪 Testing Store Creation API...');
  const result = await testAPI('/stores', 'POST', testData.storeProfile);
  console.log('Store Creation Result:', result);
  return result;
}

// Main Test Runner
async function runLiveValidationTests() {
  console.log('🚀 Starting Live Form Validation Tests...');
  console.log('='*50);
  
  const results = {
    project: await testProjectCreation(),
    order: await testOrderCreation(),
    warranty: await testWarrantyCreation(),
    store: await testStoreCreation()
  };
  
  console.log('\n📊 Test Results Summary:');
  console.log('='*50);
  
  let passedTests = 0;
  let totalTests = 0;
  
  Object.entries(results).forEach(([testName, result]) => {
    totalTests++;
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${testName.toUpperCase()} API: ${result.status || 'Error'}`);
    
    if (result.success) {
      passedTests++;
    } else {
      console.log(`   Error: ${result.error || result.data?.error || 'Unknown error'}`);
    }
  });
  
  console.log('\n📈 Final Score:');
  console.log(`${passedTests}/${totalTests} tests passed (${Math.round(passedTests/totalTests*100)}%)`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All schema validations PASSED! Forms are properly aligned with database.');
  } else {
    console.log('⚠️ Some tests failed. Check API routes and database connections.');
  }
  
  return results;
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.runLiveValidationTests = runLiveValidationTests;
  window.testData = testData;
  console.log('Live validation test functions loaded. Run: runLiveValidationTests()');
}

// Node.js execution
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runLiveValidationTests,
    testData,
    testAPI
  };
}
