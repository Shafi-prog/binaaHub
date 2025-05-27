import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // السماح بالوصول إلى الصفحات العامة
  const publicPaths = ['/', '/login', '/signup', '/not-found', '/403', '/direct-login', '/verify-auth']
  const pathname = req.nextUrl.pathname

  console.log('🔍 [middleware] معالجة المسار:', pathname)

  if (
    publicPaths.includes(pathname) ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') // ملفات ثابتة مثل CSS, JS, images
  ) {
    console.log('✅ [middleware] مسار عام، السماح بالمرور')
    return res
  }

  // Create Supabase middleware client
  const supabase = createMiddlewareClient({ req, res })
  
  // Get session from Supabase
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  
  console.log('🔐 [middleware] Session present:', !!session)
  console.log('🔐 [middleware] Session error:', sessionError?.message)
  
  if (sessionError) {
    console.error('❌ [middleware] Session error:', sessionError.message)
  }

  let userData = null

  if (session?.user) {
    try {
      console.log('✅ [middleware] User verified:', session.user.email)
      
      // Get user data from database
      const { data: dbUser, error: dbError } = await supabase
        .from('users')
        .select('account_type')
        .eq('email', session.user.email!)
        .single()

      if (dbUser && !dbError) {
        userData = dbUser
        console.log('👤 [middleware] User type:', dbUser.account_type)
      } else {
        console.error('❌ [middleware] User not found in database:', dbError?.message)
      }
    } catch (error) {
      console.error('❌ [middleware] Database query error:', error)
    }
  }

  if (!session || !userData) {
    console.warn('⚠️ [middleware] Session/User data missing. Redirecting to /login. Path:', pathname)
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const isProtectedUserRoute = [
    '/user/profile',
    '/user/dashboard',
    '/user/orders',
    '/user/projects',
  ].some((path) => pathname.startsWith(path))

  const isProtectedStoreRoute = ['/store/dashboard', '/store/profile', '/store/orders'].some(
    (path) => pathname.startsWith(path),
  )

  const accountType = userData.account_type

  if (accountType === 'store' && isProtectedUserRoute) {
    console.info('🔁 [middleware] Store user tried to access user route. Redirecting to /store/dashboard')
    return NextResponse.redirect(new URL('/store/dashboard', req.url))
  }

  if (accountType !== 'store' && isProtectedStoreRoute) {
    console.info('🔁 [middleware] Non-store user tried to access store route. Redirecting to /user/dashboard')
    return NextResponse.redirect(new URL('/user/dashboard', req.url))
  }

  console.log('✅ [middleware] السماح بالوصول للمسار:', pathname)
  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - API routes (/api/)
     * - Static files (images, js, css, etc.)
     * - favicon.ico
     * - Service worker routes
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}
