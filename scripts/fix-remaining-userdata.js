const fs = require('fs');
const path = require('path');

// List of files that need UserDataContext but don't have variable conflicts
const simpleFixFiles = [
  'src/app/user/ai-hub/page.tsx',
  'src/app/user/help-center/page.tsx',
  'src/app/user/payment/error/page.tsx',
  'src/app/user/payment/success/page.tsx',
  'src/app/user/projects-marketplace/for-sale/[id]/page.tsx',
  'src/app/user/projects/[id]/edit/page.tsx',
  'src/app/user/projects/[id]/reports/page.tsx',
  'src/app/user/projects/calculator/page.tsx',
  'src/app/user/projects/new/page.tsx',
  'src/app/user/projects/notebook/page.tsx',
  'src/app/user/projects/settings/page.tsx',
  'src/app/user/projects/suppliers/page.tsx'
];

// Files that need variable renaming to avoid conflicts
const conflictFiles = [
  {
    file: 'src/app/user/ai-smart-features-test/page.tsx',
    conflictVar: 'stats',
    newVar: 'userStats'
  },
  {
    file: 'src/app/user/dashboard/construction-data/page.tsx',
    conflictVar: 'stats',
    newVar: 'userStats'
  },
  {
    file: 'src/app/user/dashboard/construction-data/page.tsx',
    conflictVar: 'error',
    newVar: 'userError'
  },
  {
    file: 'src/app/user/expenses/page.tsx',
    conflictVar: 'projects',
    newVar: 'userProjects'
  },
  {
    file: 'src/app/user/invoices/page.tsx',
    conflictVar: 'invoices',
    newVar: 'userInvoices'
  },
  {
    file: 'src/app/user/settings/page.tsx',
    conflictVar: 'profile',
    newVar: 'userProfile'
  },
  {
    file: 'src/app/user/warranties/ai-extract/page.tsx',
    conflictVar: 'error',
    newVar: 'userError'
  }
];

function addSimpleUserDataImport(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check if already has import
  if (content.includes('useUserData')) {
    console.log(`⏭️  ${filePath} already has useUserData import`);
    return;
  }
  
  // Check if it uses the variables
  const needsUserData = content.includes('isLoading') || content.includes('error') || content.includes('refreshUserData');
  if (!needsUserData) {
    console.log(`⏭️  ${filePath} doesn't need UserData`);
    return;
  }
  
  const lines = content.split('\n');
  
  // Find last import
  let lastImportIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ') && lines[i].includes('from ')) {
      lastImportIndex = i;
    }
  }
  
  if (lastImportIndex !== -1) {
    lines.splice(lastImportIndex + 1, 0, "import { useUserData } from '@/core/shared/contexts/UserDataContext';");
  }
  
  // Find function and add destructuring
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('export default function') && lines[i].includes('{')) {
      const destructuring = "  const { profile, orders, warranties, projects, invoices, stats, isLoading, error, refreshUserData } = useUserData();";
      lines.splice(i + 1, 0, destructuring);
      break;
    }
  }
  
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
  console.log(`✅ Fixed: ${filePath}`);
}

function fixConflictFile(fileConfig) {
  const content = fs.readFileSync(fileConfig.file, 'utf8');
  
  // Check if already has import
  if (content.includes('useUserData')) {
    console.log(`⏭️  ${fileConfig.file} already has useUserData import`);
    return;
  }
  
  const lines = content.split('\n');
  
  // Find last import
  let lastImportIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ') && lines[i].includes('from ')) {
      lastImportIndex = i;
    }
  }
  
  if (lastImportIndex !== -1) {
    lines.splice(lastImportIndex + 1, 0, "import { useUserData } from '@/core/shared/contexts/UserDataContext';");
  }
  
  // Find function and add destructuring with renamed variables
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('export default function') && lines[i].includes('{')) {
      let destructuring;
      if (fileConfig.conflictVar === 'stats') {
        destructuring = "  const { profile, orders, warranties, projects, invoices, stats: userStats, isLoading, error, refreshUserData } = useUserData();";
      } else if (fileConfig.conflictVar === 'error') {
        destructuring = "  const { profile, orders, warranties, projects, invoices, stats, isLoading, error: userError, refreshUserData } = useUserData();";
      } else if (fileConfig.conflictVar === 'projects') {
        destructuring = "  const { profile, orders, warranties, projects: userProjects, invoices, stats, isLoading, error, refreshUserData } = useUserData();";
      } else if (fileConfig.conflictVar === 'invoices') {
        destructuring = "  const { profile, orders, warranties, projects, invoices: userInvoices, stats, isLoading, error, refreshUserData } = useUserData();";
      } else if (fileConfig.conflictVar === 'profile') {
        destructuring = "  const { profile: userProfile, orders, warranties, projects, invoices, stats, isLoading, error, refreshUserData } = useUserData();";
      }
      
      lines.splice(i + 1, 0, destructuring);
      break;
    }
  }
  
  fs.writeFileSync(fileConfig.file, lines.join('\n'), 'utf8');
  console.log(`✅ Fixed with renamed variable: ${fileConfig.file}`);
}

console.log('🔧 Fixing remaining UserData import issues...');

console.log('\n📋 Processing simple fixes...');
simpleFixFiles.forEach(file => {
  const fullPath = path.join('.', file);
  if (fs.existsSync(fullPath)) {
    addSimpleUserDataImport(fullPath);
  }
});

console.log('\n📋 Processing conflict fixes...');
conflictFiles.forEach(config => {
  const fullPath = path.join('.', config.file);
  if (fs.existsSync(fullPath)) {
    fixConflictFile(config);
  }
});

console.log('\n✅ All UserData imports processed!');
