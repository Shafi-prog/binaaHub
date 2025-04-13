'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import bcrypt from 'bcryptjs'

export default function LoginPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const [type, setType] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [accountType, setAccountType] = useState<'user' | 'store'>('user')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) router.push('/profile')
    }
    checkSession()
  }, [])

  const handleSignup = async () => {
    setLoading(true)
    setMessage('')
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
      if (signUpError) throw signUpError

      const hashedPassword = await bcrypt.hash(password, 10)

      const { error: insertError } = await supabase.from('users').insert({
        email,
        name,
        password: hashedPassword,
        account_type: accountType,
      })
      if (insertError) throw insertError

      setMessage('تم التسجيل بنجاح 🎉')
      setEmail(''); setPassword(''); setName('')
    } catch (err: any) {
      setMessage(err.message || 'حدث خطأ غير متوقع')
    }
    setLoading(false)
  }

  const handleLogin = async () => {
    setLoading(true)
    setMessage('')
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.push('/profile')
    } catch (err: any) {
      setMessage(err.message || 'بيانات الدخول غير صحيحة')
    }
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center font-tajawal p-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm space-y-6 text-center">
        <h1 className="text-2xl font-bold text-blue-700">
          {type === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب'}
        </h1>

        <div className="flex justify-center gap-4 text-sm">
          <button
            className={`px-4 py-1 rounded-full ${type === 'login' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setType('login')}
          >تسجيل الدخول</button>
          <button
            className={`px-4 py-1 rounded-full ${type === 'signup' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setType('signup')}
          >إنشاء حساب</button>
        </div>

        {type === 'signup' && (
          <input
            type="text"
            placeholder="الاسم الكامل"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-4 py-2 rounded-md text-right"
          />
        )}

        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-4 py-2 rounded-md text-right"
        />
        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-4 py-2 rounded-md text-right"
        />

        {type === 'signup' && (
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setAccountType('user')}
              className={`px-4 py-1 rounded-full ${accountType === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >مستخدم</button>
            <button
              onClick={() => setAccountType('store')}
              className={`px-4 py-1 rounded-full ${accountType === 'store' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >متجر</button>
          </div>
        )}

        <button
          onClick={type === 'signup' ? handleSignup : handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? '...جارٍ المعالجة' : type === 'signup' ? 'تسجيل' : 'دخول'}
        </button>

        <div className="text-gray-400 text-sm">أو</div>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition"
        >
          تسجيل الدخول عبر Google
        </button>

        {message && <p className="text-sm text-red-600">{message}</p>}
      </div>
    </main>
  )
}
