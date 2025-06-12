import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/types/database';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });

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

  // Skip middleware for auth errors to prevent redirect loops
  if (error) {
    console.error('Auth error in middleware:', error);
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return res;
  }

  // Handle protected routes
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Force user/store to complete profile after login
  if (isProtectedRoute && session) {
    try {
      if (url.pathname.startsWith('/user/') && url.pathname !== '/user/profile') {
        const { data: userProfile } = await supabase
          .from('users')
          .select('name, phone, city, region')
          .eq('id', session.user.id)
          .single();
        if (!userProfile || !userProfile.name || !userProfile.phone || !userProfile.city || !userProfile.region) {
          return NextResponse.redirect(new URL('/user/profile', req.url));
        }
      }
      if (url.pathname.startsWith('/store/') && url.pathname !== '/store/profile') {
        const { data: storeData, error: storeError } = await supabase
          .from('stores')
          .select('store_name, phone, city, region')
          .eq('user_id', session.user.id)
          .single();
        console.log('[MIDDLEWARE] Store profile check:', { storeData, storeError });
        if (!storeData || !storeData.store_name || !storeData.phone || !storeData.city || !storeData.region) {
          // إذا كان المستخدم بالفعل في /store/profile لا تعيد التوجيه
          if (url.pathname !== '/store/profile') {
            console.log('[MIDDLEWARE] Store profile incomplete, redirecting to /store/profile');
            return NextResponse.redirect(new URL('/store/profile', req.url));
          }
        } else {
          // إذا كان المستخدم في /store/profile وملفه مكتمل، وجهه للوحة التحكم
          if (url.pathname === '/store/profile') {
            console.log('[MIDDLEWARE] Store profile complete, redirecting to /store/dashboard');
            return NextResponse.redirect(new URL('/store/dashboard', req.url));
          }
        }
      }
    } catch (profileError) {
      console.warn('Profile check failed in middleware:', profileError);
    }
  }

  // Handle auth routes (login/signup) - redirect authenticated users to dashboard
  // BUT check for logout indicators to avoid redirect loops
  if (isAuthRoute && session) {
    const authSessionActive = req.cookies.get('auth_session_active')?.value;
    const logoutTimestamp = req.cookies.get('logout_timestamp')?.value;
    if (logoutTimestamp) {
      const logoutTime = new Date(logoutTimestamp).getTime();
      const now = Date.now();
      if (now - logoutTime < 5000) {
        return res;
      }
    }
    if (authSessionActive !== 'true') {
      return res;
    }
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('account_type')
        .eq('email', session.user.email)
        .single();
      const accountType = userData?.account_type;
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
     * - api routes that don't require auth
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)',
  ],
};
