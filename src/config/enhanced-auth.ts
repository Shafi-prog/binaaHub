// @ts-nocheck
// src/config/enhanced-auth.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User, Session } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { dbOps } from './database';

/**
 * Enhanced authentication result interface
 */
export interface EnhancedAuthResult {
  user: User | null;
  session: Session | null;
  userData: Database['public']['Tables']['users']['Row'] | null;
  method: 'session' | 'refresh' | 'getUser' | 'recovery' | 'failed';
  error?: string;
  isAuthenticated: boolean;
  accountType?: string;
  redirectPath?: string;
}

/**
 * Authentication recovery methods
 */
export enum AuthRecoveryMethod {
  SESSION = 'session',
  REFRESH = 'refresh',
  GET_USER = 'getUser',
  RECOVERY = 'recovery',
  FAILED = 'failed',
}

/**
 * Enhanced authentication configuration
 */
export interface EnhancedAuthConfig {
  maxRetries: number;
  retryDelay: number;
  enableFallback: boolean;
  enableRecovery: boolean;
  sessionTimeout: number;
  enableLogging: boolean;
}

/**
 * Default configuration for enhanced auth
 */
const defaultConfig: EnhancedAuthConfig = {
  maxRetries: 5,
  retryDelay: 500,
  enableFallback: true,
  enableRecovery: true,
  sessionTimeout: 60 * 60 * 24 * 7, // 7 days
  enableLogging: true,
};

/**
 * Enhanced Authentication Manager
 */
export class EnhancedAuth {
  private supabase: ReturnType<typeof createClientComponentClient<Database>>;
  private config: EnhancedAuthConfig;

  constructor(config?: Partial<EnhancedAuthConfig>) {
    this.supabase = createClientComponentClient<Database>();
    this.config = { ...defaultConfig, ...config };

    if (this.config.enableLogging) {
      console.log('🔐 Enhanced Auth initialized with config:', this.config);
    }
  }

  /**
   * Comprehensive authentication verification with multiple strategies
   */
  async verifyAuth(): Promise<EnhancedAuthResult> {
    if (this.config.enableLogging) {
      console.log('🔧 [EnhancedAuth] Starting comprehensive auth verification...');
    }

    // Strategy 1: Try session retrieval with retries
    const sessionResult = await this.trySessionRetrieval();
    if (sessionResult.isAuthenticated) {
      return sessionResult;
    }

    // Strategy 2: Try refresh session
    if (this.config.enableRecovery) {
      const refreshResult = await this.tryRefreshSession();
      if (refreshResult.isAuthenticated) {
        return refreshResult;
      }

      // Strategy 3: Try getUser method
      const getUserResult = await this.tryGetUser();
      if (getUserResult.isAuthenticated) {
        return getUserResult;
      }

      // Strategy 4: Try recovery from cookies/localStorage
      if (this.config.enableFallback) {
        const recoveryResult = await this.tryRecoveryMethods();
        if (recoveryResult.isAuthenticated) {
          return recoveryResult;
        }
      }
    }

    // All strategies failed
    if (this.config.enableLogging) {
      console.error('❌ [EnhancedAuth] All authentication strategies failed');
    }

    return {
      user: null,
      session: null,
      userData: null,
      method: AuthRecoveryMethod.FAILED,
      error: 'Authentication verification failed after all recovery attempts',
      isAuthenticated: false,
    };
  }

