'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import bcrypt from 'bcryptjs'

export default function SignupPage() {
  const [type, setType] = useState<'user' | 'store'>('user')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSignup = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const hashedPassword = await bcrypt.hash(password, 10)

    const { error } = await supabase.from('users').insert([
      {
        email,
        password: hashedPassword,
        name,
        account_type: type,
      },
    ])

    if (error) {
      setMessage('حدث خطأ: ' + error.message)
    } else {
      setMessage('تم التسجيل بنجاح! 🎉')
      setEmail('')
      setPassword('')
      setName('')
    }

    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 font-tajawal">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md text-right">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
          تسجيل {type === 'user' ? 'مستخدم' : 'متجر'}
        </h2>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setType('user')}
            className={`px-4 py-2 rounded-full text-sm ${
              type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            مستخدم
          </button>
          <button
            onClick={() => setType('store')}
            className={`px-4 py-2 rounded-full text-sm ${
              type === 'store' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            متجر
          </button>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder={type === 'user' ? 'اسم المستخدم' : 'اسم المتجر'}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md text-right"
          />
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md text-right"
          />
          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md text-right"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'جارٍ التسجيل...' : 'تسجيل'}
          </button>
        </form>

        <hr className="my-6 border-gray-300" />

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
        >
          التسجيل أو الدخول باستخدام Google
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-red-500">{message}</p>
        )}
      </div>
    </main>
  )
}
