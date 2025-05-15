'use client'
// app/login/page.tsx
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }: { data: { session: any } }) => {
      console.log('🧠 Session at mount:', data.session)
    })
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('يرجى إدخال البريد الإلكتروني وكلمة المرور.')
      return
    }

    setLoading(true)

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError || !signInData.session) {
      toast.error(signInError?.message || 'خطأ في تسجيل الدخول')
      setLoading(false)
      return
    }

    // جلب نوع الحساب
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('account_type')
      .eq('email', email)
      .single()

    if (fetchError || !userData?.account_type) {
      toast.error('فشل في تحديد نوع الحساب.')
      setLoading(false)
      return
    }

    toast.success('تم تسجيل الدخول بنجاح ✅')

    const redirectTo =
      userData.account_type === 'store'
        ? '/store/dashboard'
        : userData.account_type === 'user' || userData.account_type === 'client'
        ? '/user/dashboard'
        : userData.account_type === 'engineer' || userData.account_type === 'consultant'
        ? '/dashboard/construction-data'
        : '/'

    router.refresh() // تحديث بيانات الخادم قبل التوجيه
    router.push(redirectTo)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-100 flex">
      <div className="hidden md:flex w-1/2 items-center justify-center bg-white">
        <img
          src="/login-image.png"
          alt="تسجيل الدخول"
          className="object-cover max-w-full max-h-screen"
        />
      </div>

      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-8 font-tajawal">
            تسجيل الدخول
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="البريد الإلكتروني"
              className="w-full p-3 border rounded"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              className="w-full p-3 border rounded"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
