// @ts-nocheck
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('🔄 [auth/refresh] تحديث الجلسة...');

  const supabaseResponse = NextResponse.json({ status: 'checking' });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  try {
    // Get current session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('❌ [auth/refresh] خطأ في الجلسة:', sessionError.message);
      return NextResponse.json(
        {
          authenticated: false,
          error: sessionError.message,
        },
        { status: 401 }
      );
    }

    if (!session || !session.user) {
      console.log('⚠️ [auth/refresh] لا توجد جلسة');
      return NextResponse.json(
        {
          authenticated: false,
          error: 'No session found',
        },
        { status: 401 }
      );
    }

    // Get user data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('account_type, email')
      .eq('email', session.user.email!)
      .single();

    if (userError || !userData) {
      console.error('❌ [auth/refresh] خطأ في بيانات المستخدم:', userError?.message);
      return NextResponse.json(
        {
          authenticated: false,
          error: 'User data not found',
        },
        { status: 404 }
      );
    }

    console.log('✅ [auth/refresh] الجلسة صحيحة للمستخدم:', session.user.email);

    const response = NextResponse.json({
      authenticated: true,
      user: {
        email: session.user.email,
        account_type: userData.account_type,
      },
      redirectTo: userData.account_type === 'store' ? '/store/dashboard' : '/user/dashboard',
    });

    // Copy any cookies that were set during the operation
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      response.cookies.set(cookie.name, cookie.value, {
        httpOnly: cookie.name.startsWith('sb-'),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
    });

    return response;
  } catch (error) {
    console.error('❌ [auth/refresh] خطأ عام:', error);
    return NextResponse.json(
      {
        authenticated: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}


