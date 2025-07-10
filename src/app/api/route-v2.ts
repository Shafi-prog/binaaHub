// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Client } from 'pg';

// Initialize Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getMedusaDbClient() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  await client.connect();
  return client;
}

// GET - List orders with admin capabilities
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '20';
    const offset = searchParams.get('offset') || '0';
    const status = searchParams.get('status');

    console.log('📦 [Admin API] Fetching orders for admin management...');

    const client = await getMedusaDbClient();
    
    let whereClause = '';
    let queryParams = [limit, offset];
    
    if (status) {
      whereClause = 'WHERE o.status = $3';
      queryParams.push(status);
    }    const query = `
      SELECT 
        o.id,
        o.status,
        o.currency_code,
        o.created_at,
        o.updated_at,
        o.metadata,
        c.email as customer_email,
        c.first_name as customer_first_name,
        c.last_name as customer_last_name,
        COUNT(DISTINCT oi.id) as item_count
      FROM "order" o
      LEFT JOIN customer c ON o.customer_id = c.id
      LEFT JOIN order_item oi ON o.id = oi.order_id
      ${whereClause}
      GROUP BY o.id, o.status, o.currency_code, o.created_at, o.updated_at, o.metadata, c.email, c.first_name, c.last_name
      ORDER BY o.created_at DESC
      LIMIT $1 OFFSET $2
    `;

    const countQuery = status 
      ? `SELECT COUNT(*) as total FROM "order" o ${whereClause.replace('$3', '$1')}`
      : `SELECT COUNT(*) as total FROM "order"`;

    const countParams = status ? [status] : [];

    const [result, countResult] = await Promise.all([
      client.query(query, queryParams),
      client.query(countQuery, countParams)
    ]);

    await client.end();    const orders = result.rows.map(row => ({
      ...row,
      total: 0, // Placeholder until we find the correct column
      item_count: parseInt(row.item_count) || 0,
      customer: {
        email: row.customer_email,
        first_name: row.customer_first_name,
        last_name: row.customer_last_name
      }
    }));

    const total = parseInt(countResult.rows[0].total);

    console.log(`📦 [Admin API] Retrieved ${orders.length} orders for admin (total: ${total})`);

    return NextResponse.json({
      orders,
      count: total,
      limit: parseInt(limit),
      offset: parseInt(offset),
      has_more: (parseInt(offset) + parseInt(limit)) < total
    });

  } catch (error) {
    console.error('❌ [Admin API] Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}


