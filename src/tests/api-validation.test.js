/**
 * API Endpoint Validation Test
 * Tests all API routes we created during schema validation
 */

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

// Test data for API validation
const testData = {
  project: {
    user_id: "test-user-123",
    name: "Schema Validation Test Project",
    description: "Testing project creation with validated schema",
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
    user_id: "test-user-123",
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
    user_id: "test-user-123",
    product_name: "Test Warranty Product",
    product_model: "TWP-2025",
    serial_number: "SN123456789",
    purchase_date: "2025-01-15",
    warranty_period_months: 24,
    store_name: "Test Store",
    purchase_price: 1500.00,
    category: "electronics",
    description: "Testing warranty creation with full schema validation"
  },
  
  store: {
    user_id: "test-user-123",
    store_name: "Test Hardware Store",
    description: "A comprehensive hardware store for testing",
    category: "hardware",
    phone: "+966501234567",
    email: "test@hardwarestore.com",
    address: "789 Business District",
    city: "Dammam",
    region: "Eastern Province",
    website: "https://testhardware.com"
  }
};

async function testEndpoint(endpoint, method = 'GET', data = null) {
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
    const result = await response.text();
    
    let jsonResult;
    try {
      jsonResult = JSON.parse(result);
    } catch {
      jsonResult = { message: result };
    }
    
    return {
      success: response.ok,
      status: response.status,
      data: jsonResult,
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

async function runAPIValidationTests() {
  console.log('🚀 Starting API Endpoint Validation Tests...');
  console.log('=' * 60);
  
  const tests = [
    // Test GET endpoints first
    { name: 'Projects GET', endpoint: '/projects', method: 'GET' },
    { name: 'Orders GET', endpoint: '/orders', method: 'GET' },
    { name: 'Warranty Claims GET', endpoint: '/warranty-claims', method: 'GET' },
    { name: 'Stores GET', endpoint: '/stores', method: 'GET' },
    
    // Test POST endpoints with data
    { name: 'Projects POST', endpoint: '/projects', method: 'POST', data: testData.project },
    { name: 'Orders POST', endpoint: '/orders/create', method: 'POST', data: testData.order },
    { name: 'Warranty Claims POST', endpoint: '/warranty-claims', method: 'POST', data: testData.warranty },
    { name: 'Stores POST', endpoint: '/stores', method: 'POST', data: testData.store }
  ];
  
  const results = [];
  
  for (const test of tests) {
    console.log(`\n🔍 Testing ${test.name}...`);
    const result = await testEndpoint(test.endpoint, test.method, test.data);
    results.push({ ...test, result });
    
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${test.name}: ${result.status}`);
    
    if (!result.success) {
      console.log(`   Error: ${result.error || result.data?.error || 'Unknown error'}`);
    } else if (result.data?.message) {
      console.log(`   Response: ${result.data.message}`);
    }
  }
  
  console.log('\n📊 Test Results Summary:');
  console.log('=' * 60);
  
  const passedTests = results.filter(r => r.result.success).length;
  const totalTests = results.length;
  
  results.forEach(({ name, result }) => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${name}: ${result.status || 'Error'}`);
  });
  
  console.log(`\n📈 Final Score: ${passedTests}/${totalTests} tests passed (${Math.round(passedTests/totalTests*100)}%)`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All API endpoints are working! Schema validation is complete.');
  } else {
    console.log('⚠️ Some endpoints failed. This may be due to authentication or database issues.');
  }
  
  return results;
}

// Run the tests
runAPIValidationTests().catch(console.error);
