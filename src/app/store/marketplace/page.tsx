'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Badge } from '@/core/shared/components/ui/badge';
import { Button } from '@/core/shared/components/ui/button';
import { Input } from '@/core/shared/components/ui/input';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Star, 
  Heart,
  Plus,
  Minus,
  Eye,
  Package,
  Truck,
  Users,
  MapPin,
  Phone,
  Mail,
  Building,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Globe,
  Award,
  Shield,
  Zap,
  Activity,
  BarChart3,
  Calendar,
  Hash,
  Download,
  Upload,
  Settings,
  Grid,
  List,
  SlidersHorizontal,
  Target,
  Briefcase,
  Home,
  Construction,
  Navigation,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { CustomerSearchWidget, CustomerDetailModal, type Customer } from '@/core/shared/components/store/CustomerSearchWidget';

export const dynamic = 'force-dynamic';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  description: string;
  specifications: Record<string, string>;
  inStock: boolean;
  stockQuantity: number;
  minOrderQuantity: number;
  unit: string;
  supplier: string;
  rating: number;
  reviewsCount: number;
  images: string[];
  tags: string[];
  createdAt: string;
}

interface MarketOrder {
  id: string;
  orderNumber: string;
  customer: Customer;
  products: Array<{
    product: Product;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryDate?: string;
  shippingAddress: string;
  notes?: string;
}

export default function EnhancedMarketplacePage() {
const supabase = createClientComponentClient();

  const searchParams = useSearchParams();
  const storeId = searchParams?.get('storeId') || null;
  
  // State for products
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);;

  // State for customers/buyers
  const [customers, setCustomers] = useState<any[]>([]);;

  // State for recent orders
  const [recentOrders] = useState<MarketOrder[]>([
    {
      id: '1',
      orderNumber: 'MKT-001',
      customer: customers[0],
      products: [
        {
          product: products[0],
          quantity: 50,
          unitPrice: 28.50,
          totalPrice: 1425
        }
      ],
      totalAmount: 1425,
      status: 'delivered',
      orderDate: '2024-07-20',
      deliveryDate: '2024-07-22',
      shippingAddress: 'شارع الملك فهد، حي العليا، الرياض',
      notes: 'تسليم صباحي'
    }
  ]);

  // Component state
  const [activeTab, setActiveTab] = useState<'products' | 'customers' | 'orders'>('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCustomerDetail, setShowCustomerDetail] = useState(false);
  const [customerDetailData, setCustomerDetailData] = useState<Customer | null>(null);

  // Handle customer selection from search widget
  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    toast.success(`تم اختيار العميل: ${customer.name}`);
  };

  // Handle showing customer details
  const handleShowCustomerDetails = (customer: Customer) => {
    setCustomerDetailData(customer);
    setShowCustomerDetail(true);
  };

