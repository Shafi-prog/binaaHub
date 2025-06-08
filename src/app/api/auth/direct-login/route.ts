import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    let email, password, debug;

    const contentType = request.headers.get('content-type') || '';

    // Handle both JSON and form data
    if (contentType.includes('application/json')) {
      const body = await request.json();
      email = body.email;
      password = body.password;
      debug = body.debug;
      console.log('📝 [API] Received JSON request');
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      email = formData.get('email') as string;
      password = formData.get('password') as string;
      debug = formData.get('debug') as string;
      console.log('📝 [API] Received form data request');
    } else {
      console.error('❌ [API] Unsupported content type:', contentType);
      return NextResponse.json(
        { success: false, error: 'Unsupported content type' },
        { status: 400 }
      );
    }

    const isDebugMode = debug === 'true';
    if (isDebugMode) {
      console.log('🐛 [API] Debug mode is active');
    }

    if (!email || !password) {
      console.error('❌ [API] Missing email or password');
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log('🔐 [API] Login attempt for:', email);

    const cookieStore = await cookies();

    // Create server client with proper cookie handling
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );

    // Authenticate user
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !signInData.session) {
      console.error('❌ [API] Auth error:', signInError?.message);
      return NextResponse.json(
        { success: false, error: signInError?.message || 'Login failed' },
        { status: 401 }
      );
    }

    console.log('✅ [API] Authentication successful for:', signInData.session.user.email);

    // Get user data from database
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('account_type')
      .eq('email', email)
      .single();

    if (fetchError || !userData?.account_type) {
      console.error('❌ [API] Error fetching user data:', fetchError?.message);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch user data' },
        { status: 500 }
      );
    }

    console.log('👤 [API] User account type:', userData.account_type); // Determine redirect URL
    const redirectTo =
      userData.account_type === 'store'
        ? '/store/dashboard'
        : userData.account_type === 'user' || userData.account_type === 'client'
          ? '/user/dashboard'
          : userData.account_type === 'engineer' || userData.account_type === 'consultant'
            ? '/dashboard/construction-data'
            : '/';
    console.log('🚀 [API] Redirect URL determined:', redirectTo);

    // Create redirect response - let Supabase SSR handle all cookie management automatically
    const response = NextResponse.redirect(new URL(redirectTo, request.url), {
      // Add cache control headers to prevent caching
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
        'Surrogate-Control': 'no-store',
      },
    });

    console.log('✅ [API] Supabase SSR will handle cookies automatically');
    console.log('✅ [API] Redirecting directly to:', redirectTo);
    // If in debug mode, show debug page instead of direct redirect
    if (isDebugMode) {
      console.log('🐛 [API] Debug mode active, showing debug info before redirect');

      // Create a debug HTML page with cookie info and redirect link
      const debugHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Login Debug Info</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
            .container { max-width: 800px; margin: 0 auto; background: #f5f5f5; padding: 20px; border-radius: 5px; }
            h2 { color: #333; }
            .cookie-list { background: #fff; padding: 10px; border-radius: 3px; font-family: monospace; }
            .redirect-btn { display: inline-block; margin-top: 20px; padding: 10px 15px; background: #4CAF50; color: white; text-decoration: none; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Login Debug Information</h2>
            <p><strong>Authentication:</strong> ✅ Successful</p>
            <p><strong>Cookie Management:</strong> Handled by Supabase SSR automatically</p>
            <p><strong>User Account Type:</strong> ${userData.account_type}</p>
            <p><strong>Redirect Destination:</strong> ${redirectTo}</p>
            
            <p>Supabase SSR will automatically set the appropriate authentication cookies with the correct naming convention that the middleware expects.</p>
            
            <p>To test if cookies are properly passed to middleware, click the button below:</p>
            <a href="${redirectTo}" class="redirect-btn">Continue to ${redirectTo}</a>
            
            <script>
              // Function to check client-side accessible cookies
              function checkCookies() {
                const cookies = document.cookie.split(';').map(c => c.trim()).filter(c => c);
                const container = document.querySelector('.container');
                
                const cookieDiv = document.createElement('div');
                cookieDiv.className = 'cookie-list';
                cookieDiv.innerHTML = '<p><strong>Client-side visible cookies:</strong></p>';
                
                if (cookies.length > 0) {
                  cookies.forEach(cookie => {
                    cookieDiv.innerHTML += '<p>' + cookie + '</p>';
                  });
                } else {
                  cookieDiv.innerHTML += '<p>No client-side visible cookies found (this is expected for httpOnly cookies)</p>';
                }
                
                container.appendChild(cookieDiv);
              }
              
              // Run after page loads
              window.onload = checkCookies;
            </script>
          </div>
        </body>
        </html>
      `;

      return new NextResponse(debugHtml, {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
        },
      });
    }

    return response;
  } catch (error) {
    console.error('❌ [API] Unexpected error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
