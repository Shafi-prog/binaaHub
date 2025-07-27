const fs = require('fs');
const path = require('path');

// Function to fix user data context imports in a file
function fixUserDataContextImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check if file uses isLoading, error, or refreshUserData without proper import
  const usesUserData = content.includes('isLoading') || content.includes('error') || content.includes('refreshUserData');
  const hasUserDataImport = content.includes('useUserData');
  
  if (usesUserData && !hasUserDataImport) {
    console.log(`🔧 Fixing: ${filePath}`);
    
    // Find the last import statement
    const lines = content.split('\n');
    let lastImportIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ') && !lines[i].includes('export')) {
        lastImportIndex = i;
      }
    }
    
    if (lastImportIndex === -1) {
      // No imports found, add after 'use client'
      const useClientIndex = lines.findIndex(line => line.includes("'use client'") || line.includes('"use client"'));
      if (useClientIndex !== -1) {
        lastImportIndex = useClientIndex;
      } else {
        lastImportIndex = 0;
      }
    }
    
    // Add the useUserData import
    const newImport = "import { useUserData } from '@/core/shared/contexts/UserDataContext';";
    lines.splice(lastImportIndex + 1, 0, newImport);
    
    // Find the function declaration and add the destructuring
    let functionIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('export default function') || lines[i].includes('function ') && lines[i].includes('{')) {
        functionIndex = i;
        break;
      }
    }
    
    if (functionIndex !== -1) {
      // Look for the opening brace and add the destructuring after it
      let openBraceIndex = functionIndex;
      for (let i = functionIndex; i < lines.length; i++) {
        if (lines[i].includes('{')) {
          openBraceIndex = i;
          break;
        }
      }
      
      // Add the destructuring line
      const destructuring = "  const { profile, orders, warranties, projects, invoices, stats, isLoading, error, refreshUserData } = useUserData();";
      
      // Check if already exists
      if (!content.includes('useUserData()')) {
        lines.splice(openBraceIndex + 1, 0, destructuring);
      }
    }
    
    // Write the updated content back
    const updatedContent = lines.join('\n');
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    
    return true;
  }
  
  return false;
}

// Find all user pages that need fixing
function findAndFixUserPages() {
  const userDir = './src/app/user';
  const filesToFix = [];
  
  function scanDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        scanDirectory(fullPath);
      } else if (entry.name === 'page.tsx') {
        filesToFix.push(fullPath);
      }
    }
  }
  
  scanDirectory(userDir);
  
  console.log(`🔍 Found ${filesToFix.length} user pages to check`);
  
  let fixedCount = 0;
  for (const file of filesToFix) {
    if (fixUserDataContextImports(file)) {
      fixedCount++;
    }
  }
  
  console.log(`✅ Fixed ${fixedCount} files`);
  console.log(`📁 Total files checked: ${filesToFix.length}`);
}

// Run the fix
findAndFixUserPages();
