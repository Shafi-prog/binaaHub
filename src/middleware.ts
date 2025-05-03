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

  const isProtectedUserRoute = ['/profile', '/orders', '/projects'].some((path) =>
    pathname.startsWith(path)
  )

  const isProtectedStoreRoute = ['/store/dashboard'].some((path) =>
    pathname.startsWith(path)
  )

  // ✅ لا يوجد جلسة = تحويل لتسجيل الدخول فقط إذا دخل إلى مسار محمي
  if (!session && (isProtectedUserRoute || isProtectedStoreRoute)) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // ✅ يوجد جلسة، نتحقق من نوع الحساب
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

    // مستخدم متجر لا يدخل على مسارات المستخدم
    if (accountType === 'store' && isProtectedUserRoute) {
      return NextResponse.redirect(new URL('/store/dashboard', req.url))
    }

    // مستخدم عادي لا يدخل على لوحة المتجر
    if (accountType !== 'store' && isProtectedStoreRoute) {
      return NextResponse.redirect(new URL('/profile', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/profile', '/orders', '/projects', '/store/dashboard']
}
