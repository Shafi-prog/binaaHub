// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log('🔐 [SIMPLE-LOGIN] Login attempt for:', email);

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ [SIMPLE-LOGIN] Missing Supabase environment variables');
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Create Supabase client with public anon key (safer for production)
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Try to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      console.error('❌ [SIMPLE-LOGIN] Auth error:', error?.message);
      return NextResponse.json(
        { success: false, error: error?.message || 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('✅ [SIMPLE-LOGIN] Authentication successful');

    // For now, assume all users are 'user' type unless we have a way to check
    const accountType = 'user';
    const redirectTo = accountType === 'store' ? '/store/dashboard' : '/user/dashboard';

    return NextResponse.json({
      success: true,
      redirectTo,
      user: {
        email: data.session.user.email,
        account_type: accountType,
      },
      session: {
        access_token: data.session.access_token,
        expires_at: data.session.expires_at,
      }
    });

  } catch (error) {
    console.error('❌ [SIMPLE-LOGIN] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
