#!/usr/bin/env node

// Final Authentication Flow Verification
// This script performs comprehensive testing of the login system

const puppeteer = require('puppeteer');

async function runAuthenticationTest() {
  console.log('🚀 بدء اختبار التوثيق الشامل...\n');

  let browser;
  try {
    // Launch browser
    console.log('🌐 تشغيل المتصفح...');
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 50,
      defaultViewport: { width: 1280, height: 720 },
    });

    const page = await browser.newPage();

    // Set up console logging
    page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'log') console.log(`📊 [Browser]: ${text}`);
      else if (type === 'error') console.error(`❌ [Browser Error]: ${text}`);
      else if (type === 'warning') console.warn(`⚠️ [Browser Warning]: ${text}`);
    });

    // Test 1: Navigate to login page
    console.log('1️⃣ الانتقال إلى صفحة تسجيل الدخول...');
    await page.goto('http://localhost:3002/login', { waitUntil: 'networkidle0' });

    // Wait for page to load
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    console.log('✅ تم تحميل صفحة تسجيل الدخول');

    // Test 2: Fill login form
    console.log('2️⃣ ملء نموذج تسجيل الدخول...');
    await page.type('input[type="email"]', 'user@user.com');
    await page.type('input[type="password"]', '123456');
    console.log('✅ تم ملء البيانات');

    // Test 3: Submit form and wait for redirect
    console.log('3️⃣ إرسال النموذج وانتظار التوجيه...');

    // Click submit button
    await page.click('button[type="submit"]');
    console.log('✅ تم إرسال النموذج');

    // Wait for redirect (check multiple possible URLs)
    console.log('⏳ انتظار التوجيه...');

    try {
      await page.waitForFunction(
        () => {
          const url = window.location.href;
          return (
            url.includes('/user/dashboard') ||
            url.includes('/store/dashboard') ||
            url.includes('/dashboard')
          );
        },
        { timeout: 30000 },
      );

      const finalUrl = page.url();
      console.log(`✅ تم التوجيه بنجاح إلى: ${finalUrl}`);

      // Test 4: Verify dashboard content
      console.log('4️⃣ التحقق من محتوى لوحة التحكم...');

      // Wait for dashboard to load
      await page.waitForSelector('h1, h2, h3', { timeout: 10000 });

      const title = await page.$eval('h1, h2, h3', (el) => el.textContent);
      console.log(`✅ عنوان لوحة التحكم: ${title}`);

      // Test 5: Check authentication state
      console.log('5️⃣ التحقق من حالة التوثيق...');

      const isAuthenticated = await page.evaluate(async () => {
        // This would depend on your authentication implementation
        return (
          document.cookie.includes('supabase') ||
          localStorage.getItem('supabase.auth.token') !== null
        );
      });

      if (isAuthenticated) {
        console.log('✅ المستخدم مُوثق بنجاح');
      } else {
        console.log('⚠️ حالة التوثيق غير واضحة');
      }

      console.log('\n🎉 تم إكمال جميع الاختبارات بنجاح!');
      console.log('✅ تدفق تسجيل الدخول يعمل بشكل صحيح');

      return {
        success: true,
        finalUrl,
        title,
        authenticated: isAuthenticated,
      };
    } catch (redirectError) {
      console.error('❌ فشل في التوجيه خلال 30 ثانية');
      console.error('🔍 الرابط الحالي:', page.url());

      // Check for error messages
      const errorMessages = await page.$$eval('.bg-red-50, .error, [class*="error"]', (elements) =>
        elements.map((el) => el.textContent),
      );

      if (errorMessages.length > 0) {
        console.error('📝 رسائل الخطأ:', errorMessages);
      }

      return {
        success: false,
        error: 'فشل في التوجيه',
        currentUrl: page.url(),
        errorMessages,
      };
    }
  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
    return {
      success: false,
      error: error.message,
    };
  } finally {
    if (browser) {
      console.log('🔄 إغلاق المتصفح...');
      await browser.close();
    }
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  runAuthenticationTest()
    .then((result) => {
      console.log('\n📊 نتائج الاختبار:');
      console.log(JSON.stringify(result, null, 2));
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error('❌ فشل الاختبار:', error);
      process.exit(1);
    });
}

module.exports = { runAuthenticationTest };
