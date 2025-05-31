// Comprehensive Login Test Script
// Run this in browser console on http://localhost:3001/login

console.log('🚀 Starting comprehensive login test...');

// Wait for page to fully load
setTimeout(async () => {
  try {
    console.log('1️⃣ Checking if login form exists...');

    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const submitButton = document.querySelector('button[type="submit"]');

    if (!emailInput || !passwordInput || !submitButton) {
      console.error('❌ Login form elements not found');
      return;
    }

    console.log('✅ Login form elements found');

    // Fill in test credentials
    console.log('2️⃣ Filling in test credentials...');
    emailInput.value = 'user@user.com';
    passwordInput.value = '123456';

    // Trigger input events
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    passwordInput.dispatchEvent(new Event('input', { bubbles: true }));

    console.log('✅ Credentials filled');
    console.log('📧 Email:', emailInput.value);
    console.log('🔑 Password:', passwordInput.value);

    // Submit the form
    console.log('3️⃣ Submitting login form...');
    submitButton.click();

    console.log('✅ Form submitted, monitoring for redirects...');

    // Monitor for status updates and redirects
    let redirectCount = 0;
    const maxWaitTime = 30000; // 30 seconds
    const startTime = Date.now();

    const checkRedirect = () => {
      const currentUrl = window.location.href;
      console.log(`🔍 Current URL: ${currentUrl}`);

      if (currentUrl.includes('/user/dashboard')) {
        console.log('🎉 SUCCESS: Redirected to user dashboard!');
        console.log('✅ Login flow completed successfully');
        return true;
      } else if (currentUrl.includes('/store/dashboard')) {
        console.log('🎉 SUCCESS: Redirected to store dashboard!');
        console.log('✅ Login flow completed successfully');
        return true;
      } else if (currentUrl.includes('/dashboard')) {
        console.log('🎉 SUCCESS: Redirected to dashboard!');
        console.log('✅ Login flow completed successfully');
        return true;
      }

      return false;
    };

    // Check immediately
    if (checkRedirect()) return;

    // Set up interval to check for redirects
    const checkInterval = setInterval(() => {
      if (Date.now() - startTime > maxWaitTime) {
        console.error('❌ TIMEOUT: No redirect detected within 30 seconds');
        clearInterval(checkInterval);
        return;
      }

      if (checkRedirect()) {
        clearInterval(checkInterval);
        return;
      }

      // Check for status messages
      const statusElement = document.querySelector('.bg-blue-50');
      if (statusElement) {
        console.log('📊 Status:', statusElement.textContent);
      }

      redirectCount++;
    }, 1000);
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}, 2000);

console.log('⏳ Test script loaded, waiting 2 seconds for page to stabilize...');
