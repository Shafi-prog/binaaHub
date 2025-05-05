import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: userData, error } = await supabase
    .from('users')
    .select('name, email, account_type')
    .eq('id', user.id)
    .single()

  if (error || !userData) {
    redirect('/login')
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 font-tajawal">الملف الشخصي</h1>
        <div className="space-y-4 text-right text-gray-700">
          <p>
            <strong>الاسم:</strong> {userData.name}
          </p>
          <p>
            <strong>البريد الإلكتروني:</strong> {userData.email}
          </p>
          <p>
            <strong>نوع الحساب:</strong> {userData.account_type === 'store' ? 'متجر' : 'مستخدم'}
          </p>
        </div>
      </div>
    </main>
  )
}
