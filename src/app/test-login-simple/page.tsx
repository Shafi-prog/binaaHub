'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function LoginTestPage() {
  const [email, setEmail] = useState('user@user.com')
  const [password, setPassword] = useState('123456')
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const router = useRouter()

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString('ar-SA')
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
    console.log(message)
  }

  const clearLogs = () => {
    setLogs([])
  }

  const testLogin = async () => {
    clearLogs()
    setLoading(true)
    addLog('🧪 بدء اختبار تسجيل الدخول والتوجيه...')
    
    try {
      // 1. تسجيل الدخول
      addLog('🔐 الخطوة 1: محاولة تسجيل الدخول...')
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) {
        addLog(`❌ فشل تسجيل الدخول: ${signInError.message}`)
        setLoading(false)
        return
      }

      addLog(`✅ نجح تسجيل الدخول للمستخدم: ${signInData.user.email}`)

      // 2. جلب بيانات المستخدم
      addLog('📊 الخطوة 2: جلب بيانات المستخدم...')
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('account_type')
        .eq('email', email)
        .single()

      if (fetchError || !userData?.account_type) {
        addLog(`❌ فشل جلب بيانات المستخدم: ${fetchError?.message}`)
        setLoading(false)
        return
      }

      addLog(`✅ تم جلب بيانات المستخدم: نوع الحساب = ${userData.account_type}`)

      // 3. تحديد صفحة التوجيه
      addLog('🗺️ الخطوة 3: تحديد صفحة التوجيه...')
      const redirectTo = userData.account_type === 'store'
        ? '/store/dashboard'
        : userData.account_type === 'user' || userData.account_type === 'client'
          ? '/user/dashboard'
          : userData.account_type === 'engineer' || userData.account_type === 'consultant'
            ? '/dashboard/construction-data'
            : '/'

      addLog(`✅ صفحة التوجيه المحددة: ${redirectTo}`)

      // 4. تحديث الجلسة
      addLog('🔄 الخطوة 4: تحديث الجلسة...')
      const { data: refreshedSession, error: refreshError } = await supabase.auth.refreshSession()
      if (refreshError) {
        addLog(`❌ فشل تحديث الجلسة: ${refreshError.message}`)
      } else {
        addLog(`✅ تم تحديث الجلسة بنجاح`)
      }

      // 5. التحقق من الجلسة
      addLog('✔️ الخطوة 5: التحقق من الجلسة النهائية...')
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) {
        addLog(`❌ خطأ في التحقق من الجلسة: ${sessionError.message}`)
        setLoading(false)
        return
      }

      if (session) {
        addLog(`✅ الجلسة نشطة للمستخدم: ${session.user.email}`)
        addLog(`⏰ انتهاء الجلسة: ${new Date(session.expires_at! * 1000).toLocaleString('ar-SA')}`)
      } else {
        addLog(`❌ لا توجد جلسة نشطة`)
        setLoading(false)
        return
      }

      // 6. التوجيه
      addLog('🚀 الخطوة 6: محاولة التوجيه...')
      addLog(`📍 محاولة التوجيه باستخدام router.push إلى: ${redirectTo}`)
      
      // انتظار قصير للتأكد من استقرار الجلسة
      await new Promise(resolve => setTimeout(resolve, 1000))

      try {
        router.push(redirectTo)
        addLog('✅ تم استدعاء router.push بنجاح')
        
        // إعطاء وقت للتوجيه
        setTimeout(() => {
          addLog('⚠️ لم يتم التوجيه بعد 3 ثوانٍ، سأحاول window.location')
          window.location.href = redirectTo
        }, 3000)
        
      } catch (navError: any) {
        addLog(`❌ فشل router.push: ${navError.message}`)
        addLog('🔄 محاولة استخدام window.location...')
        window.location.href = redirectTo
      }

    } catch (error: any) {
      addLog(`❌ خطأ عام: ${error.message}`)
    }
    
    setLoading(false)
  }

  const checkSession = async () => {
    addLog('🔍 فحص الجلسة الحالية...')
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        addLog(`❌ خطأ في فحص الجلسة: ${error.message}`)
        return
      }
      
      if (session) {
        addLog(`✅ الجلسة موجودة للمستخدم: ${session.user.email}`)
        addLog(`⏰ انتهاء الجلسة: ${new Date(session.expires_at! * 1000).toLocaleString('ar-SA')}`)
      } else {
        addLog('❌ لا توجد جلسة نشطة')
      }
    } catch (err: any) {
      addLog(`❌ خطأ غير متوقع: ${err.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-6">🧪 اختبار تسجيل الدخول والتوجيه</h1>
          
          {/* نموذج البيانات */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* أزرار الاختبار */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={testLogin}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
            >
              {loading ? '⏳ جاري التشغيل...' : '🚀 تشغيل الاختبار الكامل'}
            </button>
            
            <button
              onClick={clearLogs}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium"
            >
              🗑️ مسح السجل
            </button>

            <button
              onClick={checkSession}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
            >
              🔍 فحص الجلسة
            </button>
          </div>

          {/* سجل النتائج */}
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
            <h3 className="text-lg font-semibold mb-3">📋 سجل النتائج:</h3>
            <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-gray-400">جاهز للاختبار...</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-1">{log}</div>
                ))
              )}
            </div>
          </div>

          {/* معلومات إضافية */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="text-md font-semibold text-blue-800 mb-2">📝 ملاحظات:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• هذه الصفحة تختبر كل خطوة في عملية تسجيل الدخول بشكل منفصل</li>
              <li>• يمكنك مراقبة كل خطوة في السجل أعلاه</li>
              <li>• إذا فشلت أي خطوة، ستظهر رسالة خطأ مفصلة</li>
              <li>• التوجيه سيحدث إلى /user/dashboard للمستخدم العادي</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
