import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supervisorId = params.id;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    // Update supervisor status
    const { data: updatedSupervisor, error } = await supabase
      .from('supervisors')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', supervisorId)
      .select()
      .single();

    if (error) {
      console.error('Error updating supervisor status:', error);
      return NextResponse.json({ error: 'Failed to update supervisor status' }, { status: 500 });
    }

    return NextResponse.json(updatedSupervisor);
  } catch (error) {
    console.error('Error in supervisor status API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
