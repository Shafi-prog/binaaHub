import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    console.log('🔐 [API] Login attempt for:', email)
    
    // Create route handler client with proper cookie handling
    const supabase = createRouteHandlerClient({ cookies })
    
    // Authenticate user
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError || !signInData.session) {
      console.error('❌ [API] Auth error:', signInError?.message)
      return NextResponse.json(
        { error: signInError?.message || 'Login failed' },
        { status: 401 }
      )
    }

    console.log('✅ [API] Authentication successful for:', signInData.session.user.email)

    // Get user data from database
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('account_type')
      .eq('email', email)
      .single()

    if (fetchError || !userData?.account_type) {
      console.error('❌ [API] Error fetching user data:', fetchError?.message)
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: 500 }
      )
    }

    console.log('👤 [API] User account type:', userData.account_type)

    // Determine redirect URL
    const redirectTo =
      userData.account_type === 'store'
        ? '/store/dashboard'
        : userData.account_type === 'user' || userData.account_type === 'client'
          ? '/user/dashboard'
          : userData.account_type === 'engineer' || userData.account_type === 'consultant'
            ? '/dashboard/construction-data'
            : '/'

    console.log('🚀 [API] Redirect URL determined:', redirectTo)    // Create response with session cookies
    const response = NextResponse.json({
      success: true,
      redirectTo,
      user: {
        email: signInData.session.user.email,
        account_type: userData.account_type
      }
    })

    // Set Supabase session cookies with correct naming for middleware compatibility
    const cookieOptions = {
      httpOnly: false, // Supabase client needs access to these
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    }

    // Set the access token cookie with the exact name Supabase expects
    response.cookies.set(`sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0]}-auth-token`, 
      JSON.stringify({
        access_token: signInData.session.access_token,
        refresh_token: signInData.session.refresh_token,
        expires_at: signInData.session.expires_at,
        user: signInData.session.user
      }), 
      cookieOptions
    )

    console.log('✅ [API] Login successful, session cookies set with correct Supabase format')

    return response

  } catch (error) {
    console.error('❌ [API] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
