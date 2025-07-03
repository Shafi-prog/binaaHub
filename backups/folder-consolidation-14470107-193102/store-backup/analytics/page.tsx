'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  Package,
  Eye,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  MapPin,
  Clock
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AnalyticsData {
  // Revenue Analytics
  totalRevenue: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  
  // Order Analytics
  totalOrders: number;
  monthlyOrders: number;
  orderGrowth: number;
  averageOrderValue: number;
  
  // Product Analytics
  totalProducts: number;
  lowStockProducts: number;
  topSellingProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  
  // Customer Analytics
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  customerGrowth: number;
  
  // Traffic Analytics  
  totalViews: number;
  monthlyViews: number;
  conversionRate: number;
  
  // Performance Metrics
  fulfillmentRate: number;
  averageDeliveryTime: number;
  customerSatisfaction: number;
  returnRate: number;
}

interface ChartData {
  revenueChart: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  categoryChart: Array<{
    category: string;
    sales: number;
    percentage: number;
  }>;
  trafficChart: Array<{
    date: string;
    views: number;
    orders: number;
  }>;
}

export default function StoreAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [refreshing, setRefreshing] = useState(false);

  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);

      // Get current user
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      if (userError || !currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);

      // For now, we'll use mock data since the actual analytics would require
      // complex queries and the schema might not be fully set up yet
      await loadMockAnalytics();

    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMockAnalytics = async () => {
    // Mock analytics data
    const mockAnalytics: AnalyticsData = {
      totalRevenue: 125000,
      monthlyRevenue: 18500,
      revenueGrowth: 12.5,
      
      totalOrders: 342,
      monthlyOrders: 45,
      orderGrowth: 8.3,
      averageOrderValue: 365.5,
      
      totalProducts: 156,
      lowStockProducts: 12,
      topSellingProducts: [
        { name: 'خرسانة جاهزة - درجة 350', sales: 45, revenue: 12600 },
        { name: 'حديد تسليح 16مم', sales: 38, revenue: 19000 },
        { name: 'أسمنت بورتلاندي', sales: 32, revenue: 9600 },
        { name: 'طوب أحمر', sales: 28, revenue: 8400 },
        { name: 'رمل مغسول', sales: 25, revenue: 6250 }
      ],
      
      totalCustomers: 89,
      newCustomers: 12,
      returningCustomers: 33,
      customerGrowth: 15.2,
      
      totalViews: 2340,
      monthlyViews: 456,
      conversionRate: 9.87,
      
      fulfillmentRate: 94.2,
      averageDeliveryTime: 2.3,
      customerSatisfaction: 4.6,
      returnRate: 2.1
    };

    const mockChartData: ChartData = {
      revenueChart: [
        { month: 'يناير', revenue: 15000, orders: 32 },
        { month: 'فبراير', revenue: 18000, orders: 38 },
        { month: 'مارس', revenue: 16500, orders: 35 },
        { month: 'أبريل', revenue: 19000, orders: 41 },
        { month: 'مايو', revenue: 17500, orders: 37 },
        { month: 'يونيو', revenue: 18500, orders: 45 }
      ],
      categoryChart: [
        { category: 'مواد البناء', sales: 145, percentage: 42.1 },
        { category: 'معدات', sales: 89, percentage: 25.8 },
        { category: 'أدوات', sales: 67, percentage: 19.4 },
        { category: 'كهربائي', sales: 28, percentage: 8.1 },
        { category: 'صحي', sales: 16, percentage: 4.6 }
      ],
      trafficChart: [
        { date: '1', views: 45, orders: 3 },
        { date: '2', views: 52, orders: 4 },
        { date: '3', views: 38, orders: 2 },
        { date: '4', views: 67, orders: 6 },
        { date: '5', views: 54, orders: 5 },
        { date: '6', views: 49, orders: 3 },
        { date: '7', views: 61, orders: 7 }
      ]
    };

    setAnalytics(mockAnalytics);
    setChartData(mockChartData);
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadAnalyticsData();
    setRefreshing(false);
  };

  const exportData = () => {
    // Placeholder for data export
    alert('سيتم تنفيذ تصدير البيانات قريباً');
  };

  const getTimeRangeText = (range: string) => {
    switch (range) {
      case '7d': return 'آخر 7 أيام';
      case '30d': return 'آخر 30 يوم';
      case '90d': return 'آخر 3 شهور';
      case '1y': return 'آخر سنة';
      default: return 'آخر 30 يوم';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل التحليلات...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد بيانات متاحة</h3>
          <p className="text-gray-500">لم يتم العثور على بيانات تحليلية</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-tajawal" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">تحليلات المتجر</h1>
              <p className="mt-1 text-sm text-gray-600">
                مراقبة أداء متجرك وتحليل البيانات التجارية
              </p>
            </div>
            <div className="flex gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">آخر 7 أيام</option>
                <option value="30d">آخر 30 يوم</option>
                <option value="90d">آخر 3 شهور</option>
                <option value="1y">آخر سنة</option>
              </select>
              <Button 
                variant="outline" 
                onClick={refreshData} 
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 ml-2 ${refreshing ? 'animate-spin' : ''}`} />
                تحديث
              </Button>
              <Button variant="outline" onClick={exportData}>
                <Download className="w-4 h-4 ml-2" />
                تصدير
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="mr-4 flex-1">
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(analytics.monthlyRevenue)}
                </div>
                <div className="text-sm text-gray-500">الإيرادات الشهرية</div>
                <div className={`flex items-center text-sm ${analytics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analytics.revenueGrowth >= 0 ? (
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 ml-1" />
                  )}
                  {formatPercentage(analytics.revenueGrowth)}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShoppingCart className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mr-4 flex-1">
                <div className="text-2xl font-bold text-gray-900">{analytics.monthlyOrders}</div>
                <div className="text-sm text-gray-500">الطلبات الشهرية</div>
                <div className={`flex items-center text-sm ${analytics.orderGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analytics.orderGrowth >= 0 ? (
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 ml-1" />
                  )}
                  {formatPercentage(analytics.orderGrowth)}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mr-4 flex-1">
                <div className="text-2xl font-bold text-gray-900">{analytics.newCustomers}</div>
                <div className="text-sm text-gray-500">عملاء جدد</div>
                <div className={`flex items-center text-sm ${analytics.customerGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analytics.customerGrowth >= 0 ? (
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 ml-1" />
                  )}
                  {formatPercentage(analytics.customerGrowth)}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <div className="mr-4 flex-1">
                <div className="text-2xl font-bold text-gray-900">
                  {analytics.conversionRate.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500">معدل التحويل</div>
                <div className="text-sm text-gray-600">
                  {analytics.monthlyViews} زيارة
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                <LineChart className="w-5 h-5 inline ml-2" />
                الإيرادات والطلبات
              </h3>
              <div className="text-sm text-gray-500">{getTimeRangeText(timeRange)}</div>
            </div>
            <div className="h-64 flex items-end justify-between space-x-2">
              {chartData?.revenueChart.map((data, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div className="flex flex-col items-center space-y-1">
                    <div 
                      className="bg-blue-500 rounded-t"
                      style={{ 
                        height: `${(data.revenue / 20000) * 150}px`,
                        width: '20px'
                      }}
                    />
                    <div 
                      className="bg-green-500 rounded-t"
                      style={{ 
                        height: `${(data.orders / 50) * 50}px`,
                        width: '20px'
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-600 text-center">
                    <div>{data.month}</div>
                    <div className="text-blue-600">{formatCurrency(data.revenue)}</div>
                    <div className="text-green-600">{data.orders} طلب</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4 space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded ml-2"></div>
                <span className="text-sm text-gray-600">الإيرادات</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded ml-2"></div>
                <span className="text-sm text-gray-600">الطلبات</span>
              </div>
            </div>
          </Card>

          {/* Category Sales */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                <PieChart className="w-5 h-5 inline ml-2" />
                المبيعات حسب الفئة
              </h3>
            </div>
            <div className="space-y-4">
              {chartData?.categoryChart.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">{category.category}</span>
                    <span className="text-sm text-gray-600">{category.sales} مبيعة</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500">{category.percentage}%</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{analytics.fulfillmentRate}%</div>
                <div className="text-sm text-gray-500">معدل التنفيذ</div>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{analytics.averageDeliveryTime}</div>
                <div className="text-sm text-gray-500">متوسط التسليم (أيام)</div>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{analytics.customerSatisfaction}</div>
                <div className="text-sm text-gray-500">رضا العملاء</div>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{analytics.returnRate}%</div>
                <div className="text-sm text-gray-500">معدل الإرجاع</div>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Top Products & Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Selling Products */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              <TrendingUp className="w-5 h-5 inline ml-2" />
              المنتجات الأكثر مبيعاً
            </h3>
            <div className="space-y-4">
              {analytics.topSellingProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center ml-3">
                      <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.sales} مبيعة</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{formatCurrency(product.revenue)}</div>
                    <div className="text-sm text-gray-500">إجمالي الإيرادات</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Detailed Statistics */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              <BarChart3 className="w-5 h-5 inline ml-2" />
              إحصائيات تفصيلية
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">إجمالي الإيرادات</span>
                <span className="font-semibold text-gray-900">{formatCurrency(analytics.totalRevenue)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">متوسط قيمة الطلب</span>
                <span className="font-semibold text-gray-900">{formatCurrency(analytics.averageOrderValue)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">إجمالي العملاء</span>
                <span className="font-semibold text-gray-900">{analytics.totalCustomers}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">العملاء المتكررين</span>
                <span className="font-semibold text-gray-900">{analytics.returningCustomers}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">المنتجات منخفضة المخزون</span>
                <span className="font-semibold text-red-600">{analytics.lowStockProducts}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">إجمالي المشاهدات</span>
                <span className="font-semibold text-gray-900">{analytics.totalViews.toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