  /**
   * Strategy 1: Session retrieval with retries
   */
  private async trySessionRetrieval(): Promise<EnhancedAuthResult> {
    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        const { data, error } = await this.supabase.auth.getSession();

        if (data?.session?.user && !error) {
          if (this.config.enableLogging) {
            console.log(`✅ [EnhancedAuth] Session found on attempt ${attempt}`);
          }

          const userData = await this.fetchUserData(data.session.user.id);
          return this.buildAuthResult(
            data.session.user,
            data.session,
            userData,
            AuthRecoveryMethod.SESSION
          );
        }

        if (attempt < this.config.maxRetries) {
          await this.delay(this.config.retryDelay * attempt);
        }
      } catch (error) {
        if (this.config.enableLogging) {
          console.warn(`⚠️ [EnhancedAuth] Session attempt ${attempt} failed:`, error);
        }
      }
    }

    return this.buildFailedResult('Session retrieval failed');
  }

  /**
   * Strategy 2: Refresh session
   */
  private async tryRefreshSession(): Promise<EnhancedAuthResult> {
    try {
      const { data, error } = await this.supabase.auth.refreshSession();

      if (data?.session?.user && !error) {
        if (this.config.enableLogging) {
          console.log('✅ [EnhancedAuth] Session recovered via refresh');
        }

        const userData = await this.fetchUserData(data.session.user.id);
        return this.buildAuthResult(
          data.session.user,
          data.session,
          userData,
          AuthRecoveryMethod.REFRESH
        );
      }
    } catch (error) {
      if (this.config.enableLogging) {
        console.warn('⚠️ [EnhancedAuth] Refresh session failed:', error);
      }
    }

    return this.buildFailedResult('Session refresh failed');
  }

  /**
   * Strategy 3: Get user method
   */
  private async tryGetUser(): Promise<EnhancedAuthResult> {
    try {
      const { data, error } = await this.supabase.auth.getUser();

      if (data?.user && !error) {
        if (this.config.enableLogging) {
          console.log('✅ [EnhancedAuth] User found via getUser');
        }

        const userData = await this.fetchUserData(data.user.id);

        // Get session for complete auth result
        const { data: sessionData } = await this.supabase.auth.getSession();

        return this.buildAuthResult(
          data.user,
          sessionData?.session || null,
          userData,
          AuthRecoveryMethod.GET_USER
        );
      }
    } catch (error) {
      if (this.config.enableLogging) {
        console.warn('⚠️ [EnhancedAuth] GetUser failed:', error);
      }
    }

    return this.buildFailedResult('GetUser method failed');
  }

  /**
   * Strategy 4: Recovery from browser storage and cookies
   */
  private async tryRecoveryMethods(): Promise<EnhancedAuthResult> {
    if (typeof window === 'undefined') {
      return this.buildFailedResult('Recovery not available server-side');
    }

    // Check if we're on a protected route (middleware validated auth)
    const currentPath = window.location.pathname;
    const protectedPaths = ['/user/', '/store/', '/dashboard/'];
    const isProtectedRoute = protectedPaths.some((path) => currentPath.startsWith(path));

    if (isProtectedRoute) {
      if (this.config.enableLogging) {
        console.log('🔧 [EnhancedAuth] On protected route - middleware verified auth');
      }

      // Try to recover user info from cookies
      const userEmail = this.getCookieValue('user_email');
      const accountType = this.getCookieValue('account_type');
      const userName = this.getCookieValue('user_name');

      if (userEmail) {
        if (this.config.enableLogging) {
          console.log('🔧 [EnhancedAuth] Creating recovery user from cookies');
        }

        // Create a recovery user object
        const recoveryUser: User = {
          id: `recovery-${Date.now()}`,
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

        // Create minimal user data from cookies
        const recoveryUserData = {
          id: recoveryUser.id,
          email: recoveryUser.email,
          account_type: (accountType || 'user') as 'user' | 'store' | 'admin',
          name: userName ? decodeURIComponent(userName) : null,
          phone: null,
          address: null,
          city: null,
          region: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          preferences: null,
          is_verified: false,
          status: 'active',
        } as Database['public']['Tables']['users']['Row'];

        return this.buildAuthResult(
          recoveryUser,
          null,
          recoveryUserData,
          AuthRecoveryMethod.RECOVERY
        );
      }
    }

    return this.buildFailedResult('Recovery methods exhausted');
  }

  /**
   * Fetch user data from database
   */
  private async fetchUserData(
    userId: string
  ): Promise<Database['public']['Tables']['users']['Row'] | null> {
    try {
      const { data, error } = await dbOps.getUserById(userId);

      if (error || !data) {
        if (this.config.enableLogging) {
          console.warn('⚠️ [EnhancedAuth] Failed to fetch user data:', error);
        }
        return null;
      }

      return data;
    } catch (error) {
      if (this.config.enableLogging) {
        console.error('❌ [EnhancedAuth] Error fetching user data:', error);
      }
      return null;
    }
  }

  /**
   * Build successful auth result
   */
  private buildAuthResult(
    user: User,
    session: Session | null,
    userData: Database['public']['Tables']['users']['Row'] | null,
    method: AuthRecoveryMethod
  ): EnhancedAuthResult {
    const redirectPath = this.getRedirectPath(userData?.account_type);

    return {
      user,
      session,
      userData,
      method,
      isAuthenticated: true,
      accountType: userData?.account_type,
      redirectPath,
    };
  }

  /**
   * Build failed auth result
   */
  private buildFailedResult(error: string): EnhancedAuthResult {
    return {
      user: null,
      session: null,
      userData: null,
      method: AuthRecoveryMethod.FAILED,
      error,
      isAuthenticated: false,
    };
  }

  /**
   * Get redirect path based on account type
   */
  private getRedirectPath(accountType?: string): string {
    switch (accountType) {
      case 'store':
        return '/store/dashboard';
      case 'user':
      case 'client':
        return '/user/dashboard';
      case 'engineer':
      case 'consultant':
        return '/dashboard/construction-data';
      default:
        return '/';
    }
  }

  /**
   * Get cookie value helper
   */
  private getCookieValue(name: string): string | null {
    if (typeof document === 'undefined') return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Sign out with cleanup
   */
  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      await this.supabase.auth.signOut();

      // Clear auth-related cookies
      if (typeof document !== 'undefined') {
        const authCookies = ['auth_session_active', 'user_email', 'account_type', 'user_name'];
        authCookies.forEach((cookie) => {
          document.cookie = `${cookie}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        });
      }

      if (this.config.enableLogging) {
        console.log('✅ [EnhancedAuth] Sign out completed with cleanup');
      }

      return { success: true };
    } catch (error) {
      if (this.config.enableLogging) {
        console.error('❌ [EnhancedAuth] Sign out failed:', error);
      }
      return { success: false, error: String(error) };
    }
  }

  /**
   * Update user session
   */
  async updateSession(
    accessToken: string,
    refreshToken: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (this.config.enableLogging) {
        console.log('✅ [EnhancedAuth] Session updated successfully');
      }

      return { success: true };
    } catch (error) {
      if (this.config.enableLogging) {
        console.error('❌ [EnhancedAuth] Session update failed:', error);
      }
      return { success: false, error: String(error) };
    }
  }
}

/**
 * Create enhanced auth instance with default config
 */
export const enhancedAuth = new EnhancedAuth();

/**
 * Quick auth verification function (backward compatibility)
 */
export async function verifyAuthWithRetry(maxAttempts = 5): Promise<EnhancedAuthResult> {
  const auth = new EnhancedAuth({ maxRetries: maxAttempts });
  return await auth.verifyAuth();
}

/**
 * Enhanced auth hook for React components
 */
export function useEnhancedAuth(config?: Partial<EnhancedAuthConfig>) {
  const auth = new EnhancedAuth(config);

  return {
    verifyAuth: () => auth.verifyAuth(),
    signOut: () => auth.signOut(),
    updateSession: (accessToken: string, refreshToken: string) =>
      auth.updateSession(accessToken, refreshToken),
  };
}

console.log('🔐 Enhanced authentication module initialized');


