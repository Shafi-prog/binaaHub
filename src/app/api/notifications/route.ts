import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch notifications for the user - try both public and admin schemas
    let { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    // Fallback to admin schema only if table/schema not found
    if (error && (error.message?.includes('relation') || error.message?.includes('does not exist'))) {
      const result = await supabase
        .from('admin.notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      notifications = result.data;
      error = result.error;
    }

    if (error) {
      console.error('Error fetching notifications:', error);
      return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
    }

    return NextResponse.json({ notifications: notifications || [] });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, title, content, data } = body;

    // Create notification - try both public and admin schemas
    let { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        user_id: user.id,
        type,
        title,
        content,
        data,
      })
      .select()
      .single();
    
    // Fallback to admin schema only if table/schema not found
    if (error && (error.message?.includes('relation') || error.message?.includes('does not exist'))) {
      const result = await supabase
        .from('admin.notifications')
        .insert({
          user_id: user.id,
          type,
          title,
          content,
          data,
        })
        .select()
        .single();
      notification = result.data;
      error = result.error;
    }

    if (error) {
      console.error('Error creating notification:', error);
      return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
    }

    return NextResponse.json({ success: true, notification });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
