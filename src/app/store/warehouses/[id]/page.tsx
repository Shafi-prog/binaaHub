'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Button } from '@/core/shared/components/ui/button';
import { Badge } from '@/core/shared/components/ui/badge';
import { 
  ArrowRight,
  Warehouse,
  MapPin,
  Phone,
  User,
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Edit,
  Trash2,
  Plus,
  Download,
  Eye,
  BarChart3,
  Calendar,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

export default function WarehouseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const warehouseId = params?.id as string;

  const [warehouse, setWarehouse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock warehouse data
  useEffect(() => {
    setTimeout(() => {
      const mockWarehouse = {
        id: warehouseId,
        name: 'مستودع الرياض الرئيسي',
        code: 'RYD-MAIN-001',
        type: 'مستودع رئيسي',
        status: 'active',
        manager: 'أحمد محمد السعيد',
        managerPhone: '+966 50 123 4567',
        address: 'شارع الصناعية، حي السلي، الرياض 12345',
        city: 'الرياض',
        region: 'منطقة الرياض',
        area: 2500, // متر مربع
        capacity: 5000, // وحدة تخزين
        currentStock: 3750,
        utilizationRate: 75,
        zones: [
          { id: 1, name: 'منطقة A', type: 'مواد البناء الثقيلة', capacity: 1500, current: 1200 },
          { id: 2, name: 'منطقة B', type: 'مواد التشطيب', capacity: 1000, current: 800 },
          { id: 3, name: 'منطقة C', type: 'الأدوات والمعدات', capacity: 1500, current: 1000 },
          { id: 4, name: 'منطقة D', type: 'المواد سريعة التلف', capacity: 1000, current: 750 }
        ],
        recentMovements: [
          {
            id: 1,
            type: 'in',
            product: 'أسمنت بورتلاند',
            quantity: 100,
            date: '2025-07-28',
            reference: 'PO-2025-001'
          },
          {
            id: 2,
            type: 'out',
            product: 'حديد تسليح 12مم',
            quantity: 50,
            date: '2025-07-27',
            reference: 'SO-2025-045'
          },
          {
            id: 3,
            type: 'in',
            product: 'بلاط سيراميك',
            quantity: 200,
            date: '2025-07-26',
            reference: 'PO-2025-002'
          }
        ],
        topProducts: [
          { name: 'أسمنت بورتلاند', quantity: 500, value: 75000, percentage: 13.3 },
          { name: 'حديد تسليح 12مم', quantity: 300, value: 120000, percentage: 8.0 },
          { name: 'بلاط سيراميك', quantity: 800, value: 96000, percentage: 21.3 },
          { name: 'دهانات داخلية', quantity: 150, value: 45000, percentage: 4.0 },
          { name: 'أبواب خشبية', quantity: 50, value: 60000, percentage: 1.3 }
        ],
        alerts: [
          { type: 'low_stock', message: 'مخزون منخفض: حديد تسليح 8مم', severity: 'warning' },
          { type: 'expired', message: 'انتهاء صلاحية: مواد لاصقة - منطقة B', severity: 'error' },
          { type: 'overstocked', message: 'مخزون زائد: بلاط رخام - منطقة A', severity: 'info' }
        ],
        facilities: [
          'نظام تكييف مركزي',
          'أنظمة إنذار حريق',
          'كاميرات مراقبة 24/7',
          'رافعات شوكية',
          'منطقة تحميل وتفريغ',
          'مكاتب إدارية',
          'غرف استراحة للعمال'
        ],
        operatingHours: 'من 6 صباحاً إلى 10 مساءً',
        establishedDate: '2020-03-15',
        lastInspection: '2025-07-15',
        nextInspection: '2025-10-15'
      };
      
      setWarehouse(mockWarehouse);
      setLoading(false);
    }, 1000);
  }, [warehouseId]);

  const handleEdit = () => {
    router.push(`/store/warehouses/${warehouseId}/edit`);
  };

  const handleDelete = () => {
    if (confirm('هل أنت متأكد من حذف هذا المستودع؟')) {
      toast.success('تم حذف المستودع بنجاح');
      router.push('/store/warehouses');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return 'غير نشط';
      case 'maintenance': return 'تحت الصيانة';
      default: return status;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMovementIcon = (type: string) => {
    return type === 'in' ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const getMovementText = (type: string) => {
    return type === 'in' ? 'وارد' : 'صادر';
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6" dir="rtl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!warehouse) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center" dir="rtl">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">المستودع غير موجود</h1>
        <Button onClick={() => router.push('/store/warehouses')}>
          <ArrowRight className="h-4 w-4 mr-2" />
          العودة للمستودعات
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push('/store/warehouses')}>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{warehouse.name}</h1>
            <p className="text-gray-600">كود المستودع: {warehouse.code}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            تقرير المخزون
          </Button>
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            تعديل
          </Button>
          <Button variant="outline" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            حذف
          </Button>
        </div>
      </div>

      {/* Warehouse Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Warehouse className="h-5 w-5" />
              نظرة عامة على المستودع
            </span>
            <Badge className={getStatusColor(warehouse.status)}>
              {getStatusText(warehouse.status)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">معلومات أساسية</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Warehouse className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{warehouse.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{warehouse.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">المدير: {warehouse.manager}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{warehouse.managerPhone}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">السعة والمساحة</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">المساحة الإجمالية</span>
                  <span className="text-sm font-medium">{warehouse.area.toLocaleString()} م²</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">السعة القصوى</span>
                  <span className="text-sm font-medium">{warehouse.capacity.toLocaleString()} وحدة</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">المخزون الحالي</span>
                  <span className="text-sm font-medium">{warehouse.currentStock.toLocaleString()} وحدة</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">معدل الاستغلال</span>
                  <span className="text-sm font-medium text-blue-600">{warehouse.utilizationRate}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">معلومات تشغيلية</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{warehouse.operatingHours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">تأسس: {new Date(warehouse.establishedDate).toLocaleDateString('ar-SA')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">آخر تفتيش: {new Date(warehouse.lastInspection).toLocaleDateString('ar-SA')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">التفتيش القادم: {new Date(warehouse.nextInspection).toLocaleDateString('ar-SA')}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {warehouse.alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              التنبيهات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {warehouse.alerts.map((alert: any, index: number) => (
                <div key={index} className={`p-3 rounded-lg border ${getAlertColor(alert.severity)}`}>
                  <p className="text-sm font-medium">{alert.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Storage Zones */}
      <Card>
        <CardHeader>
          <CardTitle>مناطق التخزين</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {warehouse.zones.map((zone: any) => {
              const utilizationPercent = (zone.current / zone.capacity) * 100;
              return (
                <div key={zone.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium">{zone.name}</h3>
                      <p className="text-sm text-gray-600">{zone.type}</p>
                    </div>
                    <Badge variant="outline">
                      {utilizationPercent.toFixed(0)}% مستغل
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>السعة المستخدمة</span>
                      <span>{zone.current} / {zone.capacity}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          utilizationPercent >= 90 ? 'bg-red-500' :
                          utilizationPercent >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${utilizationPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Movements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              الحركات الأخيرة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {warehouse.recentMovements.map((movement: any) => (
                <div key={movement.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getMovementIcon(movement.type)}
                      <span className="font-medium">{getMovementText(movement.type)}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(movement.date).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{movement.product}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">الكمية: {movement.quantity}</span>
                      <span className="text-sm text-gray-600">المرجع: {movement.reference}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>أهم المنتجات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {warehouse.topProducts.map((product: any, index: number) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{product.name}</span>
                    <span className="text-sm text-gray-600">{product.quantity} وحدة</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${product.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{product.percentage}% من المخزون</span>
                    <span>{product.value.toLocaleString()} ر.س</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Facilities */}
      <Card>
        <CardHeader>
          <CardTitle>المرافق والخدمات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {warehouse.facilities.map((facility: string, index: number) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <Package className="h-4 w-4 text-blue-600" />
                <span className="text-sm">{facility}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>إجراءات سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-16 flex-col">
              <Package className="h-6 w-6 mb-2" />
              جرد المخزون
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              حركة وارد
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <TrendingDown className="h-6 w-6 mb-2" />
              حركة صادر
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <BarChart3 className="h-6 w-6 mb-2" />
              تقرير مفصل
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
