// اختبار الاتصال بـ Supabase والتحقق من البيانات
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lqhopwohuddhapkhhikf.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxaG9wd29odWRkaGFwa2hoaWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5Njc1NjQsImV4cCI6MjA1OTU0MzU2NH0.Zze96fAMkynERwRFhyMF-F6_ds5WcwGckLD0qGQD9JQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
  console.log('🔍 جاري اختبار الاتصال مع Supabase...');

  try {
    // اختبار الاتصال
    const { data, error } = await supabase.from('users').select('*').limit(5);

    if (error) {
      console.error('❌ خطأ في الاتصال:', error.message);
      return;
    }

    console.log('✅ تم الاتصال بنجاح!');
    console.log('📊 المستخدمين الموجودين:', data?.length || 0);

    if (data && data.length > 0) {
      console.log('👤 بيانات المستخدمين:');
      data.forEach((user) => {
        console.log(`  - ${user.email} (${user.account_type})`);
      });
    }

    // البحث عن المستخدم المحدد
    console.log('\n🔍 البحث عن user@user.com...');
    const { data: specificUser, error: searchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'user@user.com')
      .single();

    if (searchError) {
      console.error('❌ لم يتم العثور على المستخدم:', searchError.message);

      // إنشاء المستخدم إذا لم يكن موجوداً
      console.log('📝 إنشاء مستخدم اختباري...');
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            email: 'user@user.com',
            name: 'Test User',
            account_type: 'user',
          },
        ])
        .select();

      if (insertError) {
        console.error('❌ فشل في إنشاء المستخدم:', insertError.message);
      } else {
        console.log('✅ تم إنشاء المستخدم بنجاح!');
        console.log('👤 بيانات المستخدم الجديد:', newUser);
      }
    } else {
      console.log('✅ تم العثور على المستخدم!');
      console.log('👤 بيانات المستخدم:', specificUser);
    }

    // اختبار التوثيق
    console.log('\n🔐 اختبار التوثيق...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'user@user.com',
      password: '123456',
    });

    if (authError) {
      console.error('❌ فشل في التوثيق:', authError.message);

      // إنشاء حساب التوثيق إذا لم يكن موجوداً
      console.log('📝 إنشاء حساب توثيق...');
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: 'user@user.com',
        password: '123456',
      });

      if (signUpError) {
        console.error('❌ فشل في إنشاء حساب التوثيق:', signUpError.message);
      } else {
        console.log('✅ تم إنشاء حساب التوثيق بنجاح!');
        console.log('👤 بيانات التوثيق:', signUpData.user?.email);
      }
    } else {
      console.log('✅ تم التوثيق بنجاح!');
      console.log('👤 الجلسة:', authData.session?.user.email);
    }
  } catch (err) {
    console.error('❌ خطأ غير متوقع:', err);
  }
}

testSupabaseConnection();
