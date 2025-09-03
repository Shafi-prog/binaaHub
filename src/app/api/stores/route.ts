import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

// GET /api/stores?search=term
// Returns a normalized list of stores from Supabase.
export async function GET(req: NextRequest) {
  const client = createClient()
  const { searchParams } = new URL(req.url)
  const search = (searchParams.get('search') || '').trim()

  // Try primary table first, then fallback schema if present
  const tryQuery = async (from: string) => {
    let qb: any = client.from(from).select('*').limit(50)
    if (search) {
      const pattern = `%${search}%`
      // Try common fields if available
      qb = qb.or(`name.ilike.${pattern},store_name.ilike.${pattern},city.ilike.${pattern},location.ilike.${pattern}`)
    }
    return qb
  }

  try {
    let { data, error } = await tryQuery('stores')
    if (error) {
      const second = await tryQuery('marketplace.stores')
      data = second.data
      error = second.error
      if (error) return NextResponse.json({ stores: [], error: error.message }, { status: 400 })
    }

    const stores = (data || []).map((s: any) => ({
      id: s.id,
      name: s.name || s.store_name || 'Store',
      location: s.city || s.location || null,
      rating: typeof s.rating === 'number' ? s.rating : null,
      hours: s.hours || null,
    }))

    return NextResponse.json({ stores })
  } catch (e: any) {
    return NextResponse.json({ stores: [], error: e?.message || 'unknown' }, { status: 500 })
  }
}
