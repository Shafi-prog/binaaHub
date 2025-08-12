// إعداد عام لاختبارات E2E
const { spawn } = require('child_process');
const { promisify } = require('util');
const sleep = promisify(setTimeout);

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';

module.exports = async () => {
  console.log('🚀 بدء إعداد اختبارات E2E...');
  
  // تحقق من توفر الخادم
  const isServerRunning = await checkServerHealth();
  
  if (!isServerRunning) {
    console.log('🔧 بدء تشغيل خادم التطوير...');
    await startDevServer();
    
    // انتظار حتى يصبح الخادم جاهز
    await waitForServer();
  } else {
    console.log('✅ الخادم يعمل بالفعل');
  }
  
  // إعداد بيانات الاختبار
  await setupTestData();
  
  console.log('✅ تم إعداد اختبارات E2E بنجاح');
};

async function checkServerHealth() {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(BASE_URL, { timeout: 5000 });
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function startDevServer() {
  return new Promise((resolve, reject) => {
    const server = spawn('npm', ['run', 'dev'], {
      stdio: 'ignore',
      detached: true,
    });
    
    server.on('error', reject);
    
    // حفظ معرف العملية لإيقافها لاحقاً
    process.env.DEV_SERVER_PID = server.pid.toString();
    
    // انتظار قصير لبدء الخادم
    setTimeout(resolve, 5000);
  });
}

async function waitForServer() {
  const maxAttempts = 30;
  const delay = 2000;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const isReady = await checkServerHealth();
    
    if (isReady) {
      console.log(`✅ الخادم جاهز بعد ${attempt * delay / 1000} ثانية`);
      return;
    }
    
    console.log(`⏳ محاولة ${attempt}/${maxAttempts} - انتظار الخادم...`);
    await sleep(delay);
  }
  
  throw new Error('فشل في انتظار جاهزية الخادم');
}

async function setupTestData() {
  try {
    console.log('📊 إعداد بيانات الاختبار...');
    
    // إعداد مستخدم اختبار
    const testUser = {
      email: 'test@binna.test',
      password: 'Password123!',
      name: 'مستخدم اختبار E2E',
      phone: '0501234567'
    };
    
    // يمكن إضافة استدعاءات API لإنشاء بيانات اختبار هنا
    // مثل منتجات، متاجر، مشاريع تجريبية
    
    console.log('✅ تم إعداد بيانات الاختبار');
  } catch (error) {
    console.warn('⚠️ تحذير: فشل في إعداد بيانات الاختبار:', error.message);
  }
}
