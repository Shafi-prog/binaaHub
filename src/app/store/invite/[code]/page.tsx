import { notFound, redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function StoreInvitePage({ params }: { params: { code: string } }) {
  const supabase = createServerComponentClient({ cookies });
  const { data: store, error } = await supabase
    .from('stores')
    .select('id')
    .eq('invitation_code', params.code)
    .single();
  if (!store) return notFound();
  // Optionally, log the visit event
  await fetch('/api/store/invite-usage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: params.code, event: 'visit' }),
  });
  // Redirect to the store's public page
  redirect(`/store/${store.id}`);
}
