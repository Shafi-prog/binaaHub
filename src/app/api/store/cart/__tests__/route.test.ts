// Mock Next.js server response helper
export {}

jest.mock('next/server', () => ({
  NextResponse: { json: (body: any, init?: any) => ({ __json: body, __init: init }) },
}))

// In-memory fake Supabase for orders/order_items/products
type Row = Record<string, any>
const mockDb = {
  orders: new Map<string, Row>(),
  order_items: new Map<string, Row>(),
  products: new Map<string, Row>(),
}
let mockIdSeq = 1
const mockNewId = () => String(mockIdSeq++)

function mockMakeBuilder(table: keyof typeof mockDb) {
  const state: any = { filters: {}, update: null, insert: null, selectCols: '*' }
  const rowsFiltered = () =>
    [...mockDb[table].values()].filter((r) =>
      Object.entries(state.filters).every(([k, v]) => r[k] === v)
    )
  const api: any = {
    select: (cols?: string) => {
      state.selectCols = cols || '*'
      return api
    },
    eq: (col: string, val: any) => {
      state.filters[col] = val
      return api
    },
    or: (_expr: string) => api,
    gt: (_col: string, _val: any) => api,
    single: async () => {
      const rows = rowsFiltered()
      if (!rows.length) return { data: null, error: { message: 'not found' } }
      return { data: rows[0], error: null }
    },
    maybeSingle: async () => {
      const rows = rowsFiltered()
      return { data: rows[0] || null, error: null }
    },
    insert: (payload: any) => {
      state.insert = payload
      return {
        select: () => ({
          single: async () => {
            const row = { id: mockNewId(), ...payload }
            mockDb[table].set(row.id, row)
            return { data: row, error: null }
          },
        }),
      }
    },
    update: (payload: any) => {
      state.update = payload
      return {
        eq: (col: string, val: any) => {
          state.filters[col] = val
          // apply update to all matching rows immediately
          const rows = rowsFiltered()
          const updatedRows: any[] = []
          for (const r of rows) {
            const next = { ...r, ...payload }
            mockDb[table].set(next.id, next)
            updatedRows.push(next)
          }
          // support both `await ...update().eq()` and `...select().single()` chains
          return {
            select: () => ({
              single: async () => {
                if (!updatedRows.length) return { data: null, error: { message: 'not found' } }
                return { data: updatedRows[0], error: null }
              },
            }),
            then: (resolve: any) => resolve({ data: updatedRows, error: null }),
          }
        },
      }
    },
    delete: () => ({
      eq: async (_col: string, val: any) => {
        mockDb[table].delete(val)
        return { data: null, error: null }
      },
    }),
    // allow awaiting the builder to fetch a list of rows
    then: (resolve: any) => resolve({ data: rowsFiltered(), error: null }),
  }
  return api
}

jest.mock('@/lib/supabase/client', () => {
  return {
    createClient: () => ({
      from: (table: string) => mockMakeBuilder(table as any),
    }),
  }
})

const route = require('../route')

