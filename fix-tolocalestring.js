const fs = require('fs');
const path = require('path');

/**
 * Final script to fix all remaining .toLocaleString() calls
 * to use English locale for consistent English numerals
 */

console.log('🔧 Fixing remaining .toLocaleString() calls...');

const srcDir = path.join(__dirname, 'src');

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Replace .toLocaleString() with .toLocaleString('en-US')
    const updatedContent = content.replace(
      /\.toLocaleString\s*\(\s*\)/g,
      ".toLocaleString('en-US')"
    );
    
    if (updatedContent !== content) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`✅ Fixed: ${path.relative(__dirname, filePath)}`);
      return true;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
  return false;
}

function processDirectory(dir) {
  let totalFixed = 0;
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and .next directories
      if (!['node_modules', '.next', '.git', 'dist', 'build'].includes(item)) {
        totalFixed += processDirectory(itemPath);
      }
    } else if (stat.isFile()) {
      // Process TypeScript, JavaScript, and JSX files
      if (/\.(ts|tsx|js|jsx)$/.test(item)) {
        if (processFile(itemPath)) {
          totalFixed++;
        }
      }
    }
  }
  
  return totalFixed;
}

const fixedFiles = processDirectory(srcDir);

console.log(`\n📊 Summary:`);
console.log(`✅ Files fixed: ${fixedFiles}`);
console.log('🎉 All .toLocaleString() calls now use English locale!');

// Verify no plain .toLocaleString() calls remain
const { execSync } = require('child_process');
try {
  const result = execSync('grep -r "\\.toLocaleString()" src/ || true', { encoding: 'utf8' });
  if (result.trim()) {
    console.log('\n⚠️ Remaining plain .toLocaleString() calls found:');
    console.log(result);
  } else {
    console.log('\n✅ No remaining plain .toLocaleString() calls found!');
  }
} catch (error) {
  console.log('\n💡 Manual verification recommended');
}
