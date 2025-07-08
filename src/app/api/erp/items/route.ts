// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import ERPIntegrationServiceCore from '@/lib/erp-integration/service';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const erpService = new ERPIntegrationServiceCore(supabase);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!storeId) {
      return NextResponse.json(
        { error: 'Store ID is required' },
        { status: 400 }
      );
    }

    const filters = {
      search,
      category,
      isActive: true
    };

    const items = await erpService.getItems(filters);

    return NextResponse.json({
      success: true,
      data: items,
      pagination: {
        limit,
        offset,
        hasMore: items.length === limit
      }
    });

  } catch (error) {
    console.error('Get Items Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch items',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { storeId, ...itemData } = body;

    if (!storeId) {
      return NextResponse.json(
        { error: 'Store ID is required' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!itemData.item_name || !itemData.item_code) {
      return NextResponse.json(
        { error: 'Item name and code are required' },
        { status: 400 }
      );
    }

    const newItem = await erpService.createItem({
      ...itemData,
      store_id: storeId
    });

    return NextResponse.json({
      success: true,
      data: newItem,
      message: 'Item created successfully'
    });

  } catch (error) {
    console.error('Create Item Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create item',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, storeId, ...updateData } = body;

    if (!id || !storeId) {
      return NextResponse.json(
        { error: 'Item ID and Store ID are required' },
        { status: 400 }
      );
    }

    const updatedItem = await erpService.updateItem(id, updateData);

    return NextResponse.json({
      success: true,
      data: updatedItem,
      message: 'Item updated successfully'
    });

  } catch (error) {
    console.error('Update Item Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update item',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}


