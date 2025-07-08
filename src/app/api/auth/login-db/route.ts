// @ts-nocheck
// src/app/api/auth/login-db/route.ts
// Temporary login route using direct database authentication

import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    console.log('🔐 [DB-LOGIN] Login attempt for:', email);

    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    try {
      // Get user from auth.users table
      const authQuery = await client.query(`
        SELECT id, email, encrypted_password 
        FROM auth.users 
        WHERE email = $1;
      `, [email]);

      if (authQuery.rows.length === 0) {
        console.log('❌ [DB-LOGIN] User not found in auth.users');
        return NextResponse.json(
          { success: false, error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      const authUser = authQuery.rows[0];
      
      // Verify password
      const passwordMatch = await bcrypt.compare(password, authUser.encrypted_password);
      
      if (!passwordMatch) {
        console.log('❌ [DB-LOGIN] Password mismatch');
        return NextResponse.json(
          { success: false, error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      console.log('✅ [DB-LOGIN] Password verified');

      // Get user profile data
      const userQuery = await client.query(`
        SELECT account_type, name 
        FROM users 
        WHERE id = $1;
      `, [authUser.id]);

      if (userQuery.rows.length === 0) {
        console.log('❌ [DB-LOGIN] User profile not found');
        return NextResponse.json(
          { success: false, error: 'User profile not found' },
          { status: 500 }
        );
      }

      const userProfile = userQuery.rows[0];
      
      // Determine redirect URL
      const redirectTo =
        userProfile.account_type === 'store'
          ? '/store/dashboard'
          : userProfile.account_type === 'user' || userProfile.account_type === 'client'
            ? '/user/dashboard'
            : userProfile.account_type === 'engineer' || userProfile.account_type === 'consultant'
              ? '/dashboard/construction-data'
              : '/';

      console.log('🚀 [DB-LOGIN] Login successful, redirect to:', redirectTo);

      // Create response with user data
      const response = NextResponse.json({
        success: true,
        redirectTo,
        user: {
          id: authUser.id,
          email: authUser.email,
          account_type: userProfile.account_type,
          name: userProfile.name
        },
      });      // Set a temporary auth cookie (accessible to JavaScript for client-side auth checks)
      response.cookies.set('temp_auth_user', JSON.stringify({
        id: authUser.id,
        email: authUser.email,
        account_type: userProfile.account_type,
        name: userProfile.name
      }), {
        path: '/',
        maxAge: 60 * 60 * 24, // 24 hours
        httpOnly: false, // Allow JavaScript access for client-side auth
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });

      console.log('✅ [DB-LOGIN] Response sent with cookies');
      return response;

    } finally {
      await client.end();
    }
  } catch (error) {
    console.error('❌ [DB-LOGIN] Unexpected error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}


