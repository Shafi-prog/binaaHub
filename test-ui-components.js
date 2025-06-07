#!/usr/bin/env node

/**
 * Test UI Components Import
 * Check if all required UI components are properly exported
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing UI Components Import');
console.log('================================');

// Read the project details page to see what components are being imported
const projectDetailsPath = path.join(__dirname, 'src/app/user/projects/[id]/page.tsx');
const content = fs.readFileSync(projectDetailsPath, 'utf8');

console.log('\n📋 Imports found in project details page:');

// Extract import statements
const importLines = content.split('\n').filter(line => line.trim().startsWith('import'));
importLines.forEach(line => {
  console.log('  ' + line.trim());
});

// Check specific UI components imports
const uiImports = content.match(/import\s+{([^}]+)}\s+from\s+['"]@\/components\/ui['"]/);
if (uiImports) {
  console.log('\n📦 UI Components being imported:');
  const components = uiImports[1].split(',').map(c => c.trim());
  components.forEach(comp => {
    console.log('  - ' + comp);
  });
}

// Check UI index file
const uiIndexPath = path.join(__dirname, 'src/components/ui/index.ts');
if (fs.existsSync(uiIndexPath)) {
  console.log('\n📋 UI Components exported from index.ts:');
  const indexContent = fs.readFileSync(uiIndexPath, 'utf8');
  const exports = indexContent.match(/export\s+{([^}]+)}/g);
  if (exports) {
    exports.forEach(exp => {
      console.log('  ' + exp);
    });
  }
}

console.log('\n✅ Component import analysis complete');
