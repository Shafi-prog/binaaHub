import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    console.log('🚪 [API] Logout request received');
    
    // Create route handler client
    const supabase = createRouteHandlerClient({ cookies });

    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('❌ [API] Logout error:', error.message);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'تم تسجيل الخروج بنجاح'
    });    // Clear auth session cookie
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
