import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

/**
 * Synchronizes user authentication state between client and server
 * This endpoint handles session synchronization and user data updates
 */
export async function POST(request: NextRequest) {
  try {
    const { user_id, session_data, user_metadata } = await request.json();

    console.log('🔄 [API] Syncing auth state for user:', user_id);

    if (!user_id) {
      console.error('❌ [API] Missing user_id for sync');
      return NextResponse.json(
        { success: false, error: 'User ID is required for sync' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Get current session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('❌ [API] Session error during sync:', sessionError.message);
      return NextResponse.json(
        { success: false, error: 'Session validation failed' },
        { status: 401 }
      );
    }

    if (!session) {
      console.error('❌ [API] No active session for sync');
      return NextResponse.json({ success: false, error: 'No active session' }, { status: 401 });
    }

    // Verify the user_id matches the session
    if (session.user.id !== user_id) {
      console.error('❌ [API] User ID mismatch during sync');
      return NextResponse.json({ success: false, error: 'User ID mismatch' }, { status: 403 });
    }

    // Get current user data from database
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user_id)
      .single();

    if (fetchError) {
      console.error('❌ [API] Error fetching user data:', fetchError.message);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch user data' },
        { status: 500 }
      );
    }

    // Update user metadata if provided
    let updatedUserData = userData;
    if (user_metadata && Object.keys(user_metadata).length > 0) {
      const { data: updateData, error: updateError } = await supabase
        .from('users')
        .update({
          ...user_metadata,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user_id)
        .select()
        .single();

      if (updateError) {
        console.warn('⚠️ [API] Failed to update user metadata:', updateError.message);
      } else {
        updatedUserData = updateData;
        console.log('✅ [API] User metadata updated successfully');
      }
    }

    // Create synchronized response
    const response = NextResponse.json({
      success: true,
      message: 'Auth state synchronized successfully',
      user: {
        id: session.user.id,
        email: session.user.email,
        account_type: updatedUserData.account_type,
        name: updatedUserData.name,
        is_verified: updatedUserData.is_verified,
        status: updatedUserData.status,
      },
      session: {
        expires_at: session.expires_at,
        access_token: session.access_token,
      },
      sync_timestamp: new Date().toISOString(),
    });

    // Update sync markers
    const cookieOptions = {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    };

    // Set last sync timestamp
    response.cookies.set('last_auth_sync', new Date().toISOString(), {
      ...cookieOptions,
      httpOnly: false,
    });

    console.log('✅ [API] Auth sync completed successfully');

    return response;
  } catch (error) {
    console.error('❌ [API] Unexpected error in auth sync:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Retrieves sync status and user information
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
        { success: false, error: 'No active session to sync' },
        { status: 401 }
      );
    }

    // Get user data from database
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (fetchError) {
      console.error('❌ [API] Error fetching user data for sync status:', fetchError.message);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch user data' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      sync_status: 'active',
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
      last_sync: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ [API] Unexpected error getting sync status:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
