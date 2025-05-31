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

  // Handle root path
  if (url.pathname === '/') {
    // Always allow access to landing page
    return res;
  }

  // Define protected and auth routes
  const isProtectedRoute = url.pathname.startsWith('/user/') || url.pathname.startsWith('/store/');
  const isAuthRoute = url.pathname.startsWith('/login') || url.pathname.startsWith('/signup');

  if (error) {
    console.error('Auth error in middleware:', error);
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Handle protected routes
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Handle auth routes (login/signup)
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/user/dashboard', req.url));
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
