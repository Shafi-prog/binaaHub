'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { platformDataService } from '@/core/shared/services/platform-data-service';
import { StoreDashboardData, Product, Order, WarrantyClaim } from '@/core/shared/types/platform-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Badge } from '@/core/shared/components/ui/badge';
import { Button } from '@/core/shared/components/ui/button';
import { ErrorBoundary } from '@/core/shared/components/ErrorBoundary';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Plus,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  Shield,
  FileText
} from 'lucide-react';

export default function StoreDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<StoreDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'products' | 'orders' | 'warranty'>('products');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await platformDataService.getStoreDashboard(user?.id || '');
        if (data.success && data.data) {
          setDashboardData(data.data);
        }
      } catch (error) {
        console.error('Error fetching store dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const handleCreateProduct = async () => {
    try {
      const newProduct: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
        name: 'منتج جديد',
        description: 'وصف المنتج',
        price: 100,
        category: 'عام',
        storeId: user?.id || '',
        storeName: user?.name || '',
        inStock: true,
        stockQuantity: 10,
        images: [],
        warrantyPeriod: 12,
        specifications: {}
      };

      const createdProduct = await platformDataService.createProduct(user?.id || '', newProduct);
      if (createdProduct.success && createdProduct.data && dashboardData) {
        setDashboardData({
          ...dashboardData,
          products: [...dashboardData.products, createdProduct.data]
        });
      }
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled') => {
    try {
      await platformDataService.updateOrderStatus(orderId, newStatus, 'Status updated by store');
      if (dashboardData) {
        setDashboardData({
          ...dashboardData,
          orders: dashboardData.orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusColor = (status: string, type: 'order' | 'warranty') => {
    const colors = {
      order: {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        processing: 'bg-purple-100 text-purple-800',
        shipped: 'bg-green-100 text-green-800',
        delivered: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800'
      },
      warranty: {
        submitted: 'bg-yellow-100 text-yellow-800',
        under_review: 'bg-blue-100 text-blue-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800'
      }
    };
    return colors[type][status as keyof typeof colors[typeof type]] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string, type: 'order' | 'warranty') => {
    const texts = {
      order: {
        pending: 'في الانتظار',
        confirmed: 'مؤكد',
        processing: 'قيد المعالجة',
        shipped: 'تم الشحن',
        delivered: 'تم التسليم',
        cancelled: 'ملغي'
      },
      warranty: {
        submitted: 'مُقدم',
        under_review: 'قيد المراجعة',
        approved: 'موافق عليه',
        rejected: 'مرفوض'
      }
    };
    return texts[type][status as keyof typeof texts[typeof type]] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">حدث خطأ في تحميل البيانات</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">لوحة تحكم المتجر</h1>
            <p className="text-gray-600 mt-2">
              مرحباً {user?.name} - إدارة متجرك ومنتجاتك
            </p>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">إجمالي المنتجات</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.products.length}</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">الطلبات الجديدة</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData.orders.filter(o => o.status === 'pending').length}
                    </p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">إجمالي المبيعات</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData.orders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()} ر.س
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">مطالبات الضمان</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.warrantyClaims.length}</p>
                  </div>
                  <Shield className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 space-x-reverse px-6">
                {[
                  { key: 'products', label: 'المنتجات', icon: Package, count: dashboardData?.products?.length || 0 },
                  { key: 'orders', label: 'الطلبات', icon: ShoppingCart, count: dashboardData?.orders?.length || 0 },
                  { key: 'warranty', label: 'الضمانات', icon: Shield, count: dashboardData?.warrantyClaims?.length || 0 }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedTab(tab.key as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      selectedTab === tab.key
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                    <Badge variant="secondary">{tab.count}</Badge>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Products Tab */}
              {selectedTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">منتجات المتجر</h3>
                    <Button onClick={handleCreateProduct} className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      إضافة منتج جديد
                    </Button>
                  </div>
                  
                  {dashboardData.products.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">لا توجد منتجات حتى الآن</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {dashboardData.products.map((product) => (
                        <Card key={product.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium">{product.name}</h4>
                              <Badge className={product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                {product.inStock ? 'متوفر' : 'نفد'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold text-green-600">{product.price.toLocaleString()} ر.س</span>
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                              الكمية: {product.stockQuantity} | الفئة: {product.category}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Orders Tab */}
              {selectedTab === 'orders' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">طلبات العملاء</h3>
                  
                  {dashboardData.orders.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">لا توجد طلبات حتى الآن</p>
                    </div>
                  ) : (
                    dashboardData.orders.map((order) => (
                      <Card key={order.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-medium">طلبية #{order.id}</h4>
                                <Badge className={getStatusColor(order.status, 'order')}>
                                  {getStatusText(order.status, 'order')}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-1">
                                العميل: {order.userName}
                              </p>
                              <p className="text-sm text-gray-600">
                                {order.products.length} منتج - {order.totalAmount.toLocaleString()} ر.س
                              </p>
                              <div className="text-xs text-gray-500 mt-1">
                                {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {order.status === 'pending' && (
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateOrderStatus(order.id, 'confirmed')}
                                >
                                  تأكيد
                                </Button>
                              )}
                              {order.status === 'confirmed' && (
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
                                >
                                  معالجة
                                </Button>
                              )}
                              {order.status === 'processing' && (
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateOrderStatus(order.id, 'shipped')}
                                >
                                  شحن
                                </Button>
                              )}
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}

              {/* Warranty Tab */}
              {selectedTab === 'warranty' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">مطالبات الضمان</h3>
                  
                  {dashboardData.warrantyClaims.length === 0 ? (
                    <div className="text-center py-8">
                      <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">لا توجد مطالبات ضمان</p>
                    </div>
                  ) : (
                    dashboardData.warrantyClaims.map((claim) => (
                      <Card key={claim.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-medium">{claim.productName}</h4>
                                <Badge className={getStatusColor(claim.status, 'warranty')}>
                                  {getStatusText(claim.status, 'warranty')}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-1">
                                العميل: {claim.userName}
                              </p>
                              <p className="text-sm text-gray-600 mb-1">
                                المشكلة: {claim.issueDescription}
                              </p>
                              <div className="text-xs text-gray-500">
                                تم التقديم: {new Date(claim.submittedAt).toLocaleDateString('ar-SA')}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {claim.status === 'submitted' && (
                                <Button size="sm">
                                  مراجعة
                                </Button>
                              )}
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
