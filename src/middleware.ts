import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/types/database';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  const url = req.nextUrl;

  // Always allow access to landing page and public routes
  const publicRoutes = ['/', '/auth/login', '/auth/signup', '/clear-auth', '/products/new', '/store/storefront'];
  if (publicRoutes.includes(url.pathname)) {
    return res;
  }

  const supabase = createMiddlewareClient<Database>({ req, res });

  // Get the current session
  let session: any = null;
  
  try {
    const { data, error } = await supabase.auth.getSession();
    session = data?.session;
    
    if (session) {
      console.log('✅ [Middleware] Found Supabase session for:', session.user.email);
    }
  } catch (error) {
    console.error('❌ [Middleware] Error getting session:', error);
  }

  // Define protected and auth routes
  const isProtectedRoute = (url.pathname.startsWith('/user/') || url.pathname.startsWith('/store/')) && 
                           !url.pathname.startsWith('/store/storefront');
  const isAuthRoute = url.pathname.startsWith('/auth/login') || url.pathname.startsWith('/auth/signup');
  
  // Check if user is authenticated
  const isAuthenticated = !!session;

  // Handle protected routes
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Handle auth routes - redirect authenticated users to dashboard
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/user/dashboard', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};


