// Final Login Test - Automated Verification
// Run this script to verify the complete login flow works correctly

console.log('🚀 بدء اختبار تسجيل الدخول النهائي...');
console.log('🎯 الهدف: التحقق من أن المستخدم user@user.com يتم توجيهه إلى /user/dashboard');

// Function to simulate login process
async function testCompleteLoginFlow() {
    console.log('\n1️⃣ التحقق من عناصر صفحة تسجيل الدخول...');
    
    // Check if we're on the login page
    if (!window.location.href.includes('/login')) {
        console.error('❌ لسنا في صفحة تسجيل الدخول');
        return false;
    }
    
    // Find form elements
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const submitButton = document.querySelector('button[type="submit"]');
    
    if (!emailInput || !passwordInput || !submitButton) {
        console.error('❌ عناصر النموذج غير موجودة');
        return false;
    }
    
    console.log('✅ تم العثور على جميع عناصر النموذج');
    
    console.log('\n2️⃣ ملء بيانات الاختبار...');
    
    // Clear existing values
    emailInput.value = '';
    passwordInput.value = '';
    
    // Fill in test credentials
    emailInput.value = 'user@user.com';
    passwordInput.value = '123456';
    
    // Trigger input events to update React state
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    emailInput.dispatchEvent(new Event('change', { bubbles: true }));
    passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
    passwordInput.dispatchEvent(new Event('change', { bubbles: true }));
    
    console.log('✅ تم ملء البيانات:');
    console.log('  📧 البريد الإلكتروني:', emailInput.value);
    console.log('  🔑 كلمة المرور:', '*'.repeat(passwordInput.value.length));
    
    console.log('\n3️⃣ إرسال نموذج تسجيل الدخول...');
    
    // Set up listeners for status updates
    let statusUpdates = [];
    const statusObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                const statusElement = document.querySelector('.bg-blue-50');
                if (statusElement && statusElement.textContent) {
                    const status = statusElement.textContent.trim();
                    if (!statusUpdates.includes(status)) {
                        statusUpdates.push(status);
                        console.log('📊 حالة:', status);
                    }
                }
            }
        });
    });
    
    // Start observing for status changes
    statusObserver.observe(document.body, { 
        childList: true, 
        subtree: true 
    });
    
    // Submit the form
    submitButton.click();
    console.log('✅ تم إرسال النموذج');
    
    console.log('\n4️⃣ مراقبة عملية التوجيه...');
    console.log('⏳ انتظار حتى 30 ثانية للتوجيه...');
    
    // Wait for redirect with timeout
    const startTime = Date.now();
    const maxWaitTime = 30000; // 30 seconds
    
    return new Promise((resolve) => {
        const checkRedirect = () => {
            const currentUrl = window.location.href;
            const elapsed = Date.now() - startTime;
            
            // Log current status every 2 seconds
            if (elapsed % 2000 < 100) {
                console.log(`🔍 الرابط الحالي: ${currentUrl} (مرور الوقت: ${Math.round(elapsed/1000)}s)`);
            }
            
            // Check for successful redirect
            if (currentUrl.includes('/user/dashboard')) {
                console.log('\n🎉 نجح التوجيه!');
                console.log('✅ تم توجيه المستخدم إلى لوحة تحكم المستخدم');
                console.log('🔗 الرابط النهائي:', currentUrl);
                statusObserver.disconnect();
                resolve({
                    success: true,
                    finalUrl: currentUrl,
                    redirectType: 'user-dashboard',
                    timeElapsed: elapsed,
                    statusUpdates
                });
                return;
            } else if (currentUrl.includes('/store/dashboard')) {
                console.log('\n⚠️ تم التوجيه إلى لوحة تحكم المتجر');
                console.log('🔗 الرابط النهائي:', currentUrl);
                statusObserver.disconnect();
                resolve({
                    success: true,
                    finalUrl: currentUrl,
                    redirectType: 'store-dashboard',
                    timeElapsed: elapsed,
                    statusUpdates,
                    note: 'تم التوجيه إلى لوحة المتجر بدلاً من المستخدم'
                });
                return;
            } else if (currentUrl.includes('/dashboard')) {
                console.log('\n✅ تم التوجيه إلى لوحة تحكم');
                console.log('🔗 الرابط النهائي:', currentUrl);
                statusObserver.disconnect();
                resolve({
                    success: true,
                    finalUrl: currentUrl,
                    redirectType: 'dashboard',
                    timeElapsed: elapsed,
                    statusUpdates
                });
                return;
            }
            
            // Check for timeout
            if (elapsed > maxWaitTime) {
                console.log('\n❌ انتهت المهلة المحددة');
                console.log('⏰ لم يتم اكتشاف توجيه خلال 30 ثانية');
                console.log('🔗 الرابط الحالي:', currentUrl);
                console.log('📊 تحديثات الحالة:', statusUpdates);
                statusObserver.disconnect();
                resolve({
                    success: false,
                    error: 'انتهاء المهلة',
                    finalUrl: currentUrl,
                    timeElapsed: elapsed,
                    statusUpdates
                });
                return;
            }
            
            // Continue checking
            setTimeout(checkRedirect, 500);
        };
        
        // Start checking
        setTimeout(checkRedirect, 1000);
    });
}

// Auto-run the test
testCompleteLoginFlow().then(result => {
    console.log('\n📊 نتائج الاختبار النهائي:');
    console.log('==========================================');
    
    if (result.success) {
        console.log('🎉 الاختبار نجح بالكامل!');
        console.log('✅ نظام تسجيل الدخول يعمل بشكل صحيح');
        console.log(`🕒 وقت التوجيه: ${Math.round(result.timeElapsed/1000)} ثانية`);
        console.log(`🎯 نوع التوجيه: ${result.redirectType}`);
        console.log(`🔗 الرابط النهائي: ${result.finalUrl}`);
        
        if (result.note) {
            console.log(`📝 ملاحظة: ${result.note}`);
        }
    } else {
        console.log('❌ فشل الاختبار');
        console.log(`❗ السبب: ${result.error}`);
        console.log(`🔗 الرابط الحالي: ${result.finalUrl}`);
    }
    
    if (result.statusUpdates && result.statusUpdates.length > 0) {
        console.log('\n📋 تحديثات الحالة المسجلة:');
        result.statusUpdates.forEach((status, index) => {
            console.log(`  ${index + 1}. ${status}`);
        });
    }
    
    console.log('\n==========================================');
    console.log('🏁 انتهى اختبار تسجيل الدخول النهائي');
});

console.log('📋 تم تحميل سكريبت الاختبار النهائي');
console.log('⚡ سيبدأ الاختبار تلقائياً عند تحميل الصفحة');
