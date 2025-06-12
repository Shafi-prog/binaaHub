'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  FileText,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  DollarSign,
  User,
  Building
} from 'lucide-react';

interface PurchaseOrder {
  id: string;
  po_number: string;
  supplier_id: string;
  supplier_name: string;
  status: 'draft' | 'sent' | 'acknowledged' | 'partially_received' | 'received' | 'cancelled';
  order_date: string;
  expected_delivery_date?: string;
  total_amount: number;
  currency: string;
  payment_terms: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  items?: PurchaseOrderItem[];
}

interface PurchaseOrderItem {
  id: string;
  purchase_order_id: string;
  product_id: string;
  product_name: string;
  sku?: string;
  quantity_ordered: number;
  quantity_received: number;
  unit_price: number;
  total_price: number;
  notes?: string;
}

interface Supplier {
  id: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  payment_terms?: string;
  rating: number;
}

export default function PurchaseOrderManagement() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    loadPurchaseOrderData();
  }, []);

  const loadPurchaseOrderData = async () => {
    try {
      setLoading(true);

      // Get current user
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      if (userError || !currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);

      // Load mock data (replace with actual Supabase queries when schema is available)
      const mockPurchaseOrders: PurchaseOrder[] = [
        {
          id: '1',
          po_number: 'PO-2024-001',
          supplier_id: 'sup1',
          supplier_name: 'شركة مواد البناء المتطورة',
          status: 'sent',
          order_date: '2024-01-20',
          expected_delivery_date: '2024-01-27',
          total_amount: 15000,
          currency: 'SAR',
          payment_terms: '30 يوم',
          notes: 'مواد البناء الأساسية للمشروع الجديد',
          created_at: '2024-01-20T10:00:00Z',
          updated_at: '2024-01-20T10:00:00Z',
          items: [
            {
              id: 'item1',
              purchase_order_id: '1',
              product_id: 'prod1',
              product_name: 'خرسانة جاهزة - درجة 350',
              sku: 'CON-350-M3',
              quantity_ordered: 50,
              quantity_received: 0,
              unit_price: 280,
              total_price: 14000,
              notes: 'خرسانة عالية الجودة'
            },
            {
              id: 'item2',
              purchase_order_id: '1',
              product_id: 'prod2',
              product_name: 'حديد تسليح 16مم',
              sku: 'REB-16MM-TON',
              quantity_ordered: 2,
              quantity_received: 0,
              unit_price: 500,
              total_price: 1000,
              notes: 'حديد عالي الجودة'
            }
          ]
        },
        {
          id: '2',
          po_number: 'PO-2024-002',
          supplier_id: 'sup2',
          supplier_name: 'مؤسسة التجهيزات الصحية',
          status: 'acknowledged',
          order_date: '2024-01-18',
          expected_delivery_date: '2024-01-25',
          total_amount: 8500,
          currency: 'SAR',
          payment_terms: '15 يوم',
          created_at: '2024-01-18T14:30:00Z',
          updated_at: '2024-01-19T09:15:00Z',
          items: [
            {
              id: 'item3',
              purchase_order_id: '2',
              product_id: 'prod3',
              product_name: 'أنابيب PVC قطر 110مم',
              sku: 'PVC-110-6M',
              quantity_ordered: 20,
              quantity_received: 0,
              unit_price: 85,
              total_price: 1700,
              notes: 'أنابيب صرف صحي'
            },
            {
              id: 'item4',
              purchase_order_id: '2',
              product_id: 'prod4',
              product_name: 'مضخة مياه 1 حصان',
              sku: 'PUMP-1HP',
              quantity_ordered: 2,
              quantity_received: 0,
              unit_price: 3400,
              total_price: 6800,
              notes: 'مضخات عالية الكفاءة'
            }
          ]
        },
        {
          id: '3',
          po_number: 'PO-2024-003',
          supplier_id: 'sup3',
          supplier_name: 'شركة الأدوات الكهربائية',
          status: 'partially_received',
          order_date: '2024-01-15',
          expected_delivery_date: '2024-01-22',
          total_amount: 12000,
          currency: 'SAR',
          payment_terms: '30 يوم',
          created_at: '2024-01-15T11:20:00Z',
          updated_at: '2024-01-21T16:45:00Z',
          items: [
            {
              id: 'item5',
              purchase_order_id: '3',
              product_id: 'prod5',
              product_name: 'كابلات كهربائية 2.5مم',
              sku: 'CABLE-2.5MM-100M',
              quantity_ordered: 10,
              quantity_received: 6,
              unit_price: 450,
              total_price: 4500,
              notes: 'كابلات معزولة'
            },
            {
              id: 'item6',
              purchase_order_id: '3',
              product_id: 'prod6',
              product_name: 'لوحة توزيع كهربائية',
              sku: 'ELEC-PANEL-12WAY',
              quantity_ordered: 3,
              quantity_received: 0,
              unit_price: 2500,
              total_price: 7500,
              notes: 'لوحات 12 طريق'
            }
          ]
        }
      ];

      const mockSuppliers: Supplier[] = [
        {
          id: 'sup1',
          name: 'شركة مواد البناء المتطورة',
          contact_person: 'أحمد محمد',
          email: 'ahmed@building-materials.com',
          phone: '+966501234567',
          address: 'شارع الملك فهد، الرياض',
          payment_terms: '30 يوم',
          rating: 4.8
        },
        {
          id: 'sup2',
          name: 'مؤسسة التجهيزات الصحية',
          contact_person: 'سعد العتيبي',
          email: 'saad@sanitary-eq.com',
          phone: '+966507654321',
          address: 'طريق الدمام، الرياض',
          payment_terms: '15 يوم',
          rating: 4.6
        },
        {
          id: 'sup3',
          name: 'شركة الأدوات الكهربائية',
          contact_person: 'محمد الفهد',
          email: 'mohammed@electrical-tools.com',
          phone: '+966509876543',
          address: 'شارع التحلية، جدة',
          payment_terms: '30 يوم',
          rating: 4.7
        }
      ];

      setPurchaseOrders(mockPurchaseOrders);
      setSuppliers(mockSuppliers);

    } catch (error) {
      console.error('Error loading purchase order data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter purchase orders
  const filteredOrders = purchaseOrders.filter(order => {
    const matchesSearch = order.po_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.supplier_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSupplier = supplierFilter === 'all' || order.supplier_id === supplierFilter;

    return matchesSearch && matchesStatus && matchesSupplier;
  });

  // Calculate stats
  const totalOrders = purchaseOrders.length;
  const draftOrders = purchaseOrders.filter(o => o.status === 'draft').length;
  const sentOrders = purchaseOrders.filter(o => o.status === 'sent').length;
  const acknowledgedOrders = purchaseOrders.filter(o => o.status === 'acknowledged').length;
  const partiallyReceivedOrders = purchaseOrders.filter(o => o.status === 'partially_received').length;
  const receivedOrders = purchaseOrders.filter(o => o.status === 'received').length;
  const totalValue = purchaseOrders.reduce((sum, o) => sum + o.total_amount, 0);

  const formatCurrency = (amount: number, currency: string = 'SAR') => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'acknowledged': return 'bg-yellow-100 text-yellow-800';
      case 'partially_received': return 'bg-orange-100 text-orange-800';
      case 'received': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <FileText className="h-4 w-4" />;
      case 'sent': return <Clock className="h-4 w-4" />;
      case 'acknowledged': return <CheckCircle className="h-4 w-4" />;
      case 'partially_received': return <Package className="h-4 w-4" />;
      case 'received': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'مسودة';
      case 'sent': return 'مرسل';
      case 'acknowledged': return 'مؤكد';
      case 'partially_received': return 'استلام جزئي';
      case 'received': return 'مستلم';
      case 'cancelled': return 'ملغى';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل أوامر الشراء...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">إدارة أوامر الشراء</h1>
              <p className="mt-1 text-sm text-gray-600">
                إدارة وتتبع أوامر الشراء من الموردين
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowNewOrderModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                أمر شراء جديد
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg ml-4">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الأوامر</p>
                <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg ml-4">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">قيد الانتظار</p>
                <p className="text-2xl font-bold text-gray-900">{sentOrders + acknowledgedOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg ml-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">مكتملة</p>
                <p className="text-2xl font-bold text-gray-900">{receivedOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg ml-4">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">القيمة الإجمالية</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="البحث برقم الأمر أو اسم المورد..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">جميع الحالات</option>
              <option value="draft">مسودة</option>
              <option value="sent">مرسل</option>
              <option value="acknowledged">مؤكد</option>
              <option value="partially_received">استلام جزئي</option>
              <option value="received">مستلم</option>
              <option value="cancelled">ملغى</option>
            </select>

            <select
              value={supplierFilter}
              onChange={(e) => setSupplierFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">جميع الموردين</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>

            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Download className="h-4 w-4" />
              تصدير Excel
            </button>
          </div>
        </div>

        {/* Purchase Orders Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
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
                    تاريخ الأمر
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    القيمة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تاريخ التسليم المتوقع
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <FileText className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد أوامر شراء</h3>
                        <p className="text-gray-500 mb-4">قم بإنشاء أمر شراء جديد للبدء</p>
                        <button
                          onClick={() => setShowNewOrderModal(true)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          أمر شراء جديد
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.po_number}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="p-2 bg-gray-100 rounded-lg ml-3">
                            <Building className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{order.supplier_name}</div>
                            <div className="text-sm text-gray-500">{order.payment_terms}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 ml-1" />
                          {formatDate(order.order_date)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium gap-1 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(order.total_amount, order.currency)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.expected_delivery_date ? (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 ml-1" />
                            {formatDate(order.expected_delivery_date)}
                          </div>
                        ) : (
                          <span className="text-gray-400">غير محدد</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="عرض التفاصيل"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            className="text-green-600 hover:text-green-900 p-1 rounded"
                            title="تعديل"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="حذف"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Purchase Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                تفاصيل أمر الشراء - {selectedOrder.po_number}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Order Header Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">معلومات الأمر</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">رقم الأمر:</span> {selectedOrder.po_number}</div>
                    <div><span className="font-medium">تاريخ الأمر:</span> {formatDate(selectedOrder.order_date)}</div>
                    <div><span className="font-medium">تاريخ التسليم المتوقع:</span> {selectedOrder.expected_delivery_date ? formatDate(selectedOrder.expected_delivery_date) : 'غير محدد'}</div>
                    <div>
                      <span className="font-medium">الحالة:</span> 
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium gap-1 mr-2 ${getStatusColor(selectedOrder.status)}`}>
                        {getStatusIcon(selectedOrder.status)}
                        {getStatusText(selectedOrder.status)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">معلومات المورد</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">اسم المورد:</span> {selectedOrder.supplier_name}</div>
                    <div><span className="font-medium">شروط الدفع:</span> {selectedOrder.payment_terms}</div>
                    <div><span className="font-medium">القيمة الإجمالية:</span> {formatCurrency(selectedOrder.total_amount, selectedOrder.currency)}</div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">العناصر المطلوبة</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">المنتج</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">الكمية المطلوبة</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">الكمية المستلمة</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">سعر الوحدة</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">الإجمالي</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedOrder.items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-2">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{item.product_name}</div>
                                {item.sku && <div className="text-xs text-gray-500">{item.sku}</div>}
                              </div>
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">{item.quantity_ordered}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              <span className={item.quantity_received > 0 ? 'text-green-600 font-medium' : 'text-gray-500'}>
                                {item.quantity_received}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">{formatCurrency(item.unit_price)}</td>
                            <td className="px-4 py-2 text-sm font-medium text-gray-900">{formatCurrency(item.total_price)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">ملاحظات</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  إغلاق
                </button>
                <button className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                  تعديل الأمر
                </button>
                <button className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
                  طباعة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Purchase Order Modal Placeholder */}
      {showNewOrderModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">أمر شراء جديد</h3>
              <button
                onClick={() => setShowNewOrderModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="text-center py-8">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">قريباً</h3>
              <p className="text-gray-500">سيتم إضافة نموذج إنشاء أمر شراء جديد قريباً</p>
              <button
                onClick={() => setShowNewOrderModal(false)}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                موافق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
