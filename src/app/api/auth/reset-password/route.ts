// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

// Create Supabase client with fallback to anon key if service role key is missing
const supabase = createClient(
  supabaseUrl || '',
  supabaseServiceRoleKey || supabaseAnonKey || ''
);

export async function POST(request: NextRequest) {
  try {
    // Check if required environment variables are available
    if (!supabaseUrl) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error: Missing Supabase URL' },
        { status: 500 }
      );
    }

    if (!supabaseServiceRoleKey && !supabaseAnonKey) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error: Missing Supabase keys' },
        { status: 500 }
      );
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Send password reset email using Supabase
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password-confirm`,
    });

    if (error) {
      console.error('Password reset error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset email sent successfully'
    });

  } catch (error) {
    console.error('Reset password API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


