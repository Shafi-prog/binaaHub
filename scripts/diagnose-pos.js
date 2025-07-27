const fs = require('fs');
const path = require('path');

console.log('🔍 تشخيص نقطة البيع...');

// Check if POS page exists and has content
const posFilePath = path.join(__dirname, 'src', 'app', 'store', 'pos', 'page.tsx');
if (fs.existsSync(posFilePath)) {
  const content = fs.readFileSync(posFilePath, 'utf8');
  console.log('✅ ملف نقطة البيع موجود');
  console.log(`📊 حجم الملف: ${(content.length / 1024).toFixed(2)} KB`);
  
  // Check for key components
  const checks = [
    { name: 'POSErrorBoundary', exists: content.includes('POSErrorBoundary') },
    { name: 'useState hooks', exists: content.includes('useState') },
    { name: 'useEffect hooks', exists: content.includes('useEffect') },
    { name: 'Supabase client', exists: content.includes('createClientComponentClient') },
    { name: 'Arabic text', exists: content.includes('نقطة البيع') },
    { name: 'Error handling', exists: content.includes('typeof window') },
    { name: 'Dialog components', exists: content.includes('Dialog') },
  ];
  
  console.log('\n📋 فحص المكونات:');
  checks.forEach(check => {
    console.log(`${check.exists ? '✅' : '❌'} ${check.name}`);
  });
  
  // Check for potential issues
  const issues = [];
  if (content.includes('@ts-nocheck')) {
    issues.push('يحتوي على @ts-nocheck');
  }
  if (!content.includes('export default')) {
    issues.push('لا يحتوي على export default');
  }
  
  if (issues.length > 0) {
    console.log('\n⚠️  مشاكل محتملة:');
    issues.forEach(issue => console.log(`   - ${issue}`));
  } else {
    console.log('\n✅ لا توجد مشاكل واضحة');
  }
  
} else {
  console.log('❌ ملف نقطة البيع غير موجود!');
}

console.log('\n✨ تم انتهاء التشخيص');
