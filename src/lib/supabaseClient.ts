// src/lib/supabaseClient.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const supabase = (() => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true, // ✅ حفظ الجلسة تلقائيًا
        autoRefreshToken: true, // ✅ تجديد الجلسة تلقائيًا
        detectSessionInUrl: true, // ✅ معالجة ريديركت OAuth لو استخدمت لاحقًا
      },
    });
    console.log('🔐 Supabase Connected:', supabaseUrl);
  }
  return supabaseInstance;
})();

// Export a function to create new client instances for API routes
export { createClient };
