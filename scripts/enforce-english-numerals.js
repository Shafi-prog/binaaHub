const fs = require('fs');
const path = require('path');

/**
 * Script to ensure all number formatting uses English numerals
 * and Georgian calendar dates throughout the platform
 */

console.log('🔄 Starting English numerals enforcement...');

const srcDir = path.join(__dirname, 'src');

// Arabic to English numeral mapping
const arabicToEnglish = {
  '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
  '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
};

// Patterns to find and replace
const patterns = [
  // Arabic locale formatting
  { 
    pattern: /\.toLocaleString\s*\(\s*['"]ar-SA['"].*?\)/g,
    replacement: ".toLocaleString('en-US')"
  },
  // Arabic calendar date formatting  
  {
    pattern: /\.toLocaleDateString\s*\(\s*['"]ar-SA['"].*?\)/g,
    replacement: ".toLocaleDateString('en-US')"
  },
  // Arabic numerals in text
  {
    pattern: /[٠-٩]/g,
    replacement: (match) => arabicToEnglish[match] || match
  },
  // Ensure Intl.NumberFormat uses English
  {
    pattern: /new\s+Intl\.NumberFormat\s*\(\s*['"]ar-SA['"].*?\)/g,
    replacement: "new Intl.NumberFormat('en-US')"
  }
];

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let updatedContent = content;
    let hasChanges = false;

    patterns.forEach(({ pattern, replacement }) => {
      const newContent = updatedContent.replace(pattern, replacement);
      if (newContent !== updatedContent) {
        hasChanges = true;
        updatedContent = newContent;
      }
    });

    if (hasChanges) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`✅ Updated: ${path.relative(__dirname, filePath)}`);
      return true;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
  return false;
}

function processDirectory(dir) {
  let totalUpdated = 0;
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and .next directories
      if (!['node_modules', '.next', '.git', 'dist', 'build'].includes(item)) {
        totalUpdated += processDirectory(itemPath);
      }
    } else if (stat.isFile()) {
      // Process TypeScript, JavaScript, and JSX files
      if (/\.(ts|tsx|js|jsx)$/.test(item)) {
        if (processFile(itemPath)) {
          totalUpdated++;
        }
      }
    }
  }
  
  return totalUpdated;
}

// Add import statement fixer
function addFormattingImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file uses number formatting but doesn't import from our utility
    const usesFormatting = /formatNumber|formatCurrency|formatDate|formatPercentage/.test(content);
    const hasFormattingImport = /from.*formatting/.test(content);
    
    if (usesFormatting && !hasFormattingImport) {
      // Find the last import statement
      const importLines = content.split('\n');
      let lastImportIndex = -1;
      
      for (let i = 0; i < importLines.length; i++) {
        if (importLines[i].trim().startsWith('import ')) {
          lastImportIndex = i;
        }
      }
      
      if (lastImportIndex >= 0) {
        // Add the formatting import after the last import
        const formattingImport = "import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';";
        importLines.splice(lastImportIndex + 1, 0, formattingImport);
        
        const updatedContent = importLines.join('\n');
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`📦 Added formatting import to: ${path.relative(__dirname, filePath)}`);
        return true;
      }
    }
  } catch (error) {
    console.error(`❌ Error adding imports to ${filePath}:`, error.message);
  }
  return false;
}

function addImportsToDirectory(dir) {
  let totalUpdated = 0;
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      if (!['node_modules', '.next', '.git', 'dist', 'build'].includes(item)) {
        totalUpdated += addImportsToDirectory(itemPath);
      }
    } else if (stat.isFile()) {
      if (/\.(ts|tsx|js|jsx)$/.test(item)) {
        if (addFormattingImports(itemPath)) {
          totalUpdated++;
        }
      }
    }
  }
  
  return totalUpdated;
}

// Run the updates
console.log('📁 Processing source directory...');
const updatedFiles = processDirectory(srcDir);

console.log('📦 Adding missing formatting imports...');
const importFiles = addImportsToDirectory(srcDir);

console.log('\n📊 Summary:');
console.log(`✅ Files updated for English numerals: ${updatedFiles}`);
console.log(`📦 Files with added imports: ${importFiles}`);
console.log('🎉 English numerals enforcement completed!');

// Create a verification script
const verificationScript = `
// Verification patterns to check for remaining Arabic numerals
const checkPatterns = [
  /[٠-٩]/g,                                    // Arabic numerals
  /toLocaleString\\s*\\(\\s*['"]ar-SA['"]/g,    // Arabic locale formatting
  /toLocaleDateString\\s*\\(\\s*['"]ar-SA['"]/g // Arabic date formatting
];

console.log('🔍 Verification patterns created for manual review');
`;

fs.writeFileSync(path.join(__dirname, 'verify-english-numerals.js'), verificationScript);
console.log('📝 Created verification script: verify-english-numerals.js');
