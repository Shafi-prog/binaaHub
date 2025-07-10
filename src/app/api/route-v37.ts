// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log('🔍 [DEBUG-LOGIN] Starting debug login for:', email);
    console.log('🔍 [DEBUG-LOGIN] Environment check:', {
      NODE_ENV: process.env.NODE_ENV,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasSupabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      platform: process.env.VERCEL ? 'Vercel' : 'Local'
    });

    // Test each login endpoint and report results
    const results = {};

    // Test 1: Simple Login
    try {
      const simpleResponse = await fetch(new URL('/api/auth/simple-login', request.url), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const simpleResult = await simpleResponse.json();
      results.simpleLogin = {
        status: simpleResponse.status,
        success: simpleResult.success,
        error: simpleResult.error
      };
    } catch (error) {
      results.simpleLogin = {
        status: 'error',
        error: error.message
      };
    }

    // Test 2: Check if it's a dummy account
    const isDummyAccount = email === 'test@test.com' || email === 'admin@binna.com';
    
    if (isDummyAccount) {
      // Create a successful dummy response
      return NextResponse.json({
        success: true,
        isDummyAccount: true,
        redirectTo: '/user/dashboard',
        user: {
          email: email,
          account_type: email === 'admin@binna.com' ? 'store' : 'user',
        },
        message: 'Debug login successful with dummy account'
      });
    }

    return NextResponse.json({
      success: false,
      debug: true,
      testResults: results,
      message: 'Debug login - check console for details',
      recommendations: [
        'Check if Supabase environment variables are set correctly',
        'Verify the user exists in your Supabase auth.users table',
        'Check Vercel deployment logs for more details'
      ]
    });

  } catch (error) {
    console.error('🔍 [DEBUG-LOGIN] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Debug login failed',
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Debug Login Endpoint',
    usage: 'POST with { email, password } to test login functionality',
    testAccounts: [
      'test@test.com',
      'admin@binna.com'
    ]
  });
}
