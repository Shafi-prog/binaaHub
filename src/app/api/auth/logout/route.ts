// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    console.log('🚪 [API] Logout request received');
    
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'تم تسجيل الخروج بنجاح'
    });

    // Clear local session cookie
    response.cookies.set('user-session', '', {
      httpOnly: true,
      secure: false, // Set to true in production
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
    });

    // Also try to clear Supabase session if it exists
    try {
      const supabase = createRouteHandlerClient({ cookies });
      await supabase.auth.signOut();
    } catch (supabaseError) {
      console.log('🚪 [API] Supabase logout skipped (expected in local auth)');
    }// Clear auth session cookie
    response.cookies.set('auth_session_active', '', {
      path: '/',
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    // Clear temp auth cookie
    response.cookies.set('temp_auth_user', '', {
      path: '/',
      maxAge: 0,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    // Set logout timestamp to prevent immediate redirects
    response.cookies.set('logout_timestamp', new Date().toISOString(), {
      path: '/',
      maxAge: 10, // 10 seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    console.log('✅ [API] Logout successful');
    
    return response;
  } catch (error) {
    console.error('❌ [API] Unexpected logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


