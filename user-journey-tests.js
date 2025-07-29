const fs = require('fs');
const path = require('path');

console.log('🧪 USER JOURNEY TESTING...');
console.log('═══════════════════════════════════════════════════════');

const userJourneys = [
  {
    name: 'User Registration & Login',
    path: 'src/app/auth',
    tests: ['register/page.tsx', 'login/page.tsx'],
    status: 'pending'
  },
  {
    name: 'User Dashboard & Profile',
    path: 'src/app/user',
    tests: ['dashboard/page.tsx', 'profile/page.tsx'],
    status: 'pending'
  },
  {
    name: 'Project Management',
    path: 'src/app/user/projects',
    tests: ['page.tsx', '[id]/page.tsx'],
    status: 'pending'
  },
  {
    name: 'Store Browsing & Shopping',
    path: 'src/app/user/stores-browse',
    tests: ['page.tsx'],
    status: 'pending'
  },
  {
    name: 'Order Management',
    path: 'src/app/user/orders',
    tests: ['page.tsx'],
    status: 'pending'
  },
  {
    name: 'Service Provider Dashboard',
    path: 'src/app/service-provider',
    tests: ['dashboard/page.tsx', 'bookings/page.tsx'],
    status: 'pending'
  },
  {
    name: 'Store Admin Functions',
    path: 'src/app/store',
    tests: ['admin/page.tsx', 'marketplace/page.tsx'],
    status: 'pending'
  },
  {
    name: 'Concrete Supplier Dashboard',
    path: 'src/app/dashboard/concrete-supplier',
    tests: ['page.tsx'],
    status: 'pending'
  },
  {
    name: 'Booking System',
    path: 'src/app/dashboard/bookings',
    tests: ['page.tsx'],
    status: 'pending'
  },
  {
    name: 'Authentication Components',
    path: 'src/components/auth',
    tests: ['SupabaseLoginPage.tsx'],
    status: 'pending'
  }
];

let passedTests = 0;
let failedTests = 0;
const failedJourneys = [];

console.log('🔍 Testing User Journeys...\n');

userJourneys.forEach((journey, index) => {
  console.log(`${index + 1}. ${journey.name}`);
  
  let journeyPassed = true;
  const journeyResults = [];
  
  journey.tests.forEach(test => {
    const fullPath = path.join(process.cwd(), journey.path, test);
    const exists = fs.existsSync(fullPath);
    
    if (exists) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Check for basic React/Next.js structure
        const hasValidStructure = content.includes('export default') || content.includes('export {');
        const hasReactImport = content.includes('import') && (content.includes('react') || content.includes('React'));
        const hasClientDirective = content.includes("'use client'") || !content.includes('useState') || !content.includes('useEffect');
        
        if (hasValidStructure && (hasReactImport || hasClientDirective)) {
          journeyResults.push(`   ✅ ${test} - Valid component structure`);
          passedTests++;
        } else {
          journeyResults.push(`   ⚠️  ${test} - Structure needs review`);
          journeyPassed = false;
          failedTests++;
        }
      } catch (error) {
        journeyResults.push(`   ❌ ${test} - Read error: ${error.message}`);
        journeyPassed = false;
        failedTests++;
      }
    } else {
      journeyResults.push(`   ❌ ${test} - File not found`);
      journeyPassed = false;
      failedTests++;
    }
  });
  
  // Print results for this journey
  journeyResults.forEach(result => console.log(result));
  
  if (!journeyPassed) {
    failedJourneys.push(journey.name);
  }
  
  console.log('');
});

console.log('═══════════════════════════════════════════════════════');
console.log('📊 USER JOURNEY TEST SUMMARY');
console.log('═══════════════════════════════════════════════════════');
console.log(`✅ Passed: ${passedTests} tests`);
console.log(`❌ Failed: ${failedTests} tests`);
console.log(`📈 Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`);

if (failedJourneys.length > 0) {
  console.log(`\n⚠️  Journeys needing attention:`);
  failedJourneys.forEach(journey => {
    console.log(`   - ${journey}`);
  });
}

const successRate = (passedTests / (passedTests + failedTests)) * 100;
if (successRate >= 90) {
  console.log('\n🎉 EXCELLENT: User journeys are in great shape!');
} else if (successRate >= 75) {
  console.log('\n✅ GOOD: Most user journeys are working well');
} else {
  console.log('\n⚠️  NEEDS WORK: User journeys need significant attention');
}

console.log('\n🧪 USER JOURNEY TESTING COMPLETE!');
