'use client'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ClientIcon } from '@/components/icons'

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    activeProjects: 0,
    completedOrders: 0,
    totalSpending: 0,
    activeWarranties: 0
  })
  const supabase = createClientComponentClient()
  const router = useRouter()
  useEffect(() => {
    const getUser = async () => {
      console.log('📊 [UserDashboard] تحميل صفحة dashboard المستخدم')
      const { data: { session } } = await supabase.auth.getSession()
      console.log('🔐 [UserDashboard] حالة الجلسة:', session ? 'موجودة' : 'غير موجودة')
      
      if (!session) {
        console.warn('⚠️ [UserDashboard] لا توجد جلسة، التوجيه لصفحة تسجيل الدخول')
        router.push('/login')
        return
      }
      
      console.log('👤 [UserDashboard] المستخدم:', session.user.email)
      setUser(session.user)
    }
    getUser()
  }, [supabase, router])
  const dashboardCards = [
    {
      title: 'المشاريع النشطة',
      value: stats.activeProjects,
      icon: 'dashboard' as const,
      href: '/user/projects',
      color: 'bg-blue-500'
    },
    {
      title: 'الطلبات المكتملة',
      value: stats.completedOrders,
      icon: 'settings' as const,
      href: '/user/orders',
      color: 'bg-green-500'
    },
    {
      title: 'إجمالي الإنفاق',
      value: `${stats.totalSpending} ر.س`,
      icon: 'marketing' as const,
      href: '/user/spending-tracking',
      color: 'bg-purple-500'
    },
    {
      title: 'الضمانات النشطة',
      value: stats.activeWarranties,
      icon: 'calculator' as const,
      href: '/user/warranties',
      color: 'bg-orange-500'
    }
  ]

  const quickActions = [
    { title: 'إنشاء مشروع جديد', href: '/user/projects/new', icon: 'design' as const },
    { title: 'طلب خدمة تصميم', href: '/user/services/design', icon: 'ai' as const },
    { title: 'حاسبة التكاليف', href: '/user/services/calculators', icon: 'calculator' as const },
    { title: 'تتبع الإنفاق', href: '/user/spending-tracking', icon: 'settings' as const }
  ]

  return (
    <main className="min-h-screen bg-gray-50 font-tajawal">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            مرحباً، {user?.user_metadata?.name || user?.email?.split('@')[0] || 'المستخدم'}! 👋
          </h1>
          <p className="text-gray-600">إليك نظرة عامة على حسابك ومشاريعك</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <Link key={index} href={card.href} className="block">
              <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                  </div>
                  <div className={`${card.color} p-3 rounded-lg`}>
                    <ClientIcon type={card.icon} size={24} className="text-white" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">إجراءات سريعة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href} className="block">
                <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-4 text-center">
                  <ClientIcon type={action.icon} size={32} className="mx-auto mb-3 text-blue-600" />
                  <h3 className="font-medium text-gray-800">{action.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">النشاط الأخير</h2>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="bg-blue-100 p-2 rounded-lg ml-3">
                <ClientIcon type="dashboard" size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">مرحباً بك في منصة بناء</p>
                <p className="text-sm text-gray-600">ابدأ رحلتك في إدارة مشاريع البناء</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
