#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Blank Page Diagnosis Script\n');

// Critical pages to check
const criticalPages = [
  {
    name: 'Loading Page',
    file: 'src/app/loading.tsx',
    key: 'loading'
  },
  {
    name: 'Login Page', 
    file: 'src/app/login/page.tsx',
    key: 'login'
  },
  {
    name: 'User Dashboard',
    file: 'src/domains/users/components/UserDashboard.tsx',
    key: 'userDashboard'
  },
  {
    name: 'Store Dashboard',
    file: 'src/app/store/dashboard/page.tsx',
    key: 'storeDashboard'
  }
];

// Check for common causes of blank pages
const diagnostics = {
  missingDependencies: [],
  importErrors: [],
  componentErrors: [],
  stylingIssues: [],
  configIssues: []
};

console.log('📄 Analyzing Critical Pages:\n');

criticalPages.forEach(({ name, file, key }) => {
  const fullPath = path.join(process.cwd(), file);
  
  console.log(`🔍 ${name}:`);
  console.log(`  📁 File: ${file}`);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`  ❌ MISSING: File does not exist!`);
    diagnostics.componentErrors.push(`${name}: File missing`);
    return;
  }
  
  const content = fs.readFileSync(fullPath, 'utf8');
  
  // Check for basic React structure
  const hasExport = /export\s+default/.test(content);
  const hasFunction = /function\s+\w+|const\s+\w+\s*=.*?=>/.test(content);
  const hasReturn = /return\s*\(/.test(content);
  const hasJSX = /<[A-Z]/.test(content);
  
  console.log(`  ✅ Basic Structure:`);
  console.log(`    ${hasExport ? '✅' : '❌'} Has default export`);
  console.log(`    ${hasFunction ? '✅' : '❌'} Has function/component`);
  console.log(`    ${hasReturn ? '✅' : '❌'} Has return statement`);
  console.log(`    ${hasJSX ? '✅' : '❌'} Has JSX elements`);
  
  if (!hasExport || !hasFunction || !hasReturn) {
    diagnostics.componentErrors.push(`${name}: Missing basic React structure`);
  }
  
  // Check imports
  const importMatches = content.match(/import.*?from\s+['"][^'"]+['"]/g) || [];
  const problematicImports = [];
  
  importMatches.forEach(importLine => {
    // Check for common problematic patterns
    if (importLine.includes('@/') && !importLine.includes('node_modules')) {
      const modulePath = importLine.match(/from\s+['"]([^'"]+)['"]/)?.[1];
      if (modulePath) {
        // Convert to file path and check existence
        const checkPath = modulePath.replace('@/', 'src/');
        const possiblePaths = [
          `${checkPath}.tsx`,
          `${checkPath}.ts`, 
          `${checkPath}/index.tsx`,
          `${checkPath}/index.ts`
        ];
        
        const exists = possiblePaths.some(p => fs.existsSync(path.join(process.cwd(), p)));
        if (!exists) {
          problematicImports.push(modulePath);
        }
      }
    }
  });
  
  console.log(`  📦 Imports:`);
  console.log(`    Total: ${importMatches.length} imports`);
  if (problematicImports.length > 0) {
    console.log(`    ❌ Problematic imports:`);
    problematicImports.forEach(imp => console.log(`      - ${imp}`));
    diagnostics.importErrors.push(`${name}: ${problematicImports.join(', ')}`);
  } else {
    console.log(`    ✅ All imports appear valid`);
  }
  
  // Check Tailwind classes
  const tailwindClasses = content.match(/className=["'][^"']*["']/g) || [];
  const hasTailwind = tailwindClasses.some(cls => 
    /bg-|text-|p-|m-|w-|h-|flex|grid/.test(cls)
  );
  
  console.log(`  🎨 Styling:`);
  console.log(`    ${hasTailwind ? '✅' : '❌'} Has Tailwind classes`);
  console.log(`    Found ${tailwindClasses.length} className declarations`);
  
  if (!hasTailwind) {
    diagnostics.stylingIssues.push(`${name}: No Tailwind classes found`);
  }
  
  // Check for common error patterns
  const errorPatterns = [
    { name: 'TypeScript errors', pattern: /\/\/ @ts-ignore|\/\/ @ts-nocheck/ },
    { name: 'Console errors', pattern: /console\.error/ },
    { name: 'Try-catch blocks', pattern: /try\s*{[\s\S]*?catch/ },
    { name: 'Conditional rendering', pattern: /\?\s*<|&&\s*</ }
  ];
  
  console.log(`  🔧 Error Handling:`);
  errorPatterns.forEach(({ name, pattern }) => {
    const found = pattern.test(content);
    console.log(`    ${found ? '⚠️' : '✅'} ${name}: ${found ? 'Present' : 'Not found'}`);
  });
  
  console.log('');
});

// Check configuration files
console.log('⚙️  Configuration Check:\n');

const configFiles = [
  { name: 'Tailwind Config', file: 'tailwind.config.js' },
  { name: 'Next Config', file: 'next.config.js' },
  { name: 'TypeScript Config', file: 'tsconfig.json' },
  { name: 'Package.json', file: 'package.json' }
];

configFiles.forEach(({ name, file }) => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  console.log(`  ${exists ? '✅' : '❌'} ${name}: ${file}`);
  
  if (!exists) {
    diagnostics.configIssues.push(`Missing ${name}`);
  }
});

// Check if development server is running
console.log('\n🚀 Development Environment:\n');

const devScriptCheck = () => {
  const packagePath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(packagePath)) {
    const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const scripts = packageContent.scripts || {};
    
    console.log(`  📜 Available Scripts:`);
    Object.entries(scripts).forEach(([name, command]) => {
      console.log(`    - ${name}: ${command}`);
    });
    
    const hasDevScript = scripts.dev || scripts.start;
    console.log(`  ${hasDevScript ? '✅' : '❌'} Development script available`);
    
    return hasDevScript;
  }
  return false;
};

devScriptCheck();

// Browser cache and storage check recommendations
console.log('\n🌐 Browser Troubleshooting:\n');
console.log('  🔧 Recommended Actions:');
console.log('    1. Clear browser cache (Ctrl+Shift+Delete)');
console.log('    2. Hard refresh (Ctrl+Shift+R)');
console.log('    3. Open DevTools and check Console for errors');
console.log('    4. Check Network tab for failed requests');
console.log('    5. Disable browser extensions temporarily');
console.log('    6. Try incognito/private browsing mode');

// Summary
console.log('\n📊 Diagnosis Summary:\n');

const totalIssues = Object.values(diagnostics).reduce((sum, arr) => sum + arr.length, 0);

if (totalIssues === 0) {
  console.log('  ✅ No obvious issues found in code!');
  console.log('  💡 Blank pages might be due to:');
  console.log('    - Browser cache issues');
  console.log('    - Development server not running'); 
  console.log('    - Network connectivity problems');
  console.log('    - JavaScript disabled in browser');
} else {
  console.log(`  ⚠️  Found ${totalIssues} potential issues:`);
  
  Object.entries(diagnostics).forEach(([category, issues]) => {
    if (issues.length > 0) {
      console.log(`    🔴 ${category}:`);
      issues.forEach(issue => console.log(`      - ${issue}`));
    }
  });
}

console.log('\n✨ Diagnosis complete!');
console.log('\n🛠️  Next Steps:');
console.log('  1. Run: npm run dev (if not already running)');
console.log('  2. Clear browser cache and hard refresh');
console.log('  3. Check browser DevTools console for errors');
console.log('  4. Fix any import errors found above');
