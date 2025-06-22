import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get session from cookie
    const sessionCookie = request.cookies.get('user-session');
    
    if (!sessionCookie) {
      return NextResponse.json({
        success: false,
        error: 'No session found'
      }, { status: 401 });
    }

    try {
      const sessionData = JSON.parse(sessionCookie.value);
      
      // Validate session data
      if (!sessionData.id || !sessionData.email) {
        return NextResponse.json({
          success: false,
          error: 'Invalid session data'
        }, { status: 401 });
      }

      return NextResponse.json({
        success: true,
        user: {
          id: sessionData.id,
          email: sessionData.email,
          account_type: sessionData.account_type || 'user',
          name: sessionData.name || sessionData.email.split('@')[0],
        }
      });

    } catch (parseError) {
      console.error('❌ [Auth Check] Session parse error:', parseError);
      return NextResponse.json({
        success: false,
        error: 'Invalid session format'
      }, { status: 401 });
    }

  } catch (error) {
    console.error('❌ [Auth Check] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
