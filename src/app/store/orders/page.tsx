'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { Card, StatCard, LoadingSpinner, StatusBadge, EmptyState } from '@/components/ui';
import { getStoreDashboardStats, type StoreStats } from '@/lib/api/store-dashboard';
import { formatCurrency, formatDate, translateStatus } from '@/lib/utils';
import { verifyAuthWithRetry } from '@/lib/auth-recovery';
import { ClientIcon } from '@/components/icons';
import type { IconKey } from '@/components/icons/ClientIcon';
import { updateOrderStatus } from '@/lib/api/orders';

interface StoreOrdersUser extends User {
  store_name?: string;
}

export default function StoreOrdersPage() {
  const [user, setUser] = useState<StoreOrdersUser | null>(null);
  const [stats, setStats] = useState<StoreStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isHydrated, setIsHydrated] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClientComponentClient();

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const loadStoreOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔍 [Store Orders] Verifying authentication...');
        const authResult = await verifyAuthWithRetry();

        if (authResult.error || !authResult.user) {
          console.error('❌ [Store Orders] Authentication failed');
          router.push('/login');
          return;
        }

        console.log('✅ [Store Orders] User authenticated:', authResult.user.email);
        setUser(authResult.user);

        // Get store dashboard stats which include orders
        const dashboardStats = await getStoreDashboardStats(authResult.user.id);
        setStats(dashboardStats);

        console.log('✅ [Store Orders] Data loaded successfully');
      } catch (err) {
        console.error('❌ [Store Orders] Error:', err);
        setError(err instanceof Error ? err.message : 'Error loading orders');
      } finally {
        setLoading(false);
      }
    };

    loadStoreOrders();
  }, [isHydrated, router]);

  // Store order action handlers
  const handleAcceptOrder = async (orderId: string) => {
    setUpdatingOrderId(orderId);
    await updateOrderStatus(orderId, 'confirmed');
    setStats((prev) => ({
      ...prev!,
      recentOrders: prev!.recentOrders.map((o: any) => o.id === orderId ? { ...o, status: 'confirmed' } : o)
    }));
    setUpdatingOrderId(null);
  };
  const handleShipOrder = async (orderId: string) => {
    setUpdatingOrderId(orderId);
    await updateOrderStatus(orderId, 'shipped');
    setStats((prev) => ({
      ...prev!,
      recentOrders: prev!.recentOrders.map((o: any) => o.id === orderId ? { ...o, status: 'shipped' } : o)
    }));
    setUpdatingOrderId(null);
  };
  const handleCancelOrder = async (orderId: string) => {
    setUpdatingOrderId(orderId);
    await updateOrderStatus(orderId, 'cancelled');
    setStats((prev) => ({
      ...prev!,
      recentOrders: prev!.recentOrders.map((o: any) => o.id === orderId ? { ...o, status: 'cancelled' } : o)
    }));
    setUpdatingOrderId(null);
  };

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
          No data available
        </div>
      </div>
    );
  }

  // Get orders from stats (using recent orders or create mock data)
  const orders = stats.recentOrders || [];
  const filteredOrders =
    filter === 'all' ? orders : orders.filter((order: any) => order.status === filter);

  const pendingOrders = orders.filter((o: any) => o.status === 'pending');
  const processingOrders = orders.filter((o: any) => o.status === 'processing');
  const shippedOrders = orders.filter((o: any) => o.status === 'shipped');
  const completedOrders = orders.filter((o: any) => o.status === 'delivered');

  return (
    <div className="min-h-screen bg-gray-50 font-tajawal">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">إدارة الطلبات</h1>
            <p className="text-gray-600">
              إدارة ومتابعة طلبات العملاء في متجر{' '}
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
              href="/store/products"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              إدارة المنتجات
            </Link>
          </div>
        </div>

        {/* Order Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="طلبات جديدة"
            value={pendingOrders.length}
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
          <StatCard
            title="قيد المعالجة"
            value={processingOrders.length}
            color="blue"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            }
          />
          <StatCard
            title="تم الشحن"
            value={shippedOrders.length}
            color="purple"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
          <StatCard
            title="طلبات مكتملة"
            value={completedOrders.length}
            color="green"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">إجراءات سريعة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-4 text-center">
              <ClientIcon type="settings" size={32} className="mx-auto mb-3 text-blue-600" />
              <h3 className="font-medium text-gray-800">تحديث حالة الطلبات</h3>
            </div>
            <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-4 text-center">
              <ClientIcon type="dashboard" size={32} className="mx-auto mb-3 text-green-600" />
              <h3 className="font-medium text-gray-800">طباعة الفواتير</h3>
            </div>
            <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-4 text-center">
              <ClientIcon type="marketing" size={32} className="mx-auto mb-3 text-purple-600" />
              <h3 className="font-medium text-gray-800">إرسال إشعارات</h3>
            </div>
            <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-4 text-center">
              <ClientIcon type="chart" size={32} className="mx-auto mb-3 text-orange-600" />
              <h3 className="font-medium text-gray-800">تقارير المبيعات</h3>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">جميع الطلبات</h2>
            <div className="flex gap-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">جميع الطلبات</option>
                <option value="pending">جديدة</option>
                <option value="processing">قيد المعالجة</option>
                <option value="shipped">تم الشحن</option>
                <option value="delivered">مكتملة</option>
                <option value="cancelled">ملغاة</option>
              </select>
              <input
                type="text"
                placeholder="البحث في الطلبات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm w-64"
              />
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <EmptyState
              icon={
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              }
              title="لا توجد طلبات"
              description="ستظهر الطلبات هنا عندما يبدأ العملاء بالطلب من متجرك"
              actionLabel="إضافة منتجات للمتجر"
              onAction={() => (window.location.href = '/store/products')}
            />
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order: any, index: number) => (
                <div
                  key={order.id || index}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-semibold text-gray-800">
                          طلب #{order.order_number || order.id || `ORD-${index + 1}`}
                        </h3>
                        <StatusBadge
                          status={order.status || 'pending'}
                          label={translateStatus(order.status || 'pending')}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">العميل: </span>
                          <span>{order.customer_name || order.user?.name || 'غير محدد'}</span>
                        </div>
                        <div>
                          <span className="font-medium">تاريخ الطلب: </span>
                          <span>{formatDate(order.created_at || new Date().toISOString())}</span>
                        </div>
                        <div>
                          <span className="font-medium">طريقة الدفع: </span>
                          <span>{order.payment_method || 'غير محدد'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-lg font-bold text-gray-800 mb-1">
                        {formatCurrency(order.total_amount || 0)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(order.created_at || new Date().toISOString())}
                      </div>
                    </div>
                  </div>

                  {/* Order Items Summary */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">المنتجات: </span>
                      <span>{order.items_count || 'غير محدد'} منتج</span>
                      {order.notes && (
                        <div className="mt-2">
                          <span className="font-medium">ملاحظات العميل: </span>
                          <span>{order.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-4 rounded transition-colors">
                      تفاصيل الطلب
                    </button>
                    {order.status === 'pending' && (
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white text-sm py-2 px-4 rounded transition-colors"
                        disabled={updatingOrderId === order.id}
                        onClick={() => handleAcceptOrder(order.id)}
                      >
                        {updatingOrderId === order.id ? '...جارٍ القبول' : 'قبول الطلب'}
                      </button>
                    )}
                    {order.status === 'confirmed' && (
                      <button
                        className="bg-purple-500 hover:bg-purple-600 text-white text-sm py-2 px-4 rounded transition-colors"
                        disabled={updatingOrderId === order.id}
                        onClick={() => handleShipOrder(order.id)}
                      >
                        {updatingOrderId === order.id ? '...جارٍ الشحن' : 'تحديث للشحن'}
                      </button>
                    )}
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm py-2 px-4 rounded transition-colors">
                      طباعة الفاتورة
                    </button>
                    {(order.status === 'pending' || order.status === 'processing') && (
                      <button
                        className="bg-red-100 hover:bg-red-200 text-red-600 text-sm py-2 px-4 rounded transition-colors"
                        disabled={updatingOrderId === order.id}
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        {updatingOrderId === order.id ? '...جارٍ الإلغاء' : 'إلغاء الطلب'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Activity Summary */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">النشاط الأخير</h2>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <div className="bg-blue-100 p-2 rounded-lg ml-3">
                <ClientIcon type="dashboard" size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">إدارة طلبات المتجر</p>
                <p className="text-sm text-gray-600">تتبع ومعالجة طلبات العملاء</p>
              </div>
            </div>

            {stats.totalProducts > 0 && (
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <div className="bg-green-100 p-2 rounded-lg ml-3">
                  <ClientIcon type="settings" size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {stats.totalProducts} منتج متاح في المتجر
                  </p>
                  <p className="text-sm text-gray-600">
                    {stats.activeOrders || 0} طلب نشط • {formatCurrency(stats.monthlyRevenue || 0)}{' '}
                    إيرادات شهرية
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
