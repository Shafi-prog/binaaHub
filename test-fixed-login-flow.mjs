// Test script to verify the fixed login flow
import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lvnhakmdswjdozwkkmnl.supabase.co';
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bmhha21kc3dqZG96d2trbW5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3OTI0NzgsImV4cCI6MjA1MjM2ODQ3OH0.nrQR69a4P1zlr5P3wE5qKyKDCXFTgDTRN7R4Lf04xCo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLoginFlow() {
  console.log('🧪 بدء اختبار تدفق تسجيل الدخول المحدث...');

  try {
    // Test user login
    console.log('🔐 اختبار تسجيل دخول المستخدم...');
    const { data: userData, error: userError } = await supabase.auth.signInWithPassword({
      email: 'user@user.com',
      password: '123456',
    });

    if (userError) {
      console.error('❌ خطأ في تسجيل دخول المستخدم:', userError.message);
      return;
    }

    console.log('✅ تم تسجيل دخول المستخدم بنجاح');
    console.log('👤 بيانات المستخدم:', {
      email: userData.user?.email,
      id: userData.user?.id,
      hasSession: !!userData.session,
    });

    // Get user data from database
    const { data: dbUser, error: dbError } = await supabase
      .from('users')
      .select('account_type')
      .eq('email', 'user@user.com')
      .single();

    if (dbError) {
      console.error('❌ خطأ في جلب بيانات المستخدم من قاعدة البيانات:', dbError.message);
    } else {
      console.log('✅ بيانات المستخدم من قاعدة البيانات:', dbUser);
    }

    // Test auth refresh endpoint
    console.log('🔄 اختبار نقطة تحديث المصادقة...');
    try {
      const response = await fetch('http://localhost:3004/api/auth/refresh', {
        method: 'GET',
        headers: {
          Cookie: `sb-lvnhakmdswjdozwkkmnl-auth-token=${userData.session?.access_token}`,
        },
      });

      const refreshData = await response.json();
      console.log('✅ استجابة تحديث المصادقة:', refreshData);
    } catch (refreshError) {
      console.error('❌ خطأ في اختبار تحديث المصادقة:', refreshError);
    }

    // Sign out
    await supabase.auth.signOut();
    console.log('🚪 تم تسجيل الخروج');

    // Test store login
    console.log('\n🏪 اختبار تسجيل دخول المتجر...');
    const { data: storeData, error: storeError } = await supabase.auth.signInWithPassword({
      email: 'store@store.com',
      password: '123456',
    });

    if (storeError) {
      console.error('❌ خطأ في تسجيل دخول المتجر:', storeError.message);
      return;
    }

    console.log('✅ تم تسجيل دخول المتجر بنجاح');
    console.log('🏪 بيانات المتجر:', {
      email: storeData.user?.email,
      id: storeData.user?.id,
      hasSession: !!storeData.session,
    });

    // Get store data from database
    const { data: dbStore, error: dbStoreError } = await supabase
      .from('users')
      .select('account_type')
      .eq('email', 'store@store.com')
      .single();

    if (dbStoreError) {
      console.error('❌ خطأ في جلب بيانات المتجر من قاعدة البيانات:', dbStoreError.message);
    } else {
      console.log('✅ بيانات المتجر من قاعدة البيانات:', dbStore);
    }

    // Sign out
    await supabase.auth.signOut();
    console.log('🚪 تم تسجيل خروج المتجر');

    console.log('\n🎉 تم اختبار تدفق تسجيل الدخول بنجاح!');
  } catch (error) {
    console.error('❌ خطأ عام في الاختبار:', error);
  }
}

// Run the test
testLoginFlow().catch(console.error);
