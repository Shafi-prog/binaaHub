import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const { data: { session } } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  const isProtectedUser = ['/profile', '/orders', '/projects'].some((path) => pathname.startsWith(path));
  const isProtectedStore = ['/store/dashboard'].some((path) => pathname.startsWith(path));

  if (!session && (isProtectedUser || isProtectedStore)) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (session) {
    const { data: userData, error } = await supabase
      .from('users')
      .select('account_type')
      .eq('email', session.user.email!)
      .single();

    if (error || !userData) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    const accountType = userData.account_type;

    if (accountType === 'store' && isProtectedUser) {
      return NextResponse.redirect(new URL('/store/dashboard', req.url));
    }

    if (accountType !== 'store' && isProtectedStore) {
      return NextResponse.redirect(new URL('/profile', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/profile', '/orders', '/projects', '/store/dashboard'], // تطبيق الميدلوير على هذه الصفحات
};
