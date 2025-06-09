import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supervisorId = id;

    // Get supervisor details
    const { data: supervisor, error } = await supabase
      .from('supervisors')
      .select(`
        *,
        user:users(name, email, phone),
        store:stores(store_name, address, city)
      `)
      .eq('id', supervisorId)
      .single();

    if (error) {
      console.error('Error fetching supervisor:', error);
      return NextResponse.json({ error: 'Failed to fetch supervisor' }, { status: 500 });
    }

    if (!supervisor) {
      return NextResponse.json({ error: 'Supervisor not found' }, { status: 404 });
    }

    return NextResponse.json(supervisor);
  } catch (error) {
    console.error('Error in supervisor get API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supervisorId = id;
    const body = await request.json();

    // Update supervisor
    const { data: updatedSupervisor, error } = await supabase
      .from('supervisors')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', supervisorId)
      .select()
      .single();

    if (error) {
      console.error('Error updating supervisor:', error);
      return NextResponse.json({ error: 'Failed to update supervisor' }, { status: 500 });
    }

    return NextResponse.json(updatedSupervisor);
  } catch (error) {
    console.error('Error in supervisor update API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supervisorId = id;

    // Delete supervisor
    const { error } = await supabase
      .from('supervisors')
      .delete()
      .eq('id', supervisorId);

    if (error) {
      console.error('Error deleting supervisor:', error);
      return NextResponse.json({ error: 'Failed to delete supervisor' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Supervisor deleted successfully' });
  } catch (error) {
    console.error('Error in supervisor delete API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
