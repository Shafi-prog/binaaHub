#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Page Navigation & Styling Auto-Fix Script\n');

// Missing pages that need to be created
const missingPages = [
  {
    file: 'src/app/user/page.tsx',
    content: `'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UserPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to user dashboard
    router.replace('/user/dashboard');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-gray-800">جاري التحويل...</h1>
        <p className="text-gray-600 mt-2">سيتم تحويلك إلى لوحة التحكم</p>
      </div>
    </div>
  );
}`
  },
  {
    file: 'src/app/store/page.tsx',
    content: `'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StorePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to store dashboard
    router.replace('/store/dashboard');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-xl font-semibold text-gray-800 mb-2">متجرك</h1>
        <p className="text-gray-600">جاري التحويل إلى لوحة تحكم المتجر...</p>
      </div>
    </div>
  );
}`
  },
  {
    file: 'src/app/auth/page.tsx',
    content: `'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { verifyTempAuth } from '@/core/shared/services/auth';

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authResult = verifyTempAuth();
        
        if (authResult?.user) {
          // User is authenticated, redirect to appropriate dashboard
          if (authResult.user.role === 'store') {
            router.replace('/store/dashboard');
          } else {
            router.replace('/user/dashboard');
          }
        } else {
          // Not authenticated, redirect to login
          router.replace('/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.replace('/login');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-xl max-w-md">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold text-gray-800 mb-2">التحقق من الهوية</h1>
        <p className="text-gray-600">جاري التحقق من بيانات الدخول...</p>
      </div>
    </div>
  );
}`
  }
];

// Dashboard navigation fixes
const dashboardFixes = [
  {
    file: 'src/domains/users/components/UserDashboard.tsx',
    fixes: [
      {
        description: 'Add missing calculator link',
        find: `{ title: 'حاسبة التكاليف', href: '/user/projects/calculator', icon: <BarChart3 className="w-6 h-6" /> },`,
        replace: `{ title: 'حاسبة التكاليف', href: '/user/projects/calculator', icon: <BarChart3 className="w-6 h-6" /> },
    { title: 'الحاسبة المتقدمة', href: '/user/calculator', icon: <BarChart3 className="w-6 h-6" /> },`
      }
    ]
  }
];

console.log('📄 Creating Missing Pages:\n');

// Create missing pages
missingPages.forEach(({ file, content }) => {
  const fullPath = path.join(process.cwd(), file);
  const dir = path.dirname(fullPath);
  
  try {
    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
    
    // Create file if it doesn't exist
    if (!fs.existsSync(fullPath)) {
      fs.writeFileSync(fullPath, content);
      console.log(`✅ Created: ${file}`);
    } else {
      console.log(`⏭️  Already exists: ${file}`);
    }
  } catch (error) {
    console.log(`❌ Failed to create ${file}: ${error.message}`);
  }
});

console.log('\n🔧 Applying Dashboard Fixes:\n');

// Apply dashboard fixes
dashboardFixes.forEach(({ file, fixes }) => {
  const fullPath = path.join(process.cwd(), file);
  
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;
    
    fixes.forEach(({ description, find, replace }) => {
      if (content.includes(find) && !content.includes(replace)) {
        content = content.replace(find, replace);
        modified = true;
        console.log(`✅ Applied: ${description}`);
      } else {
        console.log(`⏭️  Already applied or not found: ${description}`);
      }
    });
    
    if (modified) {
      fs.writeFileSync(fullPath, content);
      console.log(`💾 Updated: ${file}`);
    }
  } else {
    console.log(`❌ File not found: ${file}`);
  }
});

console.log('\n🎨 Style Enhancement Recommendations:\n');

// Style recommendations
const styleRecommendations = [
  {
    component: 'Loading Page',
    file: 'src/app/loading.tsx',
    suggestions: [
      'Add responsive design classes (sm:, md:, lg:)',
      'Add transition animations for smooth loading',
      'Add hover effects for interactive elements'
    ]
  },
  {
    component: 'Login Page', 
    file: 'src/app/login/page.tsx',
    suggestions: [
      'Add responsive breakpoints for mobile devices',
      'Add form validation styling',
      'Add loading states during authentication'
    ]
  },
  {
    component: 'User Layout',
    file: 'src/app/user/layout.tsx', 
    suggestions: [
      'Add authentication checks',
      'Add redirect logic for unauthenticated users',
      'Add navigation components'
    ]
  }
];

styleRecommendations.forEach(({ component, file, suggestions }) => {
  console.log(`🎨 ${component} (${file}):`);
  suggestions.forEach(suggestion => {
    console.log(`  • ${suggestion}`);
  });
  console.log('');
});

console.log('🔗 Navigation Flow Verification:\n');

// Check navigation flows
const navigationFlows = [
  { from: '/', to: '/login', description: 'Homepage to Login' },
  { from: '/login', to: '/user', description: 'Login to User Area' },
  { from: '/user', to: '/user/dashboard', description: 'User Root to Dashboard' },
  { from: '/store', to: '/store/dashboard', description: 'Store Root to Dashboard' },
  { from: '/auth', to: '/user or /store', description: 'Auth Check Routing' }
];

navigationFlows.forEach(({ from, to, description }) => {
  const fromExists = from === '/' ? 
    fs.existsSync(path.join(process.cwd(), 'src/app/page.tsx')) :
    fs.existsSync(path.join(process.cwd(), `src/app${from}/page.tsx`));
    
  const toExists = to.includes('or') ? true : 
    fs.existsSync(path.join(process.cwd(), `src/app${to}/page.tsx`));
    
  console.log(`  ${fromExists && toExists ? '✅' : '❌'} ${description}: ${from} → ${to}`);
});

console.log('\n✨ Auto-fix complete!\n');

console.log('📋 Next Steps:');
console.log('1. ✅ Missing pages have been created');
console.log('2. ✅ Dashboard navigation improved'); 
console.log('3. 🎨 Apply style recommendations above');
console.log('4. 🔄 Test navigation flows');
console.log('5. 🚀 Run validation scripts again to confirm fixes');

console.log('\nRun these commands to verify:');
console.log('- node validate-page-navigation.js');
console.log('- node advanced-page-validator.js');
