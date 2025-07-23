// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card } from '@/core/shared/components/ui/card';
import { LoadingSpinner } from '@/core/shared/components/ui/loading-spinner';
import { formatCurrency } from '@/core/shared/utils';
import { 
  BarChart3, 
  Users, 
  ShoppingBag, 
  Package,
  TrendingUp,
  TrendingDown,
  Plus,
  Eye,
  Settings,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter
} from 'lucide-react';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalCustomers: number;
  pendingOrders: number;
  activeWarranties: number;
  viewsToday: number;
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
    totalProducts: 25,
    totalOrders: 12,
    totalRevenue: 15750,
    monthlyRevenue: 8500,
    totalCustomers: 18,
    pendingOrders: 3,
    activeWarranties: 7,
    viewsToday: 145,
    recentOrders: [
      {
        id: 'demo-1',
        customerName: 'عميل تجريبي 1',
        amount: 1250,
        status: 'pending',
        created_at: new Date().toISOString()
      },
      {
        id: 'demo-2',
        customerName: 'عميل تجريبي 2',
        amount: 850,
        status: 'confirmed',
        created_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'demo-3',
        customerName: 'عميل تجريبي 3',
        amount: 2100,
        status: 'shipped',
        created_at: new Date(Date.now() - 172800000).toISOString()
      }
    ]
  });

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);      // Get current user and store
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        // If not authenticated, show demo data or redirect to login
        console.log('User not authenticated, showing demo data');
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
        console.log('No store found for user, showing demo data');
        setStats(getDemoStats());
        setIsDemo(true);
        setLoading(false);
        return;
      }

      const storeId = stores.id;

      // Fetch dashboard data
      const [
        { data: products },
        { data: orders },
        { data: warranties },
        { data: customers },
        { data: metrics },
        { data: recentOrders }
      ] = await Promise.all([
        supabase.from('products').select('id').eq('store_id', storeId),
        supabase.from('orders').select('id, total_amount, status, created_at').eq('store_id', storeId),
        supabase.from('warranties').select('id').eq('store_id', storeId).eq('status', 'active'),
        supabase.from('customers').select('id').eq('store_id', storeId),
        supabase
          .from('daily_store_metrics')
          .select('*')
          .eq('store_id', storeId)
          .eq('date', new Date().toISOString().split('T')[0])
          .single(),
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
          .limit(8)
      ]);

      // Calculate stats
      const totalRevenue = orders?.reduce((sum: any, order: any) => sum + (order.total_amount || 0), 0) || 0;
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = orders?.filter((order: any) => {
        const orderDate = new Date(order.created_at);
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
      }).reduce((sum: any, order: any) => sum + (order.total_amount || 0), 0) || 0;

      const pendingOrders = orders?.filter((order: any) => order.status === 'pending').length || 0;      setStats({
        totalProducts: products?.length || 0,
        totalOrders: orders?.length || 0,
        totalRevenue,
        monthlyRevenue,
        totalCustomers: customers?.length || 0,
        pendingOrders,
        activeWarranties: warranties?.length || 0,
        viewsToday: metrics?.view_count || 0,
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
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-green-100 text-green-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const statusTexts = {
      pending: 'في الانتظار',
      confirmed: 'مؤكد',
      processing: 'قيد المعالجة',
      shipped: 'مشحون',
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

  if (error) {
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

  const statsCards = [
    {
      title: 'المبيعات',
      value: formatCurrency(stats.monthlyRevenue),
      description: '+12% من الشهر الماضي',
      icon: BarChart3,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'الطلبات',
      value: stats.totalOrders,
      description: '+8% من الشهر الماضي',
      icon: ShoppingBag,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'العملاء',
      value: stats.totalCustomers,
      description: '+15% من الشهر الماضي',
      icon: Users,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      title: 'المنتجات',
      value: stats.totalProducts,
      description: '+5% من الشهر الماضي',
      icon: Package,
      color: 'bg-orange-500',
      textColor: 'text-orange-600'
    }
  ];

  const quickActions = [
    {
      title: 'إضافة منتج جديد',
      icon: Plus,
      href: '/store/products/new',
      color: 'hover:border-blue-300 hover:bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'إدارة الطلبات',
      icon: ShoppingBag,
      href: '/store/orders',
      color: 'hover:border-green-300 hover:bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'إدارة المخزون',
      icon: Package,
      href: '/store/inventory',
      color: 'hover:border-purple-300 hover:bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      title: 'عرض التقارير',
      icon: FileText,
      href: '/store/analytics-enhanced',
      color: 'hover:border-orange-300 hover:bg-orange-50',
      iconColor: 'text-orange-600'
    }
  ];
  return (
    <div className="min-h-screen bg-gray-50 font-tajawal" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            لوحة تحكم المتجر
          </h1>
          <p className="text-gray-600">
            مرحباً بك في لوحة تحكم المتجر المطورة
          </p>
        </div>

        {/* Alert if low stock or pending orders */}
        {(stats.pendingOrders > 0) && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-600 ml-2" />
              <span className="text-yellow-800">
                لديك {stats.pendingOrders} طلب في انتظار المراجعة
              </span>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.description}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">الطلبات الحديثة</h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" onClick={() => alert('Button clicked')}>
                عرض الكل
              </button>
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

          {/* Quick Actions */}
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">الإجراءات السريعة</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <a
                  key={index}
                  href={action.href}
                  className={`p-4 border border-gray-200 rounded-lg transition-colors ${action.color} block text-center`}
                >
                  <action.icon className={`w-8 h-8 ${action.iconColor} mx-auto mb-2`} />
                  <p className="text-sm font-medium text-gray-900">{action.title}</p>
                </a>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}


