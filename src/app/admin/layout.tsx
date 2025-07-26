// @ts-nocheck
'use client'

// Prevent static generation for admin routes
export const dynamic = 'force-dynamic';

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/core/shared/utils'
import { AuthProvider } from '@/core/shared/auth/AuthProvider'
import { Button } from '@/core/shared/components/ui/button'
import {
  LayoutDashboard,
  Store,
  BarChart3,
  Settings,
  Globe,
  Building,
  Brain,
  DollarSign,
  Users,
  LogOut
} from 'lucide-react'

const navigation = [
  {
    name: 'لوحة التحكم',
    href: '/admin/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'إدارة المتاجر',
    href: '/admin/stores',
    icon: Store
  },
  {
    name: 'تحليلات المنصة',
    href: '/admin/analytics',
    icon: BarChart3
  },
  {
    name: 'المالية والعمولات',
    href: '/admin/finance',
    icon: DollarSign
  },
  {
    name: 'أسواق دول الخليج',
    href: '/admin/gcc-markets',
    icon: Globe,
    badge: 'المرحلة 3',
    isNew: true
  },
  {
    name: 'نظام البناء المتطور',
    href: '/admin/construction',
    icon: Building,
    badge: 'المرحلة 3',
    isNew: true
  },
  {
    name: 'تحليلات الذكاء الاصطناعي',
    href: '/admin/ai-analytics',
    icon: Brain,
    badge: 'المرحلة 3',
    isNew: true
  },
  {
    name: 'الإعدادات',
    href: '/admin/settings',
    icon: Settings
  }
]

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [logoutLoading, setLogoutLoading] = useState(false)
  
  // Safe auth hook usage
  let user: any = null
  let logout: (() => Promise<void>) | null = null
  try {
    const authResult = useAuth()
    user = authResult.user
    logout = authResult.logout
  } catch (error) {
    user = null
    logout = null
  }

  // Logout handler
  const handleLogout = async () => {
    try {
      setLogoutLoading(true)
      console.log('🚪 [Admin Layout] Starting logout process...')
      
      // Call our logout API
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (response.ok) {
        console.log('✅ [Admin Layout] Logout API successful')
      } else {
        console.warn('⚠️ [Admin Layout] Logout API failed, continuing with client-side cleanup')
      }
      
      // Clear client-side auth state if logout function available
      if (logout) {
        await logout()
      }
      
      // Redirect to login
      router.push('/auth/login')
      console.log('✅ [Admin Layout] Logout complete, redirecting to login')
    } catch (error) {
      console.error('❌ [Admin Layout] Logout error:', error)
      // Even if API fails, clear client state and redirect
      if (logout) {
        await logout()
      }
      router.push('/auth/login')
    } finally {
      setLogoutLoading(false)
    }
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              إدارة منصة بنّا
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-sm text-blue-600 font-medium">
                المرحلة 3: توسع أسواق الخليج ونظام البناء المتطور
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                disabled={logoutLoading}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                {logoutLoading ? 'جاري تسجيل الخروج...' : 'تسجيل الخروج'}
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex">
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <Icon className="ml-3 h-5 w-5" />
                    {item.name}
                    {item.badge && (
                      <span className={cn(
                        "mr-auto inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                        item.isNew 
                          ? "bg-green-100 text-green-800" 
                          : "bg-blue-100 text-blue-800"
                      )}>
                        {item.badge}
                      </span>
                    )}
                    {item.isNew && (
                      <span className="mr-1 inline-flex items-center justify-center px-1 py-0.5 rounded-full text-xs font-bold text-white bg-red-500">
                        •
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Phase 3 Features Section */}
            <div className="mt-8 pt-4 border-t border-gray-200">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                ميزات المرحلة 3
              </h3>
              <div className="mt-2 space-y-1">
                <div className="px-3 py-2 text-xs text-gray-600">
                  ✅ إدارة أسواق دول الخليج
                </div>
                <div className="px-3 py-2 text-xs text-gray-600">
                  ✅ نظام البناء المتطور
                </div>
                <div className="px-3 py-2 text-xs text-gray-600">
                  ✅ تحليلات الذكاء الاصطناعي
                </div>
                <div className="px-3 py-2 text-xs text-gray-500">
                  🚧 مخطط قاعدة البيانات (قيد الانتظار)
                </div>
                <div className="px-3 py-2 text-xs text-gray-500">
                  🚧 تكامل واجهة البرمجة (قيد الانتظار)
                </div>
              </div>
            </div>
          </div>
        </nav>
        
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
    </AuthProvider>
  )
}


