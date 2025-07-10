// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log('🔐 [API] Login attempt for:', email);
    console.log('🌍 [API] Environment:', process.env.NODE_ENV);
    console.log('🔗 [API] Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

    // Create Supabase client directly (more reliable in production)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ [API] Missing Supabase environment variables');
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Use service role client for reliable server-side auth
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });    // First, try to authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.session) {
      console.error('❌ [API] Auth error:', authError?.message);
      return NextResponse.json(
        { success: false, error: authError?.message || 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('✅ [API] Authentication successful for:', authData.session.user.email);// Get user data from database using the authenticated user's session
    const { data: fetchedUserData, error: fetchError } = await supabase
      .from('users')
      .select('account_type')
      .eq('email', email)
      .single();

    let userData = fetchedUserData;

    if (fetchError || !userData?.account_type) {
      console.error('❌ [API] Error fetching user data:', fetchError?.message);

      // If user exists in auth but not in users table, create a default record
      if (fetchError?.code === 'PGRST116') {
        // No rows returned
        console.log('🔧 [API] Creating missing user record for:', email);        // Generate invitation code if not present
        const invitationCode = 'BinnaHub-' + Math.random().toString(36).substring(2, 10);
        const defaultUserData = {
          id: authData.session.user.id,
          email: email,
          account_type: 'user' as const,
          name: authData.session.user.email?.split('@')[0] || 'User',
          is_verified: true,
          status: 'active',
          invitation_code: invitationCode,
        };

        const { error: insertError } = await supabase.from('users').insert([defaultUserData]);

        if (insertError) {
          console.error('❌ [API] Failed to create user record:', insertError?.message);
          return NextResponse.json(
            { success: false, error: 'Failed to create user data' },
            { status: 500 }
          );
        }

        console.log('✅ [API] Created missing user record for:', email);

        // Use the default account type
        userData = { account_type: defaultUserData.account_type };
      } else {
        return NextResponse.json(
          { success: false, error: 'Failed to fetch user data' },
          { status: 500 }
        );
      }
    }    // Determine redirect URL
    const redirectTo =
      userData.account_type === 'store'
        ? '/store/dashboard'
        : userData.account_type === 'user' || userData.account_type === 'client'
          ? '/user/dashboard'
          : userData.account_type === 'engineer' || userData.account_type === 'consultant'
            ? '/dashboard/construction-data'
            : '/';

    console.log('🚀 [API] Redirect URL determined:', redirectTo);    // Create response with user data
    const response = NextResponse.json({
      success: true,
      redirectTo,
      user: {
        email: authData.session.user.email,
        account_type: userData.account_type,
      },
      session: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
        expires_at: authData.session.expires_at,
      }
    });    // Set secure cookies for session
    response.cookies.set('sb-access-token', authData.session.access_token, {
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });

    response.cookies.set('sb-refresh-token', authData.session.refresh_token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });

    // Set auth session cookie to indicate successful authentication
    response.cookies.set('auth_session_active', 'true', {
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });

    // Add CORS headers for production
    if (process.env.NODE_ENV === 'production') {
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || '*');
      response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    console.log('✅ [API] Login successful - Session cookies set');

    return response;
  } catch (error) {
    console.error('❌ [API] Unexpected error:', error);
    console.error('❌ [API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    const errorResponse = NextResponse.json(
      { success: false, error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );

    // Add CORS headers for error responses too
    if (process.env.NODE_ENV === 'production') {
      errorResponse.headers.set('Access-Control-Allow-Credentials', 'true');
      errorResponse.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || '*');
    }    return errorResponse;
  }
}

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}


