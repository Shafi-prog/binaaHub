// اختبار سريع لتسجيل الدخول والتوجيه
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ متغيرات البيئة مفقودة!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLoginAndRedirect() {
  console.log('🧪 اختبار تسجيل الدخول والتوجيه...');
  
  try {
    // 1. تسجيل الدخول
    console.log('1️⃣ تسجيل الدخول...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'user@user.com',
      password: '123456'
    });

    if (signInError) {
      console.error('❌ فشل تسجيل الدخول:', signInError.message);
      return;
    }

    console.log('✅ نجح تسجيل الدخول');

    // 2. جلب بيانات المستخدم
    console.log('2️⃣ جلب بيانات المستخدم...');
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('account_type')
      .eq('email', 'user@user.com')
      .single();

    if (fetchError || !userData?.account_type) {
      console.error('❌ فشل جلب بيانات المستخدم:', fetchError?.message);
      return;
    }

    console.log('✅ تم جلب بيانات المستخدم:', userData);

    // 3. تحديد صفحة التوجيه
    console.log('3️⃣ تحديد صفحة التوجيه...');
    const redirectTo = userData.account_type === 'store'
      ? '/store/dashboard'
      : userData.account_type === 'user' || userData.account_type === 'client'
        ? '/user/dashboard'
        : userData.account_type === 'engineer' || userData.account_type === 'consultant'
          ? '/dashboard/construction-data'
          : '/';

    console.log('✅ صفحة التوجيه:', redirectTo);

    // 4. تحديث الجلسة
    console.log('4️⃣ تحديث الجلسة...');
    const { data: refreshedSession } = await supabase.auth.refreshSession();
    console.log('✅ تم تحديث الجلسة:', refreshedSession?.session ? 'نجح' : 'فشل');

    // 5. التحقق من الجلسة النهائية
    console.log('5️⃣ التحقق من الجلسة النهائية...');
    const { data: { session } } = await supabase.auth.getSession();
    console.log('✅ الجلسة النهائية:', session ? 'موجودة' : 'غير موجودة');
    if (session) {
      console.log('👤 المستخدم:', session.user.email);
      console.log('⏰ انتهاء الجلسة:', new Date(session.expires_at * 1000));
    }

    // 6. تنظيف
    console.log('6️⃣ تنظيف الجلسة...');
    await supabase.auth.signOut();
    console.log('✅ تم تسجيل الخروج');

    console.log('🎉 جميع خطوات الاختبار نجحت!');
    console.log(`🚀 المستخدم ${userData.account_type} يجب أن يُوجه إلى: ${redirectTo}`);

  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message);
  }
}

testLoginAndRedirect();
