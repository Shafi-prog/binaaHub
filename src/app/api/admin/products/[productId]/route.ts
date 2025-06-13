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

// GET - Get specific product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    console.log('🔧 [Admin API] Fetching product:', productId);

    const client = await getMedusaDbClient();
    
    const query = `
      SELECT 
        p.*,
        COUNT(pv.id) as variant_count
      FROM product p
      LEFT JOIN product_variant pv ON p.id = pv.product_id
      WHERE p.id = $1
      GROUP BY p.id
    `;

    const result = await client.query(query, [productId]);
    await client.end();

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const product = {
      ...result.rows[0],
      variant_count: parseInt(result.rows[0].variant_count) || 0
    };

    console.log('✅ [Admin API] Product retrieved:', product.title);

    return NextResponse.json({ product });

  } catch (error) {
    console.error('❌ [Admin API] Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const body = await request.json();
    console.log('🔧 [Admin API] Updating product:', productId, body);

    const client = await getMedusaDbClient();

    // Check if product exists
    const existingProduct = await client.query(
      'SELECT id FROM product WHERE id = $1',
      [productId]
    );

    if (existingProduct.rows.length === 0) {
      await client.end();
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const {
      title,
      subtitle,
      description,
      handle,
      status,
      weight,
      length,
      height,
      width,
      metadata
    } = body;

    // If handle is being updated, check for conflicts
    if (handle) {
      const handleCheck = await client.query(
        'SELECT id FROM product WHERE handle = $1 AND id != $2',
        [handle, productId]
      );

      if (handleCheck.rows.length > 0) {
        await client.end();
        return NextResponse.json(
          { error: 'Product handle already exists' },
          { status: 400 }
        );
      }
    }

    // Build update query dynamically
    const updateFields = [];
    const values = [];
    let valueIndex = 1;

    if (title !== undefined) {
      updateFields.push(`title = $${valueIndex++}`);
      values.push(title);
    }
    if (subtitle !== undefined) {
      updateFields.push(`subtitle = $${valueIndex++}`);
      values.push(subtitle);
    }
    if (description !== undefined) {
      updateFields.push(`description = $${valueIndex++}`);
      values.push(description);
    }
    if (handle !== undefined) {
      updateFields.push(`handle = $${valueIndex++}`);
      values.push(handle);
    }
    if (status !== undefined) {
      updateFields.push(`status = $${valueIndex++}`);
      values.push(status);
    }
    if (weight !== undefined) {
      updateFields.push(`weight = $${valueIndex++}`);
      values.push(weight);
    }
    if (length !== undefined) {
      updateFields.push(`length = $${valueIndex++}`);
      values.push(length);
    }
    if (height !== undefined) {
      updateFields.push(`height = $${valueIndex++}`);
      values.push(height);
    }
    if (width !== undefined) {
      updateFields.push(`width = $${valueIndex++}`);
      values.push(width);
    }
    if (metadata !== undefined) {
      updateFields.push(`metadata = $${valueIndex++}`);
      values.push(JSON.stringify(metadata));
    }

    updateFields.push(`updated_at = NOW()`);
    values.push(productId);

    const updateQuery = `
      UPDATE product 
      SET ${updateFields.join(', ')}
      WHERE id = $${valueIndex}
      RETURNING *
    `;

    const result = await client.query(updateQuery, values);
    await client.end();

    const product = result.rows[0];
    console.log('✅ [Admin API] Product updated successfully:', product.title);

    return NextResponse.json(
      { product, message: 'Product updated successfully' }
    );

  } catch (error) {
    console.error('❌ [Admin API] Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    console.log('🔧 [Admin API] Deleting product:', productId);

    const client = await getMedusaDbClient();

    // Check if product exists
    const existingProduct = await client.query(
      'SELECT id, title FROM product WHERE id = $1',
      [productId]
    );

    if (existingProduct.rows.length === 0) {
      await client.end();
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const productTitle = existingProduct.rows[0].title;

    // Delete related data first (variants, etc.)
    await client.query('DELETE FROM product_variant WHERE product_id = $1', [productId]);
    
    // Delete the product
    await client.query('DELETE FROM product WHERE id = $1', [productId]);
    
    await client.end();

    console.log('✅ [Admin API] Product deleted successfully:', productTitle);

    return NextResponse.json({
      message: 'Product deleted successfully',
      deleted_product: { id: productId, title: productTitle }
    });

  } catch (error) {
    console.error('❌ [Admin API] Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
