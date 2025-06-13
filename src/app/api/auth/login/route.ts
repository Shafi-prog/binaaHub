import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log('🔐 [API] Login attempt for:', email);    // Create route handler client with proper cookie handling for Next.js 15+
    const supabase = createRouteHandlerClient({ cookies });

    // Authenticate user
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !signInData.session) {
      console.error('❌ [API] Auth error:', signInError?.message);
      return NextResponse.json(
        { success: false, error: signInError?.message || 'Login failed' },
        { status: 401 }
      );
    }

    console.log('✅ [API] Authentication successful for:', signInData.session.user.email);    // Get user data from database using the authenticated user's session
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
        console.log('🔧 [API] Creating missing user record for:', email);

        // Generate invitation code if not present
        const invitationCode = 'BinnaHub-' + Math.random().toString(36).substring(2, 10);
        const defaultUserData = {
          id: signInData.session.user.id,
          email: email,
          account_type: 'user' as const,
          name: signInData.session.user.email?.split('@')[0] || 'User',
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

    console.log('🚀 [API] Redirect URL determined:', redirectTo);

    // Set auth session cookie to prevent middleware conflicts
    const response = NextResponse.json({
      success: true,
      redirectTo,
      user: {
        email: signInData.session.user.email,
        account_type: userData.account_type,
      },
    });

    // Set cookie to indicate successful authentication to middleware
    response.cookies.set('auth_session_active', 'true', {
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    console.log('✅ [API] Login successful - Session cookies set');

    return response;
  } catch (error) {
    console.error('❌ [API] Unexpected error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
