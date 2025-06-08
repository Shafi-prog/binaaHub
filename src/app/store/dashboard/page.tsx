'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { getStoreDashboardStats, type StoreStats } from '@/lib/api/store-dashboard';
import { StatCard, RecentOrdersTable } from '@/components/store/DashboardComponents';
import { LoadingSpinner } from '@/components/ui';
import { 
  Typography, 
  EnhancedCard, 
  EnhancedButton, 
  EnhancedBadge 
} from '@/components/ui/enhanced-components';
import { formatCurrency } from '@/lib/utils';
import { verifyAuthWithRetry } from '@/lib/auth-recovery';
import { ClientIcon } from '@/components/icons';
import type { IconKey } from '@/components/icons/ClientIcon';

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
  const [cookieInfo, setCookieInfo] = useState<string[]>([]);
  const [showDebug, setShowDebug] = useState(false);
  const [headerInfo, setHeaderInfo] = useState<any>(null);
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  // Invitation code state
  const [invitationCode, setInvitationCode] = useState<string | null>(null);
  // Invitation code analytics state
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
      // Fetch analytics (manual count)
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

  // Check if this is a post-login redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isPostLogin = urlParams.has('post_login');

    if (isPostLogin) {
      console.log('🔄 [Store Dashboard] Detected post-login redirect');
      // Clean up the URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);

      // Add a small delay for post-login processing
      setTimeout(() => {
        setIsHydrated(true);
      }, 500);
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

        // Check cookies for debugging
        const cookies = document.cookie.split(';').map((c) => c.trim());
        setCookieInfo(cookies);
        console.log('🍪 [StoreDashboard] الكوكيز المتوفرة:', cookies);

        // Get session
        const {
          data: { session },
        } = await supabase.auth.getSession();
        console.log('🔐 [StoreDashboard] حالة الجلسة:', session ? 'موجودة' : 'غير موجودة');

        if (!session) {
          console.warn('⚠️ [StoreDashboard] لا توجد جلسة، التوجيه لصفحة تسجيل الدخول');
          router.push('/login');
          return;
        }

        // Get debugging info from API
        try {
          const response = await fetch('/api/debug-headers');
          if (response.ok) {
            const data = await response.json();
            setHeaderInfo(data);
            console.log('🔍 [StoreDashboard] معلومات الهيدر:', data);
          }
        } catch (error) {
          console.error('❌ [StoreDashboard] خطأ في جلب معلومات الهيدر:', error);
        }

        console.log('👤 [StoreDashboard] المستخدم:', session.user.email);
        setUser(session.user);

        // Get store stats
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
  }, [isHydrated, router]);

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

  const dashboardCards = [
    {
      title: 'إجمالي المنتجات',
      value: stats?.totalProducts ?? 0,
      icon: 'settings' as IconKey,
      href: '/store/products',
      color: 'bg-blue-500',
    },
    {
      title: 'الطلبات النشطة',
      value: stats?.activeOrders ?? 0,
      icon: 'dashboard' as IconKey,
      href: '/store/orders',
      color: 'bg-green-500',
    },
    {
      title: 'الإيرادات الشهرية',
      value: `${formatCurrency(stats?.monthlyRevenue ?? 0)}`,
      icon: 'marketing' as IconKey,
      href: '/store/balance',
      color: 'bg-purple-500',
    },
    {
      title: 'أكواد الخصم النشطة',
      value: stats?.activePromoCodes ?? 0,
      icon: 'calculator' as IconKey,
      href: '/store/promo-code',
      color: 'bg-orange-500',
    },
  ];

  const quickActions = [
    { title: 'إضافة منتج جديد', href: '/store/products/new', icon: 'design' as IconKey },
    { title: 'إدارة الطلبات', href: '/store/orders', icon: 'settings' as IconKey },
    { title: 'حملة تسويقية', href: '/store/marketing', icon: 'marketing' as IconKey },
    { title: 'إحصائيات المبيعات', href: '/store/analytics', icon: 'dashboard' as IconKey },
    { title: 'استيراد منتجات Excel', href: '/store/products/import', icon: 'ai' as IconKey },
    { title: 'ماسح الباركود', href: '/barcode-scanner', icon: 'calculator' as IconKey },
  ];

  return (
    <main className="min-h-screen bg-gray-50 font-tajawal">
      <div className="container mx-auto px-6 py-8">
        {/* Success Message */}
        <div className="bg-green-100 p-4 mb-6 rounded-lg">
          <p className="text-green-700 font-bold">
            ✅ تم تسجيل الدخول بنجاح! أنت الآن في صفحة لوحة تحكم المتجر المحمية.
          </p>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            مرحباً، {user?.store_name || user?.email?.split('@')[0] || 'المتجر'}! 🏪
          </h1>
          <p className="text-gray-600">إليك نظرة عامة على متجرك ومبيعاتك</p>
        </div>

        {/* Debug Toggle */}
        <div className="mb-6">
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg text-sm"
          >
            {showDebug ? 'إخفاء معلومات التصحيح' : 'عرض معلومات التصحيح'}
          </button>

          {showDebug && (
            <div className="mt-4 bg-white p-4 rounded-lg shadow border">
              <h3 className="font-bold mb-2">معلومات الكوكيز والجلسة:</h3>

              <div className="mb-4">
                <h4 className="font-medium text-sm mb-1">الكوكيز المتوفرة في المتصفح:</h4>
                <div className="bg-gray-50 p-3 rounded text-xs font-mono max-h-40 overflow-y-auto">
                  {cookieInfo.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {cookieInfo.map((cookie, idx) => (
                        <li key={idx}>{cookie}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-red-500">لا توجد كوكيز</p>
                  )}
                </div>
              </div>
            </div>
          )}
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

        {/* Invitation Code and Analytics */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">رمز الدعوة الخاص بالمتجر</h2>
          {invitationCode ? (
            <div className="font-mono text-blue-700 bg-blue-50 rounded p-2 text-center text-lg mb-2">
              {formatInvitationCode(invitationCode)}
            </div>
          ) : (
            <div className="text-gray-500">لا يوجد رمز دعوة متاح حالياً</div>
          )}
          <div className="text-sm text-gray-600 text-center mb-2">
            شارك هذا الرمز مع العملاء لزيارة متجرك مباشرة أو تتبع عمليات الشراء المرتبطة بك.
          </div>
          {inviteAnalytics && (
            <div className="flex justify-center gap-8 mt-2">
              <div className="text-center">
                <div className="font-bold text-lg text-blue-700">{inviteAnalytics.visits}</div>
                <div className="text-xs text-gray-500">زيارات عبر الرمز</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-green-700">{inviteAnalytics.purchases}</div>
                <div className="text-xs text-gray-500">مشتريات عبر الرمز</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-purple-700">
                  {conversionRate !== null ? `${conversionRate}%` : '--'}
                </div>
                <div className="text-xs text-gray-500">معدل التحويل</div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">إجراءات سريعة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
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
                <p className="text-sm text-gray-600">ابدأ رحلتك في إدارة متجرك</p>
              </div>
            </div>

            {!stats.recentOrders?.length ? (
              <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                <div className="bg-yellow-100 p-2 rounded-lg ml-3">
                  <ClientIcon type="dashboard" size={20} className="text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">لا توجد طلبات حديثة</p>
                  <p className="text-sm text-gray-600">ستظهر هنا الطلبات الجديدة عند وصولها</p>
                </div>
              </div>
            ) : (
              stats.recentOrders.map((order: any, index: number) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="bg-green-100 p-2 rounded-lg ml-3">
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
      </div>
    </main>
  );
}
