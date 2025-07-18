// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { syncUserWithMedusa } from '@/core/shared/services/medusa-integration';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, accountType } = await request.json();

    console.log('🔐 [API] Signup attempt for:', email, 'Account type:', accountType);

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }    // Validate account type
    const validAccountTypes = ['user', 'store'];
    const selectedAccountType = accountType || 'user';
    
    if (!validAccountTypes.includes(selectedAccountType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid account type. Please select either User or Store.' },
        { status: 400 }
      );
    }    // Create route handler client with proper cookie handling for Next.js 15+
    const supabase = createRouteHandlerClient({ cookies });

    // Create admin client for database operations
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );    // Check if user already exists in users table (using admin client)
    const { data: existingUser } = await adminSupabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      );
    }    // Create user in Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
      }
    });

    if (signUpError) {
      console.error('❌ [API] Signup auth error:', signUpError.message);
      
      // Provide user-friendly error messages
      let userFriendlyMessage = signUpError.message;
      
      if (signUpError.message.includes('User already registered')) {
        userFriendlyMessage = 'يوجد حساب مسجل بالفعل بهذا البريد الإلكتروني';
      } else if (signUpError.message.includes('Invalid email')) {
        userFriendlyMessage = 'البريد الإلكتروني غير صحيح';
      } else if (signUpError.message.includes('Password')) {
        userFriendlyMessage = 'كلمة المرور ضعيفة جداً. يجب أن تكون 6 أحرف على الأقل';
      }
      
      return NextResponse.json(
        { success: false, error: userFriendlyMessage },
        { status: 400 }
      );
    }

    if (!signUpData.user) {
      return NextResponse.json(
        { success: false, error: 'Failed to create user account' },
        { status: 500 }
      );
    }

    console.log('✅ [API] Auth user created for:', email);    // Generate invitation code
    const invitationCode = 'BinnaHub-' + Math.random().toString(36).substring(2, 10);    // Create user record in users table    // Match your exact table structure
    const userData = {
      id: signUpData.user.id,
      email: email,
      name: name,
      account_type: selectedAccountType, // Use the selected account type
      is_verified: false,
      status: 'active', // Your default is 'active'
      invitation_code: invitationCode,
    };    const { error: insertError } = await adminSupabase
      .from('users')
      .insert([userData]);

    if (insertError) {
      console.error('❌ [API] Failed to create user record:', insertError.message);
      
      // If user record creation fails, we should clean up the auth user
      // However, this is complex with Supabase auth, so we'll log the error
      console.error('⚠️ [API] User exists in auth but not in users table for:', email);
      
      return NextResponse.json(
        { success: false, error: 'Failed to complete user registration' },
        { status: 500 }
      );
    }      console.log('✅ [API] User record created for:', email);

      // Sync user with Medusa
      try {
        await syncUserWithMedusa({
          id: signUpData.user.id,
          email: email,
          name: name,
          account_type: selectedAccountType
        });
        console.log('✅ [API] User synced with Medusa successfully');
      } catch (medusaError) {
        console.error('⚠️ [API] Failed to sync with Medusa (non-blocking):', medusaError);
        // Don't fail the signup if Medusa sync fails
      }

      // Check if user needs email verification
    if (signUpData.session) {
      // User is automatically signed in (email verification disabled)
      console.log('✅ [API] User automatically signed in');
        // Determine redirect URL based on account type
      const redirectTo = 
        selectedAccountType === 'store'
          ? '/store/dashboard'
          : '/user/dashboard';
      
      return NextResponse.json({
        success: true,
        message: 'Account created successfully!',
        redirectTo,
        user: {
          email: signUpData.user.email,
          account_type: selectedAccountType,
        },
      });
    } else {
      // User needs to verify email
      console.log('📧 [API] Email verification required for:', email);
      
      return NextResponse.json({
        success: true,
        message: 'Account created! Please check your email to verify your account.',
        requiresVerification: true,
      });
    }

  } catch (error) {
    console.error('❌ [API] Unexpected signup error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


