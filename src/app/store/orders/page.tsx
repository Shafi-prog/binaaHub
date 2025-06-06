'use client';

import { useEffect, useState, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { Card, StatCard, LoadingSpinner, StatusBadge, EmptyState } from '@/components/ui';
import { getStoreDashboardStats, type StoreStats } from '@/lib/api/store-dashboard';
import { formatCurrency, formatDate, translateStatus } from '@/lib/utils';
import { verifyAuthWithRetry } from '@/lib/auth-recovery';
import ClientIcon from '@/components/icons/ClientIcon';
import type { IconKey } from '@/components/icons/ClientIcon';
import { updateOrderStatus } from '@/lib/api/orders';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';

interface StoreOrdersUser extends User {
  store_name?: string;
}

function OrderDocumentsList({ orderId, canDelete }: { orderId: string, canDelete?: boolean }) {
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchDocs = async () => {
      setLoading(true);
      try {
        const { getOrderDocuments, getDocumentUrl } = await import('@/lib/supabase');
        const files = await getOrderDocuments(orderId);
        // Attach public URLs
        const filesWithUrls = await Promise.all((files || []).map(async (doc: any) => ({
          ...doc,
          url: await getDocumentUrl(doc.id)
        })));
        setDocs(filesWithUrls);
      } catch {
        setDocs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, [orderId]);
  if (loading) return <div>جاري التحميل...</div>;
  if (!docs.length) return <div className="text-xs text-gray-400">لا توجد ملفات مرفقة</div>;
  return (
    <ul className="space-y-2">
      {docs.map((doc, idx) => (
        <li key={idx} className="flex items-center gap-2 text-sm">
          <span>📄</span>
          <a
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 underline"
          >
            {doc.name}
          </a>
          {canDelete && (
            <button
              className="text-xs text-red-600 ml-2"
              onClick={async () => {
                if (!window.confirm('هل أنت متأكد من حذف الملف؟')) return;
                const { supabase } = await import('@/lib/supabase');
                await supabase.storage.from('documents').remove([doc.id]);
                setDocs(docs.filter((d) => d.id !== doc.id));
              }}
            >
              حذف
            </button>
          )}
        </li>
      ))}
    </ul>
  );
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
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [detailsOrder, setDetailsOrder] = useState<any | null>(null);
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({ from: '', to: '' });
  const [customerFilter, setCustomerFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const detailsModalRef = useRef<HTMLDialogElement>(null);

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

  // Bulk selection handlers
  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };
  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map((order: any) => order.id));
    }
  };
  const handleBulkDelete = async () => {
    // TODO: Implement bulk delete API call
    setStats((prev) => ({
      ...prev!,
      recentOrders: prev!.recentOrders.filter((o: any) => !selectedOrders.includes(o.id)),
    }));
    setSelectedOrders([]);
  };
  const handleBulkExport = () => {
    const selected = orders.filter((o: any) => selectedOrders.includes(o.id));
    const csvRows = [
      ['Order ID', 'Order Number', 'Customer', 'Status', 'Total', 'Date'],
      ...selected.map((o: any) => [
        o.id,
        o.order_number || '',
        o.customer_name || o.user?.name || '',
        o.status,
        o.total_amount,
        formatDate(o.created_at),
      ]),
    ];
    const csvContent = csvRows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'orders.csv');
  };

  const handleBulkMarkAsPaid = async () => {
    // TODO: Implement API call to mark selected orders as paid
    setStats((prev) => ({
      ...prev!,
      recentOrders: prev!.recentOrders.map((o: any) =>
        selectedOrders.includes(o.id) ? { ...o, status: 'paid' } : o
      ),
    }));
    setSelectedOrders([]);
  };
  const handleBulkResendNotification = async () => {
    // TODO: Implement API call to resend notification for selected orders
    // For now, just show a notification (if NotificationProvider is available)
    alert('تمت إعادة إرسال الإشعار للطلبات المحددة!');
  };

  // Get orders from stats (using recent orders or create mock data)
  const orders = stats?.recentOrders || [];

  // Advanced filter logic (move here, after orders is defined)
  const filteredOrders = orders
    .filter((order: any) =>
      filter === 'all' ? true : order.status === filter
    )
    .filter((order: any) =>
      !searchTerm ||
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.order_number?.toString().includes(searchTerm)
    )
    .filter((order: any) =>
      !customerFilter ||
      order.customer_name?.toLowerCase().includes(customerFilter.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(customerFilter.toLowerCase())
    )
    .filter((order: any) =>
      !paymentFilter || order.payment_method === paymentFilter
    )
    .filter((order: any) => {
      if (!dateRange.from && !dateRange.to) return true;
      const orderDate = new Date(order.created_at);
      const from = dateRange.from ? new Date(dateRange.from) : null;
      const to = dateRange.to ? new Date(dateRange.to) : null;
      if (from && orderDate < from) return false;
      if (to && orderDate > to) return false;
      return true;
    });

  const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);
  const avgOrderValue = orders.length ? totalRevenue / orders.length : 0;
  const customerMap: Record<string, number> = {};
  orders.forEach((o: any) => {
    const name = o.customer_name || o.user?.name || 'غير معروف';
    customerMap[name] = (customerMap[name] || 0) + 1;
  });
  const topCustomers = Object.entries(customerMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-gray-500 text-xs mb-1">إجمالي الإيرادات</div>
            <div className="text-lg font-bold text-green-700">{formatCurrency(totalRevenue)}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-gray-500 text-xs mb-1">متوسط قيمة الطلب</div>
            <div className="text-lg font-bold text-blue-700">{formatCurrency(avgOrderValue)}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-gray-500 text-xs mb-1">أفضل العملاء</div>
            <ul className="text-sm mt-2">
              {topCustomers.map(([name, count], idx) => (
                <li key={idx}>{name} <span className="text-gray-400">({count} طلب)</span></li>
              ))}
            </ul>
          </div>
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
          {/* Advanced Filters UI */}
          <div className="flex flex-wrap gap-4 mb-4 items-end">
            <div>
              <label className="block text-xs text-gray-500 mb-1">تاريخ الطلب</label>
              <div className="flex gap-2">
                <input type="date" value={dateRange.from} onChange={e => setDateRange(r => ({ ...r, from: e.target.value }))} className="border rounded px-2 py-1 text-sm" />
                <span className="text-gray-400">-</span>
                <input type="date" value={dateRange.to} onChange={e => setDateRange(r => ({ ...r, to: e.target.value }))} className="border rounded px-2 py-1 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">اسم العميل</label>
              <input type="text" value={customerFilter} onChange={e => setCustomerFilter(e.target.value)} className="border rounded px-2 py-1 text-sm" placeholder="بحث بالاسم..." />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">طريقة الدفع</label>
              <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)} className="border rounded px-2 py-1 text-sm">
                <option value="">الكل</option>
                <option value="cash">نقداً</option>
                <option value="card">بطاقة</option>
                <option value="online">أونلاين</option>
              </select>
            </div>
            {(dateRange.from || dateRange.to || customerFilter || paymentFilter) && (
              <button className="text-xs text-blue-600 underline ml-2" onClick={() => { setDateRange({ from: '', to: '' }); setCustomerFilter(''); setPaymentFilter(''); }}>مسح الفلاتر</button>
            )}
          </div>
          {selectedOrders.length > 0 && (
            <div className="flex items-center gap-4 mb-4 bg-gray-50 border border-gray-200 rounded-lg p-3">
              <span className="font-medium text-gray-700">{selectedOrders.length} طلب محدد</span>
              <button className="flex items-center gap-1 bg-green-100 hover:bg-green-200 text-green-600 px-3 py-1 rounded text-sm" onClick={handleBulkMarkAsPaid}>
                <ClientIcon type="money" size={16} /> تعليم كمدفوع
              </button>
              <button className="flex items-center gap-1 bg-purple-100 hover:bg-purple-200 text-purple-600 px-3 py-1 rounded text-sm" onClick={handleBulkResendNotification}>
                <ClientIcon type="ai" size={16} /> إعادة إرسال إشعار
              </button>
              <button
                className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded text-sm"
                onClick={handleBulkDelete}
              >
                <ClientIcon type="settings" size={16} /> حذف
              </button>
              <button
                className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 py-1 rounded text-sm"
                onClick={handleBulkExport}
              >
                <ClientIcon type="chart" size={16} /> تصدير CSV
              </button>
            </div>
          )}
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
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
              onChange={handleSelectAll}
              className="mr-2"
            />
            <span className="text-sm text-gray-600">تحديد الكل</span>
          </div>

          {filteredOrders.length === 0 ? (
            <EmptyState
              icon={
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
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
                  <div className="flex items-start gap-4 mb-2">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
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

                      {/* Warranty info for each order (store view, robust, safe checks) */}
                      {order.items && order.items.length > 0 && (
                        <div className="mb-2 p-2 bg-green-50 rounded">
                          <span className="font-medium">الضمانات:</span>
                          <ul className="list-disc ml-6 mt-1">
                            {order.items.map((item: any, idx: number) => (
                              item.has_warranty ? (
                                <li key={idx} className="text-xs text-gray-700">
                                  {item.product?.name || item.name}: {item.warranty_duration_months ? `${item.warranty_duration_months} شهر` : ''} {item.warranty_notes ? `- ${item.warranty_notes}` : ''}
                                </li>
                              ) : null
                            ))}
                          </ul>
                          <button className="mt-1 text-xs text-blue-600 underline" onClick={() => alert('طلب خدمة الضمان قيد التطوير')}>طلب خدمة الضمان</button>
                        </div>
                      )}

                      {/* Order Actions */}
                      <div className="flex gap-2 pt-3 border-t border-gray-100">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-4 rounded transition-colors" onClick={() => { setDetailsOrder(order); detailsModalRef.current?.showModal(); }}>
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Order Details Modal */}
        <dialog ref={detailsModalRef} className="rounded-lg p-0 w-full max-w-2xl shadow-xl">
          {detailsOrder && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">تفاصيل الطلب #{detailsOrder.order_number || detailsOrder.id}</h3>
                <button onClick={() => { setDetailsOrder(null); detailsModalRef.current?.close(); }} className="text-gray-400 hover:text-gray-700">✕</button>
              </div>
              <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><span className="font-medium">العميل:</span> {detailsOrder.customer_name || detailsOrder.user?.name}</div>
                <div><span className="font-medium">تاريخ الطلب:</span> {formatDate(detailsOrder.created_at)}</div>
                <div><span className="font-medium">طريقة الدفع:</span> {detailsOrder.payment_method}</div>
                <div><span className="font-medium">الحالة:</span> {translateStatus(detailsOrder.status)}</div>
                <div><span className="font-medium">المبلغ:</span> {formatCurrency(detailsOrder.total_amount)}</div>
                <div><span className="font-medium">رقم الطلب:</span> {detailsOrder.id}</div>
              </div>
              <div className="mb-4">
                <span className="font-medium">المنتجات:</span>
                <ul className="list-disc ml-6 mt-2">
                  {(detailsOrder.items || []).map((item: any, idx: number) => (
                    <li key={idx}>{item.name} × {item.quantity} ({formatCurrency(item.price)})</li>
                  ))}
                </ul>
              </div>
              {detailsOrder.notes && (
                <div className="mb-2"><span className="font-medium">ملاحظات:</span> {detailsOrder.notes}</div>
              )}
              <div className="flex gap-2 mb-4">
                <button
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs"
                  onClick={() => {
                    navigator.clipboard.writeText(detailsOrder.id);
                  }}
                >
                  نسخ رقم الطلب
                </button>
                <button
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded text-xs"
                  onClick={() => {
                    const doc = new jsPDF();
                    doc.setFontSize(18);
                    doc.text(`فاتورة الطلب #${detailsOrder.order_number || detailsOrder.id}`, 10, 15);
                    doc.setFontSize(12);
                    doc.text(`العميل: ${detailsOrder.customer_name || detailsOrder.user?.name || ''}`, 10, 30);
                    doc.text(`تاريخ الطلب: ${formatDate(detailsOrder.created_at)}`, 10, 38);
                    doc.text(`طريقة الدفع: ${detailsOrder.payment_method || ''}`, 10, 46);
                    doc.text(`الحالة: ${translateStatus(detailsOrder.status)}`, 10, 54);
                    doc.text(`المبلغ: ${formatCurrency(detailsOrder.total_amount)}`, 10, 62);
                    doc.text('--- المنتجات ---', 10, 74);
                    (detailsOrder.items || []).forEach((item: any, idx: number) => {
                      doc.text(`${idx + 1}. ${item.name} × ${item.quantity} (${formatCurrency(item.price)})`, 10, 82 + idx * 8);
                    });
                    if (detailsOrder.notes) {
                      doc.text(`ملاحظات: ${detailsOrder.notes}`, 10, 100);
                    }
                    doc.save(`invoice-${detailsOrder.order_number || detailsOrder.id}.pdf`);
                  }}
                >
                  تحميل الفاتورة
                </button>
              </div>
              {/* Document Upload (Store only) */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">إرفاق ملف للطلب</label>
                <input
                  type="file"
                  onChange={async (e) => {
                    if (!e.target.files?.[0]) return;
                    try {
                      // Dynamically import upload helper
                      const { uploadOrderDocument, getOrderDocuments, getDocumentUrl } = await import('@/lib/supabase');
                      await uploadOrderDocument(e.target.files[0], detailsOrder.id);
                      alert('تم رفع الملف بنجاح!');
                      // Optionally: refresh document list
                    } catch (err) {
                      alert('حدث خطأ أثناء رفع الملف');
                    }
                  }}
                  className="block w-full text-sm text-gray-700 border border-gray-300 rounded p-2"
                />
              </div>
              {/* Document List */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">الملفات المرفقة</label>
                <OrderDocumentsList orderId={detailsOrder.id} canDelete={true} />
              </div>
              {/* Recent Activity Timeline */}
              {detailsOrder.status_history && detailsOrder.status_history.length > 0 && (
                <div className="mb-4">
                  <span className="font-medium">النشاط الأخير:</span>
                  <ul className="mt-2 ml-6 list-disc text-xs text-gray-600">
                    {detailsOrder.status_history.map((s: any, idx: number) => (
                      <li key={idx}>{formatDate(s.date)}: {translateStatus(s.status)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </dialog>

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

            {stats?.totalProducts > 0 && (
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
