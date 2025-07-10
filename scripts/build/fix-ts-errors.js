#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to find and rename .ts files containing JSX to .tsx
function findAndRenameJSXFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      // Skip node_modules and .git directories
      if (file.name !== 'node_modules' && file.name !== '.git') {
        findAndRenameJSXFiles(fullPath);
      }
    } else if (file.name.endsWith('.ts') && !file.name.endsWith('.d.ts')) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Check if file contains JSX patterns
        const hasJSX = /(<[A-Z][^>]*>|<\/[A-Z][^>]*>|\.\w+\s*=\s*<|\s+jsx|\{.*<.*>.*\})/g.test(content);
        
        if (hasJSX) {
          const newPath = fullPath.replace(/\.ts$/, '.tsx');
          
          // Only rename if .tsx version doesn't already exist
          if (!fs.existsSync(newPath)) {
            fs.renameSync(fullPath, newPath);
            console.log(`Renamed: ${fullPath} -> ${newPath}`);
          } else {
            // If .tsx exists, remove the .ts file
            fs.unlinkSync(fullPath);
            console.log(`Removed duplicate: ${fullPath} (keeping .tsx version)`);
          }
        }
      } catch (error) {
        console.error(`Error processing ${fullPath}:`, error.message);
      }
    }
  }
}

// Function to exclude backup folders from TypeScript compilation
function createTSConfigExcludes() {
  const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');
  
  try {
    const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));
    
    const backupPatterns = [
      "backups/**/*",
      "temp/**/*",
      "**/node_modules",
      "**/*.backup.*",
      "**/backup-*/**/*"
    ];
    
    if (!tsConfig.exclude) {
      tsConfig.exclude = [];
    }
    
    // Add backup patterns if they don't exist
    for (const pattern of backupPatterns) {
      if (!tsConfig.exclude.includes(pattern)) {
        tsConfig.exclude.push(pattern);
      }
    }
    
    fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2));
    console.log('Updated tsconfig.json to exclude backup folders');
    
  } catch (error) {
    console.error('Error updating tsconfig.json:', error.message);
  }
}

// Main execution
console.log('Starting TypeScript error fixes...');

// 1. Fix JSX files
console.log('\n1. Finding and renaming .ts files with JSX content...');
findAndRenameJSXFiles(process.cwd());

// 2. Update tsconfig to exclude backups
console.log('\n2. Updating tsconfig.json...');
createTSConfigExcludes();

console.log('\nTypeScript fixes completed!');
console.log('\nNext steps:');
console.log('1. Run: npm run type-check');
console.log('2. Review any remaining errors');
console.log('3. Install missing dependencies if needed');
