// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';
import { v4 as uuidv4 } from 'uuid';

async function getMedusaDbClient() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  await client.connect();
  return client;
}

export async function POST(request: NextRequest) {
  try {
    const { region_id, items = [] } = await request.json();

    console.log('🛒 [Store API] Creating cart...');

    const client = await getMedusaDbClient();
      // Create a new cart
    const cartId = `cart_${uuidv4().replace(/-/g, '')}`;
    const now = new Date().toISOString();

    // Get region details to set currency
    const regionQuery = `
      SELECT currency_code FROM region WHERE id = $1 AND deleted_at IS NULL
    `;
    const regionResult = await client.query(regionQuery, [region_id]);
    
    if (regionResult.rows.length === 0) {
      await client.end();
      return NextResponse.json(
        { error: 'Region not found' },
        { status: 404 }
      );
    }

    const currency_code = regionResult.rows[0].currency_code;

    const createCartQuery = `
      INSERT INTO cart (id, region_id, currency_code, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const cartResult = await client.query(createCartQuery, [
      cartId,
      region_id,
      currency_code,
      now,
      now
    ]);

    const cart = cartResult.rows[0];

    // Add items to cart if provided
    if (items.length > 0) {
      for (const item of items) {
        const lineItemId = `li_${uuidv4().replace(/-/g, '')}`;
        const addItemQuery = `
          INSERT INTO line_item (id, cart_id, variant_id, quantity, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6)
        `;
        
        await client.query(addItemQuery, [
          lineItemId,
          cartId,
          item.variant_id,
          item.quantity || 1,
          now,
          now
        ]);
      }
    }

    await client.end();

    console.log(`✅ [Store API] Cart created: ${cartId}`);

    return NextResponse.json({
      cart: {
        ...cart,
        items
      }
    });

  } catch (error) {
    console.error('❌ [Store API] Error creating cart:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to create cart', message: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cartId = searchParams.get('id');

    if (!cartId) {
      return NextResponse.json(
        { error: 'Cart ID is required' },
        { status: 400 }
      );
    }

    console.log(`🛒 [Store API] Fetching cart: ${cartId}`);

    const client = await getMedusaDbClient();
    
    // Get cart with items
    const query = `
      SELECT 
        c.*,
        json_agg(
          json_build_object(
            'id', li.id,
            'variant_id', li.variant_id,
            'quantity', li.quantity,
            'created_at', li.created_at
          )
        ) FILTER (WHERE li.id IS NOT NULL) as items
      FROM cart c
      LEFT JOIN line_item li ON c.id = li.cart_id AND li.deleted_at IS NULL
      WHERE c.id = $1 AND c.deleted_at IS NULL
      GROUP BY c.id
    `;

    const result = await client.query(query, [cartId]);
    await client.end();

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    const cart = result.rows[0];

    console.log(`✅ [Store API] Cart found: ${cartId}`);

    return NextResponse.json({ cart });

  } catch (error) {
    console.error('❌ [Store API] Error fetching cart:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch cart', message: errorMessage },
      { status: 500 }
    );
  }
}


