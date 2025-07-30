#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing missing useAuth imports...');

function findTsxFiles(dir) {
  const files = [];
  
  function scan(currentDir) {
    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        
        if (entry.isDirectory()) {
          scan(fullPath);
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }
  
  scan(dir);
  return files;
}

function fixMissingImports() {
  const srcPath = path.join(__dirname, 'src');
  const files = findTsxFiles(srcPath);
  let fixedCount = 0;
  
  files.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check if file uses useAuth() but doesn't import it
      if (content.includes('useAuth()') && !content.includes("from '@/core/shared/auth/AuthProvider'")) {
        console.log(`Fixing ${filePath}`);
        
        const lines = content.split('\n');
        let insertIndex = -1;
        
        // Find the last import line
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim().startsWith('import ')) {
            insertIndex = i + 1;
          } else if (lines[i].trim() === '' && insertIndex > -1) {
            break;
          }
        }
        
        if (insertIndex > -1) {
          lines.splice(insertIndex, 0, "import { useAuth } from '@/core/shared/auth/AuthProvider';");
          fs.writeFileSync(filePath, lines.join('\n'));
          fixedCount++;
        }
      }
    } catch (error) {
      console.log(`Skipping ${filePath}: ${error.message}`);
    }
  });
  
  return fixedCount;
}

try {
  const fixed = fixMissingImports();
  console.log(`✅ Fixed ${fixed} files with missing useAuth imports`);
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
