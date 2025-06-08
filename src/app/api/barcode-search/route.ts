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
    const location = searchParams.get('location') // user location for nearby stores

    if (!barcode) {
      return NextResponse.json(
        { error: 'Barcode is required' },
        { status: 400 }
      )
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
        )
      `)
      .eq('barcode', barcode)
      .single()

    if (globalItemError || !globalItem) {
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
