import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'

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
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-lg text-right font-tajawal">
        <h1 className="text-2xl font-bold text-blue-800 mb-4">لوحة تحكم المتجر</h1>
        <p className="text-gray-700">مرحبًا، {data.name} 👋</p>
        <p className="text-gray-600 text-sm mt-2">البريد الإلكتروني: {data.email}</p>
        <p className="text-gray-600 text-sm">نوع الحساب: {data.account_type}</p>
        <div className="mt-6 border-t pt-4 text-sm text-gray-500">
          📦 جاري تطوير لوحة تحكم المتجر
        </div>
      </div>
    </main>
  )
}
