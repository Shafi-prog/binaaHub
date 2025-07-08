// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { ConstructionProduct } from '@/types/construction';

// GET /api/products/construction
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'ar';
    const categoryId = searchParams.get('category_id');
    const search = searchParams.get('search');
    const barcode = searchParams.get('barcode');
    const includeInactive = searchParams.get('include_inactive') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('construction_products')
      .select(`
        *,
        construction_categories!inner(
          id,
          name_ar,
          name_en
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (!includeInactive) {
      query = query.eq('is_active', true);
    }

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    if (barcode) {
      query = query.or(`barcode.eq.${barcode},alternative_barcodes.cs.{${barcode}}`);
    }

    if (search) {
      const searchTerm = `%${search}%`;
      if (language === 'ar') {
        query = query.or(`name_ar.ilike.${searchTerm},description_ar.ilike.${searchTerm},sku.ilike.${searchTerm}`);
      } else {
        query = query.or(`name_en.ilike.${searchTerm},description_en.ilike.${searchTerm},sku.ilike.${searchTerm}`);
      }
    }

    const { data: products, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('construction_products')
      .select('*', { count: 'exact', head: true });

    if (!includeInactive) {
      countQuery = countQuery.eq('is_active', true);
    }

    if (categoryId) {
      countQuery = countQuery.eq('category_id', categoryId);
    }

    if (barcode) {
      countQuery = countQuery.or(`barcode.eq.${barcode},alternative_barcodes.cs.{${barcode}}`);
    }

    if (search) {
      const searchTerm = `%${search}%`;
      if (language === 'ar') {
        countQuery = countQuery.or(`name_ar.ilike.${searchTerm},description_ar.ilike.${searchTerm},sku.ilike.${searchTerm}`);
      } else {
        countQuery = countQuery.or(`name_en.ilike.${searchTerm},description_en.ilike.${searchTerm},sku.ilike.${searchTerm}`);
      }
    }

    const { count } = await countQuery;

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/products/construction
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name_ar,
      name_en,
      description_ar,
      description_en,
      sku,
      barcode,
      alternative_barcodes,
      category_id,
      brand_ar,
      brand_en,
      model,
      saudi_standard,
      gsi_classification,
      specifications,
      unit_of_measure,
      minimum_stock,
      maximum_stock,
      reorder_level,
      current_stock,
      cost_price,
      selling_price,
      wholesale_price,
      currency = 'SAR',
      vat_rate = 15,
      images,
      technical_sheet_url,
      safety_datasheet_url,
      is_hazardous = false,
      requires_certification = false
    } = body;

    // Validation
    if (!name_ar || name_ar.trim().length === 0) {
      return NextResponse.json({ error: 'Arabic name is required' }, { status: 400 });
    }

    if (!sku || sku.trim().length === 0) {
      return NextResponse.json({ error: 'SKU is required' }, { status: 400 });
    }

    if (!category_id) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    if (!unit_of_measure) {
      return NextResponse.json({ error: 'Unit of measure is required' }, { status: 400 });
    }

    if (selling_price === undefined || selling_price < 0) {
      return NextResponse.json({ error: 'Valid selling price is required' }, { status: 400 });
    }

    // Check if SKU already exists
    const { data: existingSku } = await supabase
      .from('construction_products')
      .select('id')
      .eq('sku', sku.trim())
      .single();

    if (existingSku) {
      return NextResponse.json({ error: 'SKU already exists' }, { status: 409 });
    }

    // Check if barcode already exists (if provided)
    if (barcode) {
      const { data: existingBarcode } = await supabase
        .from('construction_products')
        .select('id')
        .eq('barcode', barcode)
        .single();

      if (existingBarcode) {
        return NextResponse.json({ error: 'Barcode already exists' }, { status: 409 });
      }
    }

    // Generate ID
    const productId = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const productData = {
      id: productId,
      name_ar: name_ar.trim(),
      name_en: name_en?.trim() || null,
      description_ar: description_ar?.trim() || null,
      description_en: description_en?.trim() || null,
      sku: sku.trim().toUpperCase(),
      barcode: barcode || null,
      alternative_barcodes: alternative_barcodes || [],
      category_id,
      brand_ar: brand_ar?.trim() || null,
      brand_en: brand_en?.trim() || null,
      model: model?.trim() || null,
      saudi_standard: saudi_standard?.trim() || null,
      gsi_classification: gsi_classification?.trim() || null,
      specifications: specifications || {},
      unit_of_measure: unit_of_measure.trim(),
      minimum_stock: minimum_stock || 0,
      maximum_stock: maximum_stock || null,
      reorder_level: reorder_level || null,
      current_stock: current_stock || 0,
      cost_price: cost_price || null,
      selling_price,
      wholesale_price: wholesale_price || null,
      currency,
      vat_rate,
      images: images || [],
      technical_sheet_url: technical_sheet_url || null,
      safety_datasheet_url: safety_datasheet_url || null,
      is_active: true,
      is_hazardous,
      requires_certification,
      created_by: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: product, error } = await supabase
      .from('construction_products')
      .insert([productData])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      product,
      message: 'Product created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/products/construction
export async function PUT(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Check if product exists
    const { data: existingProduct } = await supabase
      .from('construction_products')
      .select('*')
      .eq('id', id)
      .single();

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // If SKU is being updated, check for duplicates
    if (updateData.sku && updateData.sku !== existingProduct.sku) {
      const { data: duplicateSku } = await supabase
        .from('construction_products')
        .select('id')
        .eq('sku', updateData.sku.trim())
        .neq('id', id)
        .single();

      if (duplicateSku) {
        return NextResponse.json({ error: 'SKU already exists' }, { status: 409 });
      }
    }

    // If barcode is being updated, check for duplicates
    if (updateData.barcode && updateData.barcode !== existingProduct.barcode) {
      const { data: duplicateBarcode } = await supabase
        .from('construction_products')
        .select('id')
        .eq('barcode', updateData.barcode)
        .neq('id', id)
        .single();

      if (duplicateBarcode) {
        return NextResponse.json({ error: 'Barcode already exists' }, { status: 409 });
      }
    }

    const finalUpdateData = {
      ...updateData,
      updated_at: new Date().toISOString()
    };

    const { data: product, error } = await supabase
      .from('construction_products')
      .update(finalUpdateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/products/construction
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Check if product exists
    const { data: existingProduct } = await supabase
      .from('construction_products')
      .select('*')
      .eq('id', id)
      .single();

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Soft delete by setting is_active to false
    const { error } = await supabase
      .from('construction_products')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


