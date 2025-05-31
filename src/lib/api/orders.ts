import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/database';
import type { Order, OrderItem } from '@/types/orders';

export async function createOrder(
  userId: string,
  storeId: string,
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    hasWarranty: boolean;
    warrantyDurationMonths?: number;
    warrantyNotes?: string;
  }[],
  projectId?: string | null,
  notes?: string | null
): Promise<{ order: Order | null; error: Error | null }> {
  const supabase = createClientComponentClient<Database>();

  try {
    // Generate order number (year + random 6 digits)
    const orderNumber = `${new Date().getFullYear()}${Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0')}`;

    // Start a transaction by inserting the order first
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        store_id: storeId,
        project_id: projectId,
        order_number: orderNumber,
        status: 'pending',
        payment_status: 'pending',
        notes,
      })
      .select()
      .single();

    if (orderError) {
      throw orderError;
    }

    // Insert order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.quantity * item.unitPrice,
      has_warranty: item.hasWarranty,
      warranty_duration_months: item.warrantyDurationMonths,
      warranty_notes: item.warrantyNotes,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

    if (itemsError) {
      throw itemsError;
    }

    // Fetch the complete order with items
    const { data: completeOrder, error: fetchError } = await supabase
      .from('orders')
      .select(
        `
        *,
        store:stores(id, store_name),
        project:projects(id, name),
        items:order_items(
          *,
          product:products(id, name)
        )
      `
      )
      .eq('id', order.id)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    return { order: completeOrder, error: null };
  } catch (error) {
    console.error('Error creating order:', error);
    return { order: null, error: error as Error };
  }
}

export async function getOrder(
  orderId: string
): Promise<{ order: Order | null; error: Error | null }> {
  const supabase = createClientComponentClient<Database>();

  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select(
        `
        *,
        store:stores(id, store_name),
        project:projects(id, name),
        items:order_items(
          *,
          product:products(id, name)
        )
      `
      )
      .eq('id', orderId)
      .single();

    if (error) {
      throw error;
    }

    return { order, error: null };
  } catch (error) {
    console.error('Error fetching order:', error);
    return { order: null, error: error as Error };
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: Database['public']['Enums']['order_status']
): Promise<{ success: boolean; error: Error | null }> {
  const supabase = createClientComponentClient<Database>();

  try {
    const { error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (error) {
      throw error;
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, error: error as Error };
  }
}

export async function cancelOrder(
  orderId: string
): Promise<{ success: boolean; error: Error | null }> {
  return updateOrderStatus(orderId, 'cancelled');
}

export async function confirmDelivery(
  orderId: string
): Promise<{ success: boolean; error: Error | null }> {
  return updateOrderStatus(orderId, 'delivered');
}
