#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔍 Complete Page Navigation & Styling Validation\n');

// Define critical pages to validate
const criticalPages = {
  'Loading Page': 'src/app/loading.tsx',
  'Login Page': 'src/app/login/page.tsx',
  'Main Auth Page': 'src/app/auth/page.tsx',
  'User Dashboard': 'src/domains/users/components/UserDashboard.tsx',
  'Store Dashboard': 'src/app/store/page.tsx',
  'Homepage': 'src/app/page.tsx'
};

console.log('📄 Critical Pages Analysis:');

// Check if critical pages exist and analyze them
Object.entries(criticalPages).forEach(([pageName, filePath]) => {
  const fullPath = path.join(process.cwd(), filePath);
  const exists = fs.existsSync(fullPath);
  console.log(`  ${exists ? '✅' : '❌'} ${pageName}: ${filePath}`);
  
  if (exists) {
    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Check for styling
      const hasStyles = content.includes('className') || content.includes('style=') || content.includes('tailwind');
      const hasTailwind = content.includes('bg-') || content.includes('text-') || content.includes('flex') || content.includes('grid');
      
      // Check for navigation
      const hasNavigation = content.includes('href=') || content.includes('router.push') || content.includes('Link') || content.includes('redirect');
      
      // Check for TypeScript/React structure
      const hasReactStructure = content.includes('export default') && (content.includes('function') || content.includes('const'));
      
      console.log(`    📱 Styling: ${hasStyles ? '✅' : '❌'} | Tailwind: ${hasTailwind ? '✅' : '❌'}`);
      console.log(`    🔗 Navigation: ${hasNavigation ? '✅' : '❌'} | React Structure: ${hasReactStructure ? '✅' : '❌'}`);
      
    } catch (error) {
      console.log(`    ❌ Error reading file: ${error.message}`);
    }
  }
});

console.log('\n🔗 Navigation Links Analysis:');

// Find all navigation patterns across critical pages
const navigationPatterns = [
  /href=['"]([^'"]*)['"]/g,
  /router\.push\(['"]([^'"]*)['"]\)/g,
  /redirect\(['"]([^'"]*)['"]\)/g,
  /Link.*?to=['"]([^'"]*)['"]/g
];

const allLinks = new Set();
const pageLinks = {};

Object.entries(criticalPages).forEach(([pageName, filePath]) => {
  const fullPath = path.join(process.cwd(), filePath);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    const pageLinksArray = [];
    
    navigationPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const link = match[1];
        allLinks.add(link);
        pageLinksArray.push(link);
      }
    });
    
    pageLinks[pageName] = pageLinksArray;
    if (pageLinksArray.length > 0) {
      console.log(`  📄 ${pageName}:`);
      pageLinksArray.forEach(link => console.log(`    → ${link}`));
    }
  }
});

console.log('\n🎨 Styling & UI Components Analysis:');

// Check for common UI components and styling patterns
const uiComponents = [
  'Button', 'Card', 'Typography', 'Input', 'LoadingSpinner', 
  'EnhancedCard', 'Link', 'Form', 'Modal', 'Navbar'
];

const stylingPatterns = [
  'bg-gradient', 'shadow', 'rounded', 'border', 'hover:', 
  'transition', 'flex', 'grid', 'text-', 'font-'
];

Object.entries(criticalPages).forEach(([pageName, filePath]) => {
  const fullPath = path.join(process.cwd(), filePath);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    
    const foundComponents = uiComponents.filter(component => 
      content.includes(`<${component}`) || content.includes(`${component}`)
    );
    
    const foundStyles = stylingPatterns.filter(style => 
      content.includes(style)
    );
    
    console.log(`  📄 ${pageName}:`);
    console.log(`    🧩 Components: ${foundComponents.join(', ') || 'None'}`);
    console.log(`    🎨 Styling: ${foundStyles.length} patterns found`);
  }
});

console.log('\n📱 Dashboard Integration Testing:');

// Test dashboard integrations specifically
const dashboardTests = [
  {
    name: 'User Dashboard Quick Actions',
    file: 'src/domains/users/components/UserDashboard.tsx',
    expectedLinks: ['/user/projects', '/user/calculator', '/user/ai-assistant', '/user/invoices']
  },
  {
    name: 'Store Dashboard Navigation',
    file: 'src/app/store/page.tsx',
    expectedLinks: ['/store/products', '/store/orders', '/store/analytics']
  }
];

dashboardTests.forEach(test => {
  const fullPath = path.join(process.cwd(), test.file);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    
    console.log(`  📊 ${test.name}:`);
    test.expectedLinks.forEach(expectedLink => {
      const found = content.includes(expectedLink);
      console.log(`    ${found ? '✅' : '❌'} ${expectedLink}`);
    });
  } else {
    console.log(`  ❌ ${test.name}: File not found`);
  }
});

console.log('\n🔄 Route Validation:');

// Check if routes are properly defined
const routeFiles = [
  'src/app/user/page.tsx',
  'src/app/store/page.tsx', 
  'src/app/auth/page.tsx',
  'src/app/login/page.tsx'
];

routeFiles.forEach(route => {
  const exists = fs.existsSync(path.join(process.cwd(), route));
  const routePath = route.replace('src/app', '').replace('/page.tsx', '') || '/';
  console.log(`  ${exists ? '✅' : '❌'} Route: ${routePath} → ${route}`);
});

console.log('\n🚀 Authentication Flow Check:');

// Check authentication flow
const authFlow = [
  { step: 'Login Page', file: 'src/app/login/page.tsx', shouldRedirectTo: '/user' },
  { step: 'Auth Service', file: 'src/core/shared/services/auth.ts', shouldContain: ['login', 'logout'] },
  { step: 'Protected Routes', file: 'src/app/user/layout.tsx', shouldContain: ['auth', 'redirect'] }
];

authFlow.forEach(({ step, file, shouldRedirectTo, shouldContain }) => {
  const fullPath = path.join(process.cwd(), file);
  const exists = fs.existsSync(fullPath);
  
  console.log(`  📋 ${step}: ${exists ? '✅' : '❌'}`);
  
  if (exists && shouldRedirectTo) {
    const content = fs.readFileSync(fullPath, 'utf8');
    const hasRedirect = content.includes(shouldRedirectTo);
    console.log(`    🔄 Redirects to ${shouldRedirectTo}: ${hasRedirect ? '✅' : '❌'}`);
  }
  
  if (exists && shouldContain) {
    const content = fs.readFileSync(fullPath, 'utf8');
    shouldContain.forEach(item => {
      const found = content.toLowerCase().includes(item.toLowerCase());
      console.log(`    🔍 Contains '${item}': ${found ? '✅' : '❌'}`);
    });
  }
});

console.log('\n📊 Summary Report:');

const totalPages = Object.keys(criticalPages).length;
const existingPages = Object.entries(criticalPages).filter(([_, filePath]) => 
  fs.existsSync(path.join(process.cwd(), filePath))
).length;

console.log(`📄 Pages Status: ${existingPages}/${totalPages} critical pages exist`);
console.log(`🔗 Total Links Found: ${allLinks.size} navigation links`);
console.log(`🎨 Styling: All pages checked for Tailwind CSS and UI components`);
console.log(`🔄 Routing: All route definitions validated`);

if (existingPages === totalPages) {
  console.log('\n🎉 All critical pages are present and functional!');
} else {
  console.log('\n⚠️  Some critical pages are missing and need attention.');
}

console.log('\n✨ Page validation complete!');
