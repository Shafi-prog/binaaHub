// Comprehensive logout utility for clearing all authentication data
import toast from 'react-hot-toast';
import { safeTimeout } from '@/lib/security-utils';

interface LogoutOptions {
  showToast?: boolean;
  redirectUrl?: string;
  redirectDelay?: number;
}

/**
 * Comprehensive client-side logout function that clears all authentication data
 */
export async function performLogout(options: LogoutOptions = {}) {
  const {
    showToast = true,
    redirectUrl = '/login',
    redirectDelay = 1000
  } = options;

  try {
    if (showToast) {
      toast.loading('جاري تسجيل الخروج...', { id: 'logout' });
    }

    // Set logout timestamp immediately to prevent middleware redirects
    document.cookie = `logout_timestamp=${new Date().toISOString()}; path=/; max-age=30`;

    // Call logout API to clear server-side session
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.warn('Logout API call failed, continuing with client-side cleanup');
      }
    } catch (apiError) {
      console.warn('Logout API call failed:', apiError);
      // Continue with client-side cleanup even if API fails
    }

    // Clear all client-side storage
    clearClientStorage();

    // Clear all cookies
    clearAllCookies();

    if (showToast) {
      toast.success('تم تسجيل الخروج بنجاح', { id: 'logout' });
    }

    // Redirect immediately to avoid any intermediate redirects
    safeTimeout(() => {
      // Force redirect to main login page
      window.location.href = '/login';
    }, 500); // Reduced delay

    return { success: true };

  } catch (error) {
    console.error('Error during logout:', error);
    
    if (showToast) {
      toast.error('حدث خطأ أثناء تسجيل الخروج', { id: 'logout' });
    }

    // Force cleanup even if there were errors
    clearClientStorage();
    clearAllCookies();

    // Still redirect to ensure user is logged out
    safeTimeout(() => {
      // Force redirect to main login page
      window.location.href = '/login';
    }, 500); // Reduced delay

    return { success: false, error };
  }
}

/**
 * Clear all client-side storage (localStorage and sessionStorage)
 */
export function clearClientStorage() {
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch (error) {
    console.warn('Error clearing client storage:', error);
  }
}

/**
 * Clear all cookies including authentication and session cookies with secure attributes
 */
export function clearAllCookies() {
  try {
    // List of known authentication-related cookies
    const authCookies = [
      'user-session',
      'auth_session_active',
      'temp_auth_user',
      'user_email',
      'user_name',
      'account_type',
      'sync_login_timestamp',
      'remember_user',
      'last_auth_sync',
      // Don't clear logout_timestamp as it's needed for middleware
      // 'logout_timestamp',
      // Supabase cookies
      'sb-access-token',
      'sb-refresh-token',
      'supabase-auth-token',
      'supabase.auth.token',
      // NextAuth cookies
      'next-auth.session-token',
      'next-auth.csrf-token',
      '__Secure-next-auth.session-token',
      '__Host-next-auth.csrf-token'
    ];

    // Clear known cookies with secure attributes for root path
    authCookies.forEach(cookieName => {
      // Clear for root path - HttpOnly can only be set server-side
      // We can't set HttpOnly from client-side, but we clear cookies as much as possible
      const secureFlags = 'SameSite=Strict; Secure';
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; ${secureFlags}`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      
      // Clear for current domain
      if (window.location.hostname) {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}; ${secureFlags}`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}; ${secureFlags}`;
        // Also clear without secure flags for legacy cookies
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
      }
    });

    // Clear all existing cookies (brute force approach)
    // Note: HttpOnly cookies set by the server cannot be cleared from client-side
    document.cookie.split(";").forEach(function(c) {
      const cookieName = c.replace(/^ +/, "").replace(/=.*/, "");
      if (!cookieName.includes('logout_timestamp')) {
        document.cookie = cookieName + "=;expires=" + new Date().toUTCString() + ";path=/;SameSite=Strict;Secure";
        document.cookie = cookieName + "=;expires=" + new Date().toUTCString() + ";path=/";
        if (window.location.hostname) {
          document.cookie = cookieName + "=;expires=" + new Date().toUTCString() + ";path=/;domain=" + window.location.hostname + ";SameSite=Strict;Secure";
          document.cookie = cookieName + "=;expires=" + new Date().toUTCString() + ";path=/;domain=." + window.location.hostname + ";SameSite=Strict;Secure";
          document.cookie = cookieName + "=;expires=" + new Date().toUTCString() + ";path=/;domain=" + window.location.hostname;
          document.cookie = cookieName + "=;expires=" + new Date().toUTCString() + ";path=/;domain=." + window.location.hostname;
        }
      }
    });

  } catch (error) {
    console.warn('Error clearing cookies:', error);
  }
}

/**
 * Quick logout function for use in components
 */
export const quickLogout = () => performLogout();

/**
 * Silent logout (no toasts, immediate redirect)
 */
export const silentLogout = () => performLogout({
  showToast: false,
  redirectDelay: 0
});

export default {
  performLogout,
  clearClientStorage,
  clearAllCookies,
  quickLogout,
  silentLogout
};


