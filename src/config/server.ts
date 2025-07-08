// @ts-nocheck
// src/config/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';
import type { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export async function createServerSupabase() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {      cookies: {
        get(name: string) {
          const cookie = cookieStore.get(name);
          return cookie?.value;
        },
        set(name: string, value: string, options: any) {
          // The cookies() function returns a ReadonlyRequestCookies object, which doesn't have a set method.
          // You might need to use NextResponse to set cookies directly in a route handler.
          console.warn('Setting cookies is not supported in this environment.');
        },
        remove(name: string, options: any) {
          console.warn('Removing cookies is not supported in this environment.');
        },
      },
    }
  );
}


