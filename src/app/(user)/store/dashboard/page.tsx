// src/app/(user)/store/dashboard/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { DashboardClient } from './DashboardClient' // ✅ استيراد الكومبوننت الجديد

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('users')
    .select('name, email, account_type')
    .eq('email', user.email!)
    .single()

  if (error || !data || data.account_type !== 'store') {
    redirect('/login?unauthorized=1')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <DashboardClient name={data.name} email={data.email} accountType={data.account_type} />
    </main>
  )
}
