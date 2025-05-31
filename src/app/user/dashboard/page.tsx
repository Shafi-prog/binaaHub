'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { getUserDashboardStats, type UserDashboardStats } from '@/lib/api/user-dashboard';
import { LoadingSpinner } from '@/components/ui';
import { formatCurrency, translateStatus } from '@/lib/utils';
import { verifyAuthWithRetry } from '@/lib/auth-recovery';
import { ClientIcon } from '@/components/icons';
import type { IconKey } from '@/components/icons/ClientIcon';

export default function UserDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<UserDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [cookieInfo, setCookieInfo] = useState<string[]>([]);
  const [showDebug, setShowDebug] = useState(false);
  const [headerInfo, setHeaderInfo] = useState<any>(null);
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  // Check if this is a post-login redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isPostLogin = urlParams.has('post_login');

    if (isPostLogin) {
      console.log('🔄 [User Dashboard] Detected post-login redirect');
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

        // Check cookies for debugging
        const cookies = document.cookie.split(';').map((c) => c.trim());
        setCookieInfo(cookies);
        console.log('🍪 [UserDashboard] Cookies available:', cookies);

        console.log('🔐 [User Dashboard] Starting auth verification...');
        const authResult = await verifyAuthWithRetry(5);

        if (!authResult.user) {
          console.log('❌ [User Dashboard] Auth failed, redirecting to login');
          setError('Authentication session not found');
          setTimeout(() => router.push('/login'), 2000);
          return;
        }

        // Get debugging info from API
        try {
          const response = await fetch('/api/debug-headers');
          if (response.ok) {
            const data = await response.json();
            setHeaderInfo(data);
            console.log('🔍 [UserDashboard] Header info:', data);
          }
        } catch (error) {
          console.error('❌ [UserDashboard] Error fetching header info:', error);
        }

        setUser(authResult.user);
        console.log('✅ [User Dashboard] Auth verified:', authResult.user.email);

        // Get user dashboard stats
        const dashboardStats = await getUserDashboardStats(authResult.user.id);
        setStats(dashboardStats);
      } catch (err) {
        console.error('❌ [User Dashboard] Error:', err);
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
      title: 'المشاريع النشطة',
      value: stats.activeProjects,
      icon: 'dashboard' as IconKey,
      href: '/user/projects',
      color: 'bg-blue-500',
    },
    {
      title: 'الطلبات المكتملة',
      value: stats.completedProjects,
      icon: 'settings' as IconKey,
      href: '/user/orders',
      color: 'bg-green-500',
    },
    {
      title: 'إجمالي الإنفاق',
      value: `${formatCurrency(stats.totalOrders)}`,
      icon: 'money' as IconKey,
      href: '/user/spending-tracking',
      color: 'bg-purple-500',
    },
    {
      title: 'الضمانات النشطة',
      value: stats.activeWarranties,
      icon: 'shield' as IconKey,
      href: '/user/warranties',
      color: 'bg-orange-500',
    },
  ];

  const quickActions = [
    { title: 'إنشاء مشروع جديد', href: '/user/projects/new', icon: 'design' as IconKey },
    { title: 'طلب خدمة تصميم', href: '/user/services/design', icon: 'ai' as IconKey },
    { title: 'حاسبة التكاليف', href: '/user/services/calculators', icon: 'calculator' as IconKey },
    { title: 'تتبع الإنفاق', href: '/user/spending-tracking', icon: 'chart' as IconKey },
  ];

  return (
    <main className="min-h-screen bg-gray-50 font-tajawal">
      <div className="container mx-auto px-6 py-8">
        {/* Success Message */}
        <div className="bg-green-100 p-4 mb-6 rounded-lg">
          <p className="text-green-700 font-bold">
            ✅ تم تسجيل الدخول بنجاح! أنت الآن في صفحة لوحة التحكم المحمية.
          </p>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            مرحباً، {user?.user_metadata?.name || user?.email?.split('@')[0] || 'المستخدم'}! 👋
          </h1>
          <p className="text-gray-600">إليك نظرة عامة على حسابك ومشاريعك</p>
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

              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-medium text-sm mb-1">معلومات HTTP Header:</h4>
                <div className="text-xs font-mono overflow-x-auto max-h-40">
                  <pre>{headerInfo ? JSON.stringify(headerInfo, null, 2) : 'جاري التحميل...'}</pre>
                </div>
              </div>

              <div className="mt-4">
                <Link
                  href="/final-cookie-verification.html"
                  className="text-blue-600 hover:underline text-sm"
                  target="_blank"
                >
                  فتح أداة فحص الكوكيز
                </Link>
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

            {stats.recentProjects?.map((project: any) => (
              <div key={project.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="bg-green-100 p-2 rounded-lg ml-3">
                  <ClientIcon type="design" size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{project.name}</p>
                  <p className="text-sm text-gray-600">{translateStatus(project.status)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
