#!/usr/bin/env node
/**
 * Update configuration file references after moving config files to ./config/
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Updating configuration file references...');

// Function to update references in a file
function updateReferences(filePath, replacements) {
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  File not found: ${filePath}`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    replacements.forEach(({ from, to }) => {
      if (content.includes(from)) {
        content = content.replace(new RegExp(from, 'g'), to);
        updated = true;
      }
    });

    if (updated) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Updated: ${filePath}`);
    } else {
      console.log(`ℹ️  No changes needed: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

// Update package.json references
const packageJsonPath = path.join(process.cwd(), 'package.json');
updateReferences(packageJsonPath, [
  { from: 'jest.config.js', to: 'config/jest.config.js' },
  { from: 'eslint.config.js', to: 'config/eslint.config.js' },
]);

// Update Next.js config references (if any files import it)
const nextConfigPath = path.join(process.cwd(), 'next.config.js');
if (fs.existsSync(nextConfigPath)) {
  // Move next.config.js back to root as Next.js expects it there
  const configNextPath = path.join(process.cwd(), 'config', 'next.config.js');
  if (fs.existsSync(configNextPath)) {
    fs.copyFileSync(configNextPath, nextConfigPath);
    console.log('✅ Restored next.config.js to root');
  }
}

// Update PostCSS config references
const postcssConfigPath = path.join(process.cwd(), 'postcss.config.js');
if (fs.existsSync(postcssConfigPath)) {
  const configPostcssPath = path.join(process.cwd(), 'config', 'postcss.config.js');
  if (fs.existsSync(configPostcssPath)) {
    fs.copyFileSync(configPostcssPath, postcssConfigPath);
    console.log('✅ Restored postcss.config.js to root');
  }
}

// Update Tailwind config references
const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.js');
if (fs.existsSync(tailwindConfigPath)) {
  const configTailwindPath = path.join(process.cwd(), 'config', 'tailwind.config.js');
  if (fs.existsSync(configTailwindPath)) {
    fs.copyFileSync(configTailwindPath, tailwindConfigPath);
    console.log('✅ Restored tailwind.config.js to root');
  }
}

// Update Prettier config references
const prettierConfigPath = path.join(process.cwd(), 'prettier.config.js');
if (fs.existsSync(prettierConfigPath)) {
  const configPrettierPath = path.join(process.cwd(), 'config', 'prettier.config.js');
  if (fs.existsSync(configPrettierPath)) {
    fs.copyFileSync(configPrettierPath, prettierConfigPath);
    console.log('✅ Restored prettier.config.js to root');
  }
}

console.log('🎉 Configuration references updated successfully!');