describe('/api/store/cart route', () => {
  beforeEach(() => {
  mockDb.orders.clear()
  mockDb.order_items.clear()
  mockDb.products.clear()
  mockIdSeq = 1
    // seed one product
    const productId = 'prod-1'
  mockDb.products.set(productId, { id: productId, name: 'Test', sku: 'SKU1', store_id: 'store-1' })
  })

  const makeUrl = (path: string, qs: Record<string, any> = {}) => {
    const p = new URLSearchParams(qs as any)
    return `http://localhost${path}${p.toString() ? `?${p.toString()}` : ''}`
  }

  test('POST creates a new cart for a customer', async () => {
  const res = await route.POST({ json: async () => ({ customer_id: 'cust-1' }) } as any)
    expect(res.__json.cart).toBeTruthy()
    expect(res.__json.cart.customer_id).toBe('cust-1')
    expect(res.__json.cart.status).toBe('pending')
  })

  test('GET requires id param', async () => {
  const res = await route.GET({ url: makeUrl('/api/store/cart') } as any)
    expect(res.__init?.status).toBe(400)
  })

  test('PATCH adds a line item and recalculates totals', async () => {
    // create cart first
  const post = await route.POST({ json: async () => ({ customer_id: 'cust-1' }) } as any)
    const cartId = post.__json.cart.id
    // add line
  const res = await route.PATCH({ json: async () => ({ cart_id: cartId, product_id: 'prod-1', quantity: 2, unit_price: 50 }) } as any)
    expect(res.__json.line).toBeTruthy()
    expect(res.__json.totals.subtotal).toBe(100)
    // totals stored on order row
  const order = [...mockDb.orders.values()].find((o) => o.id === cartId)!
    expect(order.total_amount).toBe(100)
  })

  test('PATCH rejects zero/negative quantity and negative price', async () => {
    const post = await route.POST({ json: async () => ({ customer_id: 'cust-1' }) } as any)
    const cartId = post.__json.cart.id
    const zeroQty = await route.PATCH({ json: async () => ({ cart_id: cartId, product_id: 'prod-1', quantity: 0, unit_price: 10 }) } as any)
    expect(zeroQty.__init?.status).toBe(400)
    const negQty = await route.PATCH({ json: async () => ({ cart_id: cartId, product_id: 'prod-1', quantity: -1, unit_price: 10 }) } as any)
    expect(negQty.__init?.status).toBe(400)
    const negPrice = await route.PATCH({ json: async () => ({ cart_id: cartId, product_id: 'prod-1', quantity: 1, unit_price: -5 }) } as any)
    expect(negPrice.__init?.status).toBe(400)
  })

  test('PATCH fails for non-existent product', async () => {
    const post = await route.POST({ json: async () => ({ customer_id: 'cust-1' }) } as any)
    const cartId = post.__json.cart.id
    const res = await route.PATCH({ json: async () => ({ cart_id: cartId, product_id: 'nope', quantity: 1, unit_price: 10 }) } as any)
    expect(res.__init?.status).toBe(400)
  })

  test('PATCH handles multiple lines and honors tax/shipping/discount in totals', async () => {
    const post = await route.POST({ json: async () => ({ customer_id: 'cust-1' }) } as any)
    const cartId = post.__json.cart.id
    // seed extra product
    mockDb.products.set('prod-2', { id: 'prod-2', name: 'P2', sku: 'SKU2', store_id: 'store-1' })
    // add two lines
    await route.PATCH({ json: async () => ({ cart_id: cartId, product_id: 'prod-1', quantity: 1, unit_price: 19.99 }) } as any)
    await route.PATCH({ json: async () => ({ cart_id: cartId, product_id: 'prod-2', quantity: 3, unit_price: 5 }) } as any)
    // manually set taxes/shipping/discount on order
    const order = [...mockDb.orders.values()].find((o) => o.id === cartId)!
    order.tax_amount = 2
    order.shipping_amount = 10
    order.discount_amount = 1
    mockDb.orders.set(order.id, order)
    // trigger recompute via a quantity change
    const res = await route.PATCH({ json: async () => ({ cart_id: cartId, product_id: 'prod-2', quantity: 2, unit_price: 5 }) } as any)
    const totals = res.__json.totals
    // subtotal: 19.99 + (2*5) = 29.99 -> rounded to 29.99
    expect(totals.subtotal).toBe(29.99)
  expect(totals.total_amount).toBeCloseTo(29.99 + 2 + 10 - 1, 2)
  })

  test('DELETE removes a line item and recalculates totals', async () => {
  const post = await route.POST({ json: async () => ({ customer_id: 'cust-1' }) } as any)
    const cartId = post.__json.cart.id
  const add = await route.PATCH({ json: async () => ({ cart_id: cartId, product_id: 'prod-1', quantity: 2, unit_price: 30 }) } as any)
    const lineId = add.__json.line.id
  const res = await route.DELETE({ url: makeUrl('/api/store/cart', { cartId, lineId }) } as any)
    expect(res.__json.ok).toBe(true)
    // totals go to 0
  const order = [...mockDb.orders.values()].find((o) => o.id === cartId)!
    expect(order.total_amount).toBe(0)
  })

  test('DELETE validates missing params', async () => {
    const res = await route.DELETE({ url: makeUrl('/api/store/cart') } as any)
    expect(res.__init?.status).toBe(400)
  })
})
