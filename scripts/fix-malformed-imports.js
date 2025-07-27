const fs = require('fs');
const path = require('path');

// Files that need fixing based on TypeScript errors
const filesToFix = [
  'src/app/user/comprehensive-construction-calculator/page.tsx',
  'src/app/user/projects/[id]/page.tsx',
  'src/app/user/projects/create/construction/page.tsx',
  'src/app/user/projects/create/enhanced/page.tsx',
  'src/app/user/projects/create/page.tsx',
  'src/app/user/smart-insights/page.tsx',
  'src/app/user/social-community/page.tsx',
  'src/app/user/support/page.tsx'
];

function fixFile(filePath) {
  console.log(`🔧 Fixing: ${filePath}`);
  
  const content = fs.readFileSync(filePath, 'utf8');
  let fixedContent = content;
  
  // Fix the malformed import pattern
  const malformedPattern = /import { import { useUserData } from '@\/core\/shared\/contexts\/UserDataContext';\s*([^}]*)} from 'lucide-react';/gm;
  
  const match = malformedPattern.exec(content);
  if (match) {
    const luciconImports = match[1].trim();
    const fixedImport = `import { useUserData } from '@/core/shared/contexts/UserDataContext';
import { 
  ${luciconImports}
} from 'lucide-react';`;
    
    fixedContent = content.replace(malformedPattern, fixedImport);
  }
  
  // Also handle cases where the import was split differently
  fixedContent = fixedContent.replace(
    /import { import { useUserData } from '@\/core\/shared\/contexts\/UserDataContext';/g,
    "import { useUserData } from '@/core/shared/contexts/UserDataContext';"
  );
  
  // Clean up any duplicate imports
  const lines = fixedContent.split('\n');
  const cleanLines = [];
  const importsSeen = new Set();
  
  for (const line of lines) {
    if (line.trim().startsWith('import ')) {
      if (!importsSeen.has(line.trim())) {
        importsSeen.add(line.trim());
        cleanLines.push(line);
      }
    } else {
      cleanLines.push(line);
    }
  }
  
  fixedContent = cleanLines.join('\n');
  
  // Ensure useUserData destructuring exists
  if (!fixedContent.includes('useUserData()')) {
    const lines = fixedContent.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('export default function') && lines[i].includes('{')) {
        const destructuring = "  const { profile, orders, warranties, projects, invoices, stats, isLoading, error, refreshUserData } = useUserData();";
        lines.splice(i + 1, 0, destructuring);
        break;
      }
    }
    fixedContent = lines.join('\n');
  }
  
  fs.writeFileSync(filePath, fixedContent, 'utf8');
  console.log(`✅ Fixed: ${filePath}`);
}

console.log('🔧 Fixing malformed imports...');
filesToFix.forEach(file => {
  const fullPath = path.join('.', file);
  if (fs.existsSync(fullPath)) {
    fixFile(fullPath);
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
});

console.log('✅ All files processed!');
