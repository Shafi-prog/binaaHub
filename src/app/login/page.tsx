'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import bcrypt from 'bcryptjs'

export default function LoginPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.push('/profile')
    })
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage('البريد أو كلمة المرور غير صحيحة.')
    } else {
      router.push('/profile')
    }
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      {/* الجانب الترويجي */}
      <div className="md:w-1/2 bg-gradient-to-br from-blue-900 to-blue-700 text-white flex items-center justify-center p-10">
        <div className="max-w-md text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2913/2913466.png"
            alt="BinaaHub Logo"
            className="w-24 h-24 mx-auto mb-6"
          />
          <h2 className="text-4xl font-extrabold mb-4">مرحبًا بك في BinaaHub</h2>
          <p className="text-lg leading-relaxed">
            رحلتك في البناء تبدأ من هنا — كل مواد البناء، التصميم، التوصيل، الضمانات، والمقاولين في منصة واحدة.
          </p>
        </div>
      </div>

      {/* نموذج تسجيل الدخول */}
      <div className="md:w-1/2 flex items-center justify-center bg-gray-100 p-8 font-tajawal">
        <div className="bg-white p-8 rounded-xl shadow-md text-center w-full max-w-md">
          <h2 className="text-2xl font-bold text-blue-800 mb-6">تسجيل الدخول</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded text-right"
              required
            />
            <input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded text-right"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              تسجيل الدخول
            </button>
          </form>

          <button
            onClick={handleGoogleLogin}
            className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
          >
            تسجيل الدخول باستخدام Google
          </button>

          {message && <p className="mt-4 text-sm text-red-500">{message}</p>}

          <p className="mt-6 text-sm text-gray-500">
            لا تملك حساب؟{' '}
            <a href="/signup" className="text-blue-600 underline">
              سجل الآن
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
