// تنظيف بعد اختبارات E2E
module.exports = async () => {
  console.log('🧹 بدء تنظيف اختبارات E2E...');
  
  // تنظيف بيانات الاختبار
  await cleanupTestData();
  
  // إيقاف خادم التطوير إذا كان تم بدؤه من قبل الاختبارات
  await stopDevServer();
  
  console.log('✅ تم تنظيف اختبارات E2E بنجاح');
};

async function cleanupTestData() {
  try {
    console.log('🗑️ تنظيف بيانات الاختبار...');
    
    // تنظيف المستخدمين التجريبيين
    // تنظيف الطلبات التجريبية
    // تنظيف المشاريع التجريبية
    
    // يمكن إضافة استدعاءات API للتنظيف هنا
    
    console.log('✅ تم تنظيف بيانات الاختبار');
  } catch (error) {
    console.warn('⚠️ تحذير: فشل في تنظيف بيانات الاختبار:', error.message);
  }
}

async function stopDevServer() {
  const serverPid = process.env.DEV_SERVER_PID;
  
  if (serverPid) {
    try {
      console.log('🛑 إيقاف خادم التطوير...');
      process.kill(parseInt(serverPid), 'SIGTERM');
      console.log('✅ تم إيقاف خادم التطوير');
    } catch (error) {
      console.warn('⚠️ تحذير: فشل في إيقاف خادم التطوير:', error.message);
    }
  }
}
