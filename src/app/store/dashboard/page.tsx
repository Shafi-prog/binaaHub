'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { getStoreDashboardStats, type StoreStats } from '@/lib/api/store-dashboard';
import { LoadingSpinner } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { ClientIcon } from '@/components/icons';
import type { IconKey } from '@/components/icons/ClientIcon';
import SimpleLayout from '@/components/layouts/SimpleLayout';
import { StockAlerts } from '@/hooks/useStockMonitoring';
import RealtimeOrderTracking from '@/components/store/RealtimeOrderTracking';

interface StoreDashboardUser extends User {
  store_name?: string;
}

function formatInvitationCode(code: string) {
  if (!code) return '';
  return code.startsWith('BinnaHub - ') ? code : `BinnaHub - ${code}`;
}

export default function StoreDashboard() {
  const [user, setUser] = useState<StoreDashboardUser | null>(null);
  const [stats, setStats] = useState<StoreStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  // Invitation code state
  const [invitationCode, setInvitationCode] = useState<string | null>(null);
  const [inviteAnalytics, setInviteAnalytics] = useState<{ visits: number; purchases: number } | null>(null);

  useEffect(() => {
    if (user && user.id) {
      // Fetch invitation code
      supabase
        .from('stores')
        .select('invitation_code')
        .eq('user_id', user.id)
        .single()
        .then(({ data }) => {
          if (data?.invitation_code) setInvitationCode(data.invitation_code);
        });
      
      // Fetch analytics
      Promise.all([
        supabase
          .from('store_invite_analytics')
          .select('id', { count: 'exact', head: true })
          .eq('store_id', user.id)
          .eq('event_type', 'visit'),
        supabase
          .from('store_invite_analytics')
          .select('id', { count: 'exact', head: true })
          .eq('store_id', user.id)
          .eq('event_type', 'purchase'),
      ]).then(([visitsRes, purchasesRes]) => {
        setInviteAnalytics({
          visits: visitsRes.count || 0,
          purchases: purchasesRes.count || 0,
        });
      });
    }
  }, [user, supabase]);

  // Conversion Analytics
  let conversionRate = null;
  if (inviteAnalytics && inviteAnalytics.visits > 0) {
    conversionRate = ((inviteAnalytics.purchases / inviteAnalytics.visits) * 100).toFixed(1);
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isPostLogin = urlParams.has('post_login');

    if (isPostLogin) {
      console.log('🔄 [Store Dashboard] Detected post-login redirect');
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      setTimeout(() => setIsHydrated(true), 500);
    } else {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/login');
          return;
        }

        setUser(session.user);
        const dashboardStats = await getStoreDashboardStats(session.user.id);
        setStats(dashboardStats);
        
      } catch (err) {
        console.error('❌ [Store Dashboard] Error:', err);
        setError(err instanceof Error ? err.message : 'Error loading dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [isHydrated, router, supabase]);

  if (!isHydrated || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-4">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-4 py-3 rounded">
          No data available
        </div>
      </div>
    );
  }

  // Beautiful dashboard cards using available StoreStats properties
  const dashboardCards = [
    {
      title: 'إجمالي المنتجات',
      value: stats.totalProducts ?? 0,
      icon: 'settings' as IconKey,
      href: '/store/products',
      color: 'bg-blue-500',
      description: 'عدد المنتجات في متجرك'
    },
    {
      title: 'الطلبات النشطة',
      value: stats.activeOrders ?? 0,
      icon: 'dashboard' as IconKey,
      href: '/store/orders',
      color: 'bg-green-500',
      description: 'الطلبات قيد التنفيذ'
    },
    {
      title: 'الإيرادات الشهرية',
      value: formatCurrency(stats.monthlyRevenue ?? 0),
      icon: 'marketing' as IconKey,
      href: '/store/analytics',
      color: 'bg-purple-500',
      description: 'إجمالي المبيعات هذا الشهر'
    },    {
      title: 'إجمالي الطلبات',
      value: stats.totalOrders ?? 0,
      icon: 'design' as IconKey,
      href: '/store/orders',
      color: 'bg-indigo-500',
      description: 'عدد الطلبات الإجمالي'
    },
    {
      title: 'أكواد الخصم النشطة',
      value: stats.activePromoCodes ?? 0,
      icon: 'calculator' as IconKey,
      href: '/store/promo-code',
      color: 'bg-orange-500',
      description: 'أكواد الخصم المتاحة'
    },    {
      title: 'إجمالي المبيعات',
      value: formatCurrency(stats.totalRevenue ?? 0),
      icon: 'ai' as IconKey,
      href: '/store/analytics',
      color: 'bg-emerald-500',
      description: 'إجمالي قيمة المبيعات'
    },
  ];
  const quickActions = [
    { 
      title: 'نظام ERP المتقدم', 
      href: '/store/erp/dashboard', 
      icon: 'dashboard' as IconKey,
      description: 'إدارة متكاملة للأعمال (ERPNext)'
    },
    { 
      title: 'إضافة منتج جديد', 
      href: '/store/products/new', 
      icon: 'design' as IconKey,
      description: 'أضف منتج جديد لمتجرك'
    },
    { 
      title: 'إنشاء فاتورة جديدة', 
      href: '/store/invoices/create', 
      icon: 'settings' as IconKey,
      description: 'إنشاء فاتورة للعميل'
    },
    { 
      title: 'استيراد منتجات Excel', 
      href: '/store/products/import', 
      icon: 'ai' as IconKey,
      description: 'استيراد منتجات من ملف Excel'
    },
    { 
      title: 'ماسح الباركود', 
      href: '/barcode-scanner', 
      icon: 'calculator' as IconKey,
      description: 'مسح الباركود لإدارة المخزون'
    },
  ];

  return (
    <SimpleLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            مرحباً، {user?.store_name || user?.email?.split('@')[0] || 'المتجر'}! 🏪
          </h1>
          <p className="text-blue-100 text-sm sm:text-base">إليك نظرة عامة على متجرك ومبيعاتك</p>
        </div>

        {/* Stock Alerts */}
        {user?.id && <StockAlerts userId={user.id} />}

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardCards.map((card, index) => (
            <Link key={index} href={card.href} className="block">
              <div className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 p-6 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${card.color} p-3 rounded-lg`}>
                    <ClientIcon type={card.icon} size={24} className="text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 mb-1">{card.title}</p>
                  <p className="text-xs text-gray-500">{card.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Invitation Code Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">رمز الدعوة الخاص بالمتجر</h2>
          {invitationCode ? (
            <div className="font-mono text-blue-700 bg-blue-50 rounded-lg p-3 text-center text-lg mb-4">
              {formatInvitationCode(invitationCode)}
            </div>
          ) : (
            <div className="text-gray-500 text-center p-4">لا يوجد رمز دعوة متاح حالياً</div>
          )}
          <div className="text-sm text-gray-600 text-center mb-4">
            شارك هذا الرمز مع العملاء لزيارة متجرك مباشرة أو تتبع عمليات الشراء المرتبطة بك.
          </div>
          {inviteAnalytics && (
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="font-bold text-2xl text-blue-700">{inviteAnalytics.visits}</div>
                <div className="text-sm text-blue-600">زيارات عبر الرمز</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="font-bold text-2xl text-green-700">{inviteAnalytics.purchases}</div>
                <div className="text-sm text-green-600">مشتريات عبر الرمز</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="font-bold text-2xl text-purple-700">
                  {conversionRate !== null ? `${conversionRate}%` : '--'}
                </div>
                <div className="text-sm text-purple-600">معدل التحويل</div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">إجراءات سريعة أساسية</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href} className="block">
                <div className="bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors border">
                  <ClientIcon type={action.icon} size={32} className="mx-auto mb-3 text-blue-600" />
                  <h3 className="font-medium text-gray-800 text-sm mb-1">{action.title}</h3>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">النشاط الأخير</h2>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-blue-50 rounded-lg">
              <div className="bg-blue-100 p-3 rounded-lg ml-4">
                <ClientIcon type="dashboard" size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">مرحباً بك في منصة بناء</p>
                <p className="text-sm text-gray-600">ابدأ رحلتك في إدارة متجرك بكفاءة</p>
              </div>
            </div>

            {!stats.recentOrders?.length ? (
              <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
                <div className="bg-yellow-100 p-3 rounded-lg ml-4">
                  <ClientIcon type="dashboard" size={20} className="text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">لا توجد طلبات حديثة</p>
                  <p className="text-sm text-gray-600">ستظهر هنا الطلبات الجديدة عند وصولها</p>
                </div>
              </div>
            ) : (
              stats.recentOrders.map((order: any, index: number) => (
                <div key={index} className="flex items-center p-4 bg-green-50 rounded-lg">
                  <div className="bg-green-100 p-3 rounded-lg ml-4">
                    <ClientIcon type="settings" size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">طلب جديد #{order.id}</p>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(order.total_amount || 0)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Real-time Order Tracking */}
        {user?.id && <RealtimeOrderTracking userId={user.id} maxOrders={5} />}
      </div>
    </SimpleLayout>
  );
}
