// Real User Dashboard with live data connections
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { platformDataService } from '@/core/shared/services/platform-data-service';
import { UserDashboardData, Order, WarrantyClaim, ServiceBooking } from '@/core/shared/types/platform-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Badge } from '@/core/shared/components/ui/badge';
import { Button } from '@/core/shared/components/ui/button';
import { ErrorBoundary } from '@/core/shared/components/ErrorBoundary';
import { 
  ShoppingCart, 
  Shield, 
  Calendar, 
  DollarSign,
  Package,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Eye
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function RealUserDashboard() {
  return (
    <ErrorBoundary>
      <UserDashboardContent />
    </ErrorBoundary>
  );
}

function UserDashboardContent() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<UserDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'orders' | 'warranty' | 'services'>('orders');

  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await platformDataService.getUserDashboard(user?.id || 'user1');
      
      if (response.success && response.data) {
        setDashboardData(response.data);
      } else {
        setError(response.error || 'Failed to load dashboard data');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWarrantyClaim = async (orderId: string, productId: string) => {
    try {
      const order = dashboardData?.orders.find(o => o.id === orderId);
      const product = order?.products.find(p => p.productId === productId);
      
      if (!order || !product) return;

      const claimData = {
        orderId,
        productId,
        productName: product.productName,
        userId: user?.id || 'user1',
        userName: user?.name || 'المستخدم',
        storeId: order.storeId,
        storeName: order.storeName,
        issueDescription: 'مشكلة في المنتج تتطلب مراجعة الضمان',
        issueType: 'defect' as const
      };

      const response = await platformDataService.createWarrantyClaim(claimData);
      
      if (response.success) {
        // Reload dashboard data to show new warranty claim
        await loadDashboardData();
        alert('تم تقديم مطالبة الضمان بنجاح');
      } else {
        alert('خطأ في تقديم مطالبة الضمان: ' + response.error);
      }
    } catch (error) {
      alert('حدث خطأ غير متوقع');
    }
  };

  const getStatusColor = (status: string, type: 'order' | 'warranty' | 'booking') => {
    const statusColors = {
      order: {
        'pending': 'bg-yellow-100 text-yellow-800',
        'confirmed': 'bg-blue-100 text-blue-800',
        'processing': 'bg-indigo-100 text-indigo-800',
        'shipped': 'bg-purple-100 text-purple-800',
        'delivered': 'bg-green-100 text-green-800',
        'cancelled': 'bg-red-100 text-red-800'
      },
      warranty: {
        'submitted': 'bg-yellow-100 text-yellow-800',
        'under_review': 'bg-blue-100 text-blue-800',
        'approved': 'bg-green-100 text-green-800',
        'rejected': 'bg-red-100 text-red-800',
        'resolved': 'bg-gray-100 text-gray-800'
      },
      booking: {
        'requested': 'bg-yellow-100 text-yellow-800',
        'confirmed': 'bg-green-100 text-green-800',
        'in_progress': 'bg-blue-100 text-blue-800',
        'completed': 'bg-gray-100 text-gray-800',
        'cancelled': 'bg-red-100 text-red-800'
      }
    };
    return statusColors[type][status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string, type: 'order' | 'warranty' | 'booking') => {
    const statusTexts = {
      order: {
        'pending': 'قيد الانتظار',
        'confirmed': 'مؤكد',
        'processing': 'قيد المعالجة',
        'shipped': 'تم الشحن',
        'delivered': 'تم التسليم',
        'cancelled': 'ملغي'
      },
      warranty: {
        'submitted': 'مقدم',
        'under_review': 'قيد المراجعة',
        'approved': 'موافق عليه',
        'rejected': 'مرفوض',
        'resolved': 'تم الحل'
      },
      booking: {
        'requested': 'مطلوب',
        'confirmed': 'مؤكد',
        'in_progress': 'قيد التنفيذ',
        'completed': 'مكتمل',
        'cancelled': 'ملغي'
      }
    };
    return statusTexts[type][status] || status;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات المستخدم...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error || 'فشل في تحميل البيانات'}</p>
          <Button onClick={loadDashboardData}>إعادة المحاولة</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  مرحباً {user?.name || 'بك'}
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  لوحة التحكم الشخصية - مع الاتصالات الحقيقية
                </p>
              </div>
              <div className="flex items-center space-x-4 space-x-reverse">
                <Badge className="bg-green-100 text-green-800">
                  🔗 اتصالات حقيقية نشطة
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">إجمالي الطلبات</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.analytics.totalOrders}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">ضمانات نشطة</p>
                  <p className="text-2xl font-bold text-yellow-600">{dashboardData.analytics.activeWarranties}</p>
                </div>
                <Shield className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">حجوزات قادمة</p>
                  <p className="text-2xl font-bold text-green-600">{dashboardData.analytics.upcomingBookings}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">إجمالي المنفق</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData.analytics.totalSpent.toLocaleString()} ر.س
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 space-x-reverse px-6">
              {[
                { key: 'orders', label: 'طلباتي', icon: ShoppingCart, count: dashboardData.orders.length },
                { key: 'warranty', label: 'الضمانات', icon: Shield, count: dashboardData.warrantyClaims.length },
                { key: 'services', label: 'الخدمات', icon: Calendar, count: dashboardData.serviceBookings.length }
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
            {/* Orders Tab */}
            {selectedTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">طلباتي</h3>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    طلب جديد
                  </Button>
                </div>
                
                {dashboardData.orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
                              متجر: {order.storeName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {order.products.length} منتج - {order.totalAmount.toLocaleString()} ر.س
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {order.status === 'delivered' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCreateWarrantyClaim(order.id, order.products[0].productId)}
                              >
                                مطالبة ضمان
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
                              متجر: {claim.storeName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {claim.issueDescription}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}

            {/* Services Tab */}
            {selectedTab === 'services' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">حجوزات الخدمات</h3>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    حجز خدمة
                  </Button>
                </div>
                
                {dashboardData.serviceBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">لا توجد حجوزات خدمات</p>
                  </div>
                ) : (
                  dashboardData.serviceBookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium">{booking.serviceDetails.title}</h4>
                              <Badge className={getStatusColor(booking.status, 'booking')}>
                                {getStatusText(booking.status, 'booking')}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              مقدم الخدمة: {booking.serviceProviderName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(booking.scheduledDate).toLocaleDateString('ar-SA')} - {booking.scheduledTime}
                            </p>
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
  );
}
