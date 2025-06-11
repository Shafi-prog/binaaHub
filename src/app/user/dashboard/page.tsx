'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { getUserDashboardStats, type UserDashboardStats } from '@/lib/api/user-dashboard';
import { LoadingSpinner } from '@/components/ui';
import {
  Typography,
  EnhancedCard,
  Button,
  EnhancedBadge
} from '@/components/ui/enhanced-components';
import { StatCard } from '@/components/ui';
import { formatCurrency, translateStatus } from '@/lib/utils';
import { verifyAuthWithRetry } from '@/lib/auth-recovery';
import { ClientIcon } from '@/components/icons';
import type { IconKey } from '@/components/icons/ClientIcon';

function formatInvitationCode(code: string) {
  if (!code) return '';
  return code.startsWith('BinnaHub - ') ? code : `BinnaHub - ${code}`;  
}

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

  // Invitation code analytics state
  const [invitationCode, setInvitationCode] = useState<string | null>(null);
  const [inviteAnalytics, setInviteAnalytics] = useState<{ visits: number; purchases: number } | null>(null);

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

  useEffect(() => {
    if (user && user.id) {
      // Fetch invitation code
      supabase
        .from('users')
        .select('invitation_code')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data?.invitation_code) setInvitationCode(data.invitation_code);
        });
      // Fetch analytics (manual count)
      Promise.all([
        supabase
          .from('user_invite_analytics')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('event_type', 'visit'),
        supabase
          .from('user_invite_analytics')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('event_type', 'purchase'),
      ]).then(([visitsRes, purchasesRes]) => {
        setInviteAnalytics({
          visits: visitsRes.count || 0,
          purchases: purchasesRes.count || 0,
        });
      });
    }
  }, [user, supabase]);

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
  ];  const quickActions = [
    { title: 'إنشاء مشروع جديد', href: '/user/projects/new', icon: 'design' as IconKey },
    { title: 'تصفح المشاريع', href: '/projects/', icon: 'money' as IconKey },
    { title: 'طلب خدمة تصميم', href: '/user/services/design', icon: 'ai' as IconKey },
    { title: 'حاسبة التكاليف', href: '/user/services/calculators', icon: 'calculator' as IconKey },
    { title: 'تتبع الإنفاق', href: '/user/spending-tracking', icon: 'chart' as IconKey },
    { title: 'إدارة الضمانات', href: '/user/warranties', icon: 'settings' as IconKey },
    { title: 'لوحة العمولات', href: '/user/commissions', icon: 'marketing' as IconKey },
    { title: 'إدارة المشرفين', href: '/user/supervisors', icon: 'dashboard' as IconKey },
    { title: 'ماسح الباركود', href: '/barcode-scanner', icon: 'calculator' as IconKey },
  ];

  let conversionRate = null;
  if (inviteAnalytics && inviteAnalytics.visits > 0) {
    conversionRate = ((inviteAnalytics.purchases / inviteAnalytics.visits) * 100).toFixed(1);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 font-tajawal">
      <div className="container mx-auto px-6 py-8">
        {/* Success Message */}
        <EnhancedCard variant="elevated" className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <ClientIcon type="shield" size={20} className="text-green-600" />
            </div>
            <div>
              <Typography variant="subheading" size="lg" weight="semibold" className="text-green-800 mb-1">
                تم تسجيل الدخول بنجاح!
              </Typography>
              <Typography variant="body" size="sm" className="text-green-700">
                أنت الآن في صفحة لوحة التحكم المحمية
              </Typography>
            </div>
          </div>
        </EnhancedCard>

        {/* Header */}
        <div className="mb-8">
          <Typography variant="heading" size="3xl" weight="bold" className="text-gray-800 mb-3">
            مرحباً، {user?.user_metadata?.name || user?.email?.split('@')[0] || 'المستخدم'}! 👋
          </Typography>
          <Typography variant="body" size="lg" className="text-gray-600">
            إليك نظرة عامة على حسابك ومشاريعك
          </Typography>
        </div>

        {/* Debug Toggle */}
        <div className="mb-6">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowDebug(!showDebug)}
          >
            {showDebug ? 'إخفاء معلومات التصحيح' : 'عرض معلومات التصحيح'}
          </Button>

          {showDebug && (
            <EnhancedCard variant="outlined" className="mt-4">
              <Typography variant="subheading" size="lg" weight="semibold" className="mb-4">
                معلومات الكوكيز والجلسة:
              </Typography>

              <div className="mb-4">
                <Typography variant="label" size="sm" className="mb-2"> 
                  الكوكيز المتوفرة في المتصفح:
                </Typography>
                <div className="bg-gray-50 p-3 rounded-lg text-xs font-mono max-h-40 overflow-y-auto">
                  {cookieInfo.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {cookieInfo.map((cookie, idx) => (
                        <li key={idx}>{cookie}</li>
                      ))}
                    </ul>
                  ) : (
                    <Typography variant="body" size="sm" className="text-red-500">
                      لا توجد كوكيز
                    </Typography>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <Typography variant="label" size="sm" className="mb-2"> 
                  معلومات HTTP Header:
                </Typography>
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
            </EnhancedCard>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <Link key={index} href={card.href} className="block">       
              <EnhancedCard variant="elevated" hover className="p-6 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">     
                  <div>
                    <Typography variant="caption" size="sm" className="text-gray-600 mb-1">
                      {card.title}
                    </Typography>
                    <Typography variant="heading" size="2xl" weight="bold" className="text-gray-800">
                      {card.value}
                    </Typography>
                  </div>
                  <div className={`${card.color} p-3 rounded-xl shadow-lg`}>
                    <ClientIcon type={card.icon} size={24} className="text-white" />
                  </div>
                </div>
              </EnhancedCard>
            </Link>
          ))}
        </div>

        {/* Invitation Code Analytics */}
        {invitationCode && (
          <EnhancedCard variant="elevated" className="mb-8 p-6">        
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="font-mono text-blue-800 mb-2">رمز الدعوة: {formatInvitationCode(invitationCode)}</div>
                <div className="text-xs text-gray-700 mb-2">شارك هذا الرمز مع أصدقائك أو العملاء ليحصلوا على مزايا، وستحصل أنت على عمولة عند استخدامه.</div>
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="font-bold text-lg text-blue-700">{inviteAnalytics?.visits ?? 0}</div>
                    <div className="text-xs text-gray-500">زيارات عبر الرمز</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-green-700">{inviteAnalytics?.purchases ?? 0}</div>
                    <div className="text-xs text-gray-500">عمليات شراء عبر الرمز</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-indigo-700">{conversionRate ?? 0}%</div>
                    <div className="text-xs text-gray-500">معدل التحويل</div>
                  </div>
                </div>
              </div>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-mono"
                onClick={() => {
                  if (invitationCode) {
                    navigator.clipboard.writeText(invitationCode);      
                  }
                }}
              >نسخ رمز الدعوة</button>
            </div>
          </EnhancedCard>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-800 mb-6">
            إجراءات سريعة
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href} className="block">   
                <EnhancedCard
                  variant="elevated"
                  hover
                  className="p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <ClientIcon type={action.icon} size={32} className="text-blue-600" />
                  </div>
                  <Typography variant="body" size="md" weight="medium" className="text-gray-800">
                    {action.title}
                  </Typography>
                </EnhancedCard>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <EnhancedCard variant="elevated" className="p-8">
          <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-800 mb-6">
            النشاط الأخير
          </Typography>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center ml-4">        
                <ClientIcon type="dashboard" size={20} className="text-blue-600" />
              </div>
              <div>
                <Typography variant="body" size="md" weight="medium" className="text-gray-800">
                  مرحباً بك في منصة بناء
                </Typography>
                <Typography variant="caption" size="sm" className="text-gray-600">
                  ابدأ رحلتك في إدارة مشاريع البناء
                </Typography>
              </div>
            </div>

            {stats.recentProjects?.map((project: any) => (
              <div key={project.id} className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center ml-4">    
                  <ClientIcon type="design" size={20} className="text-green-600" />
                </div>
                <div>
                  <Typography variant="body" size="md" weight="medium" className="text-gray-800">
                    {project.name}
                  </Typography>
                  <EnhancedBadge variant="success" size="sm">
                    {translateStatus(project.status)}
                  </EnhancedBadge>
                </div>
              </div>
            ))}
          </div>
        </EnhancedCard>
      </div>
    </main>
  );
}
