import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
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

    // Handle form data (for file uploads)
    const formData = await request.formData();
    const userId = formData.get('userId') as string;
    const supervisorId = formData.get('supervisorId') as string;
    const projectId = formData.get('projectId') as string;
    const content = formData.get('content') as string;
    const attachment = formData.get('attachment') as File;

    // Validate parameters
    if (!userId || !content || (!supervisorId && !projectId)) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Determine sender type
    let senderType: 'user' | 'supervisor';
    let recipientId: string;
    
    const isSupervisor = await isSenderSupervisor(supabase, user.id);
    senderType = isSupervisor ? 'supervisor' : 'user';
    
    // Set recipient based on sender type
    if (isSupervisor) {
      recipientId = userId; // If sender is supervisor, recipient is the user
    } else {
      recipientId = supervisorId; // If sender is user, recipient is the supervisor
    }

    // Handle attachment if provided
    let attachmentUrl = null;
    if (attachment) {
      const fileExt = attachment.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `chat-attachments/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('attachments')
        .upload(filePath, attachment, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading attachment:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload attachment' },
          { status: 500 }
        );
      }

      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('attachments')
        .getPublicUrl(filePath);

      attachmentUrl = publicUrl;
    }

    // Get sender name from profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();

    const senderName = profileData?.full_name || user.email;

    // Create message
    const messageData = {
      id: uuidv4(),
      user_id: isSupervisor ? recipientId : userId,
      supervisor_id: isSupervisor ? user.id : supervisorId,
      project_id: projectId || null,
      sender_id: user.id,
      sender_type: senderType,
      sender_name: senderName,
      recipient_id: recipientId,
      content: content,
      attachment_url: attachmentUrl,
      read: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('supervisor_chat_messages')
      .insert(messageData)
      .select()
      .single();

    if (error) {
      console.error('Error saving message:', error);
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }

    // Format message for response
    const message = {
      id: data.id,
      sender_id: data.sender_id,
      sender_type: data.sender_type,
      sender_name: data.sender_name,
      content: data.content,
      timestamp: data.created_at,
      attachment_url: data.attachment_url,
      read: data.read
    };

    // Send notification to recipient
    await sendChatNotification(supabase, recipientId, senderName, projectId);

    return NextResponse.json({ message });
  } catch (err) {
    console.error('Error in send message API:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Helper function to check if sender is a supervisor
async function isSenderSupervisor(supabase: any, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('construction_supervisors')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();
  
  return !!data;
}

// Helper function to send a notification
async function sendChatNotification(supabase: any, recipientId: string, senderName: string, projectId?: string) {
  try {
    const title = 'رسالة جديدة';
    const message = projectId 
      ? `لديك رسالة جديدة من ${senderName} بخصوص المشروع`
      : `لديك رسالة جديدة من ${senderName}`;
    
    await supabase
      .from('system_notifications')
      .insert({
        user_id: recipientId,
        title: title,
        message: message,
        type: 'info',
        category: 'chat',
        related_entity_type: 'chat',
        related_entity_id: projectId || null,
        is_read: false,
        created_at: new Date().toISOString()
      });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}
