'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { Card, StatCard, LoadingSpinner, EmptyState } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';
import { verifyAuthWithRetry } from '@/lib/auth-recovery';
import { ClientIcon } from '@/components/icons';

interface PromoCodeCommission {
  id: string;
  promo_code: string;
  commission_amount: number;
  usage_count: number;
  total_revenue: number;
  created_at: string;
  status: 'active' | 'inactive' | 'expired';
  expiry_date?: string;
  commission_rate: number;
}

interface PromoCodeStats {
  total_commissions: number;
  total_usage: number;
  active_codes: number;
  total_revenue: number;
  monthly_commissions: number;
}

interface StorePromoUser extends User {
  store_name?: string;
}

export default function CommissionPage() {
  const [user, setUser] = useState<StorePromoUser | null>(null);
  const [stats, setStats] = useState<PromoCodeStats | null>(null);
  const [commissions, setCommissions] = useState<PromoCodeCommission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const router = useRouter();

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const loadPromoCommissionData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔍 [Promo Commission] Verifying authentication...');
        const authResult = await verifyAuthWithRetry();

        if (authResult.error || !authResult.user) {
          console.error('❌ [Promo Commission] Authentication failed');
          router.push('/login');
          return;
        }

        console.log('✅ [Promo Commission] User authenticated:', authResult.user.email);
        setUser(authResult.user);

        // Mock promo code commission data - in a real app, this would come from the database
        const mockStats: PromoCodeStats = {
          total_commissions: 2450.75,
          total_usage: 87,
          active_codes: 5,
          total_revenue: 15600.0,
          monthly_commissions: 890.25,
        };

        const mockCommissions: PromoCodeCommission[] = [
          {
            id: '1',
            promo_code: 'BUILD20',
            commission_amount: 450.0,
            usage_count: 15,
            total_revenue: 2250.0,
            created_at: new Date(Date.now() - 86400000).toISOString(),
            status: 'active',
            expiry_date: new Date(Date.now() + 2592000000).toISOString(),
            commission_rate: 20,
          },
          {
            id: '2',
            promo_code: 'MATERIALS15',
            commission_amount: 325.5,
            usage_count: 22,
            total_revenue: 1870.0,
            created_at: new Date(Date.now() - 172800000).toISOString(),
            status: 'active',
            commission_rate: 15,
          },
          {
            id: '3',
            promo_code: 'SUMMER25',
            commission_amount: 680.25,
            usage_count: 8,
            total_revenue: 3200.0,
            created_at: new Date(Date.now() - 259200000).toISOString(),
            status: 'active',
            expiry_date: new Date(Date.now() + 1296000000).toISOString(),
            commission_rate: 25,
          },
          {
            id: '4',
            promo_code: 'NEWCUSTOMER',
            commission_amount: 195.0,
            usage_count: 13,
            total_revenue: 975.0,
            created_at: new Date(Date.now() - 345600000).toISOString(),
            status: 'active',
            commission_rate: 20,
          },
          {
            id: '5',
            promo_code: 'BULK10',
            commission_amount: 800.0,
            usage_count: 29,
            total_revenue: 8000.0,
            created_at: new Date(Date.now() - 432000000).toISOString(),
            status: 'expired',
            expiry_date: new Date(Date.now() - 86400000).toISOString(),
            commission_rate: 10,
          },
        ];

        setStats(mockStats);
        setCommissions(mockCommissions);

        console.log('✅ [Promo Commission] Data loaded successfully');
      } catch (err) {
        console.error('❌ [Promo Commission] Error:', err);
        setError(err instanceof Error ? err.message : 'Error loading promo commission data');
      } finally {
        setLoading(false);
      }
    };

    loadPromoCommissionData();
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <Link href="/store/dashboard" className="text-blue-600 hover:underline">
            العودة للوحة التحكم
          </Link>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-4">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-4 py-3 rounded">
          لا توجد بيانات عمولات متاحة
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            نشط
          </span>
        );
      case 'inactive':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            غير نشط
          </span>
        );
      case 'expired':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
            منتهي الصلاحية
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            غير محدد
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-tajawal">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">عمولات أكواد الخصم</h1>
            <p className="text-gray-600">
              تتبع عمولاتك من أكواد الخصم الترويجية في متجر{' '}
              {user?.store_name || user?.email?.split('@')[0] || 'المتجر'}
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/store/dashboard"
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              العودة للوحة التحكم
            </Link>
            <Link
              href="/store/promo-code/usage"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              إحصائيات الاستخدام
            </Link>
          </div>
        </div>

        {/* Commission Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="إجمالي العمولات"
            value={formatCurrency(stats.total_commissions)}
            color="blue"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            }
          />
          <StatCard
            title="إجمالي الاستخدامات"
            value={stats.total_usage}
            color="green"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            }
          />
          <StatCard
            title="أكواد نشطة"
            value={stats.active_codes}
            color="purple"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            }
          />
          <StatCard
            title="عمولات شهرية"
            value={formatCurrency(stats.monthly_commissions)}
            color="red"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">إجراءات سريعة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-4 text-center cursor-pointer">
              <ClientIcon type="design" size={32} className="mx-auto mb-3 text-blue-600" />
              <h3 className="font-medium text-gray-800">إنشاء كود جديد</h3>
            </div>
            <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-4 text-center cursor-pointer">
              <ClientIcon type="chart" size={32} className="mx-auto mb-3 text-green-600" />
              <h3 className="font-medium text-gray-800">تقرير العمولات</h3>
            </div>
            <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-4 text-center cursor-pointer">
              <ClientIcon type="settings" size={32} className="mx-auto mb-3 text-purple-600" />
              <h3 className="font-medium text-gray-800">إدارة الأكواد</h3>
            </div>
            <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-4 text-center cursor-pointer">
              <ClientIcon type="marketing" size={32} className="mx-auto mb-3 text-orange-600" />
              <h3 className="font-medium text-gray-800">حملة ترويجية</h3>
            </div>
          </div>
        </div>

        {/* Promo Code Commissions */}
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">عمولات أكواد الخصم</h2>
            <Link
              href="/store/promo-code"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              إدارة جميع الأكواد
            </Link>
          </div>

          {commissions.length === 0 ? (
            <EmptyState
              icon={
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              }
              title="لا توجد أكواد خصم"
              description="ابدأ بإنشاء أكواد خصم لمتجرك لزيادة المبيعات"
              actionLabel="إنشاء كود خصم"
              onAction={() => (window.location.href = '/store/promo-code/new')}
            />
          ) : (
            <div className="space-y-4">
              {commissions.map((commission) => (
                <div
                  key={commission.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <ClientIcon type="calculator" size={24} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-800">{commission.promo_code}</h3>
                          {getStatusBadge(commission.status)}
                        </div>
                        <p className="text-sm text-gray-600">
                          معدل العمولة: {commission.commission_rate}% • استخدم{' '}
                          {commission.usage_count} مرة
                        </p>
                        {commission.expiry_date && (
                          <p className="text-xs text-gray-500 mt-1">
                            ينتهي في: {formatDate(commission.expiry_date)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-lg font-bold text-blue-600">
                        +{formatCurrency(commission.commission_amount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        من {formatCurrency(commission.total_revenue)}
                      </div>
                    </div>
                  </div>

                  {/* Commission Details */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-600">إجمالي المبيعات:</span>
                        <span className="text-gray-800">
                          {formatCurrency(commission.total_revenue)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-600">عدد الاستخدامات:</span>
                        <span className="text-gray-800">{commission.usage_count} مرة</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-600">تاريخ الإنشاء:</span>
                        <span className="text-gray-800">{formatDate(commission.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Commission Summary */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">ملخص العمولات</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <div className="bg-blue-100 p-2 rounded-lg ml-3">
                  <ClientIcon type="money" size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">إجمالي العمولات المكتسبة</p>
                  <p className="text-sm text-gray-600">{formatCurrency(stats.total_commissions)}</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <div className="bg-green-100 p-2 rounded-lg ml-3">
                  <ClientIcon type="chart" size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">إجمالي المبيعات من الأكواد</p>
                  <p className="text-sm text-gray-600">{formatCurrency(stats.total_revenue)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                <div className="bg-purple-100 p-2 rounded-lg ml-3">
                  <ClientIcon type="settings" size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">أكواد الخصم النشطة</p>
                  <p className="text-sm text-gray-600">{stats.active_codes} كود</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                <div className="bg-orange-100 p-2 rounded-lg ml-3">
                  <ClientIcon type="dashboard" size={20} className="text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">عمولات هذا الشهر</p>
                  <p className="text-sm text-gray-600">
                    {formatCurrency(stats.monthly_commissions)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
