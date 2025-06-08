import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 [DB-FIX] Starting user account fix...');

    const email = 'user@user.com';
    const password = '123456';

    // Try to sign up the user first (this will create the auth record)
    console.log('📝 [DB-FIX] Creating/checking auth user...');

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError && !signUpError.message.includes('already registered')) {
      console.error('❌ [DB-FIX] SignUp error:', signUpError);
      return NextResponse.json(
        {
          success: false,
          error: `SignUp failed: ${signUpError.message}`,
        },
        { status: 400 }
      );
    }

    // Try to sign in to get the user ID
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error('❌ [DB-FIX] SignIn error:', signInError);
      return NextResponse.json(
        {
          success: false,
          error: `SignIn failed: ${signInError.message}`,
        },
        { status: 400 }
      );
    }

    const userId = signInData.user?.id;
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to get user ID',
        },
        { status: 400 }
      );
    }

    console.log('✅ [DB-FIX] User ID obtained:', userId);

    // Always try to upsert the user record to ensure it exists with correct account_type
    console.log('🔧 [DB-FIX] Upserting user record to ensure correct account_type...');

    const { error: upsertError } = await supabase.from('users').upsert(
      [
        {
          id: userId,
          email: email,
          account_type: 'user',
          name: 'Test User',
          is_verified: true,
          status: 'active',
          updated_at: new Date().toISOString(),
        },
      ],
      {
        onConflict: 'id',
      }
    );

    if (upsertError) {
      console.error('❌ [DB-FIX] Upsert error:', upsertError);
      return NextResponse.json(
        {
          success: false,
          error: `Failed to upsert user record: ${upsertError.message}`,
        },
        { status: 500 }
      );
    }

    console.log('✅ [DB-FIX] User record upserted successfully with account_type: user');

    // Sign out after fixing
    await supabase.auth.signOut();

    return NextResponse.json({
      success: true,
      message: 'User account fixed successfully',
      user: {
        id: userId,
        email: email,
        account_type: 'user',
      },
    });
  } catch (error) {
    console.error('❌ [DB-FIX] Unexpected error:', error);
    return NextResponse.json(
      {
        success: false,
        error: `Unexpected error: ${error}`,
      },
      { status: 500 }
    );
  }
}
