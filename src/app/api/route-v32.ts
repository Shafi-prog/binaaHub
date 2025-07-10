// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const supervisorId = searchParams.get('supervisorId');
    const projectId = searchParams.get('projectId');

    // Validate parameters
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Build the query
    let query = supabase
      .from('supervisor_chat_messages')
      .select(`
        id,
        sender_id,
        sender_type,
        sender_name,
        content,
        created_at as timestamp,
        attachment_url,
        read
      `);

    // Apply filters based on provided parameters
    if (supervisorId) {
      // Chat between specific user and supervisor
      query = query.or(`and(user_id.eq.${userId},supervisor_id.eq.${supervisorId}),and(user_id.eq.${supervisorId},supervisor_id.eq.${userId})`);
    } else if (projectId) {
      // Chat related to a specific project
      query = query.eq('project_id', projectId);
    } else {
      // Fall back to all messages for this user
      query = query.or(`user_id.eq.${userId},supervisor_id.eq.${userId}`);
    }

    // Execute the query
    const { data, error } = await query
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching chat messages:', error);
      return NextResponse.json(
        { error: 'Failed to fetch messages' },
        { status: 500 }
      );
    }    // Mark messages as read
    if (data && data.length > 0) {
      const unreadMessages = data
        .filter((msg: any) => msg.read === false && msg.sender_id !== user.id)
        .map((msg: any) => msg.id);

      if (unreadMessages.length > 0) {
        await supabase
          .from('supervisor_chat_messages')
          .update({ read: true, updated_at: new Date().toISOString() })
          .in('id', unreadMessages);
      }
    }

    return NextResponse.json({ messages: data || [] });
  } catch (err) {
    console.error('Error in chat messages API:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}


