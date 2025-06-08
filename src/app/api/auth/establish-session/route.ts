import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

/**
 * Establishes a new user session and sets necessary cookies
 * This endpoint is used for post-login session establishment
 */
export async function POST(request: NextRequest) {
  try {
    const { access_token, refresh_token, expires_at, user_id } = await request.json();

    console.log('🔐 [API] Establishing session for user:', user_id);

    if (!access_token || !refresh_token) {
      console.error('❌ [API] Missing required tokens');
      return NextResponse.json(
        { success: false, error: 'Access token and refresh token are required' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Set the session on the server side
    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (error || !data.session) {
      console.error('❌ [API] Failed to establish session:', error?.message);
      return NextResponse.json(
        { success: false, error: error?.message || 'Failed to establish session' },
        { status: 401 }
      );
    }

    console.log('✅ [API] Session established successfully');

    // Create response with session confirmation
    const response = NextResponse.json({
      success: true,
      message: 'Session established successfully',
      user: {
        id: data.session.user.id,
        email: data.session.user.email,
      },
      session: {
        expires_at: data.session.expires_at,
      },
    });

    // Set additional session markers
    const cookieOptions = {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    };

    // Session verification cookie (accessible by client)
    response.cookies.set('auth_session_active', 'true', {
      ...cookieOptions,
      httpOnly: false,
    });

    // User identification cookie for fallback
    response.cookies.set('user_email', encodeURIComponent(data.session.user.email || ''), {
      ...cookieOptions,
      httpOnly: false,
    });

    console.log('✅ [API] Session establishment complete with cookies set');

    return response;
  } catch (error) {
    console.error('❌ [API] Unexpected error in establish-session:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Retrieves current session status
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error('❌ [API] Error getting session:', error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }

    if (!session) {
      return NextResponse.json({ success: false, error: 'No active session' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      session: {
        user: {
          id: session.user.id,
          email: session.user.email,
        },
        expires_at: session.expires_at,
      },
    });
  } catch (error) {
    console.error('❌ [API] Unexpected error in get session:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
