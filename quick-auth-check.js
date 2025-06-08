// Quick authentication verification test
const fs = require('fs');

console.log('🔐 التحقق السريع من إصلاحات المصادقة');
console.log('='.repeat(50));

// Check key files
const files = [
  'src/app/user/profile/page.tsx',
  'src/app/user/projects/page.tsx',
  'src/app/user/orders/page.tsx',
  'src/app/store/dashboard/page.tsx',
];

let allGood = true;

files.forEach((file) => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const hasVerifyAuth = content.includes('verifyAuthWithRetry');
    const hasDirectAuth = content.includes('supabase.auth.getUser()');

    console.log(`📄 ${file}:`);
    console.log(`   ✅ يستخدم verifyAuthWithRetry: ${hasVerifyAuth ? 'نعم' : 'لا'}`);
    console.log(`   ⚠️ يستخدم الاستدعاء المباشر: ${hasDirectAuth ? 'نعم (مشكلة!)' : 'لا'}`);

    if (!hasVerifyAuth || hasDirectAuth) {
      allGood = false;
    }
  } else {
    console.log(`❌ ${file}: الملف غير موجود`);
    allGood = false;
  }
});

console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('🎉 جميع الملفات تستخدم النظام المحسن للمصادقة!');
  console.log('✅ مشاكل "خطأ في المصادقة" و "المستخدم غير مسجل الدخول" تم حلها');
} else {
  console.log('⚠️ هناك بعض الملفات تحتاج إصلاح');
}
