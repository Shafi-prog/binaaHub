const puppeteer = require('puppeteer');

async function testLoginFlow() {
  console.log('🚀 Starting comprehensive login test...');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized'],
  });

  // Test User Account
  console.log('\n📋 Testing User Account (user@user.com)...');
  const userPage = await browser.newPage();
  await userPage.goto('http://localhost:3004/login');

  // Fill user credentials
  await userPage.type('input[type="email"]', 'user@user.com');
  await userPage.type('input[type="password"]', '123456');

  // Monitor console logs
  userPage.on('console', (msg) => {
    console.log('👤 USER PAGE:', msg.text());
  });

  // Submit form
  await userPage.click('button[type="submit"]');

  // Wait for redirect or error
  try {
    await userPage.waitForNavigation({ timeout: 10000 });
    const currentUrl = userPage.url();
    console.log('✅ User redirected to:', currentUrl);

    if (currentUrl.includes('/user/dashboard')) {
      console.log('✅ SUCCESS: User correctly redirected to user dashboard!');
    } else {
      console.log('❌ FAILED: User redirected to wrong page:', currentUrl);
    }
  } catch (error) {
    console.log('❌ User login failed or timed out');
  }

  // Test Store Account
  console.log('\n📋 Testing Store Account (store@store.com)...');
  const storePage = await browser.newPage();
  await storePage.goto('http://localhost:3004/login');

  // Fill store credentials
  await storePage.type('input[type="email"]', 'store@store.com');
  await storePage.type('input[type="password"]', '123456');

  // Monitor console logs
  storePage.on('console', (msg) => {
    console.log('🏪 STORE PAGE:', msg.text());
  });

  // Submit form
  await storePage.click('button[type="submit"]');

  // Wait for redirect or error
  try {
    await storePage.waitForNavigation({ timeout: 10000 });
    const currentUrl = storePage.url();
    console.log('✅ Store redirected to:', currentUrl);

    if (currentUrl.includes('/store/dashboard')) {
      console.log('✅ SUCCESS: Store correctly redirected to store dashboard!');
    } else {
      console.log('❌ FAILED: Store redirected to wrong page:', currentUrl);
    }
  } catch (error) {
    console.log('❌ Store login failed or timed out');
  }

  // Keep pages open for manual inspection
  console.log('\n🔍 Pages kept open for manual inspection...');
  console.log('Press Ctrl+C to close when done testing');

  // Wait indefinitely
  await new Promise(() => {});
}

testLoginFlow().catch(console.error);
