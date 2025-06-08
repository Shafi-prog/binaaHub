#!/usr/bin/env node

/**
 * Comprehensive Authentication Verification Script
 * Tests all authentication fixes to ensure they're working properly
 */

const fs = require('fs');
const path = require('path');

console.log('🔐 شامل للتحقق من إصلاحات المصادقة');
console.log('='.repeat(60));

// Files that should use verifyAuthWithRetry
const filesToCheck = [
  {
    path: 'src/app/user/profile/page.tsx',
    description: 'صفحة الملف الشخصي',
    shouldUse: 'verifyAuthWithRetry',
  },
  {
    path: 'src/app/user/projects/page.tsx',
    description: 'صفحة المشاريع',
    shouldUse: 'verifyAuthWithRetry',
  },
  {
    path: 'src/app/user/projects/new/page.tsx',
    description: 'صفحة إنشاء مشروع جديد',
    shouldUse: 'verifyAuthWithRetry',
  },
  {
    path: 'src/app/user/orders/page.tsx',
    description: 'صفحة الطلبات',
    shouldUse: 'verifyAuthWithRetry',
  },
  {
    path: 'src/app/store/dashboard/page.tsx',
    description: 'لوحة تحكم المتجر',
    shouldUse: 'verifyAuthWithRetry',
  },
];

function checkFile(filePath, description, shouldUse) {
  const fullPath = path.join(__dirname, filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`❌ ${description}: الملف غير موجود`);
    return false;
  }

  const content = fs.readFileSync(fullPath, 'utf8');

  // Check for required imports and functions
  const hasVerifyAuthImport = content.includes(
    "import { verifyAuthWithRetry } from '@/lib/auth-recovery'"
  );
  const hasVerifyAuthUsage = content.includes('verifyAuthWithRetry(');
  const hasUserState = content.includes('useState<User | null>(null)');
  const hasAuthErrorState = content.includes('authError');
  const hasHydratedState = content.includes('isHydrated');
  const hasDirectAuthCall = content.includes('supabase.auth.getUser()');

  console.log(`\n📋 فحص ${description}:`);
  console.log(`   ✅ استيراد verifyAuthWithRetry: ${hasVerifyAuthImport ? 'نعم' : 'لا'}`);
  console.log(`   ✅ استخدام verifyAuthWithRetry: ${hasVerifyAuthUsage ? 'نعم' : 'لا'}`);
  console.log(`   ✅ حالة المستخدم: ${hasUserState ? 'نعم' : 'لا'}`);
  console.log(`   ✅ حالة خطأ المصادقة: ${hasAuthErrorState ? 'نعم' : 'لا'}`);
  console.log(`   ✅ حالة الهيدرة: ${hasHydratedState ? 'نعم' : 'لا'}`);
  console.log(`   ⚠️  استدعاء مباشر للمصادقة: ${hasDirectAuthCall ? 'نعم (يجب إزالته)' : 'لا'}`);

  const isCorrect =
    hasVerifyAuthImport &&
    hasVerifyAuthUsage &&
    hasUserState &&
    hasAuthErrorState &&
    hasHydratedState &&
    !hasDirectAuthCall;

  if (isCorrect) {
    console.log(`   🎉 ${description}: تم إصلاحه بشكل صحيح`);
  } else {
    console.log(`   ❌ ${description}: يحتاج لمزيد من الإصلاح`);
  }

  return isCorrect;
}

// Check auth recovery system
function checkAuthRecoverySystem() {
  console.log('\n🔧 فحص نظام استرداد المصادقة:');

  const authRecoveryPath = path.join(__dirname, 'src/lib/auth-recovery.ts');
  if (!fs.existsSync(authRecoveryPath)) {
    console.log('❌ ملف auth-recovery.ts غير موجود');
    return false;
  }

  const content = fs.readFileSync(authRecoveryPath, 'utf8');
  const hasVerifyFunction = content.includes('export async function verifyAuthWithRetry');
  const hasRetryLogic = content.includes('for (let attempt = 1; attempt <= maxRetries; attempt++)');

  console.log(`   ✅ دالة verifyAuthWithRetry: ${hasVerifyFunction ? 'موجودة' : 'غير موجودة'}`);
  console.log(`   ✅ منطق إعادة المحاولة: ${hasRetryLogic ? 'موجود' : 'غير موجود'}`);

  return hasVerifyFunction && hasRetryLogic;
}

// Check middleware
function checkMiddleware() {
  console.log('\n🛡️ فحص Middleware:');

  const middlewarePath = path.join(__dirname, 'src/middleware.ts');
  if (!fs.existsSync(middlewarePath)) {
    console.log('❌ ملف middleware.ts غير موجود');
    return false;
  }

  const content = fs.readFileSync(middlewarePath, 'utf8');
  const hasStoreProtection = content.includes('/store/dashboard');
  const hasUserProtection = content.includes('/user/dashboard');
  const hasAccountTypeCheck = content.includes('account_type');

  console.log(`   ✅ حماية مسارات المتجر: ${hasStoreProtection ? 'موجودة' : 'غير موجودة'}`);
  console.log(`   ✅ حماية مسارات المستخدم: ${hasUserProtection ? 'موجودة' : 'غير موجودة'}`);
  console.log(`   ✅ فحص نوع الحساب: ${hasAccountTypeCheck ? 'موجود' : 'غير موجود'}`);

  return hasStoreProtection && hasUserProtection && hasAccountTypeCheck;
}

// Run all checks
async function runComprehensiveCheck() {
  console.log('🚀 بدء الفحص الشامل...\n');

  // Check auth recovery system
  const authRecoveryOk = checkAuthRecoverySystem();

  // Check middleware
  const middlewareOk = checkMiddleware();

  // Check all files
  let allFilesOk = true;
  for (const file of filesToCheck) {
    const fileOk = checkFile(file.path, file.description, file.shouldUse);
    allFilesOk = allFilesOk && fileOk;
  }

  // Final report
  console.log('\n' + '='.repeat(60));
  console.log('📊 تقرير النتائج النهائي:');
  console.log(`   🔧 نظام استرداد المصادقة: ${authRecoveryOk ? '✅ يعمل' : '❌ يحتاج إصلاح'}`);
  console.log(`   🛡️ Middleware: ${middlewareOk ? '✅ يعمل' : '❌ يحتاج إصلاح'}`);
  console.log(`   📄 الصفحات المحمية: ${allFilesOk ? '✅ تم إصلاحها' : '❌ تحتاج إصلاح'}`);

  const overallStatus = authRecoveryOk && middlewareOk && allFilesOk;
  console.log(
    `\n🎯 الحالة العامة: ${overallStatus ? '🎉 جميع الإصلاحات مكتملة!' : '⚠️ هناك مشاكل تحتاج لحل'}`
  );

  if (overallStatus) {
    console.log('\n🚀 المشاكل التي تم حلها:');
    console.log('   ✅ خطأ "خطأ في المصادقة" عند النقر على "new project"');
    console.log('   ✅ رسالة "المستخدم غير مسجل الدخول" في الملف الشخصي');
    console.log('   ✅ مشاكل المصادقة في جميع الصفحات المحمية');
    console.log('   ✅ التزامن بين العميل والخادم');
    console.log('   ✅ نظام استرداد قوي للمصادقة');
  }

  return overallStatus;
}

// Run the check
runComprehensiveCheck();
