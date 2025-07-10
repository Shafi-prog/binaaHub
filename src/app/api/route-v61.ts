// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const orderNumber = searchParams.get('orderNumber');

    if (!orderId && !orderNumber) {
      return NextResponse.json(
        { error: 'Order ID or order number is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('orders')
      .select(`
        *,
        store:stores(store_name),
        order_items(
          *,
          product:products(name, image_url)
        )
      `);

    if (orderId) {
      query = query.eq('id', orderId);
    } else if (orderNumber) {
      query = query.eq('order_number', orderNumber);
    }

    const { data: order, error } = await query.single();

    if (error) {
      console.error('Order lookup error:', error);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if user has access to this order
    if (order.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Generate tracking information
    const trackingInfo = {
      orderId: order.id,
      orderNumber: order.order_number,
      status: order.status,
      statusHistory: [
        { status: 'created', timestamp: order.created_at, message: 'Order placed successfully' },
        { status: 'confirmed', timestamp: order.confirmed_at, message: 'Order confirmed by store' },
        { status: 'processing', timestamp: order.processing_at, message: 'Order is being prepared' },
        { status: 'shipped', timestamp: order.shipped_at, message: 'Order has been shipped' },
        { status: 'delivered', timestamp: order.delivered_at, message: 'Order delivered' }
      ].filter(entry => entry.timestamp),
      estimatedDelivery: order.estimated_delivery_date,
      trackingNumber: order.tracking_number,
      store: order.store,
      items: order.order_items,
      total: order.total,
      shippingAddress: order.shipping_address,
      notes: order.notes
    };

    return NextResponse.json({
      success: true,
      order: trackingInfo
    });

  } catch (error) {
    console.error('Order tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
