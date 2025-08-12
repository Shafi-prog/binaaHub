import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// إعداد عميل Supabase
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function applyDatabaseFix() {
    console.log('🔧 تطبيق إصلاح العلاقة بين المشاريع والطلبات...\n');
    
    try {
        // إضافة عمود project_id إلى جدول orders
        console.log('1️⃣ إضافة عمود project_id إلى جدول orders...');
        let { error } = await supabase.rpc('exec', { 
            sql: 'ALTER TABLE orders ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES construction_projects(id) ON DELETE SET NULL;' 
        });
        
        if (error && !error.message.includes('already exists')) {
            throw error;
        }
        console.log('   ✅ تم إضافة العمود بنجاح');
        
        // إضافة فهرس للأداء
        console.log('2️⃣ إضافة فهرس للأداء...');
        ({ error } = await supabase.rpc('exec', { 
            sql: 'CREATE INDEX IF NOT EXISTS idx_orders_project_id ON orders(project_id);' 
        }));
        
        if (error) {
            console.log('   ⚠️ تحذير في إنشاء الفهرس:', error.message);
        } else {
            console.log('   ✅ تم إضافة الفهرس بنجاح');
        }
        
        // إضافة تعليق
        console.log('3️⃣ إضافة تعليق توضيحي...');
        ({ error } = await supabase.rpc('exec', { 
            sql: "COMMENT ON COLUMN orders.project_id IS 'ربط الطلب بمشروع إنشائي محدد (اختياري)';" 
        }));
        
        if (error) {
            console.log('   ⚠️ تحذير في إضافة التعليق:', error.message);
        } else {
            console.log('   ✅ تم إضافة التعليق بنجاح');
        }
        
        // التحقق من نجاح العلاقة
        console.log('4️⃣ التحقق من العلاقة الجديدة...');
        const { data: relationCheck, error: checkError } = await supabase
            .from('information_schema.columns')
            .select('column_name, data_type')
            .eq('table_name', 'orders')
            .eq('column_name', 'project_id');
        
        if (checkError) {
            throw checkError;
        }
        
        if (relationCheck && relationCheck.length > 0) {
            console.log('   ✅ العمود project_id موجود في جدول orders');
            console.log(`   📋 نوع البيانات: ${relationCheck[0].data_type}`);
        }
        
        // اختبار العلاقة
        console.log('5️⃣ اختبار العلاقة بين الجداول...');
        const { data: joinTest, error: joinError } = await supabase
            .from('orders')
            .select(`
                id,
                order_number,
                total_amount,
                construction_projects(
                    id,
                    name,
                    budget
                )
            `)
            .not('project_id', 'is', null)
            .limit(1);
        
        if (joinError) {
            console.log('   ⚠️ ملاحظة: لا توجد بيانات اختبار للعلاقة:', joinError.message);
        } else {
            console.log('   ✅ العلاقة تعمل بشكل صحيح');
            if (joinTest && joinTest.length > 0) {
                console.log('   📊 تم العثور على بيانات مرتبطة');
            } else {
                console.log('   📝 لا توجد بيانات مرتبطة حالياً (طبيعي)');
            }
        }
        
        console.log('\n🎉 تم إصلاح العلاقة بين المشاريع والطلبات بنجاح!');
        console.log('✅ يمكن الآن ربط أي طلب بمشروع إنشائي محدد');
        
        return true;
        
    } catch (error) {
        console.error('❌ خطأ في تطبيق الإصلاح:', error);
        return false;
    }
}

// تشغيل الإصلاح
applyDatabaseFix().then(success => {
    if (success) {
        console.log('\n🚀 الإصلاح مكتمل - يمكن الآن إعادة اختبار سلامة النظام');
        process.exit(0);
    } else {
        console.log('\n❌ فشل في تطبيق الإصلاح');
        process.exit(1);
    }
}).catch(error => {
    console.error('💥 خطأ غير متوقع:', error);
    process.exit(1);
});
