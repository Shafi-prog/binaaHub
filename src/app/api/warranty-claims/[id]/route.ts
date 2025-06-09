import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

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

    const claimId = id;
    const body = await request.json();
    const { status, resolution_notes } = body;

    // Verify user owns the warranty claim
    const { data: claim, error: claimError } = await supabase
      .from('warranty_claims')
      .select('warranty_id')
      .eq('id', claimId)
      .eq('user_id', user.id)
      .single();

    if (claimError || !claim) {
      return NextResponse.json({ error: 'Claim not found or access denied' }, { status: 404 });
    }

    const updateData: any = { updated_at: new Date().toISOString() };
    
    if (status) {
      updateData.status = status;
      if (status === 'resolved') {
        updateData.resolved_at = new Date().toISOString();
      }
    }
    
    if (resolution_notes) {
      updateData.resolution_notes = resolution_notes;
    }

    // Update warranty claim
    const { data: updatedClaim, error } = await supabase
      .from('warranty_claims')
      .update(updateData)
      .eq('id', claimId)
      .select()
      .single();

    if (error) {
      console.error('Error updating warranty claim:', error);
      return NextResponse.json({ error: 'Failed to update warranty claim' }, { status: 500 });
    }

    return NextResponse.json(updatedClaim);
  } catch (error) {
    console.error('Error in warranty claim update API:', error);
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

    const claimId = id;

    // Verify user owns the warranty claim
    const { data: claim, error: claimError } = await supabase
      .from('warranty_claims')
      .select('warranty_id')
      .eq('id', claimId)
      .eq('user_id', user.id)
      .single();

    if (claimError || !claim) {
      return NextResponse.json({ error: 'Claim not found or access denied' }, { status: 404 });
    }

    // Delete warranty claim
    const { error } = await supabase
      .from('warranty_claims')
      .delete()
      .eq('id', claimId);

    if (error) {
      console.error('Error deleting warranty claim:', error);
      return NextResponse.json({ error: 'Failed to delete warranty claim' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Warranty claim deleted successfully' });
  } catch (error) {
    console.error('Error in warranty claim delete API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
