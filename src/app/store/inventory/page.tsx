'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  AlertTriangle,
  FileText,
  Users,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Settings,
  Star,
  DollarSign,
  Truck,
  ClipboardList,
  BarChart3,
  Calculator
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Product {
  id: string;
  name: string;
  sku?: string;
  selling_price: number;
  cost_price?: number;
  stock_quantity: number;
  min_stock_level: number;
  max_stock_level?: number;
  reorder_point?: number;
  reorder_quantity?: number;
  is_active: boolean;
  vat_rate: number;
  unit_of_measure: string;
  category_id?: string;
  barcode?: string;
  weight?: number;
  dimensions_length?: number;
  dimensions_width?: number;
  dimensions_height?: number;
  images?: string[];
  tags?: string[];
  created_at: string;
  updated_at: string;
}

interface StockMovement {
  id: string;
  product_id: string;
  movement_type: 'in' | 'out' | 'adjustment' | 'return';
  quantity: number;
  previous_stock: number;
  new_stock: number;
  reference_id?: string;
  reference_type?: string;
  notes?: string;
  created_at: string;
  product?: Product;
}

interface StockAlert {
  id: string;
  product_id: string;
  alert_type: 'low_stock' | 'out_of_stock' | 'overstock';
  current_stock: number;
  threshold_value?: number;
  is_acknowledged: boolean;
  created_at: string;
  product?: Product;
}

interface Supplier {
  id: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  vat_number?: string;
  payment_terms?: string;
  is_active: boolean;
  rating?: number;
}

interface PurchaseOrder {
  id: string;
  po_number: string;
  supplier_id: string;
  status: 'draft' | 'sent' | 'confirmed' | 'received' | 'cancelled';
  subtotal: number;
  vat_amount: number;
  total_amount: number;
  order_date: string;
  expected_delivery_date?: string;
  actual_delivery_date?: string;
  supplier?: Supplier;
}

