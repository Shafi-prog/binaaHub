'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import bcrypt from 'bcryptjs'
import Image from 'next/image'
import { Mail, Lock, User } from 'lucide-react'

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
      const { data: { session } } = await supabase.auth.getSession()
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
    <main className="min-h-screen grid md:grid-cols-2 items-center bg-gray-50 font-tajawal px-4 md:px-12 py-10">
      {/* Image on the LEFT */}
      <section className="hidden md:flex justify-center md:justify-center items-center h-full">
  <Image
    src="/login-illustration.svg"
    alt="login"
    width={400}
    height={400}
    className="object-contain"
  />
      </section>

      {/* Form on the RIGHT */}
      <section className="bg-white shadow-xl rounded-xl p-8 md:p-12 w-full max-w-md mx-auto md:mr-auto text-center">
  <h2 className="text-blue-600 font-semibold mb-2 text-sm">
    {type === 'login' ? 'مرحباً بعودتك' : 'إنشاء حساب جديد'}
  </h2>
  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
    {type === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب'}
  </h1>

        <div className="flex justify-center gap-4 text-sm mb-4">
          <button
            className={`px-4 py-1 rounded-full ${type === 'login' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setType('login')}
          >دخول</button>
          <button
            className={`px-4 py-1 rounded-full ${type === 'signup' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setType('signup')}
          >إنشاء</button>
        </div>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); type === 'signup' ? handleSignup() : handleLogin() }}>
          {type === 'signup' && (
            <div className="flex items-center border rounded-md px-3 py-2">
              <User className="text-gray-400 ml-2" size={18} />
              <input
                type="text"
                placeholder="الاسم الكامل"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full focus:outline-none text-right"
              />
            </div>
          )}

          <div className="flex items-center border rounded-md px-3 py-2">
            <Mail className="text-gray-400 ml-2" size={18} />
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full focus:outline-none text-right"
            />
          </div>

          <div className="flex items-center border rounded-md px-3 py-2">
            <Lock className="text-gray-400 ml-2" size={18} />
            <input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full focus:outline-none text-right"
            />
          </div>

          {type === 'signup' && (
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => setAccountType('user')}
                className={`px-4 py-1 rounded-full ${accountType === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >مستخدم</button>
              <button
                type="button"
                onClick={() => setAccountType('store')}
                className={`px-4 py-1 rounded-full ${accountType === 'store' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >متجر</button>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? '...جارٍ المعالجة' : type === 'signup' ? 'تسجيل' : 'دخول'}
          </button>
        </form>

        <div className="flex items-center gap-3 text-black text-sm text-center mt-6">
  <hr className="flex-grow border-t border-gray-300" />
  أو
  <hr className="flex-grow border-t border-gray-300" />
</div>


        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition mt-2"
        >
           Google تسجيل الدخول عبر 
        </button>

        {message && <p className="text-sm text-red-600 text-center mt-4">{message}</p>}
      </section>
    </main>
  )
}
