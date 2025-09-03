import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

// Cart model: we reuse orders table with status 'pending' as a cart.
// order_items hold line items. This keeps migration path simple.

export async function GET(req: NextRequest) {
  const client = createClient()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 })
  const { data: order, error } = await client.from('orders').select('*').eq('id', id).single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const { data: items, error: e2 } = await client.from('order_items').select('*').eq('order_id', id)
  if (e2) return NextResponse.json({ error: e2.message }, { status: 500 })
  return NextResponse.json({ cart: order, items })
}

export async function POST(req: NextRequest) {
  const client = createClient()
  const body = await req.json().catch(() => ({}))
  const { customer_id } = body || {}
  if (!customer_id) return NextResponse.json({ error: 'missing customer_id' }, { status: 400 })

  const payload = {
    order_number: `CART-${Date.now()}`,
    customer_id,
    status: 'pending',
    payment_status: 'pending',
    fulfillment_status: 'pending',
    subtotal: 0,
    tax_amount: 0,
    shipping_amount: 0,
    discount_amount: 0,
    total_amount: 0,
  }
  const { data, error } = await client.from('orders').insert(payload).select('*').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ cart: data })
}

export async function PATCH(req: NextRequest) {
  const client = createClient()
  const body = await req.json().catch(() => ({}))
  const { cart_id, product_id, quantity, unit_price } = body || {}
  if (!cart_id || !product_id || typeof quantity !== 'number' || typeof unit_price !== 'number') {
    return NextResponse.json({ error: 'missing cart_id/product_id/quantity/unit_price' }, { status: 400 })
  }
  // basic validation for quantity and price
  if (quantity <= 0) {
    return NextResponse.json({ error: 'quantity must be > 0' }, { status: 400 })
  }
  if (unit_price < 0) {
    return NextResponse.json({ error: 'unit_price must be >= 0' }, { status: 400 })
  }

  // Fetch product snapshot for required fields in order_items (store_id, product_name, product_sku)
  const { data: product, error: pErr } = await client
    .from('products')
    .select('id, name, sku, store_id')
    .eq('id', product_id)
    .single()
  if (pErr || !product) return NextResponse.json({ error: pErr?.message || 'product not found' }, { status: 400 })

  // Upsert line item
  const { data: existing, error: e1 } = await client
    .from('order_items')
    .select('*')
    .eq('order_id', cart_id)
    .eq('product_id', product_id)
    .maybeSingle()
  if (e1) return NextResponse.json({ error: e1.message }, { status: 500 })

  // money helpers: compute in cents (integers), persist/display in decimals
  const toCents = (n: number) => Math.round((n + Number.EPSILON) * 100)
  const fromCents = (c: number) => Math.round((c + Number.EPSILON)) / 100

  let line
  if (existing) {
  const newQty = quantity
  const newTotalCents = toCents(newQty * unit_price)
    const { data: upd, error: e2 } = await client
      .from('order_items')
      .update({
        quantity: newQty,
        unit_price,
    total_price: fromCents(newTotalCents),
        // make sure snapshot columns stay consistent
        store_id: product.store_id,
        product_name: product.name,
        product_sku: product.sku,
      })
      .eq('id', existing.id)
      .select('*')
      .single()
    if (e2) return NextResponse.json({ error: e2.message }, { status: 500 })
    line = upd
  } else {
  const total_price = fromCents(toCents(quantity * unit_price))
    const { data: ins, error: e3 } = await client
      .from('order_items')
      .insert({
        order_id: cart_id,
        product_id,
        store_id: product.store_id,
        quantity,
        unit_price,
        total_price,
        product_name: product.name,
        product_sku: product.sku,
      })
      .select('*')
      .single()
    if (e3) return NextResponse.json({ error: e3.message }, { status: 500 })
    line = ins
  }

  // Recalculate order totals
  const [{ data: items, error: e4 }, { data: orderRow, error: e5 }] = await Promise.all([
    client.from('order_items').select('total_price').eq('order_id', cart_id),
    client.from('orders').select('tax_amount, shipping_amount, discount_amount').eq('id', cart_id).single(),
  ])
  if (e4) return NextResponse.json({ error: e4.message }, { status: 500 })
  if (e5) return NextResponse.json({ error: e5.message }, { status: 500 })

  // recompute totals in cents to avoid FP drift
  const subtotalCents = (items || []).reduce((s: number, it: any) => s + toCents(Number(it.total_price || 0)), 0)
  const taxCents = toCents(Number(orderRow?.tax_amount || 0))
  const shippingCents = toCents(Number(orderRow?.shipping_amount || 0))
  const discountCents = toCents(Number(orderRow?.discount_amount || 0))
  const totalCents = subtotalCents + taxCents + shippingCents - discountCents
  const subtotal = fromCents(subtotalCents)
  const tax_amount = fromCents(taxCents)
  const shipping_amount = fromCents(shippingCents)
  const discount_amount = fromCents(discountCents)
  const total_amount = fromCents(totalCents)
  await client
    .from('orders')
    .update({ subtotal, tax_amount, shipping_amount, discount_amount, total_amount })
    .eq('id', cart_id)

  return NextResponse.json({ line, totals: { subtotal, tax_amount, shipping_amount, discount_amount, total_amount } })
}

export async function DELETE(req: NextRequest) {
  const client = createClient()
  const { searchParams } = new URL(req.url)
  const lineId = searchParams.get('lineId')
  const cartId = searchParams.get('cartId')
  if (!lineId || !cartId) return NextResponse.json({ error: 'missing cartId/lineId' }, { status: 400 })
  const { error } = await client.from('order_items').delete().eq('id', lineId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Recalculate totals
  const [{ data: items, error: e4 }, { data: orderRow, error: e5 }] = await Promise.all([
    client.from('order_items').select('total_price').eq('order_id', cartId),
    client.from('orders').select('tax_amount, shipping_amount, discount_amount').eq('id', cartId).single(),
  ])
  if (e4) return NextResponse.json({ error: e4.message }, { status: 500 })
  if (e5) return NextResponse.json({ error: e5.message }, { status: 500 })
  const toCentsDel = (n: number) => Math.round((n + Number.EPSILON) * 100)
  const fromCentsDel = (c: number) => Math.round((c + Number.EPSILON)) / 100
  const subtotalCentsDel = (items || []).reduce((s: number, it: any) => s + toCentsDel(Number(it.total_price || 0)), 0)
  const taxCentsDel = toCentsDel(Number(orderRow?.tax_amount || 0))
  const shippingCentsDel = toCentsDel(Number(orderRow?.shipping_amount || 0))
  const discountCentsDel = toCentsDel(Number(orderRow?.discount_amount || 0))
  const totalCentsDel = subtotalCentsDel + taxCentsDel + shippingCentsDel - discountCentsDel
  const subtotalDel = fromCentsDel(subtotalCentsDel)
  const tax_amount = fromCentsDel(taxCentsDel)
  const shipping_amount = fromCentsDel(shippingCentsDel)
  const discount_amount = fromCentsDel(discountCentsDel)
  const total_amount = fromCentsDel(totalCentsDel)
  await client.from('orders').update({ subtotal: subtotalDel, tax_amount, shipping_amount, discount_amount, total_amount }).eq('id', cartId)

  return NextResponse.json({ ok: true })
}
