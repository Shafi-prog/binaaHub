import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '50';
    const offset = searchParams.get('offset') || '0';

    const medusaBackendUrl = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000';
    
    const response = await fetch(`${medusaBackendUrl}/admin/products?limit=${limit}&offset=${offset}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MEDUSA_ADMIN_TOKEN || ''}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Medusa API returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching admin products from Medusa:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin products' },
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
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating admin product in Medusa:', error);
    return NextResponse.json(
      { error: 'Failed to create admin product' },
      { status: 500 }
    );
  }
}
