const fs = require('fs');
const path = require('path');

// Function to fix specific broken files
function fixBrokenImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Fix the broken import insertion by removing duplicate and malformed imports
  let fixedContent = content;
  
  // Remove malformed import lines that broke existing imports
  const lines = content.split('\n');
  const fixedLines = [];
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    
    // Skip malformed import lines
    if (line.includes("import { useUserData } from '@/core/shared/contexts/UserDataContext';") && 
        lines[i + 1] && lines[i + 1].includes('} from ')) {
      // This is a broken import, skip it
      i++;
      continue;
    }
    
    // Fix broken import statements
    if (line.includes('import {') && !line.includes('} from')) {
      // Find the closing part
      let j = i + 1;
      while (j < lines.length && !lines[j].includes('} from')) {
        j++;
      }
      if (j < lines.length) {
        // Reconstruct the import
        const importParts = [];
        for (let k = i; k <= j; k++) {
          importParts.push(lines[k].trim());
        }
        const reconstructed = importParts.join(' ');
        fixedLines.push(reconstructed);
        i = j + 1;
        continue;
      }
    }
    
    fixedLines.push(line);
    i++;
  }
  
  fixedContent = fixedLines.join('\n');
  
  // Now add the proper import if it doesn't exist
  if (!fixedContent.includes("import { useUserData } from '@/core/shared/contexts/UserDataContext';")) {
    // Find the right place to add it (after the last import)
    const lines = fixedContent.split('\n');
    let lastImportIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ') && lines[i].includes('from ')) {
        lastImportIndex = i;
      }
    }
    
    if (lastImportIndex !== -1) {
      lines.splice(lastImportIndex + 1, 0, "import { useUserData } from '@/core/shared/contexts/UserDataContext';");
      fixedContent = lines.join('\n');
    }
  }
  
  // Add the destructuring if it doesn't exist
  if (!fixedContent.includes('useUserData()')) {
    // Find the function declaration
    const lines = fixedContent.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('export default function') && lines[i].includes('{')) {
        const destructuring = "  const { profile, orders, warranties, projects, invoices, stats, isLoading, error, refreshUserData } = useUserData();";
        lines.splice(i + 1, 0, destructuring);
        fixedContent = lines.join('\n');
        break;
      }
    }
  }
  
  fs.writeFileSync(filePath, fixedContent, 'utf8');
  console.log(`✅ Fixed: ${filePath}`);
}

// List of files that need fixing based on the TypeScript errors
const brokenFiles = [
  'src/app/user/comprehensive-construction-calculator/page.tsx',
  'src/app/user/gamification/page.tsx',
  'src/app/user/projects/[id]/page.tsx',
  'src/app/user/projects/create/construction/page.tsx',
  'src/app/user/projects/create/enhanced/page.tsx',
  'src/app/user/projects/create/page.tsx',
  'src/app/user/smart-insights/page.tsx',
  'src/app/user/social-community/page.tsx',
  'src/app/user/support/page.tsx'
];

console.log('🔧 Fixing broken imports...');
brokenFiles.forEach(file => {
  const fullPath = path.join('.', file);
  if (fs.existsSync(fullPath)) {
    fixBrokenImports(fullPath);
  }
});

console.log('✅ All broken imports fixed!');
