"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/core/shared/components/ui/button'
import { Input } from '@/core/shared/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card'
import { Alert, AlertDescription } from '@/core/shared/components/ui/alert'
import { Eye, EyeOff, LogIn, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError('بيانات الدخول غير صحيحة')
        return
      }

      if (data.user) {
        // Get user profile to determine dashboard route
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('user_type')
          .eq('user_id', data.user.id)
          .single()

        // Redirect based on user type
        if (profile?.user_type) {
          switch (profile.user_type) {
            case 'service-provider':
              router.push('/service-provider/dashboard')
              break
            case 'store':
              router.push('/store/dashboard')
              break
            case 'admin':
              router.push('/admin/dashboard')
              break
            default:
              router.push('/dashboard')
          }
        } else {
          router.push('/dashboard')
        }
      }
    } catch (err) {
      setError('حدث خطأ أثناء تسجيل الدخول')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            تسجيل الدخول
          </CardTitle>
          <p className="text-gray-600">
            مرحباً بك في منصة بنا للبناء والتشييد
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                البريد الإلكتروني
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                className="text-left"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                كلمة المرور
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="text-left pr-10"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              {loading ? (
                "جاري تسجيل الدخول..."
              ) : (
                <>
                  تسجيل الدخول
                  <ArrowRight className="mr-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="text-center space-y-2">
            <Link 
              href="/auth/forgot-password" 
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              نسيت كلمة المرور؟
            </Link>
            <div className="text-sm text-gray-600">
              ليس لديك حساب؟{' '}
              <Link 
                href="/auth/signup" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                إنشاء حساب جديد
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
