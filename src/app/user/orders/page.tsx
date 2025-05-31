'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import {
  Card,
  StatCard,
  LoadingSpinner,
  StatusBadge,
  EmptyState,
  DataTable,
} from '@/components/ui';
import { getRecentOrders, getDashboardStats } from '@/lib/api/dashboard';
import { formatCurrency, formatDate, translateStatus } from '@/lib/utils';
import { verifyAuthWithRetry } from '@/lib/auth-recovery';
import type { Order } from '@/types/dashboard';
import type { PaginatedResponse } from '@/types/shared';

export default function OrdersPage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [isHydrated, setIsHydrated] = useState(false);

  const router = useRouter();
  const supabase = createClientComponentClient();

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return; // Wait for hydration

    const fetchOrdersData = async () => {
      try {
        setLoading(true);
        setError(null);
        setAuthError(null);

        console.log('🔍 [Orders] Verifying authentication...');

        // Use robust authentication recovery
        const user = await verifyAuthWithRetry(5);

        if (!user) {
          console.error('❌ [Orders] Authentication failed');
          setAuthError('المستخدم غير مسجل الدخول');
          router.push('/login');
          return;
        }
        console.log('✅ [Orders] User authenticated:', user.user?.email);
        setUser(user.user);

        if (user.user?.id) {
          const ordersResponse = await getRecentOrders(user.user.id, 50);
          setOrders(Array.isArray(ordersResponse) ? ordersResponse : []);
        }

        console.log('✅ [Orders] Data loaded successfully');
      } catch (error) {
        console.error('❌ [Orders] Error loading data:', error);
        setError('حدث خطأ في تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersData();
  }, [isHydrated, router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
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

  const filteredOrders =
    filter === 'all' ? orders : orders.filter((order) => order.status === filter);
  const activeOrders = orders.filter((o) => o.status === 'pending' || o.status === 'processing');
  const completedOrders = orders.filter((o) => o.status === 'delivered');
  const totalAmount = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 font-tajawal">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">إدارة الطلبات</h1>
            <p className="text-gray-600">تتبع وإدارة طلباتك من المتاجر</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/user/dashboard"
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              العودة للوحة التحكم
            </Link>
            <Link
              href="/stores"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              تصفح المتاجر
            </Link>
          </div>
        </div>

        {/* Order Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="إجمالي الطلبات"
            value={orders.length}
            color="blue"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            }
          />
          <StatCard
            title="طلبات نشطة"
            value={activeOrders.length}
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
            title="طلبات مكتملة"
            value={completedOrders.length}
            color="green"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
          <StatCard
            title="إجمالي المبلغ"
            value={formatCurrency(totalAmount)}
            color="purple"
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
        </div>

        {/* Orders List */}
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">طلباتي</h2>
            <div className="flex gap-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">جميع الطلبات</option>
                <option value="pending">في الانتظار</option>
                <option value="processing">قيد المعالجة</option>
                <option value="shipped">تم الشحن</option>
                <option value="delivered">تم التسليم</option>
                <option value="cancelled">ملغى</option>
              </select>
              <input
                type="text"
                placeholder="البحث في الطلبات..."
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
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
              description="ابدأ بتصفح المتاجر وإضافة منتجات لسلة التسوق"
              actionLabel="تصفح المتاجر"
              onAction={() => (window.location.href = '/stores')}
            />
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-semibold text-gray-800">طلب #{order.order_number}</h3>
                        <StatusBadge status={order.status} label={translateStatus(order.status)} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">المتجر: </span>
                          <span>{order.store?.store_name || 'غير محدد'}</span>
                        </div>
                        <div>
                          <span className="font-medium">المشروع: </span>
                          <span>{order.project?.name || 'غير مرتبط'}</span>
                        </div>
                        <div>
                          <span className="font-medium">تاريخ التسليم المتوقع: </span>
                          <span>
                            {order.delivery_date ? formatDate(order.delivery_date) : 'غير محدد'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-lg font-bold text-gray-800 mb-1">
                        {formatCurrency(order.total_amount || 0)}
                      </div>
                      <div className="text-sm text-gray-500">{formatDate(order.created_at)}</div>
                    </div>
                  </div>

                  {/* Order Notes */}
                  {order.notes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">ملاحظات: </span>
                        {order.notes}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-4 rounded transition-colors">
                      تفاصيل الطلب
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm py-2 px-4 rounded transition-colors">
                      تتبع الشحنة
                    </button>
                    {(order.status === 'pending' || order.status === 'processing') && (
                      <button className="bg-red-100 hover:bg-red-200 text-red-600 text-sm py-2 px-4 rounded transition-colors">
                        إلغاء الطلب
                      </button>
                    )}
                    {order.status === 'delivered' && (
                      <button className="bg-green-100 hover:bg-green-200 text-green-600 text-sm py-2 px-4 rounded transition-colors">
                        تأكيد الاستلام
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
