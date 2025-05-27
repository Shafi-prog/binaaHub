'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [debugMode, setDebugMode] = useState(false)
  const [cookies, setCookies] = useState<string[]>([])
  
  // Function to check cookies in debug mode
  const checkCookies = () => {
    const allCookies = document.cookie.split(';')
    setCookies(allCookies.map(cookie => cookie.trim()))
    return allCookies.length
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('يرجى إدخال البريد الإلكتروني وكلمة المرور.')
      return
    }

    setLoading(true)
    setStatus('🔐 جاري تسجيل الدخول...')
    console.log('🔐 محاولة تسجيل الدخول لـ:', email)
    
    if (debugMode) {
      const cookieCount = checkCookies()
      console.log(`🍪 الكوكيز الحالية قبل تسجيل الدخول: ${cookieCount}`)
    }

    try {
      // First try with fetch to check credentials before redirecting
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        // Login failed - show error message
        const errorMessage = result.error || 'فشل في تسجيل الدخول'
        toast.error(errorMessage)
        setStatus(`❌ ${errorMessage}`)
        setLoading(false)
        return
      }

      // Login successful - proceed with form submission for proper redirect
      console.log('✅ تم التحقق من صحة البيانات، جاري التوجيه...')
      toast.success('تم تسجيل الدخول بنجاح! جاري التوجيه...')
      setStatus('🚀 جاري التوجيه...')
      
      // Create a form for direct submission to get proper redirection
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = '/api/auth/direct-login'
      
      // Add email field
      const emailInput = document.createElement('input')
      emailInput.type = 'hidden'
      emailInput.name = 'email'
      emailInput.value = email
      
      // Add password field
      const passwordInput = document.createElement('input')
      passwordInput.type = 'hidden'
      passwordInput.name = 'password'
      passwordInput.value = password
      
      // Add debug mode field if active
      if (debugMode) {
        const debugInput = document.createElement('input')
        debugInput.type = 'hidden'
        debugInput.name = 'debug'
        debugInput.value = 'true'
        form.appendChild(debugInput)
      }
      
      // Add inputs to form
      form.appendChild(emailInput)
      form.appendChild(passwordInput)
      document.body.appendChild(form)
      
      // Submit form to trigger server-side redirection
      console.log('🚀 تقديم نموذج تسجيل الدخول للتوجيه المباشر...')
      form.submit()
      
      // Note: After form submission, the page will be redirected by the server
      // No further client-side code will execute past this point
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
            
            <div className="mt-2 pt-2 border-t border-gray-200">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={debugMode} 
                  onChange={e => setDebugMode(e.target.checked)}
                  className="mr-2"
                />
                <span>وضع التصحيح (Debug Mode)</span>
              </label>
              
              {debugMode && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={checkCookies}
                    className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                  >
                    فحص الكوكيز
                  </button>
                  
                  {cookies.length > 0 && (
                    <div className="mt-2 text-xs overflow-x-auto max-h-24 overflow-y-auto bg-gray-100 p-1 rounded">
                      <strong>الكوكيز الحالية ({cookies.length}):</strong>
                      <ul>
                        {cookies.map((cookie, i) => (
                          <li key={i} className="whitespace-nowrap">{cookie}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}