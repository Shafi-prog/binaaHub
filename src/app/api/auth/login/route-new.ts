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

    console.log('🚀 [API] Redirect URL determined:', redirectTo)

    // Return success response - cookies are automatically handled by createRouteHandlerClient
    console.log('✅ [API] Login successful, session automatically managed by Supabase')

    return NextResponse.json({
      success: true,
      redirectTo,
      user: {
        email: signInData.session.user.email,
        account_type: userData.account_type
      }
    })

  } catch (error) {
    console.error('❌ [API] Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
