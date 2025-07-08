// @ts-nocheck
// src/config/supabase/client.ts
'use client';

import { createClient } from '@supabase/supabase-js';
// عدّل المسار هنا إذا وضعت تعريف الـ Database في مكان آخر
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});


