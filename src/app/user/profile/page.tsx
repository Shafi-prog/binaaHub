import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ProfileClient } from './ProfileClient'

export default async function ProfilePage() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ✅ تحقق مبكر من وجود المستخدم
  if (!user) {
    redirect('/login')
  }

  // ✅ بعد التأكد نستخدم user.email بأمان
  const { data: userData, error } = await supabase
    .from('users')
    .select('name, email, account_type')
    .eq('email', user.email)
    .single()

  if (error || !userData) {
    redirect('/login')
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 font-tajawal">الملف الشخصي</h1>
        <ProfileClient
          name={userData.name}
          email={userData.email}
          accountType={userData.account_type}
        />
      </div>
    </main>
  )
}

// refresh build 👋
