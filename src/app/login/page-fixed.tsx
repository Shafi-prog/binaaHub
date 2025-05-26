'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
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
    setStatus('🔐 جاري تسجيل الدخول...')
    console.log('🔐 محاولة تسجيل الدخول لـ:', email)

    try {
      // Use API route for server-side authentication
      console.log('🔐 إرسال طلب المصادقة إلى الخادم...')
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        console.error('❌ فشل في التوثيق:', result.error)
        toast.error(result.error || 'فشل في تسجيل الدخول')
        setStatus('❌ فشل تسجيل الدخول')
        setLoading(false)
        return
      }

      console.log('✅ تم التوثيق بنجاح')
      console.log('👤 المستخدم:', result.user.email)
      console.log('🎯 نوع الحساب:', result.user.account_type)
      console.log('🚀 سيتم التوجيه إلى:', result.redirectTo)

      // Set the session on the client side
      if (result.session) {
        console.log('🔐 تعيين الجلسة على العميل...')
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: result.session.access_token,
          refresh_token: result.session.refresh_token
        })
        
        if (sessionError) {
          console.error('❌ خطأ في تعيين الجلسة:', sessionError)
          toast.error('خطأ في إعداد الجلسة')
          setLoading(false)
          return
        }

        // Set access token in cookies for middleware with proper settings
        console.log('🍪 تعيين التوكن في الكوكيز...')
        const accessToken = result.session.access_token
        
        // Set cookies with different names to ensure middleware picks them up
        document.cookie = `sb-access-token=${accessToken}; path=/; max-age=3600; samesite=lax`
        document.cookie = `supabase-auth-token=${accessToken}; path=/; max-age=3600; samesite=lax`
        
        console.log('🍪 تحقق من الكوكيز المحفوظة:', document.cookie)
        console.log('✅ تم تعيين الجلسة والكوكيز بنجاح')
        
      } else {
        console.error('❌ لم يتم إرجاع بيانات الجلسة من الخادم')
        toast.error('خطأ في بيانات الجلسة')
        setLoading(false)
        return
      }

      setStatus('✅ تم تسجيل الدخول بنجاح!')
      toast.success('تم تسجيل الدخول بنجاح ✅')

      console.log('🔄 تنفيذ التوجيه إلى:', result.redirectTo)
      setStatus(`🔄 التوجيه إلى ${result.redirectTo}...`)
      
      // Add a small delay to ensure cookies are set, then redirect
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Use window.location for direct navigation to ensure cookies are sent
      console.log('🔄 إعادة تحديث الصفحة لضمان انتشار الكوكيز...')
      window.location.href = result.redirectTo

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
            تسجيل الدخول
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
