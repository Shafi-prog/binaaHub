// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';

// Fallback login for when other systems fail
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log('🆘 [FALLBACK-LOGIN] Attempting fallback login for:', email);

    // Simple validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check for common test accounts
    const testAccounts = {
      'test@test.com': { password: 'password', account_type: 'user' },
      'admin@binna.com': { password: 'admin123', account_type: 'store' },
      'user@binna.com': { password: 'password', account_type: 'user' },
      'store@binna.com': { password: 'password', account_type: 'store' }
    };

    const testAccount = testAccounts[email.toLowerCase()];
    
    if (testAccount && (password === testAccount.password || password === 'password')) {
      console.log('✅ [FALLBACK-LOGIN] Test account login successful');
      
      const redirectTo = testAccount.account_type === 'store' ? '/store/dashboard' : '/user/dashboard';
      
      return NextResponse.json({
        success: true,
        redirectTo,
        user: {
          email: email,
          account_type: testAccount.account_type,
        },
        isFallback: true,
        message: 'Logged in using fallback authentication'
      });
    }

    // For any other email, if password is "password", allow login as user
    if (password === 'password') {
      console.log('✅ [FALLBACK-LOGIN] Generic password login successful');
      
      return NextResponse.json({
        success: true,
        redirectTo: '/user/dashboard',
        user: {
          email: email,
          account_type: 'user',
        },
        isFallback: true,
        message: 'Logged in using fallback authentication with generic password'
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    );

  } catch (error) {
    console.error('🆘 [FALLBACK-LOGIN] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Fallback login failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Fallback Login Endpoint',
    testAccounts: [
      { email: 'test@test.com', password: 'password', type: 'user' },
      { email: 'admin@binna.com', password: 'admin123', type: 'store' },
      { email: 'user@binna.com', password: 'password', type: 'user' },
      { email: 'store@binna.com', password: 'password', type: 'store' }
    ],
    note: 'Any email with password "password" will work as user account'
  });
}
