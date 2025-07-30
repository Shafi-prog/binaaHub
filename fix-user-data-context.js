const fs = require('fs');
const path = require('path');

// List of files that need to be updated
const filesToUpdate = [
  'src/app/user/ai-hub/page.tsx',
  'src/app/user/ai-smart-features-test/page.tsx',
  'src/app/user/favorites/page.tsx',
  'src/app/user/help-center/page.tsx',
  'src/app/user/invoices/page.tsx',
  'src/app/user/payment/error/page.tsx',
  'src/app/user/projects-marketplace/page.tsx',
  'src/app/user/projects/new/page.tsx',
  'src/app/user/smart-insights/page.tsx',
  'src/app/user/social-community/page.tsx',
  'src/app/user/projects/list/page.tsx',
  'src/app/user/warranty-expense-tracking/page.tsx',
  'src/app/user/warranties/ai-extract/page.tsx',
  'src/app/user/test-context/page.tsx',
  'src/app/user/warranties/new/page.tsx',
  'src/app/user/warranties/tracking/page.tsx',
  'src/app/user/support/page.tsx',
  'src/app/user/projects/settings/page.tsx',
  'src/app/user/projects/suppliers/page.tsx',
  'src/app/user/subscriptions/page.tsx',
  'src/app/user/stores-browse/page.tsx'
];

filesToUpdate.forEach(filePath => {
  try {
    const fullPath = path.join(__dirname, filePath);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace the import
    content = content.replace(
      "import { useUserData } from '@/core/shared/contexts/UserDataContextSimple';",
      "import { useAuth } from '@/core/shared/contexts/AuthProvider';"
    );
    
    // Replace the hook usage
    content = content.replace(
      /const { userData, loading } = useUserData\(\);?/g,
      'const { user, loading } = useAuth();'
    );
    
    // Replace userData references with user
    content = content.replace(/userData\./g, 'user.');
    content = content.replace(/userData\?/g, 'user?');
    content = content.replace(/!userData/g, '!user');
    
    fs.writeFileSync(fullPath, content);
    console.log(`✅ Updated: ${filePath}`);
  } catch (error) {
    console.log(`❌ Error updating ${filePath}:`, error.message);
  }
});

console.log('✅ All files updated!');
