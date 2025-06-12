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
    const customerId = searchParams.get('customerId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!storeId) {
      return NextResponse.json(
        { error: 'Store ID is required' },
        { status: 400 }
      );
    }

    const filters = {
      store_id: storeId,
      customer_id: customerId,
      status
    };

    const orders = await erpService.getSalesOrders(filters);

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        limit,
        offset,
        hasMore: orders.length === limit
      }
    });

  } catch (error) {
    console.error('Get Sales Orders Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch sales orders',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { storeId, customerId, items, ...orderData } = body;

    if (!storeId || !customerId || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Store ID, Customer ID, and items are required' },
        { status: 400 }
      );
    }

    // Validate stock availability
    const stockValidation = await erpService.validateStockAvailability(items);
    if (!stockValidation.valid) {
      return NextResponse.json(
        { 
          error: 'Insufficient stock for some items',
          stockIssues: stockValidation.errors
        },
        { status: 400 }
      );
    }

    // Create sales order
    const salesOrder = await erpService.createSalesOrder({
      store_id: storeId,
      customer_id: customerId,
      items,
      ...orderData
    });

    return NextResponse.json({
      success: true,
      data: salesOrder,
      message: 'Sales order created successfully'
    });

  } catch (error) {
    console.error('Create Sales Order Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create sales order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'submit':
        result = await erpService.submitSalesOrder(id);
        break;
      case 'cancel':
        result = await erpService.cancelSalesOrder(id);
        break;
      case 'deliver':
        result = await erpService.deliverSalesOrder(id, updateData.deliveryDetails);
        break;
      default:
        result = await erpService.updateSalesOrder(id, updateData);
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: `Sales order ${action || 'updated'} successfully`
    });

  } catch (error) {
    console.error('Update Sales Order Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update sales order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
