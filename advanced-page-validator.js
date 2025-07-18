#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 Advanced Page Styling & Links Validator\n');

// Enhanced validation with detailed styling checks
function validatePageStructure(filePath, pageName) {
  if (!fs.existsSync(filePath)) {
    return { exists: false };
  }

  const content = fs.readFileSync(filePath, 'utf8');
  
  // Detailed styling analysis
  const stylingChecks = {
    hasTailwindClasses: /className.*?["'][^"']*(?:bg-|text-|flex|grid|p-|m-|w-|h-)[^"']*["']/.test(content),
    hasResponsiveDesign: /(?:sm:|md:|lg:|xl:)/.test(content),
    hasGradients: /bg-gradient/.test(content),
    hasShadows: /shadow/.test(content),
    hasTransitions: /transition/.test(content),
    hasHoverEffects: /hover:/.test(content),
    hasRTLSupport: /rtl:|dir=/.test(content),
    hasArabicText: /[\u0600-\u06FF]/.test(content)
  };

  // Navigation analysis
  const navigationChecks = {
    hasLinks: /href=["'][^"']*["']/.test(content),
    hasRouterPush: /router\.push/.test(content),
    hasLinkComponent: /<Link/.test(content),
    hasRedirect: /redirect/.test(content),
    hasNavigation: /useRouter|useNavigation/.test(content)
  };

  // Component usage
  const componentChecks = {
    hasButton: /<Button/.test(content),
    hasCard: /<(?:Card|EnhancedCard)/.test(content),
    hasTypography: /<Typography/.test(content),
    hasForm: /<(?:Form|form)/.test(content),
    hasInput: /<Input/.test(content),
    hasLoading: /LoadingSpinner|loading/.test(content)
  };

  // Extract all links
  const linkMatches = content.match(/(?:href|router\.push\(|to)=["']([^"']*)["']/g) || [];
  const extractedLinks = linkMatches.map(match => {
    const linkMatch = match.match(/["']([^"']*)["']/);
    return linkMatch ? linkMatch[1] : '';
  }).filter(link => link);

  // Check for proper React structure
  const reactStructure = {
    hasExport: /export\s+default/.test(content),
    hasFunction: /function\s+\w+|const\s+\w+\s*=.*?=>/.test(content),
    hasUseState: /useState/.test(content),
    hasUseEffect: /useEffect/.test(content),
    hasTypeScript: /interface\s|type\s/.test(content)
  };

  return {
    exists: true,
    styling: stylingChecks,
    navigation: navigationChecks,
    components: componentChecks,
    reactStructure,
    extractedLinks,
    contentLength: content.length,
    linesCount: content.split('\n').length
  };
}

// Comprehensive page definitions
const pagesConfig = {
  'Loading Page': {
    file: 'src/app/loading.tsx',
    expectedFeatures: ['LoadingSpinner', 'transition', 'centered'],
    shouldRedirectTo: null
  },
  'Login Page': {
    file: 'src/app/login/page.tsx',
    expectedFeatures: ['Form', 'Input', 'Button', 'auth'],
    shouldRedirectTo: '/user'
  },
  'Auth Page': {
    file: 'src/app/auth/page.tsx',
    expectedFeatures: ['authentication', 'redirect'],
    shouldRedirectTo: '/user'
  },
  'User Dashboard': {
    file: 'src/domains/users/components/UserDashboard.tsx',
    expectedFeatures: ['quickActions', 'dashboardCards', 'navigation'],
    expectedLinks: ['/user/projects', '/user/calculator', '/user/ai-assistant']
  },
  'Store Dashboard': {
    file: 'src/app/store/page.tsx',
    expectedFeatures: ['analytics', 'products', 'orders'],
    expectedLinks: ['/store/products', '/store/orders']
  },
  'User Layout': {
    file: 'src/app/user/layout.tsx',
    expectedFeatures: ['authentication', 'layout'],
    shouldRedirectTo: '/login'
  },
  'Main Homepage': {
    file: 'src/app/page.tsx',
    expectedFeatures: ['landing', 'navigation'],
    expectedLinks: ['/auth', '/login']
  }
};

console.log('📄 Detailed Page Analysis:\n');

const results = {};

Object.entries(pagesConfig).forEach(([pageName, config]) => {
  const fullPath = path.join(process.cwd(), config.file);
  const result = validatePageStructure(fullPath, pageName);
  results[pageName] = { ...result, config };

  console.log(`🔍 ${pageName}:`);
  console.log(`  📁 File: ${config.file}`);
  console.log(`  ✅ Exists: ${result.exists ? 'Yes' : 'No'}`);

  if (result.exists) {
    console.log(`  📏 Size: ${result.linesCount} lines, ${(result.contentLength/1024).toFixed(1)}KB`);
    
    // Styling analysis
    console.log(`  🎨 Styling:`);
    Object.entries(result.styling).forEach(([check, passed]) => {
      console.log(`    ${passed ? '✅' : '❌'} ${check.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
    });

    // Navigation analysis
    console.log(`  🔗 Navigation:`);
    Object.entries(result.navigation).forEach(([check, passed]) => {
      console.log(`    ${passed ? '✅' : '❌'} ${check.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
    });

    // Components analysis
    console.log(`  🧩 Components:`);
    Object.entries(result.components).forEach(([check, passed]) => {
      console.log(`    ${passed ? '✅' : '❌'} ${check.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
    });

    // Links found
    if (result.extractedLinks.length > 0) {
      console.log(`  🔗 Links Found (${result.extractedLinks.length}):`);
      result.extractedLinks.forEach(link => console.log(`    → ${link}`));
    }

    // Expected features check
    if (config.expectedFeatures) {
      console.log(`  🎯 Expected Features:`);
      config.expectedFeatures.forEach(feature => {
        const content = fs.readFileSync(fullPath, 'utf8');
        const found = content.toLowerCase().includes(feature.toLowerCase());
        console.log(`    ${found ? '✅' : '❌'} ${feature}`);
      });
    }

    // Expected links check
    if (config.expectedLinks) {
      console.log(`  📋 Expected Links:`);
      config.expectedLinks.forEach(expectedLink => {
        const found = result.extractedLinks.some(link => link.includes(expectedLink));
        console.log(`    ${found ? '✅' : '❌'} ${expectedLink}`);
      });
    }
  }
  
  console.log('');
});

console.log('🔄 Flow Validation:\n');

// Test complete user flow
const userFlows = [
  {
    name: 'Authentication Flow',
    steps: [
      { page: 'Homepage', action: 'Navigate to login', target: '/login' },
      { page: 'Login Page', action: 'Successful login', target: '/user' },
      { page: 'User Dashboard', action: 'Access features', target: 'various' }
    ]
  },
  {
    name: 'Store Management Flow', 
    steps: [
      { page: 'Login', action: 'Store login', target: '/store' },
      { page: 'Store Dashboard', action: 'Manage products', target: '/store/products' },
      { page: 'Store Dashboard', action: 'View orders', target: '/store/orders' }
    ]
  }
];

userFlows.forEach(flow => {
  console.log(`📋 ${flow.name}:`);
  flow.steps.forEach((step, index) => {
    console.log(`  ${index + 1}. ${step.page} → ${step.action} → ${step.target}`);
    
    // Check if the flow is possible based on our analysis
    const pageResult = Object.values(results).find(r => 
      r.config && r.config.file.includes(step.page.toLowerCase().replace(' ', ''))
    );
    
    if (pageResult && pageResult.exists) {
      const hasTargetLink = step.target === 'various' || 
        pageResult.extractedLinks.some(link => link.includes(step.target));
      console.log(`    ${hasTargetLink ? '✅' : '❌'} Flow possible`);
    } else {
      console.log(`    ❌ Page not found`);
    }
  });
  console.log('');
});

console.log('📊 Overall Assessment:\n');

const totalPages = Object.keys(pagesConfig).length;
const existingPages = Object.values(results).filter(r => r.exists).length;
const wellStyledPages = Object.values(results).filter(r => 
  r.exists && Object.values(r.styling).filter(Boolean).length >= 3
).length;
const functionalPages = Object.values(results).filter(r => 
  r.exists && Object.values(r.navigation).filter(Boolean).length >= 1
).length;

console.log(`📄 Page Coverage: ${existingPages}/${totalPages} (${Math.round(existingPages/totalPages*100)}%)`);
console.log(`🎨 Well-Styled Pages: ${wellStyledPages}/${existingPages} (${Math.round(wellStyledPages/existingPages*100)}%)`);
console.log(`🔗 Functional Navigation: ${functionalPages}/${existingPages} (${Math.round(functionalPages/existingPages*100)}%)`);

const overallScore = Math.round(((existingPages * 0.4) + (wellStyledPages * 0.3) + (functionalPages * 0.3)) / totalPages * 100);
console.log(`\n🏆 Overall Score: ${overallScore}/100`);

if (overallScore >= 90) {
  console.log('🎉 Excellent! Your pages are well-structured and functional.');
} else if (overallScore >= 70) {
  console.log('👍 Good job! Some minor improvements needed.');
} else {
  console.log('⚠️  Needs attention. Several pages require fixes.');
}

console.log('\n✨ Advanced validation complete!');
