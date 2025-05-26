'use client'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ClientIcon } from '@/components/icons'

export default function StoreDashboard() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeOrders: 0,
    monthlyRevenue: 0,
    activePromoCodes: 0
  })
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      setUser(session.user)
    }
    getUser()
  }, [supabase, router])
  const dashboardCards = [
    {
      title: 'إجمالي المنتجات',
      value: stats.totalProducts,
      icon: 'settings' as const,
      href: '/store/products',
      color: 'bg-blue-500'
    },
    {
      title: 'الطلبات النشطة',
      value: stats.activeOrders,
      icon: 'dashboard' as const,
      href: '/store/orders',
      color: 'bg-green-500'
    },
    {
      title: 'الإيرادات الشهرية',
      value: `${stats.monthlyRevenue} ر.س`,
      icon: 'marketing' as const,
      href: '/store/balance',
      color: 'bg-purple-500'
    },
    {
      title: 'أكواد الخصم النشطة',
      value: stats.activePromoCodes,
      icon: 'calculator' as const,
      href: '/store/promo-code',
      color: 'bg-orange-500'
    }
  ]

  const quickActions = [
    { title: 'إضافة منتج جديد', href: '/store/products/new', icon: 'design' as const },
    { title: 'إدارة الطلبات', href: '/store/orders', icon: 'settings' as const },
    { title: 'حملة تسويقية', href: '/store/marketing', icon: 'marketing' as const },
    { title: 'إحصائيات المبيعات', href: '/store/analytics', icon: 'dashboard' as const }
  ]

  return (
    <main className="min-h-screen bg-gray-50 font-tajawal">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            مرحباً، {user?.user_metadata?.store_name || user?.email?.split('@')[0] || 'المتجر'}! 🏪
          </h1>
          <p className="text-gray-600">إليك نظرة عامة على متجرك ومبيعاتك</p>
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

        {/* Store Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">أداء المتجر</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">معدل التحويل</span>
                <span className="font-semibold text-green-600">2.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">متوسط قيمة الطلب</span>
                <span className="font-semibold">450 ر.س</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">عدد الزوار اليوم</span>
                <span className="font-semibold">124</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">الطلبات الأخيرة</h2>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="bg-green-100 p-2 rounded-lg ml-3">
                  <ClientIcon type="settings" size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">طلب جديد</p>
                  <p className="text-sm text-gray-600">قيمة الطلب: 320 ر.س</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
