export {}

jest.mock('@supabase/supabase-js', () => ({
  createClient: (_url: string, _key: string) => ({
    from: (table: string) => mockMakeBuilder(table as any),
  }),
}))

type ProductRow = Record<string, any>
const db = {
  products: new Map<string, ProductRow>(),
}
// allow simulating errors in certain paths
let mockErrorMode: 'none' | 'list' | 'search' | 'get' = 'none'

function mockMakeBuilder(table: keyof typeof db) {
  const state: any = { filters: {}, order: null as any, range: [0, Infinity] }
  const rowsFiltered = () =>
    [...db[table].values()].filter((r) => Object.entries(state.filters).every(([k, v]) => r[k] === v))

  const api: any = {
    select: (_cols?: string, opts?: any) => {
      api._count = opts?.count ? () => rowsFiltered().length : undefined
      return api
    },
    order: (_col: string, _opt: any) => api,
    range: (from: number, to: number) => {
      state.range = [from, to]
      return api
    },
    or: (expr: string) => {
      // simple ilike support: name.ilike.%q%,description.ilike.%q%
      const m = expr.match(/\.ilike\.%([^%]+)%/)
      const q = m ? m[1].toLowerCase() : ''
      api._or = q
      return api
    },
    eq: (col: string, val: any) => {
      state.filters[col] = val
      return api
    },
    single: async () => {
      if (mockErrorMode === 'get') {
        return { data: null, error: { message: 'get error' } }
      }
      const rows = rowsFiltered()
      return { data: rows[0] || null, error: null }
    },
    then: (resolve: any) => {
      // simulate errors
      if (mockErrorMode === 'list' && !api._or) {
        return resolve({ data: null, error: { message: 'list error' }, count: undefined })
      }
      if (mockErrorMode === 'search' && api._or) {
        return resolve({ data: null, error: { message: 'search error' } })
      }
      let rows = rowsFiltered()
      if (api._or) {
        const q = api._or
        rows = rows.filter((r) =>
          (r.name?.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q))
        )
      }
      const [from, to] = state.range
      rows = rows.slice(from, to + 1)
      const result: any = { data: rows, error: null }
      if (api._count) result.count = api._count()
      return resolve(result)
    },
  }
  return api
}

// set env before importing module
const OLD_ENV = process.env
beforeAll(() => {
  process.env = { ...OLD_ENV, NEXT_PUBLIC_SUPABASE_URL: 'http://local', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'key' }
})
afterAll(() => {
  process.env = OLD_ENV
})

const { listProducts, getProduct, searchProducts } = require('../products')

describe('ERP products service', () => {
  beforeEach(() => {
    db.products.clear()
    db.products.set('p1', { id: 'p1', name: 'Hammer', description: 'Steel hammer', price: 10, store_id: 's1' })
    db.products.set('p2', { id: 'p2', name: 'Screwdriver', description: 'Flat head', price: 5, store_id: 's1' })
    db.products.set('p3', { id: 'p3', name: 'Drill', description: 'Power drill', price: 100, store_id: 's2' })
  mockErrorMode = 'none'
  })

  test('listProducts returns paginated list and count', async () => {
    const res = await listProducts(2, 0)
    expect(res.products.length).toBe(2)
    expect(typeof res.count).toBe('number')
    expect(res.count).toBe(3)
  })

  test('listProducts respects offset/limit at boundary', async () => {
    const res = await listProducts(2, 2)
    expect(res.products.length).toBe(1)
  })

  test('searchProducts filters by ilike on name/description', async () => {
    const res = await searchProducts('drill', 50, 0)
    expect(res.map((p: any) => p.id)).toEqual(['p3'])
  })

  test('searchProducts with empty query returns list fallback', async () => {
    const all = await listProducts(50, 0)
    const res = await searchProducts('', 50, 0)
    expect(res.length).toBe(all.products.length)
  })

  test('getProduct returns a single product or null', async () => {
    const p = await getProduct('p2')
    expect(p?.name).toBe('Screwdriver')
    const n = await getProduct('nope')
    expect(n).toBeNull()
  })

  test('handles supabase errors: list/search/get', async () => {
    mockErrorMode = 'list'
    const l = await listProducts(10, 0)
    expect(l.products.length).toBe(0)
    expect(l.count).toBe(0)
    mockErrorMode = 'search'
    const s = await searchProducts('hammer', 10, 0)
    expect(s).toEqual([])
    mockErrorMode = 'get'
    const g = await getProduct('p1')
    expect(g).toBeNull()
  })
})
