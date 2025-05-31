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

interface InviteCodeCommission {
  id: string;
  invite_code: string;
  commission_amount: number;
  invitee_count: number;
  total_revenue: number;
  created_at: string;
  status: 'active' | 'inactive' | 'expired';
  commission_rate: number;
}

interface InviteCodeStats {
  total_commissions: number;
  total_invitees: number;
  active_codes: number;
  total_revenue: number;
  monthly_commissions: number;
}

interface UserInviteUser extends User {
  user_name?: string;
}

export default function CommissionPage() {
  const [user, setUser] = useState<UserInviteUser | null>(null);
  const [stats, setStats] = useState<InviteCodeStats | null>(null);
  const [commissions, setCommissions] = useState<InviteCodeCommission[]>([]);
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

    const loadInviteCommissionData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔍 [Invite Commission] Verifying authentication...');
        const authResult = await verifyAuthWithRetry();

        if (authResult.error || !authResult.user) {
          console.error('❌ [Invite Commission] Authentication failed');
          router.push('/login');
          return;
        }

        console.log('✅ [Invite Commission] User authenticated:', authResult.user.email);
        setUser(authResult.user);

        // Mock invite code commission data - in a real app, this would come from the database
        const mockStats: InviteCodeStats = {
          total_commissions: 1850.5,
          total_invitees: 23,
          active_codes: 3,
          total_revenue: 8750.0,
          monthly_commissions: 650.25,
        };

        const mockCommissions: InviteCodeCommission[] = [
          {
            id: '1',
            invite_code: 'INV-USER123',
            commission_amount: 325.75,
            invitee_count: 8,
            total_revenue: 2500.0,
            created_at: new Date(Date.now() - 86400000).toISOString(),
            status: 'active',
            commission_rate: 15,
          },
          {
            id: '2',
            invite_code: 'BUILDER-REF',
            commission_amount: 580.25,
            invitee_count: 12,
            total_revenue: 3850.0,
            created_at: new Date(Date.now() - 172800000).toISOString(),
            status: 'active',
            commission_rate: 18,
          },
          {
            id: '3',
            invite_code: 'FRIEND-INVITE',
            commission_amount: 944.5,
            invitee_count: 3,
            total_revenue: 2400.0,
            created_at: new Date(Date.now() - 259200000).toISOString(),
            status: 'expired',
            commission_rate: 20,
          },
        ];

        setStats(mockStats);
        setCommissions(mockCommissions);

        console.log('✅ [Invite Commission] Data loaded successfully');
      } catch (err) {
        console.error('❌ [Invite Commission] Error:', err);
        setError(err instanceof Error ? err.message : 'Error loading invite commission data');
      } finally {
        setLoading(false);
      }
    };

    loadInviteCommissionData();
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
          <Link href="/user/dashboard" className="text-blue-600 hover:underline">
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">عمولات أكواد الدعوة</h1>
            <p className="text-gray-600">تتبع عمولاتك من دعوة الأصدقاء والمستخدمين الجدد</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/user/dashboard"
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              العودة للوحة التحكم
            </Link>
            <Link
              href="/user/invite-code/usage"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              إحصائيات الاستخدام
            </Link>
          </div>
        </div>

        {/* Commission Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
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
            title="إجمالي المدعوين"
            value={stats.total_invitees}
            color="green"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
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
            title="إجمالي المبيعات"
            value={formatCurrency(stats.total_revenue)}
            color="purple"
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
              <h3 className="font-medium text-gray-800">إنشاء كود دعوة</h3>
            </div>
            <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-4 text-center cursor-pointer">
              <ClientIcon type="chart" size={32} className="mx-auto mb-3 text-green-600" />
              <h3 className="font-medium text-gray-800">تقرير العمولات</h3>
            </div>
            <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-4 text-center cursor-pointer">
              <ClientIcon type="marketing" size={32} className="mx-auto mb-3 text-purple-600" />
              <h3 className="font-medium text-gray-800">قائمة المدعوين</h3>
            </div>
            <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-4 text-center cursor-pointer">
              <ClientIcon type="marketing" size={32} className="mx-auto mb-3 text-orange-600" />
              <h3 className="font-medium text-gray-800">مشاركة الأكواد</h3>
            </div>
          </div>
        </div>

        {/* Invite Code Commissions */}
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">عمولات أكواد الدعوة</h2>
            <Link
              href="/user/invite-code"
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
              title="لا توجد أكواد دعوة"
              description="ابدأ بإنشاء أكواد دعوة لكسب العمولات من المستخدمين الجدد"
              actionLabel="إنشاء كود دعوة"
              onAction={() => (window.location.href = '/user/invite-code/new')}
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
                        <ClientIcon type="marketing" size={24} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-800">{commission.invite_code}</h3>
                          {getStatusBadge(commission.status)}
                        </div>
                        <p className="text-sm text-gray-600">
                          معدل العمولة: {commission.commission_rate}% • {commission.invitee_count}{' '}
                          مدعو
                        </p>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-lg font-bold text-green-600">
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
                        <span className="font-medium text-gray-600">عدد المدعوين:</span>
                        <span className="text-gray-800">{commission.invitee_count} شخص</span>
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
                  <p className="font-medium text-gray-800">إجمالي المبيعات من الدعوات</p>
                  <p className="text-sm text-gray-600">{formatCurrency(stats.total_revenue)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                <div className="bg-purple-100 p-2 rounded-lg ml-3">
                  <ClientIcon type="marketing" size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">إجمالي المدعوين</p>
                  <p className="text-sm text-gray-600">{stats.total_invitees} شخص</p>
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
