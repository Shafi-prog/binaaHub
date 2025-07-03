import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const medusaBackendUrl = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000';
    
    const response = await fetch(`${medusaBackendUrl}/store/regions`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Medusa API returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching regions from Medusa:', error);
    return NextResponse.json(
      { error: 'Failed to fetch regions' },
      { status: 500 }
    );
  }
}
