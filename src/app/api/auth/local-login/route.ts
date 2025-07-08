// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

// Local user storage for development
const usersFile = path.join(process.cwd(), 'local-users.json');

function getUsers() {
  try {
    if (fs.existsSync(usersFile)) {
      return JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    }
  } catch (error) {
    console.error('Error reading users file:', error);
  }
  return [];
}

function saveUsers(users: any[]) {
  try {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving users file:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log('🔐 [Local Auth] Login attempt for:', email);

    const users = getUsers();
    const user = users.find((u: any) => u.email === email);

    if (!user) {
      console.log('❌ [Local Auth] User not found:', email);
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      console.log('❌ [Local Auth] Invalid password for:', email);
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('✅ [Local Auth] Login successful for:', email);

    // Create session data
    const sessionData = {
      id: user.id,
      email: user.email,
      account_type: user.account_type,
      name: user.name || email.split('@')[0],
    };    // Determine redirect URL based on account type
    const redirectUrl = sessionData.account_type === 'store' 
      ? '/store/dashboard' 
      : '/user/dashboard';

    const response = NextResponse.json({
      success: true,
      user: sessionData,
      message: 'Login successful',
      redirectTo: redirectUrl,
    });

    // Set session cookie (simple approach for development)
    response.cookies.set('user-session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: false, // Set to true in production
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;

  } catch (error) {
    console.error('❌ [Local Auth] Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


