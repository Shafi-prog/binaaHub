// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

// Get cart contents
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Get cart items
    const { data: cartItems, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(
          id,
          name,
          price,
          image_url,
          stock_quantity,
          store:stores(id, store_name)
        )
      `)
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Cart fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch cart items' },
        { status: 500 }
      );
    }

    // Calculate totals
    const subtotal = cartItems?.reduce((sum, item) => {
      return sum + (item.quantity * item.product.price);
    }, 0) || 0;

    const tax = subtotal * 0.15; // 15% VAT
    const total = subtotal + tax;

    return NextResponse.json({
      success: true,
      cart: {
        items: cartItems || [],
        subtotal,
        tax,
        total,
        itemCount: cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0
      }
    });

  } catch (error) {
    console.error('Cart GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add item to cart
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { sessionId, productId, quantity = 1 } = await request.json();

    if (!sessionId || !productId) {
      return NextResponse.json(
        { error: 'Session ID and Product ID are required' },
        { status: 400 }
      );
    }

    // Get product details
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, name, price, stock_quantity, store_id')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check stock availability
    if (product.stock_quantity < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      );
    }

    // Check if item already exists in cart
    const { data: existingItem, error: existingError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('session_id', sessionId)
      .eq('product_id', productId)
      .single();

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      
      if (newQuantity > product.stock_quantity) {
        return NextResponse.json(
          { error: 'Cannot add more items than available stock' },
          { status: 400 }
        );
      }

      const { data: updatedItem, error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', existingItem.id)
        .select()
        .single();

      if (updateError) {
        return NextResponse.json(
          { error: 'Failed to update cart item' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Cart item updated successfully',
        item: updatedItem
      });
    } else {
      // Add new item
      const { data: newItem, error: insertError } = await supabase
        .from('cart_items')
        .insert({
          session_id: sessionId,
          product_id: productId,
          quantity,
          price: product.price,
          store_id: product.store_id
        })
        .select()
        .single();

      if (insertError) {
        console.error('Cart insert error:', insertError);
        return NextResponse.json(
          { error: 'Failed to add item to cart' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Item added to cart successfully',
        item: newItem
      });
    }

  } catch (error) {
    console.error('Cart POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { cartItemId, quantity } = await request.json();

    if (!cartItemId || quantity < 0) {
      return NextResponse.json(
        { error: 'Cart item ID and valid quantity are required' },
        { status: 400 }
      );
    }

    if (quantity === 0) {
      // Remove item
      const { error: deleteError } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (deleteError) {
        return NextResponse.json(
          { error: 'Failed to remove item from cart' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Item removed from cart'
      });
    }

    // Update quantity
    const { data: updatedItem, error: updateError } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update cart item' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Cart item updated successfully',
      item: updatedItem
    });

  } catch (error) {
    console.error('Cart PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Clear cart
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('session_id', sessionId);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to clear cart' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Cart cleared successfully'
    });

  } catch (error) {
    console.error('Cart DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
