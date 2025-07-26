'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/auth/signup')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">جاري التوجيه إلى صفحة التسجيل...</p>
      </div>
    </div>
  )
}
