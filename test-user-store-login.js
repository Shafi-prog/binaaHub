// Test Both User and Store Login Scenarios
// Run this in browser console on http://localhost:3003/login

console.log('🚀 بدء اختبار تسجيل الدخول للمستخدم والمتجر...');

async function testUserLogin() {
  console.log('\n1️⃣ اختبار تسجيل دخول المستخدم...');

  // Fill user credentials
  const emailInput = document.querySelector('input[type="email"]');
  const passwordInput = document.querySelector('input[type="password"]');
  const submitButton = document.querySelector('button[type="submit"]');

  if (!emailInput || !passwordInput || !submitButton) {
    console.error('❌ عناصر النموذج غير موجودة');
    return;
  }

  // Clear and fill user credentials
  emailInput.value = '';
  passwordInput.value = '';
  emailInput.value = 'user@user.com';
  passwordInput.value = '123456';

  emailInput.dispatchEvent(new Event('input', { bubbles: true }));
  passwordInput.dispatchEvent(new Event('input', { bubbles: true }));

  console.log('✅ تم ملء بيانات المستخدم:', emailInput.value);

  // Submit form
  submitButton.click();
  console.log('📤 تم إرسال نموذج المستخدم');

  // Monitor for redirect
  return monitorRedirect('user', '/user/dashboard');
}

async function testStoreLogin() {
  console.log('\n2️⃣ اختبار تسجيل دخول المتجر...');

  // Wait a bit before testing store login
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Navigate back to login if needed
  if (!window.location.href.includes('/login')) {
    window.location.href = '/login';
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  const emailInput = document.querySelector('input[type="email"]');
  const passwordInput = document.querySelector('input[type="password"]');
  const submitButton = document.querySelector('button[type="submit"]');

  if (!emailInput || !passwordInput || !submitButton) {
    console.error('❌ عناصر النموذج غير موجودة');
    return;
  }

  // Clear and fill store credentials
  emailInput.value = '';
  passwordInput.value = '';
  emailInput.value = 'store@store.com';
  passwordInput.value = '123456';

  emailInput.dispatchEvent(new Event('input', { bubbles: true }));
  passwordInput.dispatchEvent(new Event('input', { bubbles: true }));

  console.log('✅ تم ملء بيانات المتجر:', emailInput.value);

  // Submit form
  submitButton.click();
  console.log('📤 تم إرسال نموذج المتجر');

  // Monitor for redirect
  return monitorRedirect('store', '/store/dashboard');
}

function monitorRedirect(userType, expectedUrl) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const maxWaitTime = 20000; // 20 seconds

    const checkRedirect = () => {
      const currentUrl = window.location.href;
      const elapsed = Date.now() - startTime;

      console.log(`🔍 [${userType}] الرابط الحالي: ${currentUrl}`);

      if (currentUrl.includes(expectedUrl)) {
        console.log(`🎉 [${userType}] نجح التوجيه إلى: ${currentUrl}`);
        resolve({ success: true, finalUrl: currentUrl, userType, elapsed });
        return;
      }

      if (elapsed > maxWaitTime) {
        console.log(`❌ [${userType}] انتهت المهلة المحددة`);
        resolve({ success: false, finalUrl: currentUrl, userType, elapsed });
        return;
      }

      // Check for status messages
      const statusElement = document.querySelector('.bg-blue-50');
      if (statusElement) {
        console.log(`📊 [${userType}] الحالة: ${statusElement.textContent?.trim()}`);
      }

      setTimeout(checkRedirect, 1000);
    };

    setTimeout(checkRedirect, 2000);
  });
}

// Sequential testing function
async function runSequentialTests() {
  try {
    console.log('🔄 بدء الاختبارات المتسلسلة...');

    // Test user login first
    const userResult = await testUserLogin();
    console.log('📊 نتيجة اختبار المستخدم:', userResult);

    // Wait and test store login
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const storeResult = await testStoreLogin();
    console.log('📊 نتيجة اختبار المتجر:', storeResult);

    // Summary
    console.log('\n📋 ملخص النتائج:');
    console.log('===================');
    console.log(`👤 المستخدم: ${userResult.success ? '✅ نجح' : '❌ فشل'}`);
    console.log(`🏪 المتجر: ${storeResult.success ? '✅ نجح' : '❌ فشل'}`);

    return { user: userResult, store: storeResult };
  } catch (error) {
    console.error('❌ خطأ في الاختبارات:', error);
    return { error: error.message };
  }
}

// Start the test
runSequentialTests().then((results) => {
  console.log('\n🏁 انتهت جميع الاختبارات');
  console.log('النتائج النهائية:', results);
});

console.log('📝 تم تحميل سكريبت اختبار المستخدم والمتجر');
