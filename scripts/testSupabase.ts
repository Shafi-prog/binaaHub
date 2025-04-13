import 'dotenv/config'
console.log('✅ URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('✅ KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
import { createClient } from '@supabase/supabase-js'


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  console.log('🔌 Testing Supabase connection...')

  const { data, error } = await supabase.from('users').select('*').limit(1)

  if (error) {
    console.error('❌ Error:', error.message)
  } else {
    console.log('✅ Connection Success! Sample user:', data)
  }
}

testConnection()
