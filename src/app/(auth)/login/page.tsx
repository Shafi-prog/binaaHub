'use client'

import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('يرجى إدخال البريد الإلكتروني وكلمة المرور.')
      return
    }

    setLoading(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (signInError) {
      toast.error(signInError.message || 'خطأ في تسجيل الدخول')
      setLoading(false)
      return
    }

    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('account_type')
      .eq('email', email)
      .single()

    if (fetchError || !userData) {
      toast.error('فشل في تحديد نوع الحساب.')
      setLoading(false)
      return
    }

    toast.success('تم تسجيل الدخول بنجاح ✅')

    setTimeout(() => {
      if (userData.account_type === 'store') {
        router.replace('/store/dashboard')
      } else {
        router.replace('/profile')
      }
    }, 800)

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

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-right text-sm mb-1 font-medium text-gray-700">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="ادخل بريدك الإلكتروني"
              />
            </div>

            <div>
              <label className="block text-right text-sm mb-1 font-medium text-gray-700">
                كلمة المرور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="ادخل كلمة المرور"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-semibold"
              disabled={loading}
            >
              {loading ? '...جاري تسجيل الدخول' : 'تسجيل الدخول'}
            </button>
          </form>

          <div className="text-center text-sm text-gray-500 mt-6">
            لا تملك حساباً؟
            <a href="/signup" className="text-blue-600 hover:underline ml-1">
              إنشاء حساب
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
