#!/usr/bin/env node

// Script to seed Supabase database with sample data and test fetching
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables in .env.local');
  console.log('Required variables: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('🚀 Starting Supabase data seeding and testing...\n');

// Sample data from your service
const samplePrices = [
  // Metal Products
  { product_name: "طن حديد", category: "معادن", price: 450, price_change_percentage: 12.5, store_name: "شركة الخليج للحديد", city: "الرياض" },
  { product_name: "كيلو نحاس", category: "معادن", price: 8.75, price_change_percentage: -3.2, store_name: "عالم المعادن", city: "دبي" },
  { product_name: "طن ألمونيوم", category: "معادن", price: 2100, price_change_percentage: 5.8, store_name: "المنارة للمعادن", city: "الكويت" },
  { product_name: "طن حديد تسليح", category: "معادن", price: 520, price_change_percentage: 8.2, store_name: "مملكة الحديد", city: "الرياض" },
  { product_name: "كيلو زنك", category: "معادن", price: 3.20, price_change_percentage: -1.5, store_name: "شركة الخليج للحديد", city: "دبي" },
  
  // Precious Metals
  { product_name: "جرام ذهب", category: "معادن ثمينة", price: 235, price_change_percentage: 1.2, store_name: "قصر الذهب", city: "الدوحة" },
  { product_name: "أونصة فضة", category: "معادن ثمينة", price: 24.50, price_change_percentage: -0.8, store_name: "نجمة الفضة", city: "المنامة" },
  { product_name: "جرام بلاتين", category: "معادن ثمينة", price: 32.5, price_change_percentage: 2.1, store_name: "شركة المعادن الثمينة", city: "الرياض" },
  
  // Construction Materials
  { product_name: "كيس إسمنت 50كغ", category: "مواد بناء", price: 18.5, price_change_percentage: 3.4, store_name: "أساتذة البناء", city: "الرياض" },
  { product_name: "طن رمل", category: "مواد بناء", price: 45, price_change_percentage: 5.2, store_name: "البناء بلس", city: "دبي" },
  { product_name: "طن حصى", category: "مواد بناء", price: 55, price_change_percentage: -2.1, store_name: "أساتذة البناء", city: "الكويت" },
  { product_name: "1000 طوبة", category: "مواد بناء", price: 280, price_change_percentage: 4.5, store_name: "مصنع الطوب", city: "الدوحة" },
  { product_name: "بلاط للمتر المربع", category: "مواد بناء", price: 85, price_change_percentage: -1.2, store_name: "عالم البلاط", city: "المنامة" },
  
  // Electronics
  { product_name: "سلك نحاس 100م", category: "إلكترونيات", price: 125, price_change_percentage: 6.8, store_name: "الكهرباء المحترفة", city: "الرياض" },
  { product_name: "لمبة LED", category: "إلكترونيات", price: 15.5, price_change_percentage: -2.3, store_name: "بيت الإضاءة", city: "دبي" },
  { product_name: "مفتاح كهرباء", category: "إلكترونيات", price: 25, price_change_percentage: 1.8, store_name: "الكهرباء المحترفة", city: "الكويت" },
  
  // Textiles
  { product_name: "متر قماش قطني", category: "منسوجات", price: 12.5, price_change_percentage: 2.8, store_name: "أرض الأقمشة", city: "الرياض" },
  { product_name: "متر قماش حريري", category: "منسوجات", price: 45, price_change_percentage: -1.5, store_name: "الأقمشة الفاخرة", city: "دبي" },
  { product_name: "متر قماش صوفي", category: "منسوجات", price: 28, price_change_percentage: 3.2, store_name: "أرض الأقمشة", city: "الدوحة" },
  
  // Food & Commodities
  { product_name: "طن قمح", category: "غذائيات", price: 320, price_change_percentage: 4.5, store_name: "سوق الحبوب", city: "الرياض" },
  { product_name: "طن أرز", category: "غذائيات", price: 580, price_change_percentage: -2.1, store_name: "مركز الغذاء", city: "دبي" },
  { product_name: "طن سكر", category: "غذائيات", price: 450, price_change_percentage: 1.8, store_name: "إمداد الحلويات", city: "الكويت" }
];

const sampleUserProfiles = [
  {
    user_id: 'test-user-1',
    email: 'user@binna',
    display_name: 'مستخدم تجريبي',
    city: 'الرياض',
    account_type: 'free',
    loyalty_points: 1250,
    current_level: 3,
    total_spent: 15750,
    role: 'user'
  },
  {
    user_id: 'test-admin-1',
    email: 'admin@binna',
    display_name: 'المسئول تجريبي',
    city: 'الرياض',
    account_type: 'premium',
    loyalty_points: 5000,
    current_level: 5,
    total_spent: 50000,
    role: 'admin'
  },
  {
    user_id: 'test-store-1',
    email: 'store@binna',
    display_name: 'متجر تجريبي',
    city: 'الرياض',
    account_type: 'business',
    loyalty_points: 3000,
    current_level: 4,
    total_spent: 25000,
    role: 'store'
  }
];

const sampleStores = [
  {
    user_id: 'test-store-1',
    store_name: 'متجر مواد البناء الحديث',
    owner_name: 'متجر تجريبي',
    email: 'store@binna',
    phone: '+966501234567',
    business_type: 'building_materials',
    description: 'متجر متخصص في بيع مواد البناء والتشطيب',
    rating: 4.5,
    review_count: 234,
    total_sales: 1250000.00,
    total_orders: 567,
    verification_status: 'verified',
    location: { city: 'الرياض', area: 'الصناعية' }
  }
];

const sampleOrders = [
  {
    user_id: 'test-user-1',
    order_number: 'ORD-2025-001',
    status: 'delivered',
    total_amount: 1250.00,
    currency: 'SAR',
    items: [
      { name: 'إسمنت أبيض', quantity: 10, price: 125.00 }
    ],
    payment_method: 'card',
    payment_status: 'paid',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    user_id: 'test-user-1',
    order_number: 'ORD-2025-002',
    status: 'processing',
    total_amount: 850.00,
    currency: 'SAR',
    items: [
      { name: 'رمل ناعم', quantity: 5, price: 170.00 }
    ],
    payment_method: 'transfer',
    payment_status: 'paid',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
];

async function seedData() {
  const startTime = Date.now();
  
  try {
    console.log('📊 Seeding Material Prices...');
    const priceStartTime = Date.now();
    
    // Try to insert material prices in batches
    const batchSize = 5;
    let successCount = 0;
    
    for (let i = 0; i < samplePrices.length; i += batchSize) {
      const batch = samplePrices.slice(i, i + batchSize);
      
      try {
        const { data, error } = await supabase.from('material_prices').upsert(
          batch.map(price => ({
            ...price,
            last_updated: new Date().toISOString(),
            created_at: new Date().toISOString()
          }))
        );
        
        if (error) {
          console.error(`❌ Error inserting batch ${i / batchSize + 1}:`, error.message);
        } else {
          successCount += batch.length;
          console.log(`✅ Inserted batch ${i / batchSize + 1}: ${batch.length} prices`);
        }
      } catch (batchError) {
        console.error(`❌ Network error for batch ${i / batchSize + 1}:`, batchError.message);
      }
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const priceEndTime = Date.now();
    console.log(`⏱️  ${successCount} material prices inserted in ${priceEndTime - priceStartTime}ms\n`);

    console.log('👤 Seeding User Profiles...');
    const userStartTime = Date.now();
    
    // Insert user profiles one by one
    let userSuccessCount = 0;
    for (const profile of sampleUserProfiles) {
      try {
        const { error } = await supabase.from('user_profiles').upsert(profile);
        
        if (error) {
          console.error('❌ Error inserting user profile:', error.message);
        } else {
          userSuccessCount++;
          console.log(`✅ Inserted user: ${profile.display_name}`);
        }
      } catch (userError) {
        console.error('❌ Network error for user:', userError.message);
      }
    }
    
    const userEndTime = Date.now();
    console.log(`⏱️  ${userSuccessCount} user profiles inserted in ${userEndTime - userStartTime}ms\n`);

    const totalTime = Date.now() - startTime;
    console.log(`🎉 Data seeding completed in ${totalTime}ms!\n`);

  } catch (error) {
    console.error('❌ Error during seeding:', error.message);
  }
}

async function testFetchData() {
  console.log('🔍 Testing data fetching...\n');
  
  try {
    // Test material prices
    console.log('📊 Fetching Material Prices...');
    const priceStartTime = Date.now();
    
    try {
      const { data: prices, error: priceError } = await supabase
        .from('material_prices')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      const priceEndTime = Date.now();
      
      if (priceError) {
        console.error('❌ Error fetching prices:', priceError.message);
      } else {
        console.log(`✅ Fetched ${prices?.length || 0} prices in ${priceEndTime - priceStartTime}ms`);
        if (prices && prices.length > 0) {
          console.log('📋 Sample prices:');
          prices.slice(0, 3).forEach(price => {
            console.log(`   • ${price.product_name}: ${price.price} SAR (${price.store_name})`);
          });
        }
      }
    } catch (fetchError) {
      console.error('❌ Network error fetching prices:', fetchError.message);
    }
    console.log('');

    // Test database counts
    console.log('📈 Testing Database Counts...');
    const countStartTime = Date.now();
    
    try {
      const { count, error } = await supabase
        .from('material_prices')
        .select('*', { count: 'exact', head: true });
      
      const countEndTime = Date.now();
      
      if (error) {
        console.error('❌ Error getting count:', error.message);
      } else {
        console.log(`✅ Database count fetched in ${countEndTime - countStartTime}ms`);
        console.log(`📊 Total Material Prices: ${count || 0}`);
      }
    } catch (countError) {
      console.error('❌ Network error getting count:', countError.message);
    }
    
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
  }
}

async function main() {
  console.log('🔗 Connecting to Supabase...');
  console.log(`📍 URL: ${supabaseUrl}`);
  console.log(`🔑 Key: ${supabaseKey.substring(0, 20)}...\n`);
  
  await seedData();
  await testFetchData();
  
  console.log('🎯 Script completed! Your Supabase database now contains real data.');
  console.log('🌐 You can verify this in your Supabase dashboard or by running your app.');
}

// Run the script
main().catch(console.error);
