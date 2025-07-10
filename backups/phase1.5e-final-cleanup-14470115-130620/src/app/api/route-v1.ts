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

// GET - List customers with admin capabilities
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '20';
    const offset = searchParams.get('offset') || '0';
    const search = searchParams.get('search') || '';

    console.log('👥 [Admin API] Fetching customers for admin management...');

    const client = await getMedusaDbClient();
    
    let whereClause = '';
    let queryParams = [limit, offset];
    
    if (search) {
      whereClause = `WHERE c.email ILIKE $3 OR c.first_name ILIKE $3 OR c.last_name ILIKE $3`;
      queryParams.push(`%${search}%`);
    }

    const query = `      SELECT 
        c.id,
        c.email,
        c.first_name,
        c.last_name,
        c.phone,
        c.has_account,
        c.created_at,
        c.updated_at,
        c.metadata,
        COUNT(DISTINCT o.id) as order_count
      FROM customer c
      LEFT JOIN "order" o ON c.id = o.customer_id
      ${whereClause}
      GROUP BY c.id, c.email, c.first_name, c.last_name, c.phone, c.has_account, c.created_at, c.updated_at, c.metadata
      ORDER BY c.created_at DESC
      LIMIT $1 OFFSET $2
    `;

    const countQuery = search 
      ? `SELECT COUNT(*) as total FROM customer c ${whereClause.replace('$3', '$1')}`
      : `SELECT COUNT(*) as total FROM customer`;

    const countParams = search ? [search] : [];

    const [result, countResult] = await Promise.all([
      client.query(query, queryParams),
      client.query(countQuery, countParams)
    ]);

    await client.end();    const customers = result.rows.map(row => ({
      ...row,
      order_count: parseInt(row.order_count) || 0,
      total_spent: 0 // Placeholder until we find correct calculation
    }));

    const total = parseInt(countResult.rows[0].total);

    console.log(`👥 [Admin API] Retrieved ${customers.length} customers for admin (total: ${total})`);

    return NextResponse.json({
      customers,
      count: total,
      limit: parseInt(limit),
      offset: parseInt(offset),
      has_more: (parseInt(offset) + parseInt(limit)) < total
    });

  } catch (error) {
    console.error('❌ [Admin API] Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

// POST - Create new customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('👥 [Admin API] Creating new customer:', body);

    const client = await getMedusaDbClient();

    const {
      email,
      first_name,
      last_name,
      phone,
      has_account = false,
      metadata = {}
    } = body;

    // Check if email already exists
    const emailCheck = await client.query(
      'SELECT id FROM customer WHERE email = $1',
      [email]
    );

    if (emailCheck.rows.length > 0) {
      await client.end();
      return NextResponse.json(
        { error: 'Customer with this email already exists' },
        { status: 400 }
      );
    }

    // Insert customer
    const insertQuery = `
      INSERT INTO customer (
        email, first_name, last_name, phone, has_account, metadata, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *
    `;

    const result = await client.query(insertQuery, [
      email,
      first_name,
      last_name,
      phone,
      has_account,
      JSON.stringify(metadata)
    ]);

    await client.end();

    const customer = result.rows[0];
    console.log('✅ [Admin API] Customer created successfully:', customer.id);

    return NextResponse.json(
      { customer, message: 'Customer created successfully' },
      { status: 201 }
    );

  } catch (error) {
    console.error('❌ [Admin API] Error creating customer:', error);
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}


