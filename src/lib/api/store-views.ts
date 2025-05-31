import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/database';

const supabase = createClientComponentClient<Database>();

export async function trackStoreView(
  storeId: string,
  userId?: string | null,
  source: string = 'direct'
) {
  try {
    // Get existing session ID from localStorage or create a new one
    let sessionId = localStorage.getItem('store_session_id');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('store_session_id', sessionId);
    }

    // Insert view record
    const { error } = await supabase.from('store_views').insert({
      store_id: storeId,
      session_id: sessionId,
      user_id: userId || null,
      source,
      referrer: document.referrer || null,
      ip_address: null, // IP will be captured by Supabase
      user_agent: navigator.userAgent,
    });

    if (error) {
      console.error('Error tracking store view:', error);
    }

    // Update daily metrics
    await supabase.rpc('calculate_daily_metrics', {
      store_id: storeId,
      calc_date: new Date().toISOString().split('T')[0],
    });
  } catch (error) {
    console.error('Error in trackStoreView:', error);
  }
}
