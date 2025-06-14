'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, LoadingSpinner, StatusBadge, EnhancedLoading } from '@/components/ui';
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
  Edit3, 
  Trash2, 
  Search, 
  Eye,
  BarChart3,
  Settings,
  DollarSign,
  TrendingUp
} from 'lucide-react';

interface Product {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  handle: string;
  status: string;
  created_at: string;
  variant_count?: number;
  min_price?: number;
  max_price?: number;
}

interface Customer {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  has_account: boolean;
  created_at: string;
  order_count: number;
  total_spent: number;
}

interface Order {
  id: string;
  status: string;
  total: number;
  currency_code: string;
  created_at: string;
  customer: {
    email: string;
    first_name?: string;
    last_name?: string;
  };
  item_count: number;
}

interface Region {
  id: string;
  name: string;
  currency_code: string;
  automatic_taxes: boolean;
}

interface DashboardStats {
  totalProducts: number;
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: Order[];
}

export default function MedusaAdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  const [loading, setLoading] = useState(true);  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const router = useRouter();

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Medusa Admin: Starting comprehensive data fetch...');
        // Fetch all admin data in parallel
      const [productsRes, customersRes, ordersRes, regionsRes] = await Promise.all([
        fetch('/api/admin/products/', { cache: 'no-cache' }),
        fetch('/api/admin/customers/', { cache: 'no-cache' }),
        fetch('/api/admin/orders/', { cache: 'no-cache' }),
        fetch('/api/store/regions/', { cache: 'no-cache' })
      ]);
        // Process responses with better error handling
      const productsData = productsRes.ok ? await productsRes.json() : { products: [] };
      const customersData = customersRes.ok ? await customersRes.json() : { customers: [] };
      const ordersData = ordersRes.ok ? await ordersRes.json() : { orders: [] };
      const regionsData = regionsRes.ok ? await regionsRes.json() : { regions: [] };
      
      // Log any failed requests
      if (!productsRes.ok) console.warn('Products API failed:', productsRes.status);
      if (!customersRes.ok) console.warn('Customers API failed:', customersRes.status);
      if (!ordersRes.ok) console.warn('Orders API failed:', ordersRes.status);
      if (!regionsRes.ok) console.warn('Regions API failed:', regionsRes.status);
      
      setProducts(productsData.products || []);
      setCustomers(customersData.customers || []);
      setOrders(ordersData.orders || []);
      setRegions(regionsData.regions || []);
      
      // Calculate stats
      const totalRevenue = (ordersData.orders || []).reduce((sum: number, order: Order) => sum + order.total, 0);
      setStats({
        totalProducts: productsData.products?.length || 0,
        totalCustomers: customersData.customers?.length || 0,
        totalOrders: ordersData.orders?.length || 0,
        totalRevenue,
        recentOrders: (ordersData.orders || []).slice(0, 5)
      });
      
      console.log('✅ Medusa Admin: All data loaded successfully');
      
    } catch (error) {
      console.error('❌ Medusa Admin: Error fetching data:', error);
      setError('فشل في تحميل البيانات. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    
    try {
      setActionLoading(true);      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId));
        alert('تم حذف المنتج بنجاح');
      } else {
        throw new Error('فشل في حذف المنتج');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('حدث خطأ أثناء حذف المنتج');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateProductStatus = async (productId: string, status: string) => {
    try {
      setActionLoading(true);      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        const { product } = await response.json();
        setProducts(products.map(p => p.id === productId ? { ...p, status: product.status } : p));
        alert('تم تحديث حالة المنتج بنجاح');
      } else {
        throw new Error('فشل في تحديث المنتج');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('حدث خطأ أثناء تحديث المنتج');
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);
  if (loading) {
    return (
      <EnhancedLoading 
        title="جاري تحميل لوحة تحكم Medusa..."
        subtitle="يرجى الانتظار حتى نقوم بتحميل البيانات"
        showLogo={true}
        size="lg"
        fullScreen={true}
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 text-center max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">خطأ في تحميل البيانات</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchAllData();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center mx-auto"
          >
            <RefreshCw className="h-4 w-4 ml-2" />
            إعادة المحاولة
          </button>
        </Card>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المنتجات</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalProducts || 0}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي العملاء</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalCustomers || 0}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الطلبات</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الإيرادات</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${(stats?.totalRevenue || 0).toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 ml-2" />
            أحدث الطلبات
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(stats?.recentOrders || []).length === 0 ? (
            <p className="text-gray-500 text-center py-4">لا توجد طلبات حديثة</p>
          ) : (
            <div className="space-y-4">
              {stats?.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">#{order.id.slice(-8)}</p>
                    <p className="text-sm text-gray-600">{order.customer.email}</p>
                  </div>
                  <div className="text-left">
                    <p className="font-medium">${order.total.toFixed(2)}</p>                    <StatusBadge
                      status={order.status === 'completed' ? 'active' : 'pending'}
                    >
                      {order.status === 'completed' ? 'مكتمل' : 'معلق'}
                    </StatusBadge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderProducts = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 ml-2" />
            إدارة المنتجات
          </CardTitle>
          <div className="flex items-center space-x-2 space-x-reverse">            <button
              onClick={() => {
                alert('إضافة منتج جديد - قريباً!');
                // TODO: Navigate to add product page or open modal
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <Plus className="h-4 w-4 ml-2" />
              إضافة منتج
            </button>            <button
              onClick={fetchAllData}
              disabled={loading}
              className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <RefreshCw className={`h-4 w-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'جاري التحديث...' : 'تحديث'}
            </button>
          </div>
        </div>        <div className="flex items-center space-x-2 space-x-reverse mt-4">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="البحث في المنتجات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1 text-right"
            dir="rtl"
          />
        </div>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">لا توجد منتجات</p>
          </div>
        ) : (
          <div className="space-y-4">
            {products
              .filter(product => 
                searchTerm === '' || 
                product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.handle.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((product) => (
                <div key={product.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900">
                        {product.title}
                      </h3>
                      {product.subtitle && (
                        <p className="text-sm text-gray-600 mt-1">{product.subtitle}</p>
                      )}                      <div className="mt-2 flex items-center space-x-4 space-x-reverse text-sm text-gray-500">
                        <span>الكود: {product.handle}</span>
                        <span>•</span>
                        <span>المتغيرات: {product.variant_count || 0}</span>
                        <span>•</span>
                        <span>التاريخ: {new Date(product.created_at).toLocaleDateString('ar-SA')}</span>
                      </div>
                      {product.description && (
                        <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                          {product.description}
                        </p>                      )}
                    </div>                    <div className="flex items-center space-x-2 space-x-reverse mr-4">
                      <StatusBadge
                        status={product.status === 'published' ? 'active' : 'pending'}
                      >
                        {product.status === 'published' ? 'منشور' : 'مسودة'}
                      </StatusBadge><button
                        onClick={() => {
                          alert('تعديل المنتج - قريباً!');
                          // TODO: Navigate to edit product page or open modal
                        }}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                        title="تعديل"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>                      <button
                        onClick={() => handleUpdateProductStatus(
                          product.id, 
                          product.status === 'published' ? 'draft' : 'published'
                        )}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md disabled:opacity-50"
                        title={product.status === 'published' ? 'إلغاء النشر' : 'نشر'}
                        disabled={actionLoading}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md disabled:opacity-50"
                        title="حذف"
                        disabled={actionLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>                  </div>
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
            <p className="text-gray-500">لا توجد عملاء</p>
          </div>
        ) : (
          <div className="space-y-4">
            {customers.map((customer) => (
              <div key={customer.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900">
                      {customer.first_name && customer.last_name 
                        ? `${customer.first_name} ${customer.last_name}` 
                        : customer.email}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{customer.email}</p>
                    <div className="mt-2 flex items-center space-x-4 space-x-reverse text-sm text-gray-500">
                      <span>الطلبات: {customer.order_count}</span>
                      <span>•</span>
                      <span>إجمالي المشتريات: ${customer.total_spent.toFixed(2)}</span>
                    </div>                  </div>                  <div className="flex-shrink-0 mr-4">
                    <StatusBadge
                      status={customer.has_account ? 'active' : 'cancelled'}
                    >
                      {customer.has_account ? 'لديه حساب' : 'ضيف'}
                    </StatusBadge>
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
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900">
                      طلب #{order.id.slice(-8)}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{order.customer.email}</p>
                    <div className="mt-2 flex items-center space-x-4 space-x-reverse text-sm text-gray-500">
                      <span>العناصر: {order.item_count}</span>
                      <span>•</span>
                      <span>العملة: {order.currency_code.toUpperCase()}</span>
                      <span>•</span>
                      <span>التاريخ: {new Date(order.created_at).toLocaleDateString('ar-SA')}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="text-left">
                      <p className="text-lg font-bold text-gray-900">${order.total.toFixed(2)}</p>                    </div>                    <StatusBadge
                      status={order.status === 'completed' ? 'completed' : order.status === 'pending' ? 'pending' : 'cancelled'}
                    >
                      {order.status === 'completed' ? 'مكتمل' : order.status === 'pending' ? 'معلق' : order.status}
                    </StatusBadge>
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
          إدارة المناطق والعملات
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
            {regions.map((region) => (
              <div key={region.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900">
                      {region.name}
                    </h3>
                    <div className="mt-2 flex items-center space-x-4 space-x-reverse text-sm text-gray-500">
                      <span>العملة: {region.currency_code.toUpperCase()}</span>
                      <span>•</span>
                      <span>الضرائب التلقائية: {region.automatic_taxes ? 'مفعلة' : 'معطلة'}</span>
                    </div>
                  </div>                  <div className="flex-shrink-0 mr-4">
                    <StatusBadge
                      status="active"
                    >
                      نشط
                    </StatusBadge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

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
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 space-x-reverse">
            {[
              { id: 'overview', label: 'نظرة عامة', icon: BarChart3 },
              { id: 'products', label: 'المنتجات', icon: Package },
              { id: 'customers', label: 'العملاء', icon: Users },
              { id: 'orders', label: 'الطلبات', icon: ShoppingCart },
              { id: 'regions', label: 'المناطق', icon: Globe },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 ml-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

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
