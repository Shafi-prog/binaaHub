// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { erpService } from '@/core/shared/services/erp-integration/service';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');
    const search = searchParams.get('search');
    const customerGroup = searchParams.get('customerGroup');
    const territory = searchParams.get('territory');
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
      customer_group: customerGroup,
      territory,
      disabled: false
    };

    const customers = await erpService.getCustomers(filters);

    return NextResponse.json({
      success: true,
      data: customers,
      pagination: {
        limit,
        offset,
        hasMore: customers.length === limit
      }
    });

  } catch (error) {
    console.error('Get Customers Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch customers',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { storeId, ...customerData } = body;

    if (!storeId) {
      return NextResponse.json(
        { error: 'Store ID is required' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!customerData.customer_name) {
      return NextResponse.json(
        { error: 'Customer name is required' },
        { status: 400 }
      );
    }

    const newCustomer = await erpService.createCustomer({
      ...customerData,
      store_id: storeId
    });

    return NextResponse.json({
      success: true,
      data: newCustomer,
      message: 'Customer created successfully'
    });

  } catch (error) {
    console.error('Create Customer Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create customer',
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
        { error: 'Customer ID and Store ID are required' },
        { status: 400 }
      );
    }

    const updatedCustomer = await erpService.updateCustomer(id, updateData);

    return NextResponse.json({
      success: true,
      data: updatedCustomer,
      message: 'Customer updated successfully'
    });

  } catch (error) {
    console.error('Update Customer Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update customer',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}


