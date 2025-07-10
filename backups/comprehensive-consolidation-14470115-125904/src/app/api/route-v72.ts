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

    // Get store information
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (storeError || !store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }

    // Get dashboard metrics
    const [ordersData, productsData, revenueData] = await Promise.all([
      // Recent orders
      supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            product:products(name, image_url)
          )
        `)
        .eq('store_id', store.id)
        .order('created_at', { ascending: false })
        .limit(10),

      // Product count
      supabase
        .from('products')
        .select('id', { count: 'exact' })
        .eq('store_id', store.id),

      // Revenue metrics
      supabase
        .from('orders')
        .select('total, created_at')
        .eq('store_id', store.id)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    ]);

    // Calculate metrics
    const totalOrders = ordersData.data?.length || 0;
    const totalProducts = productsData.count || 0;
    const monthlyRevenue = revenueData.data?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
    const avgOrderValue = totalOrders > 0 ? monthlyRevenue / totalOrders : 0;

    // Get recent activity
    const recentActivity = [
      ...ordersData.data?.slice(0, 5).map(order => ({
        type: 'order',
        message: `New order #${order.order_number} received`,
        timestamp: order.created_at,
        amount: order.total
      })) || []
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const dashboardData = {
      store: {
        id: store.id,
        name: store.store_name,
        description: store.description,
        phone: store.phone,
        email: store.email,
        city: store.city,
        region: store.region,
        logo_url: store.logo_url,
        status: store.status,
        created_at: store.created_at
      },
      metrics: {
        totalOrders,
        totalProducts,
        monthlyRevenue,
        avgOrderValue,
        pendingOrders: ordersData.data?.filter(order => order.status === 'pending').length || 0,
        completedOrders: ordersData.data?.filter(order => order.status === 'completed').length || 0
      },
      recentOrders: ordersData.data || [],
      recentActivity,
      alerts: [
        ...(totalProducts === 0 ? [{ type: 'warning', message: 'No products added yet. Add your first product to start selling.' }] : []),
        ...(totalOrders === 0 ? [{ type: 'info', message: 'No orders yet. Share your store to get your first customers.' }] : [])
      ]
    };

    return NextResponse.json({
      success: true,
      dashboard: dashboardData
    });

  } catch (error) {
    console.error('Vendor dashboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { action, data } = body;

    // Get store information
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (storeError || !store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }

    switch (action) {
      case 'update_store':
        const { data: updatedStore, error: updateError } = await supabase
          .from('stores')
          .update({
            store_name: data.store_name,
            description: data.description,
            phone: data.phone,
            email: data.email,
            city: data.city,
            region: data.region,
            logo_url: data.logo_url
          })
          .eq('id', store.id)
          .select()
          .single();

        if (updateError) {
          return NextResponse.json(
            { error: 'Failed to update store' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          store: updatedStore
        });

      case 'update_order_status':
        const { orderId, status } = data;
        
        const { data: updatedOrder, error: orderUpdateError } = await supabase
          .from('orders')
          .update({ 
            status,
            [`${status}_at`]: new Date().toISOString()
          })
          .eq('id', orderId)
          .eq('store_id', store.id)
          .select()
          .single();

        if (orderUpdateError) {
          return NextResponse.json(
            { error: 'Failed to update order status' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          order: updatedOrder
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Vendor dashboard POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
