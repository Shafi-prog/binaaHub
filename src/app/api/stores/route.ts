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
    const category = searchParams.get('category');
    const city = searchParams.get('city');
    const region = searchParams.get('region');
    const verified = searchParams.get('verified');
    const active = searchParams.get('active');

    let query = supabase
      .from('stores')
      .select(`
        id,
        store_name,
        description,
        category,
        phone,
        email,
        address,
        city,
        region,
        district,
        country,
        website,
        logo_url,
        cover_image_url,
        rating,
        total_reviews,
        is_verified,
        is_active,
        delivery_areas,
        working_hours,
        payment_methods,
        location_lat,
        location_lng,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (category) {
      query = query.eq('category', category);
    }
    
    if (city) {
      query = query.eq('city', city);
    }
    
    if (region) {
      query = query.eq('region', region);
    }
    
    if (verified !== null) {
      query = query.eq('is_verified', verified === 'true');
    }
    
    if (active !== null) {
      query = query.eq('is_active', active === 'true');
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching stores:', error);
      return NextResponse.json({ error: 'Failed to fetch stores' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in stores API:', error);
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
      store_name,
      description,
      category,
      phone,
      email,
      address,
      city,
      region,
      district,
      country = 'Saudi Arabia',
      website,
      logo_url,
      cover_image_url,
      delivery_areas,
      working_hours,
      payment_methods,
      location_lat,
      location_lng
    } = body;

    // Validate required fields
    if (!store_name || !category || !phone || !address || !city || !region) {
      return NextResponse.json({ 
        error: 'Missing required fields: store_name, category, phone, address, city, region' 
      }, { status: 400 });
    }

    // Create store
    const { data: store, error } = await supabase
      .from('stores')
      .insert({
        owner_id: user.id,
        store_name,
        description,
        category,
        phone,
        email,
        address,
        city,
        region,
        district,
        country,
        website,
        logo_url,
        cover_image_url,
        delivery_areas,
        working_hours,
        payment_methods,
        location_lat,
        location_lng,
        is_active: true,
        is_verified: false,
        rating: 0,
        total_reviews: 0,
        // Generate invitation code for new store
        invitation_code: 'BinnaHub-' + Math.random().toString(36).substring(2, 10)
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating store:', error);
      return NextResponse.json({ error: 'Failed to create store' }, { status: 500 });
    }

    return NextResponse.json(store, { status: 201 });
  } catch (error) {
    console.error('Error in stores POST API:', error);
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
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Store ID is required' }, { status: 400 });
    }

    // Verify user owns the store
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('owner_id')
      .eq('id', id)
      .single();

    if (storeError || !store || store.owner_id !== user.id) {
      return NextResponse.json({ error: 'Store not found or access denied' }, { status: 404 });
    }

    // Update store
    const { data: updatedStore, error } = await supabase
      .from('stores')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating store:', error);
      return NextResponse.json({ error: 'Failed to update store' }, { status: 500 });
    }

    return NextResponse.json(updatedStore);
  } catch (error) {
    console.error('Error in stores PATCH API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


