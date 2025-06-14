'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
import { verifyTempAuth, type TempAuthUser } from '@/lib/temp-auth';
import { ClientIcon } from '@/components/icons';
import type { IconKey } from '@/components/icons/ClientIcon';
import AIExpenseTracker from '@/components/ai/AIExpenseTracker';
import ConstructionProgressTracker from '@/components/ai/ConstructionProgressTracker';
import PDFBlueprintAnalyzer from '@/components/ai/PDFBlueprintAnalyzer';

function formatInvitationCode(code: string) {
  if (!code) return '';
  
  // Clean up any duplicates or malformed codes
  let cleanCode = code;
  
  // Remove various forms of duplication
  if (cleanCode.includes('BinnaHub - BinnaHub-')) {
    cleanCode = cleanCode.replace('BinnaHub - BinnaHub-', 'BinnaHub-');
  }
  
  if (cleanCode.includes('BinnaHub-BinnaHub-')) {
    cleanCode = cleanCode.replace('BinnaHub-BinnaHub-', 'BinnaHub-');
  }
  
  // Ensure it starts with BinnaHub- and only once
  if (cleanCode.startsWith('BinnaHub-')) {
    return cleanCode;
  }
  
  // If it doesn't start with BinnaHub-, add it
  return `BinnaHub-${cleanCode}`;
}

