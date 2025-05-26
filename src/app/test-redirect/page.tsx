'use client'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function TestRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    async function testLogin() {
      console.log('🧪 Starting test login...')
      
      // Test login
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'user@user.com',
        password: '123456',
      })

      if (signInError) {
        console.error('❌ Login failed:', signInError.message)
        return
      }

      console.log('✅ Login successful!')

      // Get user data
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('account_type')
        .eq('email', 'user@user.com')
        .single()

      if (fetchError) {
        console.error('❌ Fetch failed:', fetchError.message)
        return
      }

      console.log('👤 Account type:', userData.account_type)

      // Wait and redirect
      console.log('⏳ Waiting before redirect...')
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('🚀 Redirecting to user dashboard...')
      
      // Try multiple redirection methods
      try {
        router.push('/user/dashboard')
        console.log('✅ router.push called')
      } catch (error) {
        console.error('❌ router.push failed:', error)
      }

      // Fallback after 2 seconds
      setTimeout(() => {
        console.log('🔄 Fallback: using window.location')
        window.location.href = '/user/dashboard'
      }, 2000)
    }

    testLogin()
  }, [router])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Testing Login & Redirect</h1>
        <p>Check the browser console for detailed logs...</p>
        <div className="mt-4">
          <a href="/user/dashboard" className="text-blue-600 hover:underline">
            Manual link to User Dashboard
          </a>
        </div>
        <div className="mt-2">
          <a href="/store/dashboard" className="text-blue-600 hover:underline">
            Manual link to Store Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
