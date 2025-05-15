import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // السماح بالوصول إلى صفحات تسجيل الدخول والتسجيل
  const publicPaths = ['/login', '/signup']
  const pathname = req.nextUrl.pathname
  
  if (publicPaths.includes(pathname) || 
      pathname.startsWith('/login') || 
      pathname.startsWith('/signup')) {
    return res
  }

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const isProtectedUserRoute = [
    '/user/profile',
    '/user/dashboard',
    '/user/orders',
    '/user/projects',
  ].some((path) => pathname.startsWith(path))

  const isProtectedStoreRoute = [
    '/store/dashboard',
    '/store/profile',
    '/store/orders',
  ].some((path) => pathname.startsWith(path))

  if (!session) {
    console.warn('⚠️ [middleware] Session is missing. Redirecting to /login. Path:', pathname)
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    const { data: userData, error } = await supabase
      .from('users')
      .select('account_type')
      .eq('email', session.user.email!)
      .single()

    if (error) {
      console.error('❌ [middleware] Error fetching user from users table:', error.message)
      return NextResponse.redirect(new URL('/login', req.url))
    }
    if (!userData) {
      console.warn('⚠️ [middleware] User not found in users table. Redirecting to /login. Email:', session.user.email)
      return NextResponse.redirect(new URL('/login', req.url))
    }

    const accountType = userData.account_type

    if (accountType === 'store' && isProtectedUserRoute) {
      console.info('🔁 [middleware] Store user tried to access user route. Redirecting to /store/dashboard')
      return NextResponse.redirect(new URL('/store/dashboard', req.url))
    }

    if (accountType !== 'store' && isProtectedStoreRoute) {
      console.info('🔁 [middleware] Non-store user tried to access store route. Redirecting to /user/dashboard')
      return NextResponse.redirect(new URL('/user/dashboard', req.url))
    }
  } catch (err) {
    console.error('❌ [middleware] Unexpected error:', err)
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/user/profile',
    '/user/dashboard',
    '/user/orders',
    '/user/projects',
    '/store/dashboard',
    '/store/profile',
    '/store/orders',
  ],
}