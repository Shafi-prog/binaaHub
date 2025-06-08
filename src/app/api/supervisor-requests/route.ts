import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

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
    const status = searchParams.get('status');

    // Validate parameters
    if (!userId && !supervisorId) {
      return NextResponse.json(
        { error: 'Missing userId or supervisorId parameter' },
        { status: 400 }
      );
    }    // Build the query
    let query = supabase
      .from('supervisor_requests')
      .select(`
        id,
        user_id,
        supervisor_id,
        project_id,
        project:projects(name),
        request_type,
        description,
        budget_range_min,
        budget_range_max,
        preferred_start_date,
        duration_weeks,
        status,
        supervisor_response,
        created_at,
        updated_at
      `);

    // Apply filters based on provided parameters
    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (supervisorId) {
      // Find the supervisor ID from the user ID
      const { data: supervisorData } = await supabase
        .from('construction_supervisors')
        .select('id')
        .eq('user_id', supervisorId)
        .single();
      
      if (supervisorData) {
        query = query.eq('supervisor_id', supervisorData.id);
      } else {
        return NextResponse.json({ requests: [] });
      }
    }

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    // Execute the query
    const { data, error } = await query
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching supervisor requests:', error);
      return NextResponse.json(
        { error: 'Failed to fetch requests' },
        { status: 500 }
      );
    }    // Format the response
    const requests = data?.map(request => ({
      id: request.id,
      user_id: request.user_id,
      supervisor_id: request.supervisor_id,
      project_id: request.project_id,
      project_name: request.project && request.project[0] ? request.project[0].name : 'Unknown Project',
      request_type: request.request_type,
      description: request.description,
      budget: request.budget_range_min,
      currency: 'SAR',
      estimated_duration: request.duration_weeks ? `${request.duration_weeks} weeks` : undefined,
      status: request.status,
      created_at: request.created_at,
      updated_at: request.updated_at,
      supervisor_response: request.supervisor_response ? JSON.parse(request.supervisor_response) : undefined
    })) || [];

    return NextResponse.json({ requests });
  } catch (err) {
    console.error('Error in supervisor requests API:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

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

    const requestData = await request.json();
    const { action } = requestData;

    // Handle different actions
    switch (action) {
      case 'create':
        return await handleCreateRequest(supabase, user.id, requestData);
      
      case 'respond':
        return await handleRespondToRequest(supabase, user.id, requestData);
      
      case 'update-status':
        return await handleUpdateStatus(supabase, user.id, requestData);
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (err) {
    console.error('Error in supervisor requests API:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Handler for creating a new supervisor request
async function handleCreateRequest(supabase: any, userId: string, data: any) {
  const { project_id, request_type, description, budget, estimated_duration, supervisorId } = data;
  
  // Validate required fields
  if (!project_id || !request_type || !description) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  // Get project details for notification purposes
  const { data: projectData } = await supabase
    .from('projects')
    .select('name')
    .eq('id', project_id)
    .single();

  // Find supervisor by ID if provided
  let supervisorDbId = null;
  if (supervisorId) {
    const { data: supervisorData } = await supabase
      .from('construction_supervisors')
      .select('id')
      .eq('user_id', supervisorId)
      .single();
    
    supervisorDbId = supervisorData?.id;
  }

  // Create the request
  const requestId = uuidv4();
  const newRequest = {
    id: requestId,
    user_id: userId,
    supervisor_id: supervisorDbId,
    project_id,
    request_type,
    description,
    budget_range_min: budget || null,
    budget_range_max: null, // Can be extended if needed
    duration_weeks: estimated_duration ? parseInt(estimated_duration) : null,
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data: insertedRequest, error } = await supabase
    .from('supervisor_requests')
    .insert(newRequest)
    .select()
    .single();

  if (error) {
    console.error('Error creating supervisor request:', error);
    return NextResponse.json(
      { error: 'Failed to create request' },
      { status: 500 }
    );
  }

  // Send notification to supervisor if assigned
  if (supervisorDbId) {
    // Get supervisor user ID for notification
    const { data: supervisorData } = await supabase
      .from('construction_supervisors')
      .select('user_id')
      .eq('id', supervisorDbId)
      .single();
    
    if (supervisorData) {
      await supabase
        .from('system_notifications')
        .insert({
          user_id: supervisorData.user_id,
          title: 'طلب إشراف جديد',
          message: `لديك طلب إشراف جديد على مشروع ${projectData?.name || 'جديد'}`,
          type: 'info',
          category: 'supervisor_request',
          related_entity_type: 'supervisor_request',
          related_entity_id: requestId,
          is_read: false,
          created_at: new Date().toISOString()
        });
    }
  }
  // Format response data
  const formattedRequest = {
    id: insertedRequest.id,
    user_id: insertedRequest.user_id,
    supervisor_id: insertedRequest.supervisor_id,
    project_id: insertedRequest.project_id,
    project_name: projectData?.name || 'Unknown Project',
    request_type: insertedRequest.request_type,
    description: insertedRequest.description,
    budget: insertedRequest.budget_range_min,
    currency: 'SAR',
    estimated_duration: insertedRequest.duration_weeks ? `${insertedRequest.duration_weeks} weeks` : undefined,
    status: insertedRequest.status,
    created_at: insertedRequest.created_at,
    updated_at: insertedRequest.updated_at,
    supervisor_response: undefined
  };

  return NextResponse.json({ request: formattedRequest });
}

// Handler for responding to a supervisor request
async function handleRespondToRequest(supabase: any, userId: string, data: any) {
  const { requestId, amount, duration, message } = data;
  
  // Validate required fields
  if (!requestId || !amount || !duration || !message) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  // First, get the supervisor ID for this user
  const { data: supervisorData } = await supabase
    .from('construction_supervisors')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (!supervisorData) {
    return NextResponse.json(
      { error: 'User is not a supervisor' },
      { status: 403 }
    );
  }

  // Check if this request belongs to this supervisor
  const { data: requestData } = await supabase
    .from('supervisor_requests')
    .select('id, user_id, project_id')
    .eq('id', requestId)
    .eq('supervisor_id', supervisorData.id)
    .single();

  if (!requestData) {
    return NextResponse.json(
      { error: 'Request not found or not assigned to this supervisor' },
      { status: 404 }
    );
  }

  // Store the response data as JSON
  const responseData = {
    amount,
    duration,
    message
  };

  // Update the request with the response
  const { data: updatedRequest, error } = await supabase
    .from('supervisor_requests')
    .update({
      supervisor_response: JSON.stringify(responseData),
      updated_at: new Date().toISOString()
    })
    .eq('id', requestId)
    .select()
    .single();

  if (error) {
    console.error('Error updating supervisor request:', error);
    return NextResponse.json(
      { error: 'Failed to respond to request' },
      { status: 500 }
    );
  }

  // Send notification to the user
  await supabase
    .from('system_notifications')
    .insert({
      user_id: requestData.user_id,
      title: 'رد على طلب الإشراف',
      message: 'تم الرد على طلب الإشراف الخاص بك',
      type: 'info',
      category: 'supervisor_request',
      related_entity_type: 'supervisor_request',
      related_entity_id: requestId,
      is_read: false,
      created_at: new Date().toISOString()
    });

  // Get project name for formatting the response
  const { data: projectData } = await supabase
    .from('projects')
    .select('name')
    .eq('id', requestData.project_id)
    .single();
  // Format response data
  const formattedRequest = {
    id: updatedRequest.id,
    user_id: updatedRequest.user_id,
    supervisor_id: updatedRequest.supervisor_id,
    project_id: updatedRequest.project_id,
    project_name: projectData?.name || 'Unknown Project',
    request_type: updatedRequest.request_type,
    description: updatedRequest.description,
    budget: updatedRequest.budget_range_min,
    currency: 'SAR',
    estimated_duration: updatedRequest.duration_weeks ? `${updatedRequest.duration_weeks} weeks` : undefined,
    status: updatedRequest.status,
    created_at: updatedRequest.created_at,
    updated_at: updatedRequest.updated_at,
    supervisor_response: updatedRequest.supervisor_response ? JSON.parse(updatedRequest.supervisor_response) : undefined
  };

  return NextResponse.json({ request: formattedRequest });
}

// Handler for updating the status of a request (approve/reject)
async function handleUpdateStatus(supabase: any, userId: string, data: any) {
  const { requestId, status, response } = data;
  
  // Validate required fields
  if (!requestId || !status) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  // Validate status value
  const validStatuses = ['approved', 'rejected', 'in_progress', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return NextResponse.json(
      { error: 'Invalid status value' },
      { status: 400 }
    );
  }

  // Check if this request belongs to this user
  const { data: requestData } = await supabase
    .from('supervisor_requests')
    .select('id, supervisor_id, project_id')
    .eq('id', requestId)
    .eq('user_id', userId)
    .single();

  if (!requestData) {
    return NextResponse.json(
      { error: 'Request not found or not owned by this user' },
      { status: 404 }
    );
  }

  // Update the request status
  const { data: updatedRequest, error } = await supabase
    .from('supervisor_requests')
    .update({
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', requestId)
    .select()
    .single();

  if (error) {
    console.error('Error updating supervisor request status:', error);
    return NextResponse.json(
      { error: 'Failed to update request status' },
      { status: 500 }
    );
  }

  // Send notification to the supervisor
  if (requestData.supervisor_id) {
    // Get supervisor user ID for notification
    const { data: supervisorData } = await supabase
      .from('construction_supervisors')
      .select('user_id')
      .eq('id', requestData.supervisor_id)
      .single();
    
    if (supervisorData) {
      let title, message;
      
      switch (status) {
        case 'approved':
          title = 'تمت الموافقة على طلب الإشراف';
          message = 'تمت الموافقة على عرضك للإشراف';
          break;
        case 'rejected':
          title = 'تم رفض طلب الإشراف';
          message = 'تم رفض عرضك للإشراف';
          break;
        case 'in_progress':
          title = 'تم بدء العمل على المشروع';
          message = 'تم تحديث حالة طلب الإشراف إلى قيد التنفيذ';
          break;
        case 'completed':
          title = 'تم اكتمال المشروع';
          message = 'تم تحديث حالة طلب الإشراف إلى مكتمل';
          break;
        case 'cancelled':
          title = 'تم إلغاء طلب الإشراف';
          message = 'تم إلغاء طلب الإشراف';
          break;
      }

      await supabase
        .from('system_notifications')
        .insert({
          user_id: supervisorData.user_id,
          title,
          message,
          type: 'info',
          category: 'supervisor_request',
          related_entity_type: 'supervisor_request',
          related_entity_id: requestId,
          is_read: false,
          created_at: new Date().toISOString()
        });
    }
  }  // Get project name for formatting the response
  const { data: projectData } = await supabase
    .from('projects')
    .select('name')
    .eq('id', requestData.project_id)
    .single();

  // Format response data
  const formattedRequest = {
    id: updatedRequest.id,
    user_id: updatedRequest.user_id,
    supervisor_id: updatedRequest.supervisor_id,
    project_id: updatedRequest.project_id,
    project_name: projectData?.name || 'Unknown Project',
    request_type: updatedRequest.request_type,
    description: updatedRequest.description,
    budget: updatedRequest.budget_range_min,
    currency: 'SAR',
    estimated_duration: updatedRequest.duration_weeks ? `${updatedRequest.duration_weeks} weeks` : undefined,
    status: updatedRequest.status,
    created_at: updatedRequest.created_at,
    updated_at: updatedRequest.updated_at,
    supervisor_response: response || updatedRequest.supervisor_response
  };

  return NextResponse.json({ request: formattedRequest });
}
