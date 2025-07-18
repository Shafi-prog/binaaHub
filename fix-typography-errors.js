#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Define the mapping of old variants to new variants with size and weight
const variantMapping = {
  'h1': { variant: 'heading', size: '3xl', weight: 'bold' },
  'h2': { variant: 'subheading', size: 'xl', weight: 'semibold' },
  'h3': { variant: 'subheading', size: 'lg', weight: 'semibold' },
  'h4': { variant: 'subheading', size: 'lg', weight: 'semibold' },
  'h5': { variant: 'subheading', size: 'lg', weight: 'semibold' },
  'h6': { variant: 'subheading', size: 'lg', weight: 'semibold' },
  'body1': { variant: 'body', size: 'lg' },
  'body2': { variant: 'caption', size: 'sm' },
  'subtitle1': { variant: 'subheading', size: 'lg' },
  'subtitle2': { variant: 'caption', size: 'sm' }
};

function fixTypographyInFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;

  // Fix each variant
  Object.entries(variantMapping).forEach(([oldVariant, newConfig]) => {
    // Pattern 1: variant="h1" className="text-3xl font-bold ..."
    const pattern1 = new RegExp(
      `<Typography\\s+variant="${oldVariant}"\\s+className="([^"]*)"`,
      'g'
    );
    
    content = content.replace(pattern1, (match, className) => {
      hasChanges = true;
      // Extract existing classes and add size/weight if needed
      let newClassName = className;
      
      // Remove old font size and weight classes
      newClassName = newClassName.replace(/text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)\b/g, '');
      newClassName = newClassName.replace(/font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)\b/g, '');
      
      // Clean up extra spaces
      newClassName = newClassName.replace(/\s+/g, ' ').trim();
      
      let result = `<Typography variant="${newConfig.variant}"`;
      if (newConfig.size) result += ` size="${newConfig.size}"`;
      if (newConfig.weight) result += ` weight="${newConfig.weight}"`;
      if (newClassName) result += ` className="${newClassName}"`;
      
      return result;
    });

    // Pattern 2: variant="h1" with no className
    const pattern2 = new RegExp(
      `<Typography\\s+variant="${oldVariant}"(?!\\s+className)`,
      'g'
    );
    
    content = content.replace(pattern2, () => {
      hasChanges = true;
      let result = `<Typography variant="${newConfig.variant}"`;
      if (newConfig.size) result += ` size="${newConfig.size}"`;
      if (newConfig.weight) result += ` weight="${newConfig.weight}"`;
      return result;
    });
  });

  if (hasChanges) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed Typography variants in: ${filePath}`);
  } else {
    console.log(`⚡ No changes needed in: ${filePath}`);
  }
}

function findUserPageFiles() {
  const userPagesDir = path.join(__dirname, 'src', 'app', 'user');
  const files = [];

  function walk(dir) {
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (item === 'page.tsx') {
        files.push(fullPath);
      }
    });
  }

  if (fs.existsSync(userPagesDir)) {
    walk(userPagesDir);
  }

  return files;
}

// Main execution
console.log('🔧 Starting Typography variant fix...');

const userPageFiles = findUserPageFiles();
console.log(`Found ${userPageFiles.length} user page files to process:`);

userPageFiles.forEach(file => {
  console.log(`  - ${file}`);
});

console.log('\n📝 Processing files...');
userPageFiles.forEach(fixTypographyInFile);

console.log('\n✨ Typography variant fix completed!');
console.log('🔍 Run "npx tsc --noEmit" to verify all errors are fixed.');
