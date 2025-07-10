// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { initERPService, generateId, generateOrderNumber, calculateTotal } from '@/domains/shared/services/erp/mongodb-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const skip = parseInt(searchParams.get('skip') || '0');
    const status = searchParams.get('status') || '';
    const customerId = searchParams.get('customer_id') || '';

    const erpService = await initERPService();
    
    let filter: any = {};
    if (status) {
      filter.status = status;
    }
    if (customerId) {
      filter.customer_id = customerId;
    }

    const orders = await erpService.getOrders(filter, limit, skip);
    
    return NextResponse.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const erpService = await initERPService();
    
    // Calculate totals
    const subtotal = body.items.reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0);
    const discount = body.discount || 0;
    const { vat, total } = calculateTotal(subtotal, 15, discount);
    
    const orderData = {
      ...body,
      id: generateId('ORD-'),
      order_number: generateOrderNumber(),
      subtotal,
      vat_amount: vat,
      total,
      status: 'pending' as const,
      payment_status: 'pending' as const,
      order_date: new Date()
    };

    const order = await erpService.createOrder(orderData);
    
    return NextResponse.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}


