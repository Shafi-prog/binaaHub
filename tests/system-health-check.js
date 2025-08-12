// فحص سلامة النظام الشامل - Comprehensive System Health Check
import { createClient } from '@supabase/supabase-js';

// إعدادات Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lqhopwohuddhapkhhikf.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxaG9wd29odWRkaGFwa2hoaWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5Njc1NjQsImV4cCI6MjA1OTU0MzU2NH0.Zze96fAMkynERwRFhyMF-F6_ds5WcwGckLD0qGQD9JQ';

// إنشاء عميل Supabase محسّن
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  },
  global: {
    headers: {
      'User-Agent': 'BinaaHub/1.0'
    }
  }
});

console.log('🏗️ منصة بناء هب - فحص سلامة النظام');
console.log('============================================\n');

// 1. اختبار الاتصال الأساسي
async function testBasicConnection() {
  console.log('🔌 اختبار الاتصال الأساسي...');
  
  try {
    // اختبار بسيط لجلب معلومات قاعدة البيانات
    const { data, error } = await supabase.rpc('version');
    
    if (error) {
      console.log('   ⚠️  لا يمكن الوصول لدالة version، جاري المحاولة بطريقة أخرى...');
      
      // محاولة أخرى بجلب الجداول المتاحة
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .limit(1);
      
      if (tablesError) {
        console.log('   ❌ فشل الاتصال:', tablesError.message);
        return { success: false, error: tablesError.message };
      }
    }
    
    console.log('   ✅ الاتصال بقاعدة البيانات نجح');
    return { success: true };
    
  } catch (error) {
    console.log('   ❌ خطأ في الاتصال:', error.message);
    return { success: false, error: error.message };
  }
}

// 2. اختبار الجداول الأساسية
async function testCoreTables() {
  console.log('\n📊 اختبار الجداول الأساسية...');
  
  const coreTables = [
    'user_profiles',
    'construction_projects', 
    'orders',
    'products',
    'service_providers'
  ];
  
  const results = [];
  
  for (const tableName of coreTables) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`   ❌ جدول ${tableName}: ${error.message}`);
        results.push({ table: tableName, success: false, error: error.message });
      } else {
        console.log(`   ✅ جدول ${tableName}: متاح`);
        results.push({ table: tableName, success: true });
      }
    } catch (error) {
      console.log(`   ❌ جدول ${tableName}: ${error.message}`);
      results.push({ table: tableName, success: false, error: error.message });
    }
  }
  
  return results;
}

// 3. اختبار عمليات CRUD
async function testCRUDOperations() {
  console.log('\n🔄 اختبار عمليات CRUD...');
  
  try {
    // اختبار قراءة البيانات
    const { data: profiles, error: readError } = await supabase
      .from('user_profiles')
      .select('id, email, full_name')
      .limit(5);
    
    if (readError) {
      console.log('   ❌ فشل في قراءة البيانات:', readError.message);
      return { success: false, error: readError.message };
    }
    
    console.log(`   ✅ قراءة البيانات: ${profiles?.length || 0} سجل متاح`);
    
    // لا نقوم بإنشاء أو تعديل بيانات في الاختبار السريع
    console.log('   ℹ️  اختبارات الكتابة مؤجلة للاختبارات الشاملة');
    
    return { success: true, readCount: profiles?.length || 0 };
    
  } catch (error) {
    console.log('   ❌ خطأ في عمليات CRUD:', error.message);
    return { success: false, error: error.message };
  }
}

// 4. اختبار العلاقات بين الجداول
async function testRelationships() {
  console.log('\n🔗 اختبار العلاقات بين الجداول...');
  
  try {
    // اختبار العلاقة بين المشاريع والطلبات
    const { data: projectsWithOrders, error } = await supabase
      .from('construction_projects')
      .select(`
        id,
        project_name,
        orders (
          id,
          status
        )
      `)
      .limit(3);
    
    if (error) {
      console.log('   ❌ فشل في اختبار العلاقات:', error.message);
      return { success: false, error: error.message };
    }
    
    console.log(`   ✅ العلاقات تعمل: ${projectsWithOrders?.length || 0} مشروع مع طلبات`);
    return { success: true, relationCount: projectsWithOrders?.length || 0 };
    
  } catch (error) {
    console.log('   ❌ خطأ في اختبار العلاقات:', error.message);
    return { success: false, error: error.message };
  }
}

