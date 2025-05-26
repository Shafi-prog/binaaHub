import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    console.log('🔐 [API] Login attempt for:', email)
    
    // Create server-side supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Authenticate user
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError || !signInData.session) {
      console.error('❌ [API] Auth error:', signInError?.message)
      return NextResponse.json(
        { success: false, error: signInError?.message || 'Login failed' },
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
        { success: false, error: 'Failed to fetch user data' },
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

    console.log('🚀 [API] Redirect URL determined:', redirectTo)    // Create response with session info
    const response = NextResponse.json({
      success: true,
      redirectTo,
      user: {
        email: signInData.session.user.email,
        account_type: userData.account_type
      },
      session: {
        access_token: signInData.session.access_token,
        refresh_token: signInData.session.refresh_token,
        expires_at: signInData.session.expires_at
      }
    })

    // Set cookies server-side for middleware access
    const accessToken = signInData.session.access_token
    response.cookies.set('sb-access-token', accessToken, {
      path: '/',
      maxAge: 3600, // 1 hour
      httpOnly: false, // Allow client-side access
      secure: false, // Allow over HTTP for localhost development
      sameSite: 'lax'
    })
    
    response.cookies.set('supabase-auth-token', accessToken, {
      path: '/',
      maxAge: 3600,
      httpOnly: false,
      secure: false,
      sameSite: 'lax'
    })

    console.log('🍪 [API] Set cookies server-side for middleware access')
    console.log('✅ [API] Login successful, returning session data')

    return response

  } catch (error) {
    console.error('❌ [API] Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}