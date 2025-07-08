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

// GET - List products with admin capabilities
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '20';
    const offset = searchParams.get('offset') || '0';

    console.log('🔧 [Admin API] Fetching products for admin management...');

    const client = await getMedusaDbClient();
      const query = `
      SELECT 
        p.id,
        p.title,
        p.subtitle,
        p.description,
        p.handle,
        p.status,
        p.created_at,
        p.updated_at,
        p.weight,
        p.length,
        p.height,
        p.width,
        p.metadata,
        COUNT(pv.id) as variant_count
      FROM product p
      LEFT JOIN product_variant pv ON p.id = pv.product_id
      WHERE p.deleted_at IS NULL
      GROUP BY p.id, p.title, p.subtitle, p.description, p.handle, p.status, p.created_at, p.updated_at, p.weight, p.length, p.height, p.width, p.metadata
      ORDER BY p.created_at DESC
      LIMIT $1 OFFSET $2
    `;

    const countQuery = `SELECT COUNT(*) as total FROM product`;

    const [result, countResult] = await Promise.all([
      client.query(query, [limit, offset]),
      client.query(countQuery)
    ]);

    await client.end();    const products = result.rows.map(row => ({
      ...row,
      variant_count: parseInt(row.variant_count) || 0
    }));

    const total = parseInt(countResult.rows[0].total);

    console.log(`🔧 [Admin API] Retrieved ${products.length} products for admin (total: ${total})`);

    return NextResponse.json({
      products,
      count: total,
      limit: parseInt(limit),
      offset: parseInt(offset),
      has_more: (parseInt(offset) + parseInt(limit)) < total
    });

  } catch (error) {
    console.error('❌ [Admin API] Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('🔧 [Admin API] Creating new product:', body);

    const client = await getMedusaDbClient();

    const {
      title,
      subtitle,
      description,
      handle,
      status = 'draft',
      weight,
      length,
      height,
      width,
      metadata = {}
    } = body;

    // Generate handle if not provided
    const productHandle = handle || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Check if handle already exists
    const handleCheck = await client.query(
      'SELECT id FROM product WHERE handle = $1',
      [productHandle]
    );

    if (handleCheck.rows.length > 0) {
      await client.end();
      return NextResponse.json(
        { error: 'Product handle already exists' },
        { status: 400 }
      );
    }

    // Insert product
    const insertQuery = `
      INSERT INTO product (
        title, subtitle, description, handle, status, weight, length, height, width, metadata, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
      RETURNING *
    `;

    const result = await client.query(insertQuery, [
      title,
      subtitle,
      description,
      productHandle,
      status,
      weight,
      length,
      height,
      width,
      JSON.stringify(metadata)
    ]);

    await client.end();

    const product = result.rows[0];
    console.log('✅ [Admin API] Product created successfully:', product.id);

    return NextResponse.json(
      { product, message: 'Product created successfully' },
      { status: 201 }
    );

  } catch (error) {
    console.error('❌ [Admin API] Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}


