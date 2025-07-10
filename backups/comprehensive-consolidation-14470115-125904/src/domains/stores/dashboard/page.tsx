'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  Eye,
  Star,
  Package,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Calendar,
  Filter
} from 'lucide-react';

interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  totalProducts: number;
  productsChange: number;
  totalCustomers: number;
  customersChange: number;
  averageRating: number;
  ratingChange: number;
  lowStockItems: number;
}

interface RecentOrder {
  id: string;
  customerName: string;
  items: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
}

interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  image: string;
}

export default function StoreDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats(mockStats);
      setRecentOrders(mockRecentOrders);
      setTopProducts(mockTopProducts);
      setLoading(false);
    }, 1000);
  }, [dateRange]);

  const mockStats: DashboardStats = {
    totalRevenue: 125000,
    revenueChange: 12.5,
    totalOrders: 1567,
    ordersChange: -2.3,
    totalProducts: 234,
    productsChange: 5.2,
    totalCustomers: 890,
    customersChange: 8.7,
    averageRating: 4.5,
    ratingChange: 0.2,
    lowStockItems: 8
  };

  const mockRecentOrders: RecentOrder[] = [
    {
      id: 'ORD001',
      customerName: 'أحمد محمد',
      items: 3,
      total: 450.00,
      status: 'pending',
      date: '2024-12-21'
    },
    {
      id: 'ORD002',
      customerName: 'فاطمة السالم',
      items: 1,
      total: 125.50,
      status: 'shipped',
      date: '2024-12-21'
    },
    {
      id: 'ORD003',
      customerName: 'محمد العتيبي',
      items: 5,
      total: 780.00,
      status: 'delivered',
      date: '2024-12-20'
    }
  ];

  const mockTopProducts: TopProduct[] = [
    {
      id: 'PRD001',
      name: 'أسمنت بورتلاندي عادي 50 كيلو',
      sales: 234,
      revenue: 5967.00,
      image: '/api/placeholder/60/60'
    },
    {
      id: 'PRD002',
      name: 'مثقاب كهربائي بوش 18 فولت',
      sales: 89,
      revenue: 26691.11,
      image: '/api/placeholder/60/60'
    },
    {
      id: 'PRD003',
      name: 'أنابيب PVC قطر 4 بوصة',
      sales: 145,
      revenue: 4350.00,
      image: '/api/placeholder/60/60'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'في الانتظار';
      case 'processing': return 'قيد المعالجة';
      case 'shipped': return 'تم الشحن';
      case 'delivered': return 'تم التسليم';
      case 'cancelled': return 'ملغي';
      default: return 'غير معروف';
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color = 'blue',
    format = 'number'
  }: {
    title: string;
    value: number;
    change: number;
    icon: any;
    color?: string;
    format?: 'number' | 'currency' | 'rating';
  }) => {
    const formatValue = (val: number) => {
      switch (format) {
        case 'currency':
          return `${val.toLocaleString()} ر.س`;
        case 'rating':
          return val.toFixed(1);
        default:
          return val.toLocaleString();
      }
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{formatValue(value)}</p>
            <div className="flex items-center gap-1 mt-1">
              {change > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change > 0 ? '+' : ''}{change.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className={`bg-${color}-100 p-3 rounded-lg`}>
            <Icon className={`w-6 h-6 text-${color}-600`} />
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم</h1>
            <p className="text-gray-600 mt-2">مرحباً بك في متجر البناء الحديث</p>
          </div>
          
          <div className="flex items-center gap-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">آخر 7 أيام</option>
              <option value="30d">آخر 30 يوم</option>
              <option value="90d">آخر 90 يوم</option>
              <option value="1y">آخر سنة</option>
            </select>
          </div>
        </div>

        {/* Quick Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800">تنبيه مخزون</p>
                <p className="text-xs text-yellow-700">{stats?.lowStockItems} منتج بحاجة لإعادة تموين</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800">طلبات جديدة</p>
                <p className="text-xs text-blue-700">5 طلبات جديدة تحتاج للمراجعة</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">متجر نشط</p>
                <p className="text-xs text-green-700">جميع الأنظمة تعمل بشكل طبيعي</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <StatCard
            title="إجمالي الإيرادات"
            value={stats?.totalRevenue || 0}
            change={stats?.revenueChange || 0}
            icon={DollarSign}
            color="green"
            format="currency"
          />
          
          <StatCard
            title="إجمالي الطلبات"
            value={stats?.totalOrders || 0}
            change={stats?.ordersChange || 0}
            icon={ShoppingBag}
            color="blue"
          />
          
          <StatCard
            title="المنتجات"
            value={stats?.totalProducts || 0}
            change={stats?.productsChange || 0}
            icon={Package}
            color="purple"
          />
          
          <StatCard
            title="العملاء"
            value={stats?.totalCustomers || 0}
            change={stats?.customersChange || 0}
            icon={Users}
            color="orange"
          />
          
          <StatCard
            title="متوسط التقييم"
            value={stats?.averageRating || 0}
            change={stats?.ratingChange || 0}
            icon={Star}
            color="yellow"
            format="rating"
          />
          
          <StatCard
            title="مخزون منخفض"
            value={stats?.lowStockItems || 0}
            change={0}
            icon={AlertCircle}
            color="red"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">الطلبات الأخيرة</h2>
                  <button className="text-blue-600 hover:text-blue-800 text-sm">
                    عرض الكل
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        رقم الطلب
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        العميل
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        المبلغ
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        الحالة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.customerName}</div>
                          <div className="text-sm text-gray-500">{order.items} منتج</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.total.toLocaleString()} ر.س
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div>
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">المنتجات الأكثر مبيعاً</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {product.sales} مبيعة
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {product.revenue.toLocaleString()} ر.س
                        </p>
                        <p className="text-xs text-gray-500">
                          المرتبة {index + 1}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md mt-6">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">إجراءات سريعة</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  <button className="w-full text-right p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">إضافة منتج جديد</span>
                    </div>
                  </button>
                  
                  <button className="w-full text-right p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-900">عرض التقارير</span>
                    </div>
                  </button>
                  
                  <button className="w-full text-right p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium text-purple-900">إدارة العملاء</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
