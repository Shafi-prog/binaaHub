// src/lib/supabaseClient.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true, // ✅ حفظ الجلسة تلقائيًا
    autoRefreshToken: true, // ✅ تجديد الجلسة تلقائيًا
    detectSessionInUrl: true, // ✅ معالجة ريديركت OAuth لو استخدمت لاحقًا
  },
});

console.log('🔐 Supabase Connected:', supabaseUrl);
