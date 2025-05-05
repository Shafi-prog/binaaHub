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
      return NextResponse.redirect(new URL('/store/dashboard', req.url))
    }

    if (accountType !== 'store' && isProtectedStoreRoute) {
      return NextResponse.redirect(new URL('/user/dashboard', req.url))
    }
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
  ]
}
