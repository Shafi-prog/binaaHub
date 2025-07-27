#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔍 User Dashboard Validation Script\n');

// Find dashboard components
const dashboardFiles = glob.sync('src/**/UserDashboard.tsx', { cwd: process.cwd() });

if (dashboardFiles.length === 0) {
  console.log('❌ No UserDashboard.tsx found!');
  process.exit(1);
}

console.log(`📄 Analyzing dashboard: ${dashboardFiles[0]}`);
const dashboardPath = path.join(process.cwd(), dashboardFiles[0]);
const content = fs.readFileSync(dashboardPath, 'utf8');

// Validation checks
const validations = [
  {
    name: 'Dashboard Cards Structure',
    check: () => content.includes('dashboardCards') || content.includes('cards'),
    severity: 'error'
  },
  {
    name: 'Quick Actions Section',
    check: () => content.includes('quickActions') || content.includes('Quick') || content.includes('سريعة'),
    severity: 'warning'
  },
  {
    name: 'Navigation Links',
    check: () => content.includes('href=') || content.includes('router.push') || content.includes('Link'),
    severity: 'error'
  },
  {
    name: 'AI Features Integration',
    check: () => content.includes('calculator') || content.includes('ai-assistant') || content.includes('حاسبة'),
    severity: 'warning'
  },
  {
    name: 'Invoice/Financial Links',
    check: () => content.includes('invoice') || content.includes('financial') || content.includes('فاتورة'),
    severity: 'info'
  },
  {
    name: 'Arabic Language Support',
    check: () => /[\u0600-\u06FF]/.test(content),
    severity: 'info'
  },
  {
    name: 'Responsive Design Classes',
    check: () => content.includes('grid') || content.includes('flex') || content.includes('responsive'),
    severity: 'warning'
  },
  {
    name: 'Accessibility Features',
    check: () => content.includes('aria-') || content.includes('alt=') || content.includes('role='),
    severity: 'info'
  }
];

console.log('\n🧪 Validation Results:');
validations.forEach(validation => {
  const passed = validation.check();
  const icon = passed ? '✅' : getIcon(validation.severity);
  console.log(`${icon} ${validation.name}`);
  
  if (!passed && validation.severity === 'error') {
    console.log(`   ⚠️  Critical issue - requires immediate attention`);
  }
});

function getIcon(severity) {
  switch (severity) {
    case 'error': return '❌';
    case 'warning': return '⚠️';
    case 'info': return 'ℹ️';
    default: return '❓';
  }
}

// Count specific patterns
console.log('\n📊 Pattern Analysis:');
const patterns = {
  'Navigation Links': (content.match(/href=['"][^'"]*['"]/g) || []).length,
  'React Components': (content.match(/<[A-Z][^>]*>/g) || []).length,
  'Arabic Text': (content.match(/[\u0600-\u06FF]+/g) || []).length,
  'CSS Classes': (content.match(/className=['"][^'"]*['"]/g) || []).length
};

Object.entries(patterns).forEach(([pattern, count]) => {
  console.log(`  ${pattern}: ${count} instances`);
});

// Find all user routes referenced
console.log('\n🗺️  Referenced User Routes:');
const userRoutes = content.match(/\/user\/[^'"'\s]*/g) || [];
const uniqueRoutes = [...new Set(userRoutes)];
uniqueRoutes.forEach(route => console.log(`  - ${route}`));

// Check for common dashboard sections
console.log('\n📋 Dashboard Sections Analysis:');
const sections = [
  { name: 'Welcome Section', patterns: ['welcome', 'مرحبا', 'أهلا'] },
  { name: 'Statistics Cards', patterns: ['stats', 'إحصائيات', 'statistics'] },
  { name: 'Recent Activity', patterns: ['recent', 'activity', 'نشاط', 'أخيرة'] },
  { name: 'Quick Actions', patterns: ['quick', 'actions', 'سريعة', 'إجراءات'] },
  { name: 'Navigation Menu', patterns: ['menu', 'nav', 'قائمة', 'تنقل'] }
];

sections.forEach(section => {
  const found = section.patterns.some(pattern => 
    content.toLowerCase().includes(pattern.toLowerCase())
  );
  console.log(`  ${found ? '✅' : '❌'} ${section.name}`);
});

console.log('\n✨ Dashboard validation complete!');
