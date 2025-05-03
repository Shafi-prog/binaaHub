'use client'

import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [accountType, setAccountType] = useState<'user' | 'store'>('user')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !password) {
      toast.error('يرجى تعبئة جميع الحقول.')
      return
    }

    setLoading(true)

    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      toast.error(error.message || 'خطأ أثناء إنشاء الحساب')
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase.from('users').insert([
      {
        name,
        email,
        password,
        account_type: accountType,
      },
    ])

    if (insertError) {
      toast.error(insertError.message || 'فشل في حفظ بيانات الحساب.')
      setLoading(false)
      return
    }

    toast.success('تم إنشاء الحساب بنجاح ✅')
    setTimeout(() => {
      router.push('/login')
    }, 800)

    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-100 flex">
      <div className="hidden md:flex w-1/2 items-center justify-center bg-white">
        <img
          src="/forms-concept-illustration_114360-4957.avif"
          alt="إنشاء حساب"
          className="object-cover max-w-full max-h-screen"
        />
      </div>

      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-8 font-tajawal">
            إنشاء حساب جديد
          </h2>

          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label className="block text-right text-sm mb-1 font-medium text-gray-700">
                الاسم الكامل
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="ادخل اسمك الكامل"
              />
            </div>

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

            {/* اختيار نوع الحساب */}
            <div className="flex justify-center gap-4 mt-4">
              <button
                type="button"
                onClick={() => setAccountType('user')}
                className={`px-4 py-2 rounded-full text-sm ${accountType === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                مستخدم
              </button>
              <button
                type="button"
                onClick={() => setAccountType('store')}
                className={`px-4 py-2 rounded-full text-sm ${accountType === 'store' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                متجر
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-semibold mt-6"
              disabled={loading}
            >
              {loading ? '...جاري إنشاء الحساب' : 'إنشاء حساب'}
            </button>
          </form>

          <div className="text-center text-sm text-gray-500 mt-6">
            لديك حساب بالفعل؟
            <a href="/login" className="text-blue-600 hover:underline ml-1">
              تسجيل الدخول
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
