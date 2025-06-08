<<<<<<< HEAD
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export async function verifyAuthWithRetry(retries: number = 3): Promise<any> {
  const supabase = createClientComponentClient();
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🔐 [verifyAuthWithRetry] Attempt ${attempt}/${retries}`);
      
      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error(`❌ [verifyAuthWithRetry] Session error on attempt ${attempt}:`, sessionError);
        if (attempt === retries) throw sessionError;
        continue;
      }
      
      if (!session) {
        console.log(`❌ [verifyAuthWithRetry] No session found on attempt ${attempt}`);
        if (attempt === retries) return null;
        
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      
      // Get user details
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error(`❌ [verifyAuthWithRetry] User error on attempt ${attempt}:`, userError);
        if (attempt === retries) throw userError;
        continue;
      }
      
      if (!user) {
        console.log(`❌ [verifyAuthWithRetry] No user found on attempt ${attempt}`);
        if (attempt === retries) return null;
        
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      
      console.log(`✅ [verifyAuthWithRetry] Authentication successful on attempt ${attempt}`);
      console.log(`📧 User: ${user.email}`);
      console.log(`🆔 User ID: ${user.id}`);
      
      return { user, session };
      
    } catch (error) {
      console.error(`❌ [verifyAuthWithRetry] Error on attempt ${attempt}:`, error);
      if (attempt === retries) throw error;
      
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return null;
}
=======
// This file is deprecated, use auth-recovery-new.ts instead
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';

export interface AuthRecoveryResult {
  user: User | null;
  method: 'session' | 'refresh' | 'getUser' | 'fallback' | 'failed';
  error?: string;
  id?: string;
  email?: string;
}

export async function recoverAuthentication(): Promise<AuthRecoveryResult> {
  const result: AuthRecoveryResult = {
    user: null,
    method: 'failed',
  };

  const supabase = createClientComponentClient();

  console.log('🔧 [AuthRecovery] Starting comprehensive auth recovery...');

  // Strategy 1: Try getSession multiple times with delays
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session?.user && !error) {
        console.log(`✅ [AuthRecovery] Session found on attempt ${attempt}`);
        return {
          user: data.session.user,
          method: 'session',
          id: data.session.user.id,
          email: data.session.user.email,
        };
      }

      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
      }
    } catch (error) {
      console.warn(`⚠️ [AuthRecovery] Session attempt ${attempt} failed:`, error);
    }
  }

  // Strategy 2: Try refreshSession
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (data?.session?.user && !error) {
      console.log('✅ [AuthRecovery] Session recovered via refresh');
      return {
        user: data.session.user,
        method: 'refresh',
        id: data.session.user.id,
        email: data.session.user.email,
      };
    }
  } catch (error) {
    console.warn('⚠️ [AuthRecovery] Refresh failed:', error);
  }

  // Strategy 3: Try getUser (works with valid cookies)
  try {
    const { data, error } = await supabase.auth.getUser();
    if (data?.user && !error) {
      console.log('✅ [AuthRecovery] User found via getUser');
      return {
        user: data.user,
        method: 'getUser',
        id: data.user.id,
        email: data.user.email,
      };
    }
  } catch (error) {
    console.warn('⚠️ [AuthRecovery] GetUser failed:', error);
  }

  // Strategy 4: Check for fallback indicators
  // If we're on a protected route that middleware allowed, we know auth is valid
  const currentPath = window.location.pathname;
  const protectedPaths = ['/user/dashboard', '/user/profile', '/store/dashboard'];
  const isProtectedRoute = protectedPaths.some((path) => currentPath.startsWith(path));

  if (isProtectedRoute) {
    console.log('🔧 [AuthRecovery] On protected route - middleware verified auth');

    // Look for email in cookies as fallback
    const userEmail = getCookieValue('user_email');
    if (userEmail) {
      console.log('🔧 [AuthRecovery] Creating fallback user from cookie');
      const fallbackUser: User = {
        id: `fallback-${Date.now()}`,
        email: decodeURIComponent(userEmail),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        aud: 'authenticated',
        role: 'authenticated',
        app_metadata: {},
        user_metadata: {},
        confirmed_at: new Date().toISOString(),
        email_confirmed_at: new Date().toISOString(),
        last_sign_in_at: new Date().toISOString(),
      };

      return {
        user: fallbackUser,
        method: 'fallback',
        id: fallbackUser.id,
        email: fallbackUser.email,
      };
    }
  }

  console.error('❌ [AuthRecovery] All recovery strategies failed');
  return {
    user: null,
    method: 'failed',
    error: 'Unable to recover authentication after multiple attempts',
    id: undefined,
    email: undefined,
  };
}

function getCookieValue(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

export async function verifyAuthWithRetry(maxAttempts = 5): Promise<AuthRecoveryResult> {
  const supabase = createClientComponentClient();
  let attempt = 1;

  while (attempt <= maxAttempts) {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (session?.user && !error) {
        console.log(`✅ [AuthVerify] Session verified on attempt ${attempt}`);
        return {
          user: session.user,
          method: 'session',
          id: session.user.id,
          email: session.user.email,
        };
      }

      console.log(`⚠️ [AuthVerify] Attempt ${attempt}/${maxAttempts} failed, retrying...`);
      await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
    } catch (error) {
      console.error(`❌ [AuthVerify] Error on attempt ${attempt}:`, error);
    }

    attempt++;
  }

  console.log(`❌ [AuthVerify] Failed to verify auth after ${maxAttempts} attempts`);
  return { user: null, method: 'failed' };
}
>>>>>>> e0e83bc2e6a4c393009b329773f07bfad211af6b