  // Filter functions
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.projectLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.customerCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredOrders = recentOrders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-orange-100 text-orange-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return 'غير نشط';
      case 'pending': return 'قيد الانتظار';
      case 'confirmed': return 'مؤكد';
      case 'processing': return 'قيد التجهيز';
      case 'shipped': return 'تم الشحن';
      case 'delivered': return 'تم التسليم';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  const getLoyaltyColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'bg-amber-100 text-amber-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'platinum': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLoyaltyText = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'برونزي';
      case 'silver': return 'فضي';
      case 'gold': return 'ذهبي';
      case 'platinum': return 'بلاتيني';
      default: return tier;
    }
  };

  const categories = ['all', 'مواد البناء', 'حديد ومعادن', 'تشطيبات', 'أدوات', 'كهربائية', 'صحية'];

  
  // Fetch products from Supabase
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*,store:stores(*)')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching products:', error);
        return;
      }
      
      if (data) {
        setProducts(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };


  
  // Fetch customers from Supabase
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching customers:', error);
        return;
      }
      
      if (data) {
        setCustomers(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          {storeId ? (
            <>
              <h1 className="text-2xl font-bold text-gray-900">منتجات المتجر</h1>
              <p className="text-gray-600">تصفح منتجات المتجر المحدد (رقم المتجر: {storeId})</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900">السوق الرقمي المتقدم</h1>
              <p className="text-gray-600">إدارة شاملة للمنتجات والعملاء والطلبات</p>
            </>
          )}
        </div>
        <div className="flex gap-3">
          {storeId && (
            <Button variant="outline" onClick={() => window.history.back()}>
              <Navigation className="h-4 w-4 mr-2" />
              العودة للمتاجر
            </Button>
          )}
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            تصدير البيانات
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            استيراد منتجات
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            إضافة منتج
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">إجمالي المنتجات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold">{products.length}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">منتج متاح</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">العملاء النشطون</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold">{customers.filter(c => c.status === 'active').length}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">عميل نشط</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">إجمالي الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-purple-600" />
              <span className="text-2xl font-bold">{recentOrders.length}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">طلب هذا الشهر</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">إجمالي المبيعات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <span className="text-2xl font-bold">{recentOrders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">ريال سعودي</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex space-x-1 rtl:space-x-reverse">
              <Button
                variant={activeTab === 'products' ? 'default' : 'outline'}
                onClick={() => setActiveTab('products')}
                className="flex items-center gap-2"
              >
                <Package className="h-4 w-4" />
                المنتجات
              </Button>
              <Button
                variant={activeTab === 'customers' ? 'default' : 'outline'}
                onClick={() => setActiveTab('customers')}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                العملاء
              </Button>
              <Button
                variant={activeTab === 'orders' ? 'default' : 'outline'}
                onClick={() => setActiveTab('orders')}
                className="flex items-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                الطلبات
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex items-center gap-4 mb-6">
            {activeTab === 'customers' ? (
              <div className="flex-1">
                <CustomerSearchWidget
                  onCustomerSelect={handleCustomerSelect}
                  showProjectDetails={true}
                  showDeliveryInfo={true}
                  placeholder="البحث عن العملاء لمعلومات المشروع والتسليم..."
                />
              </div>
            ) : (
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder={
                    activeTab === 'products' ? "البحث في المنتجات..." :
                    "البحث في الطلبات..."
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            )}
            
            {activeTab === 'products' && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'جميع الفئات' : category}
                  </option>
                ))}
              </select>
            )}

            {(activeTab === 'customers' || activeTab === 'orders') && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع الحالات</option>
                {activeTab === 'customers' ? (
                  <>
                    <option value="active">نشط</option>
                    <option value="inactive">غير نشط</option>
                  </>
                ) : (
                  <>
                    <option value="pending">قيد الانتظار</option>
                    <option value="confirmed">مؤكد</option>
                    <option value="processing">قيد التجهيز</option>
                    <option value="shipped">تم الشحن</option>
                    <option value="delivered">تم التسليم</option>
                    <option value="cancelled">ملغي</option>
                  </>
                )}
              </select>
            )}

            <Button variant="outline" size="sm">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              تصفية متقدمة
            </Button>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'products' && (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <p className="text-sm text-gray-600">{product.category}</p>
                      </div>
                      {product.discount && (
                        <Badge className="bg-red-100 text-red-800">
                          -{product.discount}%
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">({product.reviewsCount})</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-green-600">
                            {product.price.toLocaleString()} ريال
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through mr-2">
                              {product.originalPrice.toLocaleString()} ريال
                            </span>
                          )}
                          <p className="text-xs text-gray-500">لكل {product.unit}</p>
                        </div>
                        <Badge className={product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {product.inStock ? `متوفر (${product.stockQuantity})` : 'غير متوفر'}
                        </Badge>
                      </div>

                      <div className="pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-600 mb-2">المورد: {product.supplier}</p>
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            أضف للسلة
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="space-y-4">
              {filteredCustomers.map((customer) => (
                <Card key={customer.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900">{customer.name}</h3>
                            <Badge className={getLoyaltyColor(customer.loyaltyTier)}>
                              {getLoyaltyText(customer.loyaltyTier)}
                            </Badge>
                            <Badge className={getStatusColor(customer.status)}>
                              {getStatusText(customer.status)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Hash className="h-3 w-3" />
                              <span>{customer.customerCode}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <span>{customer.phone}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              <span>{customer.email}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-left text-sm">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="text-gray-600">إجمالي الطلبات</p>
                              <p className="font-medium">{customer.totalOrders}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">إجمالي الإنفاق</p>
                              <p className="font-medium text-green-600">{customer.totalSpent.toLocaleString()} ريال</p>
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShowCustomerDetails(customer)}
                          className="flex items-center gap-2"
                        >
                          <Info className="h-4 w-4" />
                          تفاصيل المشروع
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{customer.city}, {customer.region}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Construction className="h-4 w-4 text-gray-400" />
                        <span>{customer.projectType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span>{customer.projectLocation}</span>
                      </div>
                    </div>

                    {/* Enhanced Project Info Preview */}
                    {customer.projectAddress && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Navigation className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-900">عنوان المشروع للتسليم:</span>
                        </div>
                        <p className="text-sm text-green-800">{customer.projectAddress}</p>
                        {customer.deliveryInstructions && (
                          <p className="text-sm text-green-700 mt-1">
                            <span className="font-medium">تعليمات التسليم:</span> {customer.deliveryInstructions}
                          </p>
                        )}
                      </div>
                    )}

                    {customer.notes && (
                      <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-900">{customer.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <ShoppingCart className="h-6 w-6 text-green-600" />
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900">{order.orderNumber}</h3>
                            <Badge className={getStatusColor(order.status)}>
                              {getStatusText(order.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{order.customer.name}</p>
                        </div>
                      </div>
                      
                      <div className="text-left">
                        <p className="font-medium text-lg text-green-600">
                          {order.totalAmount.toLocaleString()} ريال
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.orderDate).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {order.products.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <p className="font-medium text-sm">{item.product.name}</p>
                            <p className="text-xs text-gray-600">الكمية: {item.quantity} {item.product.unit}</p>
                          </div>
                          <span className="text-sm font-medium">{item.totalPrice.toLocaleString()} ريال</span>
                        </div>
                      ))}
                    </div>

                    {order.notes && (
                      <div className="mt-3 p-2 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-yellow-900">{order.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Detail Modal */}
      {showCustomerDetail && customerDetailData && (
        <CustomerDetailModal
          customer={customerDetailData}
          onClose={() => setShowCustomerDetail(false)}
          showDeliveryInfo={true}
        />
      )}
    </div>
  );
}





