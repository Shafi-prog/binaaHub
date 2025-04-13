// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const protectedRoutes = ['/profile', '/orders', '/projects']
  const isProtected = protectedRoutes.some(path => req.nextUrl.pathname.startsWith(path))

  if (!user && isProtected) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (user && isProtected) {
    const { data, error } = await supabase
      .from('users')
      .select('account_type')
      .eq('email', user.email!)
      .single()

    if (error || !data) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    if (data.account_type === 'store') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/profile', '/orders', '/projects', '/dashboard'],
}
