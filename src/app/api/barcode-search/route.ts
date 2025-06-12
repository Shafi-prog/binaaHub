import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const barcode = searchParams.get('barcode')
    const storeId = searchParams.get('store_id') // For store-specific searches
    const location = searchParams.get('location') // user location for nearby stores

    if (!barcode) {
      return NextResponse.json(
        { error: 'Barcode is required' },
        { status: 400 }
      )
    }

    // If store_id is provided, search for store's own products first
    if (storeId) {
      // Search in store's own products table
      const { data: storeProducts, error: storeProductsError } = await supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          price,
          barcode,
          sku,
          category,
          brand,
          stock_quantity,
          tax_rate,
          is_active,
          image_url,
          cost_price,
          min_stock_level,
          created_at,
          updated_at
        `)
        .eq('store_id', storeId)
        .eq('is_active', true)
        .or(`barcode.eq.${barcode},sku.eq.${barcode},name.ilike.%${barcode}%`)
        .limit(10)

      if (!storeProductsError && storeProducts && storeProducts.length > 0) {
        return NextResponse.json({
          success: true,
          source: 'store_inventory',
          products: storeProducts.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            barcode: product.barcode || product.sku,
            stock_quantity: product.stock_quantity,
            category: product.category,
            brand: product.brand,
            tax_rate: product.tax_rate || 0.15,
            is_active: product.is_active,
            image_url: product.image_url,
            cost_price: product.cost_price,
            profit_margin: product.cost_price ? ((product.price - product.cost_price) / product.cost_price * 100).toFixed(2) : null
          }))
        })
      }
    }

    // Search for global item with this barcode
    const { data: globalItem, error: globalItemError } = await supabase
      .from('global_items')
      .select(`
        *,
        store_inventory (
          store_id,
          price,
          quantity_available,
          store:stores (
            id,
            name,
            location,
            contact_phone,
            email
          )
        )      `)
      .eq('barcode', barcode)
      .single()

    if (globalItemError || !globalItem) {
      // If no global item found, try searching products by name/description
      if (storeId) {
        return NextResponse.json({
          success: false,
          message: `لم يتم العثور على منتج بالباركود: ${barcode}`,
          suggestions: [],
          canCreateNew: true
        })
      }
      
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    // Filter out stores with no inventory
    const availableStores = globalItem.store_inventory.filter(
      (inventory: any) => inventory.quantity_available > 0
    )

    if (availableStores.length === 0) {
      return NextResponse.json(
        { 
          item: globalItem,
          message: 'Item found but not available in any store',
          availableStores: []
        }
      )
    }

    // Sort by price if no location provided, otherwise by distance (simplified)
    let sortedStores = availableStores
    if (location) {
      // In a real implementation, you'd calculate actual distances
      // For now, just randomize to simulate distance sorting
      sortedStores = availableStores.sort(() => Math.random() - 0.5)
    } else {
      sortedStores = availableStores.sort((a: any, b: any) => a.price - b.price)
    }

    return NextResponse.json({
      item: {
        id: globalItem.id,
        barcode: globalItem.barcode,
        name: globalItem.name,
        description: globalItem.description,
        category: globalItem.category,
        brand: globalItem.brand,
        specifications: globalItem.specifications,
        image_url: globalItem.image_url,
        warranty_period_months: globalItem.warranty_period_months
      },
      availableStores: sortedStores.map((inventory: any) => ({
        store: inventory.store,
        price: inventory.price,
        quantity: inventory.quantity_available,
        storeInventoryId: inventory.store_id
      }))
    })
  } catch (error) {
    console.error('Barcode search error:', error)
    return NextResponse.json(
      { error: 'Failed to search for item' },
      { status: 500 }
    )
  }
}
