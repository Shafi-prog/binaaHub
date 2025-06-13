import { NextRequest, NextResponse } from 'next/server';
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
    console.log('🌍 [Store API] Fetching regions...');

    const client = await getMedusaDbClient();
    
    // Query regions from Medusa database
    const query = `
      SELECT 
        r.id,
        r.name,
        r.currency_code,
        r.automatic_taxes,
        r.created_at,
        r.updated_at,
        r.metadata
      FROM region r
      WHERE r.deleted_at IS NULL
      ORDER BY r.created_at DESC
    `;

    const result = await client.query(query);
    await client.end();

    const regions = result.rows;

    console.log(`✅ [Store API] Found ${regions.length} regions`);

    return NextResponse.json({
      regions,
      count: regions.length
    });

  } catch (error) {
    console.error('❌ [Store API] Error fetching regions:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch regions', message: errorMessage },
      { status: 500 }
    );
  }
}
