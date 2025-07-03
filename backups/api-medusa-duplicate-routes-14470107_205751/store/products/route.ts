import { NextRequest, NextResponse } from 'next/server';

// For now, let's use the existing store API approach and proxy to the unified medusa client
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '10';
    const offset = searchParams.get('offset') || '0';

    // Use the existing integrated approach with medusa-client
    const medusaBackendUrl = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000';
    
    const response = await fetch(`${medusaBackendUrl}/store/products?limit=${limit}&offset=${offset}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Medusa API returned ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      products: data.products || [],
      count: data.count || 0,
      offset: parseInt(offset),
      limit: parseInt(limit),
    });
  } catch (error) {
    console.error('Error fetching products from Medusa:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const medusaBackendUrl = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000';

    const response = await fetch(`${medusaBackendUrl}/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MEDUSA_ADMIN_TOKEN || ''}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Medusa API returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ product: data.product });
  } catch (error) {
    console.error('Error creating product in Medusa:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
