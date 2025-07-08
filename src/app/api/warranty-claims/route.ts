// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const warrantyId = searchParams.get('warranty_id');

    let query = supabase
      .from('warranty_claims')
      .select(`
        *,
        warranties (
          warranty_number,
          product_name,
          brand,
          model
        )
      `)
      .order('created_at', { ascending: false });

    // Filter by warranty_id if provided
    if (warrantyId) {
      query = query.eq('warranty_id', warrantyId);
    }

    // Filter by user_id for security
    query = query.eq('user_id', user.id);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching warranty claims:', error);
      return NextResponse.json({ error: 'Failed to fetch warranty claims' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in warranty claims API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      warranty_id,
      description,
      claim_type,
      preferred_contact,
      contact_details,
      photos = []
    } = body;

    // Validate required fields
    if (!warranty_id || !description || !claim_type || !preferred_contact || !contact_details) {
      return NextResponse.json({ 
        error: 'Missing required fields: warranty_id, description, claim_type, preferred_contact, contact_details' 
      }, { status: 400 });
    }

    // Verify user owns the warranty
    const { data: warranty, error: warrantyError } = await supabase
      .from('warranties')
      .select('id')
      .eq('id', warranty_id)
      .eq('user_id', user.id)
      .single();

    if (warrantyError || !warranty) {
      return NextResponse.json({ error: 'Warranty not found or access denied' }, { status: 404 });
    }

    // Create warranty claim
    const { data: claim, error } = await supabase
      .from('warranty_claims')
      .insert({
        warranty_id,
        user_id: user.id,
        description,
        claim_type,
        preferred_contact,
        contact_details,
        photos,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating warranty claim:', error);
      return NextResponse.json({ error: 'Failed to create warranty claim' }, { status: 500 });
    }

    // Update warranty status if needed
    await supabase
      .from('warranties')
      .update({ 
        status: 'claimed',
        claim_count: supabase.rpc('increment', { x: 1 })
      })
      .eq('id', warranty_id);

    return NextResponse.json(claim, { status: 201 });
  } catch (error) {
    console.error('Error in warranty claims POST API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, resolution_notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'Claim ID is required' }, { status: 400 });
    }

    // Verify user owns the warranty claim
    const { data: claim, error: claimError } = await supabase
      .from('warranty_claims')
      .select('warranty_id')
      .eq('id', id)
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
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating warranty claim:', error);
      return NextResponse.json({ error: 'Failed to update warranty claim' }, { status: 500 });
    }

    return NextResponse.json(updatedClaim);
  } catch (error) {
    console.error('Error in warranty claims PATCH API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