export default function UserDashboard() {
  const [user, setUser] = useState<TempAuthUser | null>(null);
  const [stats, setStats] = useState<UserDashboardStats | null>(null);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [cookieInfo, setCookieInfo] = useState<string[]>([]);
  const [showDebug, setShowDebug] = useState(false);
  const [headerInfo, setHeaderInfo] = useState<any>(null);
  const router = useRouter();
  // Invitation code analytics state
  const [invitationCode, setInvitationCode] = useState<string | null>(null);
  const [inviteAnalytics, setInviteAnalytics] = useState<{ visits: number; purchases: number } | null>(null);
  // Check if this is a post-login redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);      
    const isPostLogin = urlParams.has('post_login');

    if (isPostLogin) {
      console.log('🔄 [User Dashboard] Detected post-login redirect, cleaning URL');  
      // Remove the post_login parameter from URL immediately
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
    
    // Always set hydrated to true after a short delay to ensure middleware processing
    setTimeout(() => setIsHydrated(true), 300);
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
        console.log('🍪 [UserDashboard] Cookies available:', cookies);        console.log('🔐 [User Dashboard] Starting auth verification...');
        const authResult = await verifyTempAuth(5);

        if (!authResult?.user) {
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
      // TODO: Replace with API calls that work with our new auth system
      // For now, set placeholder values
      setInvitationCode('BinnaHub-' + Math.random().toString(36).substring(2, 8));
      setInviteAnalytics({
        visits: 0,
        purchases: 0,
      });
    }
  }, [user]);

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
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      description: 'مشاريعك الحالية قيد التنفيذ',
      change: '+3',
      trend: 'up'
    },
    {
      title: 'الطلبات المكتملة',
      value: stats.completedOrders,
      icon: 'settings' as IconKey,
      href: '/user/orders',
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      description: 'طلبات تم إنجازها بنجاح',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'إجمالي الإنفاق',
      value: `${formatCurrency(stats.totalOrders)}`,
      icon: 'money' as IconKey,
      href: '/user/spending-tracking',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      description: 'إجمالي المبلغ المنفق',
      change: '+8%',
      trend: 'up'
    },
    {
      title: 'الضمانات النشطة',
      value: stats.activeWarranties,
      icon: 'shield' as IconKey,
      href: '/user/warranties',
      color: 'bg-gradient-to-br from-orange-500 to-orange-600',
      description: 'ضمانات سارية المفعول',
      change: '+2',
      trend: 'up'
    },
  ];  const quickActions = [
    { 
      title: 'إنشاء مشروع جديد', 
      href: '/user/projects/new', 
      icon: 'design' as IconKey,
      color: 'from-blue-50 to-blue-100 border-blue-100',
      hoverColor: 'group-hover:from-blue-100 group-hover:to-blue-200 group-hover:border-blue-200',
      iconColor: 'text-blue-600 group-hover:text-blue-700',
      textColor: 'group-hover:text-blue-900',
      description: 'ابدأ مشروع بناء جديد'
    },
    { 
      title: 'طلب خدمة تصميم', 
      href: '/user/services/design', 
      icon: 'ai' as IconKey,
      color: 'from-purple-50 to-purple-100 border-purple-100',
      hoverColor: 'group-hover:from-purple-100 group-hover:to-purple-200 group-hover:border-purple-200',
      iconColor: 'text-purple-600 group-hover:text-purple-700',
      textColor: 'group-hover:text-purple-900',
      description: 'خدمات التصميم المعماري'
    },
    { 
      title: 'إدارة الضمانات', 
      href: '/user/warranties', 
      icon: 'shield' as IconKey,
      color: 'from-emerald-50 to-emerald-100 border-emerald-100',
      hoverColor: 'group-hover:from-emerald-100 group-hover:to-emerald-200 group-hover:border-emerald-200',
      iconColor: 'text-emerald-600 group-hover:text-emerald-700',
      textColor: 'group-hover:text-emerald-900',
      description: 'إدارة ضمانات المنتجات'
    },
    { 
      title: 'لوحة العمولات', 
      href: '/user/commissions', 
      icon: 'marketing' as IconKey,
      color: 'from-teal-50 to-teal-100 border-teal-100',
      hoverColor: 'group-hover:from-teal-100 group-hover:to-teal-200 group-hover:border-teal-200',
      iconColor: 'text-teal-600 group-hover:text-teal-700',
      textColor: 'group-hover:text-teal-900',
      description: 'تتبع العمولات والأرباح'
    },
    { 
      title: 'إدارة المشرفين', 
      href: '/user/supervisors', 
      icon: 'users' as IconKey,
      color: 'from-rose-50 to-rose-100 border-rose-100',
      hoverColor: 'group-hover:from-rose-100 group-hover:to-rose-200 group-hover:border-rose-200',
      iconColor: 'text-rose-600 group-hover:text-rose-700',
      textColor: 'group-hover:text-rose-900',
      description: 'إدارة فريق العمل'
    },
    { 
      title: 'ماسح الباركود', 
      href: '/barcode-scanner', 
      icon: 'calculator' as IconKey,
      color: 'from-orange-50 to-orange-100 border-orange-100',
      hoverColor: 'group-hover:from-orange-100 group-hover:to-orange-200 group-hover:border-orange-200',
      iconColor: 'text-orange-600 group-hover:text-orange-700',
      textColor: 'group-hover:text-orange-900',
      description: 'مسح الباركود للمنتجات'
    },
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
            مرحباً، {user?.name || user?.email?.split('@')[0] || 'المستخدم'}! 👋
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
        </div>        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <Link key={index} href={card.href} className="block group">       
              <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1">
                {/* Gradient Background */}
                <div className={`absolute inset-0 ${card.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Content */}
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">     
                    <div className={`${card.color} p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                      <ClientIcon type={card.icon} size={24} className="text-white" />
                    </div>
                    {card.change && (
                      <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        {card.change}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2 group-hover:text-gray-700 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
                      {card.value}
                    </p>
                    <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors">
                      {card.description}
                    </p>
                  </div>

                  {/* Hover Indicator */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </div>
              </div>
            </Link>
          ))}
        </div>        {/* Invitation Code Analytics */}
        {invitationCode && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">رمز الدعوة الخاص بك</h2>
            <div className="font-mono text-blue-700 bg-blue-50 rounded-lg p-3 text-center text-lg mb-4">
              {formatInvitationCode(invitationCode)}
            </div>
            <div className="text-sm text-gray-600 text-center mb-4">
              شارك هذا الرمز مع أصدقائك أو العملاء ليحصلوا على مزايا، وستحصل أنت على عمولة عند استخدامه.
            </div>
            {inviteAnalytics && (
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="font-bold text-2xl text-blue-700">{inviteAnalytics.visits}</div>
                  <div className="text-sm text-blue-600">زيارات عبر الرمز</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="font-bold text-2xl text-green-700">{inviteAnalytics.purchases}</div>
                  <div className="text-sm text-green-600">عمليات شراء عبر الرمز</div>
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
        )}        {/* Features Section with Free/Paid Tiers */}
        <div className="mb-8" id="ai-features">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <ClientIcon type="ai" size={20} className="text-white" />
            </div>
            <div>
              <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-800">
                الميزات المدعومة بالذكاء الاصطناعي
              </Typography>
              <Typography variant="body" size="sm" className="text-gray-600">
                استخدم التقنيات المتقدمة لتتبع مصروفاتك وتقدم مشاريعك
              </Typography>
            </div>
          </div>

          {/* Free Tier Features */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                مجاني
              </span>
              <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-800">
                الميزات المجانية
              </Typography>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* PDF Blueprint Analyzer - Free */}
              <div id="pdf-blueprint-analyzer">
                <PDFBlueprintAnalyzer />
              </div>
              
              {/* Free tier placeholder */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClientIcon type="shield" size={32} className="text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">المزيد من الميزات المجانية قريباً</h3>
                  <p className="text-gray-600 text-sm">سنضيف المزيد من الأدوات المجانية لمساعدتك في إدارة مشاريعك</p>
                </div>
              </div>
            </div>
          </div>          {/* Premium Tier Features */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                مدفوع
              </span>
              <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-800">
                الميزات المتقدمة
              </Typography>
              <span className="text-sm text-gray-500">- ابتداءً من 29 ريال/شهر</span>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* AI Expense Tracker - Premium */}
              <div className="relative" id="ai-expense-tracker">
                <div className="absolute top-2 right-2 z-20">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs font-medium px-2 py-1 rounded-full shadow-lg">
                    مدفوع
                  </span>
                </div>
                <div className="relative">
                  {user?.id && (
                    <AIExpenseTracker 
                      userId={user.id}
                      onExpenseAdded={(expense) => {
                        console.log('New expense added:', expense);
                        // Refresh dashboard stats if needed
                      }}
                    />
                  )}
                  {/* Premium Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-purple-900/40 to-transparent rounded-xl flex items-end justify-center p-4">
                    <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg font-medium text-sm hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                      🚀 ترقية للنسخة المدفوعة - 29 ريال/شهر
                    </button>
                  </div>
                </div>
              </div>

              {/* Construction Progress Tracker - Premium */}
              <div className="relative" id="construction-progress">
                <div className="absolute top-2 right-2 z-20">
                  <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-medium px-2 py-1 rounded-full shadow-lg">
                    مدفوع
                  </span>
                </div>
                <div className="relative">
                  {user?.id && (
                    <ConstructionProgressTracker
                      userId={user.id}
                      projectId={stats?.activeProjects > 0 ? 'project-1' : undefined}
                    />
                  )}
                  {/* Premium Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/40 to-transparent rounded-xl flex items-end justify-center p-4">
                    <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium text-sm hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                      🏗️ ترقية للنسخة المدفوعة - 29 ريال/شهر
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-800 mb-6">
            إجراءات سريعة
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href} className="block group">
                <div className={`bg-gradient-to-br ${action.color} rounded-lg p-4 text-center ${action.hoverColor} transition-all duration-300 border transform group-hover:scale-105 group-hover:shadow-md`}>
                  <ClientIcon type={action.icon} size={32} className={`mx-auto mb-3 ${action.iconColor}`} />
                  <h3 className={`font-medium text-gray-800 text-sm mb-1 ${action.textColor}`}>{action.title}</h3>
                  <p className={`text-xs text-gray-500 ${action.textColor}`}>{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>{/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-800 mb-6">
            النشاط الأخير
          </Typography>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <div className="bg-blue-100 p-3 rounded-lg ml-4">        
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
              <div key={project.id} className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                <div className="bg-green-100 p-3 rounded-lg ml-4">    
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
          </div>        </div>
      </div>
    </main>
  );
}
