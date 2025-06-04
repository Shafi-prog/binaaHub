// test-create-project.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testCreateProject() {
  const { data, error } = await supabase.from('projects').insert([
    {
      name: 'اختبار مشروع',
      city: 'الرياض',
      project_type: 'residential',
      // أضف أي أعمدة مطلوبة أخرى هنا حسب قاعدة البيانات
    }
  ]);
  if (error) {
    console.error('Insert error:', error);
  } else {
    console.log('Insert success:', data);
  }
}

testCreateProject();
