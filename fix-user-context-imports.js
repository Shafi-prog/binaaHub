// Script to fix all UserDataContextSimple imports to use AuthProvider
const fs = require('fs');
const path = require('path');

const files = [
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
  'src/app/user/warranties/new/page.tsx',
  'src/app/user/warranties/tracking/page.tsx',
  'src/app/user/support/page.tsx',
  'src/app/user/projects/settings/page.tsx',
  'src/app/user/projects/suppliers/page.tsx',
  'src/app/user/subscriptions/page.tsx',
  'src/app/user/stores-browse/page.tsx',
  'src/app/test-context/page.tsx',
  'src/app/user/documents/page.tsx',
  'src/app/user/gamification/page.tsx',
  'src/app/user/profile/page.tsx',
  'src/app/user/settings/page.tsx',
  'src/app/user/projects-marketplace/for-sale/page.tsx',
  'src/app/user/orders/page.tsx',
  'src/app/user/projects/calculator/page.tsx'
];

files.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Replace the import
      content = content.replace(
        /import { useUserData } from '@\/core\/shared\/contexts\/UserDataContextSimple';/g,
        "import { useAuth } from '@/core/shared/auth/AuthProvider';"
      );
      
      // Replace useUserData() with useAuth()
      content = content.replace(/const\s+(\w+)\s*=\s*useUserData\(\);/g, 'const { user, session, isLoading, error } = useAuth();');
      
      // Replace common userData references with user
      content = content.replace(/userData\./g, 'user?.');
      content = content.replace(/userData\?/g, 'user');
      
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed ${filePath}`);
    } catch (error) {
      console.error(`❌ Error fixing ${filePath}:`, error.message);
    }
  } else {
    console.log(`⚠️ File not found: ${filePath}`);
  }
});

console.log('✅ Batch fix completed!');
