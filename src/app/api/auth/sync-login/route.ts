import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

/**
 * Handles synchronized login with immediate session establishment
 * This endpoint combines authentication and session sync in one operation
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password, remember_me = false } = await request.json();

    console.log('🔐 [API] Sync login attempt for:', email);

    if (!email || !password) {
      console.error('❌ [API] Missing email or password for sync login');
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Authenticate user
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !signInData.session) {
      console.error('❌ [API] Auth error in sync login:', signInError?.message);
      return NextResponse.json(
        { success: false, error: signInError?.message || 'Login failed' },
        { status: 401 }
      );
    }

    console.log('✅ [API] Authentication successful for sync login');

    // Get user data from database
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError || !userData?.account_type) {
      console.error('❌ [API] Error fetching user data for sync login:', fetchError?.message);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch user data' },
        { status: 500 }
      );
    }

    // Determine redirect URL based on account type
    const redirectTo =
      userData.account_type === 'store'
        ? '/store/dashboard'
        : userData.account_type === 'user' || userData.account_type === 'client'
          ? '/user/dashboard'
          : userData.account_type === 'engineer' || userData.account_type === 'consultant'
            ? '/dashboard/construction-data'
            : '/';

    console.log('🚀 [API] Sync login redirect URL determined:', redirectTo);

    // Create response with complete user data and session info
    const response = NextResponse.json({
      success: true,
      message: 'Sync login successful',
      user: {
        id: signInData.session.user.id,
        email: signInData.session.user.email,
        account_type: userData.account_type,
        name: userData.name,
        phone: userData.phone,
        is_verified: userData.is_verified,
        status: userData.status,
      },
      session: {
        access_token: signInData.session.access_token,
        refresh_token: signInData.session.refresh_token,
        expires_at: signInData.session.expires_at,
      },
      redirect_to: redirectTo,
      sync_timestamp: new Date().toISOString(),
    });

    // Set comprehensive cookies for sync login
    const cookieOptions = {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: remember_me ? 60 * 60 * 24 * 30 : 60 * 60 * 24, // 30 days if remember_me, else 1 day
    };

    // Session verification cookies
    response.cookies.set('auth_session_active', 'true', {
      ...cookieOptions,
      httpOnly: false,
    });

    response.cookies.set('user_email', encodeURIComponent(signInData.session.user.email || ''), {
      ...cookieOptions,
      httpOnly: false,
    });

    response.cookies.set('account_type', userData.account_type, {
      ...cookieOptions,
      httpOnly: false,
    });

    response.cookies.set('user_name', encodeURIComponent(userData.name || ''), {
      ...cookieOptions,
      httpOnly: false,
    });

    // Sync login marker
    response.cookies.set('sync_login_timestamp', new Date().toISOString(), {
      ...cookieOptions,
      httpOnly: false,
    });

    // Remember me preference
    if (remember_me) {
      response.cookies.set('remember_user', 'true', {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 30, // 30 days
        httpOnly: false,
      });
    }

    console.log('✅ [API] Sync login completed with all cookies set');

    return response;
  } catch (error) {
    console.error('❌ [API] Unexpected error in sync login:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Validates sync login status
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session) {
      return NextResponse.json(
        { success: false, error: 'No active sync login session' },
        { status: 401 }
      );
    }

    // Get user data to validate sync status
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (fetchError) {
      console.error('❌ [API] Error validating sync login status:', fetchError.message);
      return NextResponse.json(
        { success: false, error: 'Failed to validate sync login' },
        { status: 500 }
      );
    }

    // Check for sync login timestamp cookie
    const cookieStore = await cookies();
    const syncTimestamp = cookieStore.get('sync_login_timestamp')?.value;

    return NextResponse.json({
      success: true,
      sync_login_active: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        account_type: userData.account_type,
        name: userData.name,
        is_verified: userData.is_verified,
        status: userData.status,
      },
      session: {
        expires_at: session.expires_at,
      },
      sync_timestamp: syncTimestamp || new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ [API] Unexpected error validating sync login:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Clears sync login session
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Sign out user
    await supabase.auth.signOut();

    const response = NextResponse.json({
      success: true,
      message: 'Sync login session cleared successfully',
    });

    // Clear all sync login cookies
    const clearCookieOptions = {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 0,
    };

    response.cookies.set('auth_session_active', '', clearCookieOptions);
    response.cookies.set('user_email', '', clearCookieOptions);
    response.cookies.set('account_type', '', clearCookieOptions);
    response.cookies.set('user_name', '', clearCookieOptions);
    response.cookies.set('sync_login_timestamp', '', clearCookieOptions);
    response.cookies.set('remember_user', '', clearCookieOptions);

    console.log('✅ [API] Sync login session cleared');

    return response;
  } catch (error) {
    console.error('❌ [API] Unexpected error clearing sync login:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
