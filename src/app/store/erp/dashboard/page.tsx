'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { LoadingSpinner } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { ClientIcon } from '@/components/icons';
import type { IconKey } from '@/components/icons/ClientIcon';
import SimpleLayout from '@/components/layouts/SimpleLayout';
import ERPStoreDashboard from '@/components/store/ERPStoreDashboard';

interface ERPDashboardUser extends User {
  store_name?: string;
}

export default function ERPDashboard() {
  const [user, setUser] = useState<ERPDashboardUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [erpStats, setErpStats] = useState<any>(null);
  
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isPostLogin = urlParams.has('post_login');

    if (isPostLogin) {
      console.log('🔄 [ERP Dashboard] Detected post-login redirect');
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

        // Get store information
        const { data: storeData } = await supabase
          .from('stores')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (storeData) {
          setUser(prev => ({ ...prev!, store_name: storeData.store_name }));
        }

        // Fetch ERP analytics data
        const response = await fetch(`/api/erp/analytics?storeId=${session.user.id}&dateRange=30`);
        if (response.ok) {
          const analyticsData = await response.json();
          setErpStats(analyticsData.data);
        }

      } catch (err) {
        console.error('❌ [ERP Dashboard] Error:', err);
        setError(err instanceof Error ? err.message : 'Error loading ERP dashboard');
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

  if (!user) {
    return (
      <div className="p-4">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-4 py-3 rounded">
          No user data available
        </div>
      </div>
    );
  }

  // ERP Quick Actions
  const erpActions = [
    { 
      title: 'إنشاء أمر مبيعات', 
      href: '/store/erp/sales-orders/new', 
      icon: 'settings' as IconKey,
      description: 'إنشاء أمر مبيعات جديد'
    },
    { 
      title: 'إدارة العناصر', 
      href: '/store/erp/items', 
      icon: 'design' as IconKey,
      description: 'إدارة عناصر المخزون'
    },
    { 
      title: 'إدارة العملاء', 
      href: '/store/erp/customers', 
      icon: 'ai' as IconKey,
      description: 'إدارة بيانات العملاء'
    },
    { 
      title: 'دفتر المخزون', 
      href: '/store/erp/stock-ledger', 
      icon: 'calculator' as IconKey,
      description: 'مراجعة حركات المخزون'
    },
    { 
      title: 'تقارير ERP', 
      href: '/store/erp/reports', 
      icon: 'chart' as IconKey,
      description: 'تقارير وتحليلات شاملة'
    },
    { 
      title: 'إعدادات ERP', 
      href: '/store/erp/settings', 
      icon: 'dashboard' as IconKey,
      description: 'إعدادات نظام ERP'
    },
  ];

  return (
    <SimpleLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            نظام ERP المتقدم - {user?.store_name || user?.email?.split('@')[0] || 'المتجر'}! 🏢
          </h1>
          <p className="text-indigo-100 text-sm sm:text-base">
            إدارة متكاملة للأعمال مع ميزات ERPNext المتقدمة
          </p>
        </div>        {/* ERP Dashboard Component */}
        {user?.id && (
          <ERPStoreDashboard 
            storeId={user.id} 
          />
        )}

        {/* ERP Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">إجراءات ERP السريعة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {erpActions.map((action, index) => (
              <Link key={index} href={action.href} className="block">
                <div className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-lg p-4 text-center hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 border border-gray-100 hover:border-indigo-200 hover:shadow-md">
                  <ClientIcon type={action.icon} size={32} className="mx-auto mb-3 text-indigo-600" />
                  <h3 className="font-medium text-gray-800 text-sm mb-1">{action.title}</h3>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ERP Feature Highlights */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">ميزات نظام ERP</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <ClientIcon type="settings" size={32} className="mx-auto mb-2 text-blue-600" />
              <h3 className="font-medium text-gray-800 text-sm mb-1">إدارة المخزون</h3>
              <p className="text-xs text-gray-600">تتبع المخزون في الوقت الفعلي</p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <ClientIcon type="dashboard" size={32} className="mx-auto mb-2 text-green-600" />
              <h3 className="font-medium text-gray-800 text-sm mb-1">أوامر المبيعات</h3>
              <p className="text-xs text-gray-600">إدارة متقدمة للمبيعات</p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <ClientIcon type="ai" size={32} className="mx-auto mb-2 text-purple-600" />
              <h3 className="font-medium text-gray-800 text-sm mb-1">إدارة العملاء</h3>
              <p className="text-xs text-gray-600">CRM متطور للعملاء</p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
              <ClientIcon type="chart" size={32} className="mx-auto mb-2 text-orange-600" />
              <h3 className="font-medium text-gray-800 text-sm mb-1">التحليلات المالية</h3>
              <p className="text-xs text-gray-600">تقارير وإحصائيات شاملة</p>
            </div>
          </div>
        </div>

        {/* Migration Status */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <ClientIcon type="shield" size={24} className="text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">حالة تطبيق نظام ERP</h3>
              <p className="text-yellow-700 text-sm mb-3">
                نظام ERP متاح ومجهز للاستخدام. إذا كنت تواجه أي مشاكل، يرجى تطبيق ترقية قاعدة البيانات.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/erp/migrate-schema', { method: 'POST' });
                      const result = await response.json();
                      alert(result.success ? 'تم تطبيق النظام بنجاح!' : 'فشل في التطبيق: ' + result.error);
                    } catch (error) {
                      alert('حدث خطأ في التطبيق');
                    }
                  }}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  تطبيق ترقية قاعدة البيانات
                </button>
                <Link 
                  href="/store/dashboard"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  العودة للوحة التحكم العادية
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SimpleLayout>
  );
}
