import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/types/database';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });
  // Check for temporary auth cookie (our new direct DB auth system)
  const tempAuthCookie = req.cookies.get('temp_auth_user')?.value;
  let tempAuthUser = null;
  
  if (tempAuthCookie) {
    try {
      tempAuthUser = JSON.parse(tempAuthCookie);
    } catch (e) {
      console.error('Failed to parse temp auth cookie:', e);
    }
  }

  // Get the current session
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  const url = req.nextUrl;

  // Always allow access to landing page
  if (url.pathname === '/') {
    return res;
  }

  // Exclude these routes from auth/protected logic
  const alwaysAllowRoutes = ['/login', '/signup', '/products/new'];
  if (alwaysAllowRoutes.includes(url.pathname)) {
    return res;
  }

  // Define protected and auth routes
  const isProtectedRoute = url.pathname.startsWith('/user/') || url.pathname.startsWith('/store/');
  const isAuthRoute = url.pathname.startsWith('/login') || url.pathname.startsWith('/signup');

  // Check if user is authenticated (either via Supabase session or temp auth cookie)
  const isAuthenticated = !!(session || tempAuthUser);
  const currentUser = session?.user || tempAuthUser;

  // Skip middleware for auth errors to prevent redirect loops (but allow temp auth)
  if (error && !tempAuthUser) {
    console.error('Auth error in middleware:', error);
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return res;
  }

  // Handle protected routes
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  // Force user/store to complete profile after login
  if (isProtectedRoute && isAuthenticated) {
    try {      if (url.pathname.startsWith('/user/') && url.pathname !== '/user/profile') {
        // For temp auth users, we'll skip profile checks for now since we don't have full profile data
        if (tempAuthUser) {
          console.log('[MIDDLEWARE] Temp auth user accessing user route, allowing access');
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
      }

      if (url.pathname.startsWith('/store/') && url.pathname !== '/store/profile') {
        // For temp auth users, we'll skip profile checks for now
        if (tempAuthUser) {
          console.log('[MIDDLEWARE] Temp auth user accessing store route, allowing access');  
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
    if (logoutTimestamp) {
      const logoutTime = new Date(logoutTimestamp).getTime();
      const now = Date.now();
      if (now - logoutTime < 5000) {
        return res;
      }
    }
    if (authSessionActive !== 'true' && !tempAuthUser) {
      return res;
    }
    try {
      let accountType: string | undefined;
      
      // Get account type from temp auth user or database
      if (tempAuthUser) {
        accountType = tempAuthUser.account_type;
      } else if (session) {
        const { data: userData } = await supabase
          .from('users')
          .select('account_type')
          .eq('email', session.user.email)
          .single();
        accountType = userData?.account_type;
      }
      
      const redirectUrl = accountType === 'store' ? '/store/dashboard' : '/user/dashboard';
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
