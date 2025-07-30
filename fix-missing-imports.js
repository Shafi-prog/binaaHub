#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Fixing missing useAuth imports...');

// Get all TypeScript files that use useAuth but might be missing the import
function findFilesWithUseAuth() {
  try {
    const result = execSync('grep -r "useAuth()" src/ --include="*.tsx" --include="*.ts" -l', { encoding: 'utf8' });
    return result.trim().split('\n').filter(f => f.length > 0);
  } catch (error) {
    console.log('No files found with useAuth or grep command failed');
    return [];
  }
}

function fixMissingImports() {
  const files = findFilesWithUseAuth();
  let fixedCount = 0;
  
  files.forEach(filePath => {
    if (!fs.existsSync(filePath)) return;
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file already has the import
    if (content.includes("from '@/core/shared/auth/AuthProvider'")) {
      return; // Already has the import
    }
    
    // Check if file uses useAuth()
    if (!content.includes('useAuth()')) {
      return; // Doesn't use useAuth
    }
    
    console.log(`Fixing ${filePath}`);
    
    // Add the import after existing imports
    const lines = content.split('\n');
    let insertIndex = -1;
    
    // Find the last import line
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ')) {
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