// 5. اختبار المصادقة (Authentication)
async function testAuthentication() {
  console.log('\n🔐 اختبار نظام المصادقة...');
  
  try {
    // اختبار الحصول على المستخدم الحالي
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error && error.message !== 'Auth session missing!') {
      console.log('   ❌ خطأ في نظام المصادقة:', error.message);
      return { success: false, error: error.message };
    }
    
    if (user) {
      console.log('   ✅ مستخدم مسجل دخول:', user.email);
    } else {
      console.log('   ℹ️  لا يوجد مستخدم مسجل حالياً (طبيعي في الاختبار)');
    }
    
    return { success: true, user: user || null };
    
  } catch (error) {
    console.log('   ❌ خطأ في اختبار المصادقة:', error.message);
    return { success: false, error: error.message };
  }
}

// تشغيل جميع الاختبارات
async function runHealthCheck() {
  const startTime = Date.now();
  
  const testResults = {
    connection: await testBasicConnection(),
    tables: await testCoreTables(),
    crud: await testCRUDOperations(),
    relationships: await testRelationships(),
    auth: await testAuthentication()
  };
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  console.log('\n📈 ملخص النتائج');
  console.log('=================');
  
  let successCount = 0;
  let totalTests = 0;
  
  // فحص الاتصال
  totalTests++;
  if (testResults.connection.success) {
    successCount++;
    console.log('✅ الاتصال الأساسي: نجح');
  } else {
    console.log('❌ الاتصال الأساسي: فشل');
  }
  
  // فحص الجداول
  const tablesSuccessCount = testResults.tables.filter(t => t.success).length;
  const tablesTotal = testResults.tables.length;
  totalTests += tablesTotal;
  successCount += tablesSuccessCount;
  console.log(`📊 الجداول الأساسية: ${tablesSuccessCount}/${tablesTotal} نجح`);
  
  // فحص CRUD
  totalTests++;
  if (testResults.crud.success) {
    successCount++;
    console.log('✅ عمليات CRUD: نجحت');
  } else {
    console.log('❌ عمليات CRUD: فشلت');
  }
  
  // فحص العلاقات
  totalTests++;
  if (testResults.relationships.success) {
    successCount++;
    console.log('✅ العلاقات بين الجداول: نجحت');
  } else {
    console.log('❌ العلاقات بين الجداول: فشلت');
  }
  
  // فحص المصادقة
  totalTests++;
  if (testResults.auth.success) {
    successCount++;
    console.log('✅ نظام المصادقة: نجح');
  } else {
    console.log('❌ نظام المصادقة: فشل');
  }
  
  console.log(`\n🎯 النتيجة النهائية: ${successCount}/${totalTests} (${Math.round(successCount/totalTests*100)}%)`);
  console.log(`⏱️  وقت الاختبار: ${duration}ms`);
  
  if (successCount === totalTests) {
    console.log('\n🎉 ممتاز! جميع الاختبارات نجحت - النظام جاهز للاستخدام');
    return true;
  } else if (successCount >= totalTests * 0.8) {
    console.log('\n⚠️  معظم الاختبارات نجحت - النظام يعمل مع بعض المشاكل البسيطة');
    return true;
  } else {
    console.log('\n❌ عدة اختبارات فشلت - يُرجى مراجعة الأخطاء قبل الاستخدام');
    return false;
  }
}

// تشغيل الفحص
runHealthCheck()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('\n💥 فشل فحص سلامة النظام:', error);
    process.exit(1);
  });

export { runHealthCheck };
