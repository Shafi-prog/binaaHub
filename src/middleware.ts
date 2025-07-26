// @ts-nocheck
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/types/database';
import { checkRateLimit } from '@/lib/rate-limit';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Add comprehensive security headers
  const securityHeaders = {
    // CORS headers
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === 'production' ? 'https://binna.sa' : 'http://localhost:3000'),
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie, X-Requested-With, X-CSRF-Token',
    
    // Security headers
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
    'Strict-Transport-Security': process.env.NODE_ENV === 'production' ? 'max-age=63072000; includeSubDomains; preload' : '',
    'Content-Security-Policy': process.env.NODE_ENV === 'production' 
      ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.supabase.co wss://realtime.supabase.co; frame-ancestors 'none';"
      : "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' http://localhost:* https://api.supabase.co wss://realtime.supabase.co; frame-ancestors 'none';"
  };

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    if (value) res.headers.set(key, value);
  });

  // Rate limiting check
  const rateLimit = await checkRateLimit(req);
  if (!rateLimit.success) {
    return new NextResponse('Too Many Requests', { 
      status: 429,
      headers: {
        'Retry-After': '60',
        'X-RateLimit-Limit': '100',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(Math.floor(Date.now() / 1000) + 60)
      }
    });
  }

  const supabase = createMiddlewareClient<Database>({ req, res });
    // Check for local auth cookie (our new local auth system)
  const localAuthCookie = req.cookies.get('user-session')?.value;
  let localAuthUser = null;
  
  if (localAuthCookie) {
    try {
      localAuthUser = JSON.parse(localAuthCookie);
      console.log('🍪 [Middleware] Found local auth user:', localAuthUser.email);
    } catch (e) {
      console.error('❌ [Middleware] Failed to parse local auth cookie:', e);
    }
  }

  // Check for temporary auth cookie (our legacy temp auth system)
  const tempAuthCookie = req.cookies.get('temp_auth_user')?.value;
  let tempAuthUser = null;
  
  if (tempAuthCookie) {
    try {
      tempAuthUser = JSON.parse(tempAuthCookie);
      console.log('🍪 [Middleware] Found temp auth user:', tempAuthUser.email);
    } catch (e) {
      console.error('❌ [Middleware] Failed to parse temp auth cookie:', e);
    }
  }

  // Get the current session with better error handling
  let session = null;
  let authError = null;
  
  try {
    const { data, error } = await supabase.auth.getSession();
    session = data?.session;
    authError = error;
    
    if (session) {
      console.log('✅ [Middleware] Found Supabase session for:', session.user.email);
    }
  } catch (error) {
    console.error('❌ [Middleware] Error getting session:', error);
    authError = error;
  }

  const url = req.nextUrl;

  // Always allow access to landing page
  if (url.pathname === '/') {
    return res;
  }
  // Exclude these routes from auth/protected logic
  const alwaysAllowRoutes = ['/auth/login', '/auth/signup', '/clear-auth', '/products/new', '/store/storefront'];
  if (alwaysAllowRoutes.includes(url.pathname)) {
    return res;
  }

  // Define protected and auth routes
  const isProtectedRoute = (url.pathname.startsWith('/user/') || url.pathname.startsWith('/store/')) && 
                           !url.pathname.startsWith('/store/storefront');
  const isAuthRoute = url.pathname.startsWith('/auth/login') || url.pathname.startsWith('/auth/signup');
  // Check if user is authenticated (Supabase session, local auth, or temp auth cookie)
  const isAuthenticated = !!(session || localAuthUser || tempAuthUser);
  const currentUser = session?.user || localAuthUser || tempAuthUser;  // Skip middleware for auth errors to prevent redirect loops (but allow local/temp auth)
  if (authError && !localAuthUser && !tempAuthUser) {
    console.error('❌ [Middleware] Auth error:', authError);
    // Still allow the request to proceed in production to avoid breaking the app
    if (process.env.NODE_ENV === 'production') {
      console.log('🚀 [Middleware] Allowing request to proceed in production despite auth error');
      return res;
    }
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    return res;
  }

  // Handle protected routes
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
  // Force user/store to complete profile after login
  if (isProtectedRoute && isAuthenticated) {
    try {      if (url.pathname.startsWith('/user/') && url.pathname !== '/user/profile') {
        // For local/temp auth users, we'll skip profile checks for now since we don't have full profile data
        if (localAuthUser || tempAuthUser) {
          console.log('[MIDDLEWARE] Local/temp auth user accessing user route, allowing access');
        } else if (session) {
          const { data: userProfile } = await supabase
            .from('users')
            .select('name, phone, city, region')
            .eq('id', session.user.id)
            .single();
          if (!userProfile || !userProfile.name || !userProfile.phone || !userProfile.city || !userProfile.region) {
            console.log('[MIDDLEWARE] User profile incomplete, redirecting to /user/profile');
            const redirectUrl = new URL('/user/profile', req.url);
            if (url.searchParams.has('post_login')) {
              redirectUrl.searchParams.set('post_login', 'true');
            }
            return NextResponse.redirect(redirectUrl);
          }
        }
      }      if (url.pathname.startsWith('/store/') && url.pathname !== '/store/profile') {
        // For local/temp auth users, we'll skip profile checks for now
        if (localAuthUser || tempAuthUser) {
          console.log('[MIDDLEWARE] Local/temp auth user accessing store route, allowing access');  
        } else if (session) {
          const { data: storeData, error: storeError } = await supabase
            .from('stores')
            .select('store_name, phone, city, region')
            .eq('user_id', session.user.id)
            .single();
          console.log('[MIDDLEWARE] Store profile check:', { storeData, storeError });
          if (!storeData || !storeData.store_name || !storeData.phone || !storeData.city || !storeData.region) {
            if (url.pathname !== '/store/profile') {
              console.log('[MIDDLEWARE] Store profile incomplete, redirecting to /store/profile');
              const redirectUrl = new URL('/store/profile', req.url);
              if (url.searchParams.has('post_login')) {
                redirectUrl.searchParams.set('post_login', 'true');
              }
              return NextResponse.redirect(redirectUrl);
            }
          } else {
            if (url.pathname === '/store/profile') {
              console.log('[MIDDLEWARE] Store profile complete, redirecting to /store/dashboard');
              const redirectUrl = new URL('/store/dashboard', req.url);
              if (url.searchParams.has('post_login')) {
                redirectUrl.searchParams.set('post_login', 'true');
              }
              return NextResponse.redirect(redirectUrl);
            }
          }
        }
      }
    } catch (profileError) {
      console.warn('Profile check failed in middleware:', profileError);
    }
  }  // Check for post-login flag to prevent redirect loops
  const isPostLogin = url.searchParams.has('post_login');
  if (isPostLogin) {
    console.log('[MIDDLEWARE] Post-login detected, allowing access to:', url.pathname);
    return res;
  }
  // Handle auth routes (login/signup) - redirect authenticated users to dashboard
  if (isAuthRoute && isAuthenticated) {
    const authSessionActive = req.cookies.get('auth_session_active')?.value;
    const logoutTimestamp = req.cookies.get('logout_timestamp')?.value;
    
    // If user recently logged out, allow access to login page
    if (logoutTimestamp) {
      const logoutTime = new Date(logoutTimestamp).getTime();
      const now = Date.now();
      if (now - logoutTime < 10000) { // 10 seconds grace period
        console.log('[MIDDLEWARE] Recent logout detected, allowing login page access');
        return res;
      }
    }
    
    // If no active session cookie and no temp user, allow access
    if (authSessionActive !== 'true' && !localAuthUser && !tempAuthUser) {
      console.log('[MIDDLEWARE] No active session, allowing login page access');
      return res;
    }
    
    try {
      let accountType: string | undefined;
      
      // Get account type from local auth, temp auth user, or database
      if (localAuthUser) {
        accountType = localAuthUser.account_type;
      } else if (tempAuthUser) {
        accountType = tempAuthUser.account_type;
      } else if (session) {
        const { data: userData } = await supabase
          .from('users')
          .select('account_type')
          .eq('email', session.user.email)
          .single();
        accountType = userData?.account_type;
      }
      
      // Enhanced redirect logic for all user types
      let redirectUrl = '/user/dashboard'; // default
      if (accountType === 'store' || 
          localAuthUser?.role === 'store_admin' || localAuthUser?.role === 'store_owner' ||
          tempAuthUser?.role === 'store_admin' || tempAuthUser?.role === 'store_owner') {
        redirectUrl = '/store/dashboard';
      } else if (localAuthUser?.role === 'admin' || tempAuthUser?.role === 'admin') {
        redirectUrl = '/admin/dashboard';
      } else if (localAuthUser?.role === 'service_provider' || tempAuthUser?.role === 'service_provider') {
        redirectUrl = '/service-provider/dashboard';
      }
      
      console.log('[MIDDLEWARE] Redirecting authenticated user from auth route to:', redirectUrl);
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    } catch (dbError) {
      console.warn('Middleware DB query failed, allowing auth route access:', dbError);
      return res;
    }
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};


