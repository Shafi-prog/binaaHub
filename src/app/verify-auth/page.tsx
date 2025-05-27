'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function VerifyAuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('جار التحقق من الجلسة...')
  
  useEffect(() => {
    const redirectTo = searchParams.get('redirect') || '/user/dashboard'
    
    // Wait a brief moment for cookies to be processed
    const timer = setTimeout(() => {
      setStatus('تم التحقق بنجاح، جار التحويل...')
      
      // Add another small delay before redirect to ensure cookies are processed
      const redirectTimer = setTimeout(() => {
        console.log('🔄 [verify-auth] Redirecting to:', redirectTo)
        router.push(redirectTo)
        
        // Fallback to window.location if router.push doesn't work
        setTimeout(() => {
          window.location.href = redirectTo
        }, 1000)
      }, 500)
      
      return () => clearTimeout(redirectTimer)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">{status}</p>
        <p className="text-sm text-gray-400 mt-2">لا تقم بإغلاق هذه الصفحة</p>
      </div>
    </div>
  )
}
