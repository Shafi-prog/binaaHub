#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 Auto-Fix User Dashboard Integration\n');

// Find dashboard file
const dashboardFiles = glob.sync('src/**/UserDashboard.tsx', { cwd: process.cwd() });
if (dashboardFiles.length === 0) {
  console.log('❌ No UserDashboard.tsx found!');
  process.exit(1);
}

// Find all user pages
const userPages = glob.sync('src/app/user/**/page.tsx', { cwd: process.cwd() });
console.log(`📄 Found ${userPages.length} user pages to integrate`);

const dashboardPath = path.join(process.cwd(), dashboardFiles[0]);
let content = fs.readFileSync(dashboardPath, 'utf8');

// Extract routes from user pages
const userRoutes = userPages.map(page => {
  const route = page.replace('src/app', '').replace('/page.tsx', '');
  const fileName = path.basename(path.dirname(page));
  
  // Try to extract page title from file content
  let title = fileName;
  try {
    const pageContent = fs.readFileSync(path.join(process.cwd(), page), 'utf8');
    
    // Look for Arabic titles
    const arabicTitleMatch = pageContent.match(/title.*?['"]([^'"]*[\u0600-\u06FF][^'"]*)['"]/) ||
                            pageContent.match(/Typography.*?['"]([^'"]*[\u0600-\u06FF][^'"]*)['"]/) ||
                            pageContent.match(/h[1-6].*?>([^<]*[\u0600-\u06FF][^<]*)</) ||
                            pageContent.match(/['"]([^'"]*[\u0600-\u06FF][^'"]*)['"]/);
    
    if (arabicTitleMatch) {
      title = arabicTitleMatch[1].trim();
    }
  } catch (error) {
    // Use filename if can't read page content
  }
  
  return { route, title, fileName };
});

console.log('\n🗺️  Extracted Routes:');
userRoutes.forEach(({ route, title }) => {
  console.log(`  ${route} -> ${title}`);
});

// Check if AI features are properly integrated
const aiFeatures = [
  {
    route: '/user/ai-assistant',
    title: 'المساعد الذكي',
    icon: 'Bot',
    description: 'مساعد ذكي للاستفسارات والدعم'
  },
  {
    route: '/user/projects/calculator',
    title: 'حاسبة التكاليف',
    icon: 'Calculator',
    description: 'احسب تكلفة مشاريع البناء'
  },
  {
    route: '/user/invoices',
    title: 'إدارة الفواتير',
    icon: 'FileText',
    description: 'إنشاء ومتابعة الفواتير'
  }
];

console.log('\n🤖 AI Features Integration Check:');
const missingFeatures = aiFeatures.filter(feature => {
  const isLinked = content.includes(feature.route);
  console.log(`  ${isLinked ? '✅' : '❌'} ${feature.title} (${feature.route})`);
  return !isLinked;
});

// Generate quick actions for missing features
if (missingFeatures.length > 0) {
  console.log('\n🔧 Generating Quick Actions for Missing Features:');
  
  const quickActionsCode = `
  // AI Features Quick Actions
  const aiQuickActions = [
    ${missingFeatures.map(feature => `{
      id: '${feature.route.replace(/\//g, '-')}',
      title: '${feature.title}',
      description: '${feature.description}',
      icon: ${feature.icon},
      href: '${feature.route}',
      color: 'bg-blue-500'
    }`).join(',\n    ')}
  ];`;
  
  console.log(quickActionsCode);
  
  // Generate card components
  const cardComponents = missingFeatures.map(feature => `
    <Link href="${feature.route}">
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <${feature.icon} className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">${feature.title}</h3>
              <p className="text-sm text-gray-600">${feature.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>`).join('\n');
  
  console.log('\n📋 Suggested Card Components:');
  console.log(cardComponents);
}

// Check for proper imports
console.log('\n📦 Import Analysis:');
const requiredImports = [
  'Link from "next/link"',
  'Card, CardContent from "@/core/shared/components/ui/"',
  'Typography from "@/core/shared/components/ui/"'
];

requiredImports.forEach(imp => {
  const importName = imp.split(' ')[0];
  const hasImport = content.includes(`import`) && content.includes(importName);
  console.log(`  ${hasImport ? '✅' : '❌'} ${imp}`);
});

// Generate navigation menu structure
console.log('\n🧭 Suggested Navigation Structure:');
const navStructure = {
  'الرئيسية': '/user',
  'المشاريع': {
    'جميع المشاريع': '/user/projects',
    'حاسبة التكاليف': '/user/projects/calculator',
    'مشروع جديد': '/user/projects/new'
  },
  'الفواتير والمالية': {
    'الفواتير': '/user/invoices',
    'التقارير المالية': '/user/financial-management',
    'إدارة العملاء': '/user/customers'
  },
  'الأدوات الذكية': {
    'المساعد الذكي': '/user/ai-assistant',
    'حاسبة البناء المتقدمة': '/user/ai-construction-calculator'
  },
  'الخدمات': '/user/services',
  'الملف الشخصي': '/user/profile'
};

console.log(JSON.stringify(navStructure, null, 2));

console.log('\n✨ Auto-fix analysis complete!');
console.log('\n💡 Recommendations:');
console.log('1. Ensure all AI features are properly linked in dashboard');
console.log('2. Add quick action cards for frequently used features');
console.log('3. Implement proper navigation hierarchy');
console.log('4. Add Arabic language support for all feature names');
console.log('5. Include proper icons and descriptions for each feature');
