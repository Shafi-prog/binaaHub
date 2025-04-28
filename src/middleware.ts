// src/middleware.ts
import { createServerClient } from '@supabase/ssr'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // تأكد من تعيين المتغيرات البيئية بشكل صحيح في ملف .env
  const supabaseUrl = process.env.SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_ANON_KEY!

  // تأكد من تمرير المعاملات بشكل صحيح مع cookies
  const supabase = createServerClient(supabaseUrl, supabaseKey, { cookies: req.cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = req.nextUrl.pathname
  const isProtected = ['/profile', '/orders', '/projects'].some((path) => pathname.startsWith(path))
  const isStoreOnly = ['/dashboard'].some((path) => pathname.startsWith(path))

  if (!user && (isProtected || isStoreOnly)) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (user) {
    const { data, error } = await supabase
      .from('users')
      .select('account_type')
      .eq('email', user.email!)
      .single()

    if (error || !data) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    if (data.account_type === 'store' && isProtected) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    if (data.account_type !== 'store' && isStoreOnly) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/profile', '/orders', '/projects', '/dashboard'],
}
