import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Production-optimized Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: process.env.NODE_ENV === 'development',
    flowType: 'pkce',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
  global: {
    headers: {
      'X-Client-Info': 'binna-web-app',
    },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Enhanced error logging for production
if (process.env.NODE_ENV === 'production') {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('🔐 [Supabase] Auth state change:', event);
    if (event === 'SIGNED_IN') {
      console.log('✅ [Supabase] User signed in:', session?.user?.email);
    } else if (event === 'SIGNED_OUT') {
      console.log('👋 [Supabase] User signed out');
    } else if (event === 'TOKEN_REFRESHED') {
      console.log('🔄 [Supabase] Token refreshed');
    }
  });
}

export default supabase;
