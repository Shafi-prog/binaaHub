'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, LoadingSpinner, StatusBadge } from '@/components/ui';
import { Button } from '@/components/ui/enhanced-components';
import { formatCurrency } from '@/lib/utils';
import { 
  Building2, 
  Package, 
  Globe, 
  RefreshCw, 
  ArrowLeft, 
  LogOut, 
  Users, 
  ShoppingCart, 
  Plus, 
  Edit,
  Trash2, 
  Search, 
  Eye,
  BarChart3,
  DollarSign,
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Fetch products
      const productsRes = await fetch('/api/store/products');
      const productsData = await productsRes.json();
      setProducts(productsData.products || []);

      // Fetch customers
      const customersRes = await fetch('/api/admin/customers');
      const customersData = await customersRes.json();
      setCustomers(customersData.customers || []);

      // Fetch orders
      const ordersRes = await fetch('/api/store/orders/recent');
      const ordersData = await ordersRes.json();
      setOrders(ordersData.orders || []);

      // Fetch regions
      const regionsRes = await fetch('/api/store/regions');
      const regionsData = await regionsRes.json();
      setRegions(regionsData.regions || []);

      // Calculate stats
      setStats({
        totalProducts: productsData.products?.length || 0,
        totalCustomers: customersData.customers?.length || 0,
        totalOrders: ordersData.orders?.length || 0,
        totalRevenue: ordersData.orders?.reduce((sum: number, order: any) => sum + (order.total || 0), 0) || 0,
      });

    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600" />
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">المنتجات</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-600" />
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">العملاء</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalCustomers}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <ShoppingCart className="h-8 w-8 text-purple-600" />
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">الطلبات</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-yellow-600" />
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">الإيرادات</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderProducts = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Package className="h-5 w-5 ml-2" />
          إدارة المنتجات
        </CardTitle>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">لا توجد منتجات</p>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product: any) => (
              <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{product.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                  </div>
                  <div className="flex-shrink-0 mr-4">
                    <StatusBadge status={product.status === 'published' ? 'active' : 'pending'}>
                      {product.status === 'published' ? 'منشور' : 'معلق'}
                    </StatusBadge>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <div className="flex space-x-2 space-x-reverse">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 ml-1" />
                      عرض
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 ml-1" />
                      تعديل
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderCustomers = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 ml-2" />
          إدارة العملاء
        </CardTitle>
      </CardHeader>
      <CardContent>
        {customers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">لا يوجد عملاء</p>
          </div>
        ) : (
          <div className="space-y-4">
            {customers.map((customer: any) => (
              <div key={customer.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{customer.first_name} {customer.last_name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{customer.email}</p>
                  </div>
                  <div className="flex-shrink-0 mr-4">
                    <StatusBadge status={customer.has_account ? 'active' : 'pending'}>
                      {customer.has_account ? 'نشط' : 'معلق'}
                    </StatusBadge>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <div className="flex space-x-2 space-x-reverse">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 ml-1" />
                      عرض
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 ml-1" />
                      تعديل
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderOrders = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShoppingCart className="h-5 w-5 ml-2" />
          إدارة الطلبات
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">لا توجد طلبات</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">طلب #{order.display_id}</h3>
                    <p className="text-sm text-gray-500 mt-1">{order.customer?.email}</p>
                  </div>
                  <div className="flex-shrink-0 mr-4">
                    <StatusBadge 
                      status={order.status === 'completed' ? 'completed' : order.status === 'pending' ? 'pending' : 'cancelled'}
                    >
                      {order.status === 'completed' ? 'مكتمل' : order.status === 'pending' ? 'معلق' : 'ملغي'}
                    </StatusBadge>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(order.total || 0)}</span>
                  <div className="flex space-x-2 space-x-reverse">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 ml-1" />
                      عرض
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 ml-1" />
                      تعديل
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderRegions = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Globe className="h-5 w-5 ml-2" />
          إدارة المناطق
        </CardTitle>
      </CardHeader>
      <CardContent>
        {regions.length === 0 ? (
          <div className="text-center py-8">
            <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">لا توجد مناطق</p>
          </div>
        ) : (
          <div className="space-y-4">
            {regions.map((region: any) => (
              <div key={region.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{region.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">العملة: {region.currency_code}</p>
                  </div>
                  <div className="flex-shrink-0 mr-4">
                    <StatusBadge status="active">نشط</StatusBadge>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <div className="flex space-x-2 space-x-reverse">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 ml-1" />
                      عرض
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 ml-1" />
                      تعديل
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600 ml-3" />
              <h1 className="text-xl font-bold text-gray-900">لوحة تحكم Medusa</h1>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <button
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-900 flex items-center text-sm font-medium"
              >
                <ArrowLeft className="h-4 w-4 ml-2" />
                العودة للموقع
              </button>
              <button
                onClick={() => router.push('/login')}
                className="text-gray-600 hover:text-gray-900 flex items-center text-sm font-medium"
              >
                <LogOut className="h-4 w-4 ml-2" />
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 space-x-reverse">
            {[
              { key: 'overview', label: 'نظرة عامة', icon: BarChart3 },
              { key: 'products', label: 'المنتجات', icon: Package },
              { key: 'customers', label: 'العملاء', icon: Users },
              { key: 'orders', label: 'الطلبات', icon: ShoppingCart },
              { key: 'regions', label: 'المناطق', icon: Globe },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 ml-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'customers' && renderCustomers()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'regions' && renderRegions()}
      </main>
    </div>
  );
}
