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

  // Handle root path - always allow access to landing page
  if (url.pathname === '/') {
    return res;
  }

  // Define protected and auth routes
  const isProtectedRoute = url.pathname.startsWith('/user/') || url.pathname.startsWith('/store/');
  const isAuthRoute = url.pathname.startsWith('/login') || url.pathname.startsWith('/signup');

  // Skip middleware for auth errors to prevent redirect loops
  if (error) {
    console.error('Auth error in middleware:', error);
    // Only redirect to login if accessing protected routes
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return res;
  }

  // Handle protected routes
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Handle auth routes (login/signup) - redirect authenticated users to dashboard
  // BUT check for logout indicators to avoid redirect loops
  if (isAuthRoute && session) {
    // Check for logout indicators in cookies or headers
    const authSessionActive = req.cookies.get('auth_session_active')?.value;
    const logoutTimestamp = req.cookies.get('logout_timestamp')?.value;

    // If user just logged out (within last 5 seconds), allow access to auth routes
    if (logoutTimestamp) {
      const logoutTime = new Date(logoutTimestamp).getTime();
      const now = Date.now();
      if (now - logoutTime < 5000) {
        // 5 seconds grace period
        return res;
      }
    }

    // If auth session is not marked as active, allow access to auth routes
    if (authSessionActive !== 'true') {
      return res;
    }

    // Get user account type to determine redirect (only if session is truly active)
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
      // If database query fails, allow access to auth routes
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
