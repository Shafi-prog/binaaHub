import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { data, error } = await supabase.from('construction_projects').select('*').order('created_at', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ projects: data || [] })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unknown' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Create a simple supabase client - auth will be handled by RLS
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Try to get authenticated user id from auth cookie if present
    let userId: string | null = null
    try {
      const authCookieStore = await cookies()
      const supabaseAccessToken = (authCookieStore as any)?.get?.('sb-access-token')?.value
      if (supabaseAccessToken) {
        // We don't have a server helper here, but some proxies set user in JWT; keep placeholder
        // Prefer explicit user_id in body if provided
      }
    } catch {}
    userId = body.user_id || body.customer_id || userId || null
    if (!userId && process.env.NEXT_PUBLIC_ALLOW_DEMO_FALLBACK === 'true') {
      // final fallback for demo only (gated by env)
      userId = '00000000-0000-0000-0000-000000000000'
    }

    // Build two shapes to support both schemas
    const insertA: any = {
      user_id: userId,
      project_name: body.name || body.project_name || '',
      description: body.description ?? null,
      status: body.status ?? 'planning',
      location: body.location ?? null,
      budget: body.estimated_cost ?? body.budget ?? 0,
      project_type: body.type ?? body.project_type ?? 'residential',
    }
    const insertB: any = {
      user_id: userId,
      name: body.name || body.project_name || '',
      description: body.description ?? null,
      status: body.status ?? 'planning',
      location: body.location ?? null,
      budget: body.estimated_cost ?? body.budget ?? 0,
      project_type: body.type ?? body.project_type ?? 'residential',
    }

    // If lat/lng provided, include coordinates in location as JSON
    if (body.latitude && body.longitude) {
      const locationData = {
        address: body.location || '',
        coordinates: {
          lat: parseFloat(body.latitude),
          lng: parseFloat(body.longitude)
        }
      }
      insertA.location = JSON.stringify(locationData)
      insertB.location = JSON.stringify(locationData)
    }

    // Try first shape, then fallback to second
    let { data, error } = await supabase.from('construction_projects').insert(insertA).select('*').single()
    if (error) {
      const second = await supabase.from('construction_projects').insert(insertB).select('*').single()
      if (second.error) return NextResponse.json({ error: second.error.message }, { status: 400 })
      data = second.data
    }
    return NextResponse.json({ project: data })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unknown' }, { status: 500 })
  }
}
