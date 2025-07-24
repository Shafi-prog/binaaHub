// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card } from '@/core/shared/components/ui/card';
import { LoadingSpinner } from '@/core/shared/components/ui/loading-spinner';
import { formatCurrency } from '@/core/shared/utils';
import Link from 'next/link';
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';
import { 
  Package, 
  ShoppingBag, 
  Users, 
  DollarSign,
  TrendingUp,
  Plus,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  pendingOrders: number;
  lowStockItems: number;
  recentOrders: Array<{
    id: string;
    customerName: string;
    amount: number;
    status: string;
    created_at: string;
  }>;
}

export default function StoreDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const getDemoStats = (): DashboardStats => ({
    totalProducts: 15,
    totalOrders: 8,
    totalRevenue: 12450,
    totalCustomers: 12,
    pendingOrders: 2,
    lowStockItems: 3,
    recentOrders: [
      {
        id: 'demo-1',
        customerName: 'أحمد محمد',
        amount: 850,
        status: 'pending',
        created_at: new Date().toISOString()
      },
      {
        id: 'demo-2',
        customerName: 'فاطمة علي',
        amount: 1200,
        status: 'confirmed',
        created_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'demo-3',
        customerName: 'محمد سالم',
        amount: 650,
        status: 'delivered',
        created_at: new Date(Date.now() - 172800000).toISOString()
      }
    ]
  });

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user and store
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        setStats(getDemoStats());
        setIsDemo(true);
        setLoading(false);
        return;
      }

      // Get user's store
      const { data: stores, error: storeError } = await supabase
        .from('stores')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (storeError || !stores) {
        setStats(getDemoStats());
        setIsDemo(true);
        setLoading(false);
        return;
      }

      const storeId = stores.id;

      // Fetch basic dashboard data
      const [
        { data: products },
        { data: orders },
        { data: customers },
        { data: recentOrders }
      ] = await Promise.all([
        supabase.from('products').select('id').eq('store_id', storeId),
        supabase.from('orders').select('id, total_amount, status, created_at').eq('store_id', storeId),
        supabase.from('customers').select('id').eq('store_id', storeId),
        supabase
          .from('orders')
          .select(`
            id,
            total_amount,
            status,
            created_at,
            users!orders_user_id_fkey (name)
          `)
          .eq('store_id', storeId)
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      const totalRevenue = orders?.reduce((sum: any, order: any) => sum + (order.total_amount || 0), 0) || 0;
      const pendingOrders = orders?.filter((order: any) => order.status === 'pending').length || 0;

      setStats({
        totalProducts: products?.length || 0,
        totalOrders: orders?.length || 0,
        totalRevenue,
        totalCustomers: customers?.length || 0,
        pendingOrders,
        lowStockItems: 0, // Simple version - no complex stock tracking
        recentOrders: recentOrders?.map((order: any) => ({
          id: order.id,
          customerName: (order.users as any)?.[0]?.name || 'عميل غير معروف',
          amount: order.total_amount || 0,
          status: order.status,
          created_at: order.created_at
        })) || []
      });
      
      setIsDemo(false);

    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError('حدث خطأ في تحميل بيانات اللوحة');
      setStats(getDemoStats());
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const statusTexts = {
      pending: 'في الانتظار',
      confirmed: 'مؤكد',
      delivered: 'مُسلم',
      cancelled: 'ملغي'
    };
    return statusTexts[status as keyof typeof statusTexts] || status;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
          <button
            onClick={loadDashboardData}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        {/* Demo Banner */}
        {isDemo && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-blue-600 ml-3" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">عرض تجريبي</h3>
                <p className="text-sm text-blue-700">
                  هذه بيانات تجريبية. سجل الدخول لعرض بيانات متجرك الحقيقية.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            لوحة تحكم المتجر
          </h1>
          <p className="text-gray-600">
            مرحباً بك في متجرك
          </p>
        </div>

        {/* Alerts */}
        {stats.pendingOrders > 0 && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-600 ml-2" />
              <span className="text-yellow-800">
                لديك {stats.pendingOrders} طلب في انتظار المراجعة
              </span>
            </div>
          </div>
        )}

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">المنتجات</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <ShoppingBag className="w-6 h-6 text-green-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">الطلبات</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">العملاء</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">المبيعات</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">الطلبات الحديثة</h2>
                <Link href="/store/orders" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  عرض الكل
                </Link>
              </div>
              <div className="space-y-4">
                {stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-900">طلب #{order.id.slice(-6)}</p>
                        <p className="text-sm text-gray-600">{order.customerName}</p>
                        <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">{formatCurrency(order.amount)}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">لا توجد طلبات حديثة</p>
                )}
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">الإجراءات السريعة</h2>
              </div>
              <div className="space-y-4">
                <Link
                  href="/store/products/new"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <Plus className="w-8 h-8 text-blue-600 ml-3" />
                  <div>
                    <p className="font-medium text-gray-900">إضافة منتج جديد</p>
                    <p className="text-sm text-gray-600">أضف منتج إلى متجرك</p>
                  </div>
                </Link>

                <Link
                  href="/store/orders"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                >
                  <ShoppingBag className="w-8 h-8 text-green-600 ml-3" />
                  <div>
                    <p className="font-medium text-gray-900">إدارة الطلبات</p>
                    <p className="text-sm text-gray-600">تتبع ومتابعة الطلبات</p>
                  </div>
                </Link>

                <Link
                  href="/store/inventory"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                >
                  <Package className="w-8 h-8 text-purple-600 ml-3" />
                  <div>
                    <p className="font-medium text-gray-900">إدارة المخزون</p>
                    <p className="text-sm text-gray-600">تتبع المخزون والكميات</p>
                  </div>
                </Link>

                <Link
                  href="/store/analytics-enhanced"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
                >
                  <TrendingUp className="w-8 h-8 text-orange-600 ml-3" />
                  <div>
                    <p className="font-medium text-gray-900">عرض التقارير</p>
                    <p className="text-sm text-gray-600">إحصائيات وتحليلات</p>
                  </div>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


