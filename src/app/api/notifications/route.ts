import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    // Get the bearer token from the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'No bearer token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // Create Supabase client with the bearer token
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    });
    
    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.log('Authentication error:', authError);
      return NextResponse.json(
        { success: false, error: 'User not authenticated' },
        { status: 401 }
      );
    }    const body = await request.json();
    
    console.log('Creating notification with data:', body);
    console.log('Authenticated user:', user.id);
    
    // Create notification in database using authenticated client
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        user_id: body.user_id,
        project_id: body.project_id,
        title: body.title,
        message: body.message,
        notification_type: body.notification_type || 'info',
        link: body.link,
        is_read: false
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: error.message, details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      notification
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
