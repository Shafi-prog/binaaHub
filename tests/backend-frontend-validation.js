#!/usr/bin/env node
// فحص صحة الاتصال بين الواجهة الأمامية والخلفية
import { createClient } from '@supabase/supabase-js';
import puppeteer from 'puppeteer';

const BASE_URL = 'http://localhost:3000';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lqhopwohuddhapkhhikf.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxaG9wd29odWRkaGFwa2hoaWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5Njc1NjQsImV4cCI6MjA1OTU0MzU2NH0.Zze96fAMkynERwRFhyMF-F6_ds5WcwGckLD0qGQD9JQ';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 فحص صحة الاتصال بين الواجهة الأمامية والخلفية');
console.log('='.repeat(60));

async function testBackendAPI() {
  console.log('\n📡 اختبار APIs الخلفية...');
  
  try {
    // اختبار API المنتجات
    const response = await fetch(`${BASE_URL}/api/products`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`   ✅ API المنتجات: ${data.data?.length || 0} منتج`);
    
    // اختبار قاعدة البيانات مباشرة
    const { data: dbProducts, error } = await supabase
      .from('products')
      .select('id, name')
      .limit(5);
    
    if (error) {
      console.log(`   ⚠️  خطأ في قاعدة البيانات: ${error.message}`);
    } else {
      console.log(`   ✅ قاعدة البيانات: ${dbProducts?.length || 0} منتج`);
    }
    
    return true;
  } catch (error) {
    console.log(`   ❌ فشل اختبار الخلفية: ${error.message}`);
    return false;
  }
}

async function testFrontendBackendIntegration() {
  console.log('\n🌐 اختبار تكامل الواجهة الأمامية مع الخلفية...');
  
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });
    
    const page = await browser.newPage();
    page.setDefaultTimeout(15000);
    
    // اختبار الصفحة الرئيسية
    console.log('   📄 اختبار الصفحة الرئيسية...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 15000 });
    
    const title = await page.title();
    console.log(`   ✅ العنوان: ${title}`);
    
    // اختبار تحميل المنتجات في الواجهة
    console.log('   📦 اختبار تحميل المنتجات...');
    
    // انتظار تحميل المنتجات أو رسالة التحميل
    await page.waitForSelector('.product-card, .loading, .error, [data-test="product-card"]', { timeout: 10000 });
    
    const productCards = await page.$$('.product-card, [data-test="product-card"]');
    const loadingElements = await page.$$('.loading');
    const errorElements = await page.$$('.error');
    
    if (productCards.length > 0) {
      console.log(`   ✅ تم تحميل ${productCards.length} منتج في الواجهة`);
    } else if (loadingElements.length > 0) {
      console.log('   ⏳ المنتجات قيد التحميل...');
    } else if (errorElements.length > 0) {
      console.log('   ⚠️  ظهرت رسالة خطأ في تحميل المنتجات');
    } else {
      console.log('   ℹ️  لا توجد منتجات معروضة');
    }
    
    // اختبار استجابة API من الواجهة
    const apiResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        return { success: true, count: data.data?.length || 0 };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
    
    if (apiResponse.success) {
      console.log(`   ✅ API يستجيب من الواجهة: ${apiResponse.count} منتج`);
    } else {
      console.log(`   ❌ فشل استدعاء API من الواجهة: ${apiResponse.error}`);
    }
    
    return true;
    
  } catch (error) {
    console.log(`   ❌ فشل اختبار التكامل: ${error.message}`);
    return false;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function testCRUDOperations() {
  console.log('\n🔄 اختبار عمليات CRUD...');
  
  try {
    // اختبار القراءة
    const { data: users, error: readError } = await supabase
      .from('user_profiles')
      .select('id, email, display_name')
      .limit(3);
    
    if (readError) {
      console.log(`   ❌ فشل في قراءة البيانات: ${readError.message}`);
      return false;
    }
    
    console.log(`   ✅ قراءة البيانات: ${users?.length || 0} مستخدم`);
    
    // اختبار المنتجات
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price')
      .limit(5);
    
    if (productsError) {
      console.log(`   ❌ فشل في قراءة المنتجات: ${productsError.message}`);
    } else {
      console.log(`   ✅ قراءة المنتجات: ${products?.length || 0} منتج`);
    }
    
    // اختبار المشاريع
    const { data: projects, error: projectsError } = await supabase
      .from('construction_projects')
      .select('id, project_name')
      .limit(3);
    
    if (projectsError) {
      console.log(`   ❌ فشل في قراءة المشاريع: ${projectsError.message}`);
    } else {
      console.log(`   ✅ قراءة المشاريع: ${projects?.length || 0} مشروع`);
    }
    
    return true;
    
  } catch (error) {
    console.log(`   ❌ خطأ في عمليات CRUD: ${error.message}`);
    return false;
  }
}

async function main() {
  const startTime = Date.now();
  
  const backendTest = await testBackendAPI();
  const integrationTest = await testFrontendBackendIntegration();
  const crudTest = await testCRUDOperations();
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  console.log('\n📊 ملخص النتائج');
  console.log('='.repeat(30));
  console.log(`📡 اختبار APIs الخلفية: ${backendTest ? '✅ نجح' : '❌ فشل'}`);
  console.log(`🌐 تكامل الواجهة والخلفية: ${integrationTest ? '✅ نجح' : '❌ فشل'}`);
  console.log(`🔄 عمليات CRUD: ${crudTest ? '✅ نجح' : '❌ فشل'}`);
  
  const successCount = [backendTest, integrationTest, crudTest].filter(Boolean).length;
  const totalTests = 3;
  const percentage = Math.round((successCount / totalTests) * 100);
  
  console.log(`\n🎯 النتيجة النهائية: ${successCount}/${totalTests} (${percentage}%)`);
  console.log(`⏱️  وقت الاختبار: ${duration}ms`);
  
  if (percentage >= 67) {
    console.log('\n✅ الاتصال بين الواجهة الأمامية والخلفية يعمل بشكل صحيح');
    process.exit(0);
  } else {
    console.log('\n❌ توجد مشاكل في الاتصال بين الواجهة الأمامية والخلفية');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ خطأ فادح:', error.message);
  process.exit(1);
});
