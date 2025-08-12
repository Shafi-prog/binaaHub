// فحص بنية قاعدة البيانات الفعلية
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://lqhopwohuddhapkhhikf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxaG9wd29odWRkaGFwa2hoaWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5Njc1NjQsImV4cCI6MjA1OTU0MzU2NH0.Zze96fAMkynERwRFhyMF-F6_ds5WcwGckLD0qGQD9JQ'
);

async function inspectDatabase() {
  console.log('🔍 فحص بنية قاعدة البيانات الفعلية');
  console.log('===================================\n');
  
  // 1. فحص جدول user_profiles
  console.log('👤 فحص جدول user_profiles:');
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('   ❌', error.message);
    } else {
      console.log('   ✅ الجدول موجود');
      if (data && data.length > 0) {
        console.log('   📝 الأعمدة المتاحة:', Object.keys(data[0]).join(', '));
      } else {
        console.log('   📝 الجدول فارغ - سنحتاج لفحص المخطط');
      }
    }
  } catch (e) {
    console.log('   ❌ خطأ:', e.message);
  }
  
  // 2. فحص جدول construction_projects
  console.log('\n🏗️ فحص جدول construction_projects:');
  try {
    const { data, error } = await supabase
      .from('construction_projects')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('   ❌', error.message);
    } else {
      console.log('   ✅ الجدول موجود');
      if (data && data.length > 0) {
        console.log('   📝 الأعمدة المتاحة:', Object.keys(data[0]).join(', '));
      } else {
        console.log('   📝 الجدول فارغ');
      }
    }
  } catch (e) {
    console.log('   ❌ خطأ:', e.message);
  }
  
  // 3. فحص جدول orders
  console.log('\n🛒 فحص جدول orders:');
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('   ❌', error.message);
    } else {
      console.log('   ✅ الجدول موجود');
      if (data && data.length > 0) {
        console.log('   📝 الأعمدة المتاحة:', Object.keys(data[0]).join(', '));
      } else {
        console.log('   📝 الجدول فارغ');
      }
    }
  } catch (e) {
    console.log('   ❌ خطأ:', e.message);
  }
  
  // 4. فحص جدول products
  console.log('\n📦 فحص جدول products:');
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('   ❌', error.message);
    } else {
      console.log('   ✅ الجدول موجود');
      if (data && data.length > 0) {
        console.log('   📝 الأعمدة المتاحة:', Object.keys(data[0]).join(', '));
      } else {
        console.log('   📝 الجدول فارغ');
      }
    }
  } catch (e) {
    console.log('   ❌ خطأ:', e.message);
  }
  
  // 5. فحص جدول service_providers
  console.log('\n🔧 فحص جدول service_providers:');
  try {
    const { data, error } = await supabase
      .from('service_providers')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('   ❌', error.message);
    } else {
      console.log('   ✅ الجدول موجود');
      if (data && data.length > 0) {
        console.log('   📝 الأعمدة المتاحة:', Object.keys(data[0]).join(', '));
      } else {
        console.log('   📝 الجدول فارغ');
      }
    }
  } catch (e) {
    console.log('   ❌ خطأ:', e.message);
  }
  
  console.log('\n✅ انتهى فحص قاعدة البيانات');
}

inspectDatabase()
  .catch(error => {
    console.error('💥 خطأ في فحص قاعدة البيانات:', error);
  });
