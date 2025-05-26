// Complete Login Flow Test
// This script tests the entire login and redirection process

const testLogin = async () => {
  console.log('🚀 بدء اختبار تسجيل الدخول الشامل...');
  
  try {
    // 1. Navigate to login page
    console.log('1️⃣ فتح صفحة تسجيل الدخول...');
    
    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 2. Check if form elements exist
    console.log('2️⃣ التحقق من عناصر النموذج...');
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const submitButton = document.querySelector('button[type="submit"]');
    
    if (!emailInput || !passwordInput || !submitButton) {
      console.error('❌ عناصر النموذج غير موجودة');
      return false;
    }
    
    console.log('✅ تم العثور على عناصر النموذج');
    
    // 3. Fill in credentials
    console.log('3️⃣ ملء بيانات الاعتماد...');
    emailInput.value = 'user@user.com';
    passwordInput.value = '123456';
    
    // Trigger change events
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    emailInput.dispatchEvent(new Event('change', { bubbles: true }));
    passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
    passwordInput.dispatchEvent(new Event('change', { bubbles: true }));
    
    console.log('✅ تم ملء البيانات');
    console.log('📧 البريد الإلكتروني:', emailInput.value);
    console.log('🔑 كلمة المرور:', passwordInput.value);
    
    // 4. Submit form
    console.log('4️⃣ إرسال النموذج...');
    
    // Track console logs
    const originalLog = console.log;
    const logs = [];
    console.log = (...args) => {
      logs.push(args.join(' '));
      originalLog(...args);
    };
    
    // Submit the form
    submitButton.click();
    
    console.log('✅ تم إرسال النموذج');
    console.log('⏳ انتظار المعالجة والتوجيه...');
    
    // 5. Monitor for redirect
    let redirectDetected = false;
    const startTime = Date.now();
    const maxWaitTime = 30000; // 30 seconds
    
    const checkRedirect = () => {
      const currentUrl = window.location.href;
      console.log(`🔍 الرابط الحالي: ${currentUrl}`);
      
      if (currentUrl.includes('/user/dashboard')) {
        console.log('🎉 نجح: تم التوجيه إلى لوحة تحكم المستخدم!');
        return 'user-dashboard';
      } else if (currentUrl.includes('/store/dashboard')) {
        console.log('🎉 نجح: تم التوجيه إلى لوحة تحكم المتجر!');
        return 'store-dashboard';
      } else if (currentUrl.includes('/dashboard')) {
        console.log('🎉 نجح: تم التوجيه إلى لوحة التحكم!');
        return 'dashboard';
      }
      
      return null;
    };
    
    // Wait for redirect
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        
        if (elapsed > maxWaitTime) {
          console.error('❌ انتهت المهلة: لم يتم اكتشاف توجيه خلال 30 ثانية');
          console.log('📊 السجلات المجمعة:', logs);
          clearInterval(checkInterval);
          resolve(false);
          return;
        }
        
        const redirectResult = checkRedirect();
        if (redirectResult) {
          console.log('✅ تم إكمال تدفق تسجيل الدخول بنجاح!');
          console.log('📊 نتيجة التوجيه:', redirectResult);
          clearInterval(checkInterval);
          resolve(redirectResult);
          return;
        }
        
        // Check for status updates
        const statusElement = document.querySelector('.bg-blue-50');
        if (statusElement) {
          console.log('📊 الحالة:', statusElement.textContent?.trim());
        }
        
        // Check for loading state
        const loadingButton = document.querySelector('button[disabled]');
        if (loadingButton) {
          console.log('⏳ زر التحميل نشط...');
        }
        
      }, 1000);
    });
    
  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error);
    return false;
  }
};

// Auto-run the test
testLogin().then(result => {
  if (result) {
    console.log('🎉 الاختبار مكتمل بنجاح! النتيجة:', result);
  } else {
    console.error('❌ فشل الاختبار');
  }
});

console.log('📝 تم تحميل سكريبت اختبار تسجيل الدخول الشامل');
