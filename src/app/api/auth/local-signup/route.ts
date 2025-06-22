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
    const { email, password, accountType } = await request.json();

    console.log('🔧 [Local Auth] Creating user:', email, 'Type:', accountType);

    const users = getUsers();
    
    // Check if user already exists
    const existingUser = users.find((u: any) => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = {
      id: 'user_' + Date.now(),
      email,
      passwordHash,
      account_type: accountType || 'user',
      name: email.split('@')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    users.push(newUser);
    
    if (!saveUsers(users)) {
      return NextResponse.json(
        { success: false, error: 'Failed to save user' },
        { status: 500 }
      );
    }

    console.log('✅ [Local Auth] User created successfully:', email);

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        account_type: newUser.account_type,
        name: newUser.name,
      }
    });

  } catch (error) {
    console.error('❌ [Local Auth] Create user error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
