import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const pathname = req.nextUrl.pathname

  const isProtectedUserRoute = [
    '/profile',
    '/user/profile',
    '/orders',
    '/projects',
  ].some((path) => pathname.startsWith(path))

  const isProtectedStoreRoute = [
    '/store/dashboard',
    '/user/store/dashboard',
  ].some((path) => pathname.startsWith(path))

  if (!session && (isProtectedUserRoute || isProtectedStoreRoute)) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (session) {
    const { data: userData, error } = await supabase
      .from('users')
      .select('account_type')
      .eq('email', session.user.email!)
      .single()

    if (error || !userData) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    const accountType = userData.account_type

    if (accountType === 'store' && isProtectedUserRoute) {
      return NextResponse.redirect(new URL('/user/store/dashboard', req.url))
    }

    if (accountType !== 'store' && isProtectedStoreRoute) {
      return NextResponse.redirect(new URL('/user/profile', req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    '/profile',
    '/user/profile',
    '/orders',
    '/projects',
    '/store/dashboard',
    '/user/store/dashboard',
  ]
}
