import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Create Supabase client for builds - fallback to dummy if no env vars
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// For build purposes, create a client or dummy object
export const supabase = (() => {
  try {
    return createClientComponentClient({
      supabaseUrl,
      supabaseKey: supabaseAnonKey
    });
  } catch {
    // Fallback dummy for builds without proper env vars
    return {
      from: () => ({
        select: () => ({
          eq: () => ({
            order: () => ({
              limit: () => Promise.resolve({ data: [], error: null })
            })
          })
        })
      }),
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null })
      }
    };
  }
})();
