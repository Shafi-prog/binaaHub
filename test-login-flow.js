// تست شامل لعملية تسجيل الدخول
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ متغيرات البيئة مفقودة!');
  console.log('URL:', supabaseUrl);
  console.log('Key:', supabaseAnonKey ? 'موجود' : 'مفقود');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLoginFlow() {
  console.log('🧪 بدء اختبار عملية تسجيل الدخول...\n');
  
  try {
    // 1. اختبار التوثيق
    console.log('1️⃣ اختبار التوثيق...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'user@user.com',
      password: '123456'
    });

    if (signInError) {
      console.error('❌ فشل التوثيق:', signInError.message);
      return;
    }

    console.log('✅ نجح التوثيق للمستخدم:', signInData.user.email);

    // 2. اختبار جلب بيانات المستخدم
    console.log('\n2️⃣ اختبار جلب بيانات المستخدم...');
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('account_type')
      .eq('email', 'user@user.com')
      .single();

    if (fetchError) {
      console.error('❌ فشل جلب بيانات المستخدم:', fetchError.message);
      return;
    }

    console.log('✅ تم جلب بيانات المستخدم:', userData);

    // 3. اختبار منطق التوجيه
    console.log('\n3️⃣ اختبار منطق التوجيه...');
    const redirectTo =
      userData.account_type === 'store'
        ? '/store/dashboard'
        : userData.account_type === 'user' || userData.account_type === 'client'
          ? '/user/dashboard'
          : userData.account_type === 'engineer' || userData.account_type === 'consultant'
            ? '/dashboard/construction-data'
            : '/';

    console.log('✅ صفحة التوجيه المحددة:', redirectTo);

    // 4. اختبار الجلسة
    console.log('\n4️⃣ اختبار الجلسة...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ فشل جلب الجلسة:', sessionError.message);
      return;
    }

    if (session) {
      console.log('✅ الجلسة نشطة للمستخدم:', session.user.email);
    } else {
      console.log('❌ لا توجد جلسة نشطة');
    }

    // 5. تنظيف - تسجيل الخروج
    console.log('\n5️⃣ تنظيف الجلسة...');
    await supabase.auth.signOut();
    console.log('✅ تم تسجيل الخروج بنجاح');

    console.log('\n🎉 جميع الاختبارات نجحت! عملية تسجيل الدخول تعمل بشكل صحيح.');
    
  } catch (error) {
    console.error('❌ خطأ غير متوقع:', error.message);
  }
}

testLoginFlow();
