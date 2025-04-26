import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

console.log('🔐 Supabase Connected To:', process.env.NEXT_PUBLIC_SUPABASE_URL)

export { supabase }
