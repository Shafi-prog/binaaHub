// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// POST: /api/store/invite-usage
// Body: { code: string, event: 'visit' | 'purchase' }
export async function POST(request: NextRequest) {
  const { code, event } = await request.json();
  if (!code || !event) {
    return NextResponse.json({ error: 'Missing code or event' }, { status: 400 });
  }
  const supabase = createRouteHandlerClient({ cookies });
  // Find store by invitation code
  const { data: store, error } = await supabase
    .from('stores')
    .select('id')
    .eq('invitation_code', code)
    .single();
  if (error || !store) {
    return NextResponse.json({ error: 'Store not found' }, { status: 404 });
  }
  // Insert usage event
  const { error: insertError } = await supabase
    .from('store_invite_analytics')
    .insert({ store_id: store.id, event_type: event, used_at: new Date().toISOString() });
  if (insertError) {
    return NextResponse.json({ error: 'Failed to log event' }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}


