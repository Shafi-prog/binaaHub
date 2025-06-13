import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Connect to Medusa database directly
import { Client } from 'pg';

async function getMedusaDbClient() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  await client.connect();
  return client;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '20';
    const offset = searchParams.get('offset') || '0';
    const order = searchParams.get('order') || '-created_at';
    const title = searchParams.get('title');
    const handle = searchParams.get('handle');
    const collection_id = searchParams.get('collection_id');

    console.log('🛍️ [Store API] Fetching products...');

    const client = await getMedusaDbClient();
    
    // Build WHERE conditions
    let whereConditions = [
      'p.deleted_at IS NULL',
      'p.status = \'published\''
    ];
    const queryParams = [limit, offset];
    let paramIndex = 3;

    // Add search filters
    if (title) {
      whereConditions.push(`p.title ILIKE $${paramIndex}`);
      queryParams.push(`%${title}%`);
      paramIndex++;
    }

    if (handle) {
      whereConditions.push(`p.handle = $${paramIndex}`);
      queryParams.push(handle);
      paramIndex++;
    }

    if (collection_id) {
      whereConditions.push(`p.collection_id = $${paramIndex}`);
      queryParams.push(collection_id);
      paramIndex++;
    }

    // Build ORDER BY clause
    let orderBy = 'ORDER BY p.created_at DESC';
    if (order) {
      const isDesc = order.startsWith('-');
      const field = isDesc ? order.substring(1) : order;
      const direction = isDesc ? 'DESC' : 'ASC';
      
      // Validate field to prevent SQL injection
      const allowedFields = ['created_at', 'updated_at', 'title', 'handle'];
      if (allowedFields.includes(field)) {
        orderBy = `ORDER BY p.${field} ${direction}`;
      }
    }

    // Query products from Medusa database
    const query = `
      SELECT 
        p.id,
        p.title,
        p.subtitle,
        p.description,
        p.handle,
        p.status,
        p.thumbnail,
        p.weight,
        p.length,
        p.height,
        p.width,
        p.hs_code,
        p.origin_country,
        p.mid_code,
        p.material,
        p.collection_id,
        p.type_id,
        p.discountable,
        p.external_id,
        p.created_at,
        p.updated_at,
        p.metadata
      FROM product p
      WHERE ${whereConditions.join(' AND ')}
      ${orderBy}
      LIMIT $1 OFFSET $2
    `;

    const result = await client.query(query, queryParams);
    
    // Get total count for pagination with same filters
    const countQuery = `
      SELECT COUNT(*) as total
      FROM product p
      WHERE ${whereConditions.join(' AND ')}
    `;
    const countResult = await client.query(countQuery, queryParams.slice(2));
    const totalCount = parseInt(countResult.rows[0]?.total || '0');
    
    await client.end();

    const products = result.rows;

    console.log(`✅ [Store API] Found ${products.length} products`);

    // Return response in Medusa Store API format
    return NextResponse.json({
      products,
      count: totalCount,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('❌ [Store API] Error fetching products:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch products', message: errorMessage },
      { status: 500 }
    );
  }
}
