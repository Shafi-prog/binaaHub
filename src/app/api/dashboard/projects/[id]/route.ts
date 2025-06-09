import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params in Next.js 15
    const { id } = await params;
    
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
        { success: false, error: 'User not authenticated', authError: authError?.message },
        { status: 401 }
      );
    }

    console.log('Authenticated user:', user.id);
    console.log('Requested project ID:', id);    // Query the project
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    
    if (error) {
      console.log('Database query error:', error);
      return NextResponse.json(
        { success: false, error: 'Project not found', dbError: error.message },
        { status: 404 }
      );
    }
    
    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Return the project data
    return NextResponse.json({
      success: true,
      project: data
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params in Next.js 15
    const { id } = await params;
    
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
        { success: false, error: 'User not authenticated', authError: authError?.message },
        { status: 401 }
      );
    }    // Get the update data from the request body
    const updateData = await request.json();
    
    // Transform the update data to match database schema
    const transformedData = { ...updateData };
    
    // Map expected_completion_date to end_date for database compatibility
    if (transformedData.expected_completion_date) {
      transformedData.end_date = transformedData.expected_completion_date;
      delete transformedData.expected_completion_date;
    }
    
    console.log('Update data received:', updateData);
    console.log('Transformed data for DB:', transformedData);
      // Update the project
    const { data, error } = await supabase
      .from('projects')
      .update(transformedData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();
    
    if (error) {
      console.log('Database update error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update project', dbError: error.message },
        { status: 400 }
      );
    }
    
    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Project not found or not updated' },
        { status: 404 }
      );
    }

    // Return the updated project data
    return NextResponse.json({
      success: true,
      project: data
    });
  } catch (error: any) {
    console.error('PUT API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}