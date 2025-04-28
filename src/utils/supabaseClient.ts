// src/utils/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// احصل على المفاتيح من البيئة
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// قم بإنشاء العميل للاتصال بـ Supabase
export const supabase = createClient(supabaseUrl, supabaseKey)
