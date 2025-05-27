'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function DirectLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('يرجى إدخال البريد الإلكتروني وكلمة المرور.')
      return
    }

    setLoading(true)
    setStatus('🔐 جاري تسجيل الدخول...')
    console.log('🔐 محاولة تسجيل الدخول لـ:', email)

    try {
      // Use direct login API route for server-side authentication and immediate redirection
      console.log('🔐 إرسال طلب المصادقة والتوجيه المباشر...')
      const response = await fetch('/api/auth/direct-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        // This is important - we need to follow redirects for this approach to work
        redirect: 'follow'
      })

      // If we've reached this point and there was no redirect, it means there was an error
      if (!response.redirected) {
        const result = await response.json()
        console.error('❌ فشل في التوثيق:', result.error)
        toast.error(result.error || 'فشل في تسجيل الدخول')
        setStatus('❌ فشل تسجيل الدخول')
      }
      
      // If we get here, there might be an issue because we should have already redirected
      setLoading(false)

    } catch (error) {
      console.error('❌ خطأ عام:', error)
      toast.error('حدث خطأ غير متوقع')
      setStatus('❌ خطأ غير متوقع')
      setLoading(false)
    }
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
            تسجيل الدخول المباشر
          </h2>

          {status && (
            <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-center">
              {status}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="البريد الإلكتروني"
              className="w-full p-3 border rounded"
              disabled={loading}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              className="w-full p-3 border rounded"
              disabled={loading}
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>
          
          {/* Test credentials for development */}
          <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
            <p>للاختبار:</p>
            <p>👤 المستخدم: user@user.com / 123456</p>
            <p>🏪 المتجر: store@store.com / 123456</p>
          </div>
        </div>
      </div>
    </main>
  )
}