export default function AdvancedInventoryManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState<any>(null);

  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    loadInventoryData();
  }, []);

  const loadInventoryData = async () => {
    try {
      setLoading(true);

      // Get current user
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      if (userError || !currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);

      // Load products with advanced info
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', currentUser.id)
        .order('updated_at', { ascending: false });

      if (!productsError) {
        setProducts(productsData || []);
      }

      // Load stock movements
      const { data: movementsData, error: movementsError } = await supabase
        .from('stock_movements')
        .select(`
          *,
          products!inner(name, sku)
        `)
        .eq('products.store_id', currentUser.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (!movementsError) {
        setStockMovements(movementsData || []);
      }

      // Load stock alerts
      const { data: alertsData, error: alertsError } = await supabase
        .from('stock_alerts')
        .select(`
          *,
          products!inner(name, sku, stock_quantity, min_stock_level)
        `)
        .eq('products.store_id', currentUser.id)
        .eq('is_acknowledged', false)
        .order('created_at', { ascending: false });

      if (!alertsError) {
        setStockAlerts(alertsData || []);
      }

      // Load suppliers
      const { data: suppliersData, error: suppliersError } = await supabase
        .from('suppliers')
        .select('*')
        .eq('store_id', currentUser.id)
        .eq('is_active', true)
        .order('name');

      if (!suppliersError) {
        setSuppliers(suppliersData || []);
      }

      // Load purchase orders
      const { data: purchaseOrdersData, error: purchaseOrdersError } = await supabase
        .from('purchase_orders')
        .select(`
          *,
          suppliers(name, contact_person)
        `)
        .eq('store_id', currentUser.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!purchaseOrdersError) {
        setPurchaseOrders(purchaseOrdersData || []);
      }

    } catch (error) {
      console.error('Error loading inventory data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'low_stock': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      case 'overstock': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertTypeText = (type: string) => {
    switch (type) {
      case 'low_stock': return 'مخزون منخفض';
      case 'out_of_stock': return 'نفاد المخزون';
      case 'overstock': return 'مخزون زائد';
      default: return type;
    }
  };

  const getMovementTypeColor = (type: string) => {
    switch (type) {
      case 'in': return 'text-green-600';
      case 'out': return 'text-red-600';
      case 'adjustment': return 'text-blue-600';
      case 'return': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getMovementTypeText = (type: string) => {
    switch (type) {
      case 'in': return 'إدخال';
      case 'out': return 'إخراج';
      case 'adjustment': return 'تعديل';
      case 'return': return 'إرجاع';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'received': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'مسودة';
      case 'sent': return 'مرسل';
      case 'confirmed': return 'مؤكد';
      case 'received': return 'مستلم';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  // Calculate inventory stats
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.is_active).length;
  const lowStockProducts = products.filter(p => p.stock_quantity <= p.min_stock_level).length;
  const outOfStockProducts = products.filter(p => p.stock_quantity === 0).length;
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.selling_price * p.stock_quantity), 0);
  const totalCostValue = products.reduce((sum, p) => sum + ((p.cost_price || 0) * p.stock_quantity), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل بيانات المخزون...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-tajawal">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">إدارة المخزون المتقدمة</h1>
              <p className="text-gray-600">نظام شامل لإدارة المخزون والموردين مع تتبع دقيق للحركات</p>
            </div>
            <div className="flex gap-3">
              <Link href="/store/dashboard">
                <Button variant="outline">
                  <Settings className="w-4 h-4 ml-2" />
                  لوحة التحكم
                </Button>
              </Link>
              <Link href="/store/products/add">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة منتج
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'نظرة عامة', icon: BarChart3 },
              { id: 'products', name: 'المنتجات', icon: Package },
              { id: 'movements', name: 'حركات المخزون', icon: TrendingUp },
              { id: 'alerts', name: 'التنبيهات', icon: AlertTriangle },
              { id: 'suppliers', name: 'الموردين', icon: Users },
              { id: 'purchase-orders', name: 'أوامر الشراء', icon: ClipboardList }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5 ml-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="mr-4">
                    <div className="text-2xl font-bold text-gray-900">{totalProducts}</div>
                    <div className="text-sm text-gray-500">إجمالي المنتجات</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ShoppingCart className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="mr-4">
                    <div className="text-2xl font-bold text-gray-900">{activeProducts}</div>
                    <div className="text-sm text-gray-500">منتجات نشطة</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="mr-4">
                    <div className="text-2xl font-bold text-gray-900">{lowStockProducts}</div>
                    <div className="text-sm text-gray-500">مخزون منخفض</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="mr-4">
                    <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalInventoryValue)}</div>
                    <div className="text-sm text-gray-500">قيمة المخزون</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">إجراءات سريعة</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/store/products/add">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة منتج جديد
                  </Button>
                </Link>
                <Link href="/store/inventory/stock-adjustment">
                  <Button variant="outline" className="w-full justify-start">
                    <Calculator className="w-4 h-4 ml-2" />
                    تعديل المخزون
                  </Button>
                </Link>
                <Link href="/store/suppliers/add">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 ml-2" />
                    إضافة مورد
                  </Button>
                </Link>
                <Link href="/store/purchase-orders/create">
                  <Button variant="outline" className="w-full justify-start">
                    <ClipboardList className="w-4 h-4 ml-2" />
                    إنشاء أمر شراء
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Recent Stock Movements */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">حركات المخزون الأخيرة</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setActiveTab('movements')}
                >
                  عرض الكل
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        المنتج
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        نوع الحركة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الكمية
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        التاريخ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stockMovements.slice(0, 5).map((movement) => (
                      <tr key={movement.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {(movement.product as any)?.name || 'منتج غير معروف'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${getMovementTypeColor(movement.movement_type)}`}>
                            {getMovementTypeText(movement.movement_type)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {movement.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(movement.created_at).toLocaleDateString('ar-SA')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Stock Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">تنبيهات المخزون</h2>
              <div className="text-sm text-gray-600">
                {stockAlerts.length} تنبيه غير مؤكد
              </div>
            </div>

            {stockAlerts.length === 0 ? (
              <Card className="p-12 text-center">
                <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد تنبيهات</h3>
                <p className="text-gray-500">جميع منتجاتك ضمن المستويات الآمنة</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {stockAlerts.map((alert) => (
                  <Card key={alert.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <AlertTriangle className="h-6 w-6 text-yellow-500 ml-3" />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {(alert.product as any)?.name || 'منتج غير معروف'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            المخزون الحالي: {alert.current_stock} | 
                            الحد الأدنى: {(alert.product as any)?.min_stock_level || 0}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAlertTypeColor(alert.alert_type)}`}>
                          {getAlertTypeText(alert.alert_type)}
                        </span>
                        <Button size="sm" variant="outline">
                          تأكيد
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">إدارة المنتجات</h2>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="البحث في المنتجات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Link href="/store/products/add">
                  <Button>
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة منتج
                  </Button>
                </Link>
              </div>
            </div>

            <Card className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        المنتج
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        السعر
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        المخزون
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الحالة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        إجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products
                      .filter(product => 
                        !searchTerm || 
                        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
                      )
                      .slice(0, 20)
                      .map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              {product.sku && <div className="text-sm text-gray-500">SKU: {product.sku}</div>}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatCurrency(product.selling_price)}</div>
                            {product.cost_price && (
                              <div className="text-sm text-gray-500">التكلفة: {formatCurrency(product.cost_price)}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm font-medium ${
                              product.stock_quantity <= product.min_stock_level 
                                ? 'text-red-600' 
                                : 'text-gray-900'
                            }`}>
                              {product.stock_quantity} {product.unit_of_measure}
                            </div>
                            <div className="text-xs text-gray-500">الحد الأدنى: {product.min_stock_level}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              product.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product.is_active ? 'نشط' : 'غير نشط'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => router.push(`/store/products/${product.id}/edit`)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => router.push(`/store/products/${product.id}`)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Stock Movements Tab */}
        {activeTab === 'movements' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">حركات المخزون</h2>
              <Button>
                <Plus className="w-4 h-4 ml-2" />
                تسجيل حركة جديدة
              </Button>
            </div>

            <Card className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        المنتج
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        نوع الحركة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الكمية
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        المخزون السابق
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        المخزون الجديد
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        التاريخ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stockMovements.map((movement) => (
                      <tr key={movement.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {(movement.product as any)?.name || 'منتج غير معروف'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${getMovementTypeColor(movement.movement_type)}`}>
                            {getMovementTypeText(movement.movement_type)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {movement.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {movement.previous_stock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {movement.new_stock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(movement.created_at).toLocaleDateString('ar-SA')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Suppliers Tab */}
        {activeTab === 'suppliers' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">إدارة الموردين</h2>
              <Link href="/store/suppliers/add">
                <Button>
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة مورد
                </Button>
              </Link>
            </div>

            {suppliers.length === 0 ? (
              <Card className="p-12 text-center">
                <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد موردين</h3>
                <p className="text-gray-500 mb-4">ابدأ بإضافة موردين لإدارة مشترياتك</p>
                <Link href="/store/suppliers/add">
                  <Button>
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة مورد جديد
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suppliers.map((supplier) => (
                  <Card key={supplier.id} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{supplier.name}</h3>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      {supplier.contact_person && (
                        <p>جهة الاتصال: {supplier.contact_person}</p>
                      )}
                      {supplier.phone && (
                        <p>الهاتف: {supplier.phone}</p>
                      )}
                      {supplier.email && (
                        <p>البريد: {supplier.email}</p>
                      )}
                      {supplier.payment_terms && (
                        <p>شروط الدفع: {supplier.payment_terms}</p>
                      )}
                    </div>
                    {supplier.rating && (
                      <div className="mt-4 flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="mr-1 text-sm text-gray-600">{supplier.rating}/5</span>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Purchase Orders Tab */}
        {activeTab === 'purchase-orders' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">أوامر الشراء</h2>
              <Link href="/store/purchase-orders/create">
                <Button>
                  <Plus className="w-4 h-4 ml-2" />
                  إنشاء أمر شراء
                </Button>
              </Link>
            </div>

            {purchaseOrders.length === 0 ? (
              <Card className="p-12 text-center">
                <ClipboardList className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد أوامر شراء</h3>
                <p className="text-gray-500 mb-4">ابدأ بإنشاء أوامر شراء لتجديد مخزونك</p>
                <Link href="/store/purchase-orders/create">
                  <Button>
                    <Plus className="w-4 h-4 ml-2" />
                    إنشاء أمر شراء جديد
                  </Button>
                </Link>
              </Card>
            ) : (
              <Card className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          رقم الأمر
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          المورد
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          المبلغ الإجمالي
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          الحالة
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          تاريخ الأمر
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          إجراءات
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {purchaseOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order.po_number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {(order.supplier as any)?.name || 'مورد غير معروف'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(order.total_amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.order_date).toLocaleDateString('ar-SA')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
