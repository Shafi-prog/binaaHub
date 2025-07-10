// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { initERPService, generateId } from '@/domains/shared/services/erp/mongodb-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const skip = parseInt(searchParams.get('skip') || '0');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    const erpService = await initERPService();
    
    let filter: any = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { barcode: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) {
      filter.category = category;
    }

    const products = await erpService.getProducts(filter, limit, skip);
    
    return NextResponse.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const erpService = await initERPService();
    
    const productData = {
      ...body,
      id: generateId('PROD-'),
      status: 'active' as const
    };

    const product = await erpService.createProduct(productData);
    
    return NextResponse.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}


