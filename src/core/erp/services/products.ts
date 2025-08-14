import { createClient } from '@supabase/supabase-js'

export interface ErpProduct {
  id: string
  name: string
  description?: string | null
  price: number
  image_url?: string | null
  sku?: string | null
  store_id: string
  created_at?: string
  updated_at?: string
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error('SUPABASE_ENV_MISSING')
  }
  return createClient(url, key)
}

export async function listProducts(limit = 50, offset = 0): Promise<{ products: ErpProduct[]; count: number }> {
  const supabase = getSupabase()
  const { data, error, count } = await supabase
    .from('products')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('ERP listProducts error:', error)
    return { products: [], count: 0 }
  }
  return { products: (data as ErpProduct[]) || [], count: count ?? 0 }
}

export async function searchProducts(query: string, limit = 50, offset = 0): Promise<ErpProduct[]> {
  const supabase = getSupabase()
  if (!query) return (await listProducts(limit, offset)).products
  const like = `%${query}%`
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.${like},description.ilike.${like}`)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('ERP searchProducts error:', error)
    return []
  }
  return (data as ErpProduct[]) || []
}

export async function getProduct(id: string): Promise<ErpProduct | null> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('ERP getProduct error:', error)
    return null
  }
  return (data as ErpProduct) || null
}
