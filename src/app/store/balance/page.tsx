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

interface StoreTransaction {
  id: string;
  type: 'sale' | 'withdrawal' | 'refund' | 'commission' | 'fee';
  amount: number;
  description: string;
  created_at: string;
  status: 'completed' | 'pending' | 'failed';
  reference_id?: string;
  customer_name?: string;
  order_id?: string;
}

interface StoreBalance {
  current_balance: number;
  total_sales: number;
  total_withdrawals: number;
  pending_amount: number;
  commission_amount: number;
  currency: string;
}

interface StoreBalanceUser extends User {
  store_name?: string;
}

export default function StoreBalancePage() {
  const [user, setUser] = useState<StoreBalanceUser | null>(null);
  const [balance, setBalance] = useState<StoreBalance | null>(null);
  const [transactions, setTransactions] = useState<StoreTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const router = useRouter();
  const supabase = createClientComponentClient();

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const loadBalanceData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔍 [Store Balance] Verifying authentication...');
        const authResult = await verifyAuthWithRetry();

        if (authResult.error || !authResult.user) {
          console.error('❌ [Store Balance] Authentication failed');
          router.push('/login');
          return;
        }

        console.log('✅ [Store Balance] User authenticated:', authResult.user.email);
        setUser(authResult.user);

        // Mock store balance data - in a real app, this would come from the database
        const mockBalance: StoreBalance = {
          current_balance: 15750.8,
          total_sales: 45000.0,
          total_withdrawals: 28249.2,
          pending_amount: 1200.0,
          commission_amount: 750.0,
          currency: 'SAR',
        };

        const mockTransactions: StoreTransaction[] = [
          {
            id: '1',
            type: 'sale',
            amount: 450.5,
            description: 'مبيعات طلب #ORD-1001',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            status: 'completed',
            reference_id: 'ORD-1001',
            customer_name: 'أحمد محمد',
            order_id: 'ORD-1001',
          },
          {
            id: '2',
            type: 'withdrawal',
            amount: 2000.0,
            description: 'سحب أرباح للحساب البنكي',
            created_at: new Date(Date.now() - 172800000).toISOString(),
            status: 'completed',
          },
          {
            id: '3',
            type: 'sale',
            amount: 1250.75,
            description: 'مبيعات طلب #ORD-1002',
            created_at: new Date(Date.now() - 259200000).toISOString(),
            status: 'completed',
            reference_id: 'ORD-1002',
            customer_name: 'فاطمة علي',
            order_id: 'ORD-1002',
          },
          {
            id: '4',
            type: 'commission',
            amount: 125.5,
            description: 'عمولة منصة بناء - شهر نوفمبر',
            created_at: new Date(Date.now() - 345600000).toISOString(),
            status: 'completed',
          },
          {
            id: '5',
            type: 'refund',
            amount: 350.0,
            description: 'استرداد لطلب ملغي #ORD-998',
            created_at: new Date(Date.now() - 432000000).toISOString(),
            status: 'completed',
            reference_id: 'ORD-998',
          },
          {
            id: '6',
            type: 'sale',
            amount: 850.25,
            description: 'مبيعات طلب #ORD-1003',
            created_at: new Date(Date.now() - 518400000).toISOString(),
            status: 'pending',
            reference_id: 'ORD-1003',
            customer_name: 'محمد سالم',
          },
          {
            id: '7',
            type: 'fee',
            amount: 50.0,
            description: 'رسوم خدمة دفع إلكتروني',
            created_at: new Date(Date.now() - 604800000).toISOString(),
            status: 'completed',
          },
        ];

        setBalance(mockBalance);
        setTransactions(mockTransactions);

        console.log('✅ [Store Balance] Data loaded successfully');
      } catch (err) {
        console.error('❌ [Store Balance] Error:', err);
        setError(err instanceof Error ? err.message : 'Error loading balance data');
      } finally {
        setLoading(false);
      }
    };

    loadBalanceData();
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

  if (!balance) {
    return (
      <div className="p-4">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-4 py-3 rounded">
          لا توجد بيانات أرباح متاحة
        </div>
      </div>
    );
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return (
          <svg
            className="w-5 h-5 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
        );
      case 'withdrawal':
        return (
          <svg
            className="w-5 h-5 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 20V4m-8 8l8 8 8-8"
            />
          </svg>
        );
      case 'refund':
        return (
          <svg
            className="w-5 h-5 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"
            />
          </svg>
        );
      case 'commission':
        return (
          <svg
            className="w-5 h-5 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        );
      case 'fee':
        return (
          <svg
            className="w-5 h-5 text-orange-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
        );
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'sale':
        return 'text-green-600';
      case 'withdrawal':
        return 'text-blue-600';
      case 'refund':
        return 'text-red-600';
      case 'commission':
        return 'text-purple-600';
      case 'fee':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTransactionText = (type: string) => {
    switch (type) {
      case 'sale':
        return 'مبيعات';
      case 'withdrawal':
        return 'سحب أرباح';
      case 'refund':
        return 'استرداد';
      case 'commission':
        return 'عمولة منصة';
      case 'fee':
        return 'رسوم';
      default:
        return 'معاملة';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            مكتمل
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
            معلق
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
            فاشل
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">إدارة الأرباح والمدفوعات</h1>
            <p className="text-gray-600">
              تتبع إيراداتك وأرباحك من المبيعات في متجر{' '}
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
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
              سحب أرباح
            </button>
          </div>
        </div>

        {/* Balance Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="الرصيد الحالي"
            value={formatCurrency(balance.current_balance)}
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
            title="إجمالي المبيعات"
            value={formatCurrency(balance.total_sales)}
            color="green"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-4 4"
                />
              </svg>
            }
          />
          <StatCard
            title="إجمالي السحوبات"
            value={formatCurrency(balance.total_withdrawals)}
            color="purple"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 20V4m-8 8l8 8 8-8"
                />
              </svg>
            }
          />
          <StatCard
            title="مبيعات معلقة"
            value={formatCurrency(balance.pending_amount)}
            color="yellow"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
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
              <ClientIcon type="money" size={32} className="mx-auto mb-3 text-green-600" />
              <h3 className="font-medium text-gray-800">سحب أرباح</h3>
            </div>
            <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-4 text-center cursor-pointer">
              <ClientIcon type="chart" size={32} className="mx-auto mb-3 text-blue-600" />
              <h3 className="font-medium text-gray-800">تقرير المبيعات</h3>
            </div>
            <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-4 text-center cursor-pointer">
              <ClientIcon type="calculator" size={32} className="mx-auto mb-3 text-purple-600" />
              <h3 className="font-medium text-gray-800">حاسبة الأرباح</h3>
            </div>
            <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-4 text-center cursor-pointer">
              <ClientIcon type="dashboard" size={32} className="mx-auto mb-3 text-orange-600" />
              <h3 className="font-medium text-gray-800">كشف حساب</h3>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">المعاملات المالية الأخيرة</h2>
            <Link
              href="/store/balance/transactions"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              عرض جميع المعاملات
            </Link>
          </div>

          {transactions.length === 0 ? (
            <EmptyState
              icon={
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              }
              title="لا توجد معاملات مالية"
              description="ستظهر معاملاتك المالية ومبيعاتك هنا"
              actionLabel="عرض المنتجات"
              onAction={() => (window.location.href = '/store/products')}
            />
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                            {getTransactionText(transaction.type)}
                          </h3>
                          {getStatusBadge(transaction.status)}
                        </div>
                        <p className="text-sm text-gray-600">{transaction.description}</p>
                        {transaction.customer_name && (
                          <p className="text-xs text-gray-500 mt-1">
                            العميل: {transaction.customer_name}
                          </p>
                        )}
                        {transaction.reference_id && (
                          <p className="text-xs text-gray-500 mt-1">
                            المرجع: {transaction.reference_id}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-left">
                      <div className={`text-lg font-bold ${getTransactionColor(transaction.type)}`}>
                        {transaction.type === 'withdrawal' ||
                        transaction.type === 'refund' ||
                        transaction.type === 'commission' ||
                        transaction.type === 'fee'
                          ? '-'
                          : '+'}
                        {formatCurrency(transaction.amount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(transaction.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Store Financial Summary */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">ملخص الأرباح</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <div className="bg-blue-100 p-2 rounded-lg ml-3">
                  <ClientIcon type="money" size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">رصيد المتجر المتاح</p>
                  <p className="text-sm text-gray-600">{formatCurrency(balance.current_balance)}</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                <div className="bg-yellow-100 p-2 rounded-lg ml-3">
                  <ClientIcon type="chart" size={20} className="text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">مبيعات في الانتظار</p>
                  <p className="text-sm text-gray-600">{formatCurrency(balance.pending_amount)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <div className="bg-green-100 p-2 rounded-lg ml-3">
                  <ClientIcon type="settings" size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">العملة المستخدمة</p>
                  <p className="text-sm text-gray-600">الريال السعودي (SAR)</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                <div className="bg-purple-100 p-2 rounded-lg ml-3">
                  <ClientIcon type="shield" size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">عمولة المنصة</p>
                  <p className="text-sm text-gray-600">
                    {formatCurrency(balance.commission_amount)} شهرياً
                  </p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                <div className="bg-orange-100 p-2 rounded-lg ml-3">
                  <ClientIcon type="dashboard" size={20} className="text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">حالة المتجر</p>
                  <p className="text-sm text-gray-600">نشط ومؤكد</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
