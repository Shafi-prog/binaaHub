import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export default async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // السماح بالوصول إلى الصفحات العامة
  const publicPaths = ['/', '/login', '/signup', '/not-found', '/403']
  const pathname = req.nextUrl.pathname

  console.log('🔍 [middleware] معالجة المسار:', pathname)
  console.log('🔍 [middleware] User Agent:', req.headers.get('user-agent')?.slice(0, 50))

  if (
    publicPaths.includes(pathname) ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') // ملفات ثابتة مثل CSS, JS, images
  ) {
    console.log('✅ [middleware] مسار عام، السماح بالمرور')
    return res
  }  // Get access token from cookies
  const accessToken = req.cookies.get('sb-access-token')?.value ||
                     req.cookies.get('supabase-auth-token')?.value
                     
  // Log all cookies for debugging
  const allCookies = req.cookies.getAll()
  console.log('🔐 [middleware] Access token present:', !!accessToken)
  console.log('🔐 [middleware] All cookies:', allCookies.map(c => `${c.name}=${c.value?.slice(0, 10)}...`))
  console.log('🔐 [middleware] All cookie names:', allCookies.map(c => c.name))
  console.log('🔐 [middleware] Cookie count:', allCookies.length)
  let session = null
  let userData = null

  if (accessToken) {
    try {
      // Create supabase client with service role for server-side operations
      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      
      // Get user from access token
      const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken)
      
      if (user && !userError) {
        console.log('✅ [middleware] User verified:', user.email)
        
        // Get user data from database
        const { data: dbUser, error: dbError } = await supabase
          .from('users')
          .select('account_type')
          .eq('email', user.email!)
          .single()

        if (dbUser && !dbError) {
          userData = dbUser
          session = { user }
          console.log('👤 [middleware] User type:', dbUser.account_type)
        } else {
          console.error('❌ [middleware] User not found in database:', dbError?.message)
        }
      } else {
        console.error('❌ [middleware] Invalid access token:', userError?.message)
      }
    } catch (error) {
      console.error('❌ [middleware] Token verification error:', error)
    }
  } else {
    // Try to get additional info about the request
    console.log('🔎 [middleware] Headers:', 
      Object.fromEntries(
        Array.from(req.headers.entries())
          .filter(([key]) => !key.includes('cookie'))
          .map(([key, value]) => [key, value?.slice(0, 30) + '...'])
      )
    )
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
    '/user/profile',
    '/user/dashboard',
    '/user/orders',
    '/user/projects',
    '/store/dashboard',
    '/store/profile',
    '/store/orders',
  ],
}