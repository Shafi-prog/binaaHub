'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getStoreDashboardStats, type StoreStats } from '@/lib/api/store-dashboard';
import { LoadingSpinner } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { ClientIcon } from '@/components/icons';
import type { IconKey } from '@/components/icons/ClientIcon';
import SimpleLayout from '@/components/layouts/SimpleLayout';
import { StockAlerts } from '@/hooks/useStockMonitoring';
import RealtimeOrderTracking from '@/components/store/RealtimeOrderTracking';
import ERPStoreDashboard from '@/components/store/ERPStoreDashboard';
import { verifyTempAuth, type TempAuthUser } from '@/lib/temp-auth';

interface StoreDashboardUser extends TempAuthUser {
  store_name?: string;
}

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

export default function StoreDashboard() {
  const [user, setUser] = useState<StoreDashboardUser | null>(null);
  const [stats, setStats] = useState<StoreStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();

  // Invitation code state
  const [invitationCode, setInvitationCode] = useState<string | null>(null);
  const [inviteAnalytics, setInviteAnalytics] = useState<{ visits: number; purchases: number } | null>(null);
  useEffect(() => {
    if (user && user.id) {
      // TODO: Replace with API calls for our new auth system
      // For now, set placeholder values
      setInvitationCode('BinnaHub-' + Math.random().toString(36).substring(2, 8));
      setInviteAnalytics({
        visits: 0,
        purchases: 0,
      });
    }
  }, [user]);

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
      console.log('🔄 [Store Dashboard] Detected post-login redirect, cleaning URL');  
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
        setError(null);        const authResult = await verifyTempAuth(5);
        
        if (!authResult?.user) {
          router.push('/login');
          return;
        }

        setUser(authResult.user);
        const dashboardStats = await getStoreDashboardStats(authResult.user.id);
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
  }  // Core business metrics - actual data visualization
  const coreMetrics = [
    {
      title: 'إجمالي المنتجات',
      value: stats.totalProducts ?? 0,
      icon: 'package' as IconKey,
      href: '/store/products',
      color: 'bg-blue-500',
      description: 'إدارة شاملة للمنتجات',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'إجمالي الطلبات',
      value: stats.totalOrders ?? 0,
      icon: 'dashboard' as IconKey,
      href: '/store/orders',
      color: 'bg-green-500',
      description: 'جميع طلبات المتجر',
      change: '+8%',
      trend: 'up'
    },
    {
      title: 'الطلبات النشطة',
      value: stats.activeOrders ?? 0,
      icon: 'chart' as IconKey,
      href: '/store/orders?status=active',
      color: 'bg-orange-500',
      description: 'قيد التنفيذ الآن',
      change: '+5%',
      trend: 'up'
    },
    {
      title: 'إجمالي العملاء',
      value: stats.viewsToday ?? 0,
      icon: 'ai' as IconKey,
      href: '/store/erp/customers',
      color: 'bg-purple-500',
      description: 'قاعدة العملاء',
      change: '+15%',
      trend: 'up'
    },
    {
      title: 'الإيرادات الشهرية',
      value: formatCurrency(stats.monthlyRevenue ?? 0),
      icon: 'marketing' as IconKey,
      href: '/store/analytics',
      color: 'bg-emerald-500',
      description: 'إيرادات هذا الشهر',
      change: '+22%',
      trend: 'up'
    }
  ];

  // Primary action items - most used functions
  const primaryActions = [
    { 
      title: 'إنشاء طلب جديد', 
      href: '/store/orders/new', 
      icon: 'settings' as IconKey,
      color: 'bg-indigo-500',
      description: 'إنشاء طلب أو فاتورة جديدة'
    },
    { 
      title: 'مواد البناء والتشييد', 
      href: '/store/construction-products', 
      icon: 'package' as IconKey,
      color: 'bg-teal-500',
      description: 'إدارة مواد البناء مع الباركود السعودي'
    },
    { 
      title: 'إضافة منتج جديد', 
      href: '/store/products/new', 
      icon: 'design' as IconKey,
      color: 'bg-blue-500',
      description: 'إضافة منتج عادي جديد'
    },
    { 
      title: 'إدارة المخزون', 
      href: '/store/inventory', 
      icon: 'settings' as IconKey,
      color: 'bg-yellow-500',
      description: 'تتبع المخزون والمستودعات'
    }
  ];

  // Secondary management functions
  const managementActions = [
    { 
      title: 'إدارة الموردين', 
      href: '/store/suppliers', 
      icon: 'ai' as IconKey,
      description: 'إدارة الموردين وأوامر الشراء'
    },
    { 
      title: 'ماسح الباركود', 
      href: '/barcode-scanner', 
      icon: 'calculator' as IconKey,
      description: 'مسح الباركود للمنتجات'
    },
    { 
      title: 'استيراد Excel', 
      href: '/store/products/import', 
      icon: 'settings' as IconKey,
      description: 'استيراد منتجات من ملف Excel'
    },
    { 
      title: 'إعدادات المتجر', 
      href: '/store/settings', 
      icon: 'dashboard' as IconKey,
      description: 'إعدادات وتخصيصات المتجر'
    }
  ];

  // ERP Reports - consolidated in one place
  const erpReports = [
    {
      title: 'تقرير المبيعات',
      href: '/store/erp/reports?type=sales',
      icon: 'chart' as IconKey,
      color: 'from-blue-50 to-blue-100 border-blue-100',
      hoverColor: 'group-hover:from-blue-100 group-hover:to-blue-200 group-hover:border-blue-200',
      iconColor: 'text-blue-600 group-hover:text-blue-700',
      textColor: 'group-hover:text-blue-900',
      description: 'تحليل شامل للمبيعات والإيرادات'
    },
    {
      title: 'تقرير المخزون',
      href: '/store/erp/reports?type=inventory',
      icon: 'settings' as IconKey,
      color: 'from-green-50 to-green-100 border-green-100',
      hoverColor: 'group-hover:from-green-100 group-hover:to-green-200 group-hover:border-green-200',
      iconColor: 'text-green-600 group-hover:text-green-700',
      textColor: 'group-hover:text-green-900',
      description: 'حالة المخزون والتقييم'
    },
    {
      title: 'تقرير العملاء',
      href: '/store/erp/reports?type=customers',
      icon: 'ai' as IconKey,
      color: 'from-purple-50 to-purple-100 border-purple-100',
      hoverColor: 'group-hover:from-purple-100 group-hover:to-purple-200 group-hover:border-purple-200',
      iconColor: 'text-purple-600 group-hover:text-purple-700',
      textColor: 'group-hover:text-purple-900',
      description: 'تحليل بيانات العملاء'
    },
    {
      title: 'تقرير الربحية',
      href: '/store/erp/reports?type=profitability',
      icon: 'marketing' as IconKey,
      color: 'from-yellow-50 to-yellow-100 border-yellow-100',
      hoverColor: 'group-hover:from-yellow-100 group-hover:to-yellow-200 group-hover:border-yellow-200',
      iconColor: 'text-yellow-600 group-hover:text-yellow-700',
      textColor: 'group-hover:text-yellow-900',
      description: 'تحليل الهوامش والأرباح'
    },
    {
      title: 'تقرير الأداء',
      href: '/store/erp/reports?type=performance',
      icon: 'dashboard' as IconKey,
      color: 'from-indigo-50 to-indigo-100 border-indigo-100',
      hoverColor: 'group-hover:from-indigo-100 group-hover:to-indigo-200 group-hover:border-indigo-200',
      iconColor: 'text-indigo-600 group-hover:text-indigo-700',
      textColor: 'group-hover:text-indigo-900',
      description: 'مؤشرات الأداء الرئيسية'
    },
    {
      title: 'تقرير الضرائب',
      href: '/store/erp/reports?type=taxes',
      icon: 'calculator' as IconKey,
      color: 'from-red-50 to-red-100 border-red-100',
      hoverColor: 'group-hover:from-red-100 group-hover:to-red-200 group-hover:border-red-200',
      iconColor: 'text-red-600 group-hover:text-red-700',
      textColor: 'group-hover:text-red-900',
      description: 'ملخص الضرائب والرسوم'
    }
  ];
  return (
    <SimpleLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            مرحباً، {user?.store_name || user?.email?.split('@')[0] || 'المتجر'}! 🏪
          </h1>
          <p className="text-blue-100 text-sm sm:text-base">إدارة شاملة لمتجرك مع ميزات ERP المتقدمة</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="bg-blue-500 bg-opacity-30 px-3 py-1 rounded-full text-xs font-medium">
              🔧 نظام ERP متكامل
            </span>
            <span className="bg-green-500 bg-opacity-30 px-3 py-1 rounded-full text-xs font-medium">
              📊 تحليلات متقدمة
            </span>
            <span className="bg-purple-500 bg-opacity-30 px-3 py-1 rounded-full text-xs font-medium">
              🛒 تجارة إلكترونية
            </span>
          </div>
        </div>        {/* Stock Alerts - High Priority */}
        {user?.id && <StockAlerts userId={user.id} />}

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

        {/* Primary Actions - Most Used Functions */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">الإجراءات الأساسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {primaryActions.map((action, index) => (
              <Link key={index} href={action.href} className="block group">
                <div className={`${action.color} text-white rounded-lg p-4 text-center group-hover:shadow-lg transition-all duration-200 transform group-hover:scale-105`}>
                  <ClientIcon type={action.icon} size={32} className="mx-auto mb-3" />
                  <h3 className="font-medium text-sm mb-2">{action.title}</h3>
                  <p className="text-xs opacity-90">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Core Business Metrics */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">المؤشرات الأساسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {coreMetrics.map((metric, index) => (
              <Link key={index} href={metric.href} className="block">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 hover:shadow-md transition-all duration-200 border hover:border-gray-300">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`${metric.color} p-2 rounded-lg`}>
                      <ClientIcon type={metric.icon} size={20} className="text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-800">{metric.value}</p>
                      {metric.change && (
                        <p className={`text-xs font-medium ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {metric.change}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 mb-1">{metric.title}</p>
                    <p className="text-xs text-gray-600">{metric.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ERP Analytics & Reports - Consolidated */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">تقارير ERP المتقدمة</h2>
            <Link href="/store/erp/reports" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              عرض جميع التقارير ←
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {erpReports.map((report, index) => (
              <Link key={index} href={report.href} className="block group">
                <div className={`bg-gradient-to-br ${report.color} rounded-lg p-4 text-center ${report.hoverColor} transition-all duration-300 border transform group-hover:scale-105 group-hover:shadow-md`}>
                  <ClientIcon type={report.icon} size={32} className={`mx-auto mb-3 ${report.iconColor}`} />
                  <h3 className={`font-medium text-gray-800 text-sm mb-1 ${report.textColor}`}>{report.title}</h3>
                  <p className={`text-xs text-gray-500 ${report.textColor}`}>{report.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ERP Dashboard Component - Advanced Analytics */}
        {user?.id && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">تحليلات ERP التفصيلية</h2>
            <ERPStoreDashboard storeId={user.id} />
          </div>
        )}        {/* Management Tools - Secondary Functions */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">أدوات الإدارة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {managementActions.map((action, index) => (
              <Link key={index} href={action.href} className="block group">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 text-center group-hover:from-gray-100 group-hover:to-gray-200 transition-all duration-200 border group-hover:border-gray-300 transform group-hover:scale-105">
                  <ClientIcon type={action.icon} size={28} className="mx-auto mb-3 text-gray-600 group-hover:text-gray-700" />
                  <h3 className="font-medium text-gray-800 text-sm mb-1 group-hover:text-gray-900">{action.title}</h3>
                  <p className="text-xs text-gray-500 group-hover:text-gray-700">{action.description}</p>
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
