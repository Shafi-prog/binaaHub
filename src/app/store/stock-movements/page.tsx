'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  ArrowUp, 
  ArrowDown, 
  Package, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Calendar,
  User,
  FileText,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  BarChart3
} from 'lucide-react';

interface StockMovement {
  id: string;
  product_id: string;
  product_name: string;
  sku: string;
  movement_type: 'in' | 'out' | 'adjustment' | 'transfer';
  quantity: number;
  previous_quantity: number;
  new_quantity: number;
  unit_cost?: number;
  total_value?: number;
  reference_type: 'purchase_order' | 'sale' | 'return' | 'adjustment' | 'transfer' | 'damage' | 'expired';
  reference_id?: string;
  reference_number?: string;
  location_from?: string;
  location_to?: string;
  reason?: string;
  notes?: string;
  created_by: string;
  created_by_name: string;
  created_at: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface Product {
  id: string;
  name: string;
  sku: string;
  current_stock: number;
  unit: string;
  category?: string;
}

interface StockSummary {
  total_movements: number;
  stock_in: number;
  stock_out: number;
  adjustments: number;
  transfers: number;
  total_value_in: number;
  total_value_out: number;
}

export default function StockMovementTracking() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedMovement, setSelectedMovement] = useState<StockMovement | null>(null);
  const [showNewMovementModal, setShowNewMovementModal] = useState(false);
  const [stockSummary, setStockSummary] = useState<StockSummary | null>(null);
  const [user, setUser] = useState<any>(null);

  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    loadStockMovementData();
  }, []);

  const loadStockMovementData = async () => {
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
      const mockMovements: StockMovement[] = [
        {
          id: '1',
          product_id: 'prod1',
          product_name: 'خرسانة جاهزة - درجة 350',
          sku: 'CON-350-M3',
          movement_type: 'in',
          quantity: 50,
          previous_quantity: 20,
          new_quantity: 70,
          unit_cost: 280,
          total_value: 14000,
          reference_type: 'purchase_order',
          reference_id: 'po1',
          reference_number: 'PO-2024-001',
          reason: 'استلام من المورد',
          notes: 'خرسانة عالية الجودة - دفعة جديدة',
          created_by: 'user1',
          created_by_name: 'أحمد محمد',
          created_at: '2024-01-20T14:30:00Z',
          status: 'confirmed'
        },
        {
          id: '2',
          product_id: 'prod2',
          product_name: 'حديد تسليح 16مم',
          sku: 'REB-16MM-TON',
          movement_type: 'out',
          quantity: 5,
          previous_quantity: 15,
          new_quantity: 10,
          unit_cost: 500,
          total_value: 2500,
          reference_type: 'sale',
          reference_id: 'order1',
          reference_number: 'ORD-2024-101',
          reason: 'بيع للعميل',
          notes: 'تم التسليم للموقع',
          created_by: 'user2',
          created_by_name: 'سعد العتيبي',
          created_at: '2024-01-19T11:15:00Z',
          status: 'confirmed'
        },
        {
          id: '3',
          product_id: 'prod3',
          product_name: 'أنابيب PVC قطر 110مم',
          sku: 'PVC-110-6M',
          movement_type: 'adjustment',
          quantity: -3,
          previous_quantity: 25,
          new_quantity: 22,
          unit_cost: 85,
          total_value: -255,
          reference_type: 'damage',
          reason: 'تلف أثناء النقل',
          notes: 'أنابيب تالفة - يجب استبدالها',
          created_by: 'user1',
          created_by_name: 'أحمد محمد',
          created_at: '2024-01-18T16:45:00Z',
          status: 'confirmed'
        },
        {
          id: '4',
          product_id: 'prod4',
          product_name: 'مضخة مياه 1 حصان',
          sku: 'PUMP-1HP',
          movement_type: 'transfer',
          quantity: 2,
          previous_quantity: 4,
          new_quantity: 2,
          location_from: 'مستودع الرياض',
          location_to: 'مستودع جدة',
          reference_type: 'transfer',
          reference_number: 'TRF-2024-005',
          reason: 'نقل بين المستودعات',
          notes: 'نقل حسب الطلب',
          created_by: 'user3',
          created_by_name: 'محمد الفهد',
          created_at: '2024-01-17T09:20:00Z',
          status: 'confirmed'
        },
        {
          id: '5',
          product_id: 'prod5',
          product_name: 'كابلات كهربائية 2.5مم',
          sku: 'CABLE-2.5MM-100M',
          movement_type: 'in',
          quantity: 15,
          previous_quantity: 8,
          new_quantity: 23,
          unit_cost: 450,
          total_value: 6750,
          reference_type: 'return',
          reference_number: 'RET-2024-012',
          reason: 'إرجاع من العميل',
          notes: 'كابلات غير مستخدمة - حالة ممتازة',
          created_by: 'user2',
          created_by_name: 'سعد العتيبي',
          created_at: '2024-01-16T13:10:00Z',
          status: 'confirmed'
        },
        {
          id: '6',
          product_id: 'prod6',
          product_name: 'لوحة توزيع كهربائية',
          sku: 'ELEC-PANEL-12WAY',
          movement_type: 'out',
          quantity: 1,
          previous_quantity: 3,
          new_quantity: 2,
          unit_cost: 2500,
          total_value: 2500,
          reference_type: 'sale',
          reference_id: 'order2',
          reference_number: 'ORD-2024-102',
          reason: 'بيع للعميل',
          created_by: 'user1',
          created_by_name: 'أحمد محمد',
          created_at: '2024-01-15T10:30:00Z',
          status: 'pending'
        }
      ];

      const mockProducts: Product[] = [
        { id: 'prod1', name: 'خرسانة جاهزة - درجة 350', sku: 'CON-350-M3', current_stock: 70, unit: 'متر مكعب', category: 'خرسانة' },
        { id: 'prod2', name: 'حديد تسليح 16مم', sku: 'REB-16MM-TON', current_stock: 10, unit: 'طن', category: 'حديد' },
        { id: 'prod3', name: 'أنابيب PVC قطر 110مم', sku: 'PVC-110-6M', current_stock: 22, unit: 'عدد', category: 'صحي' },
        { id: 'prod4', name: 'مضخة مياه 1 حصان', sku: 'PUMP-1HP', current_stock: 2, unit: 'عدد', category: 'مضخات' },
        { id: 'prod5', name: 'كابلات كهربائية 2.5مم', sku: 'CABLE-2.5MM-100M', current_stock: 23, unit: 'لفة', category: 'كهربائي' },
        { id: 'prod6', name: 'لوحة توزيع كهربائية', sku: 'ELEC-PANEL-12WAY', current_stock: 2, unit: 'عدد', category: 'كهربائي' }
      ];

      // Calculate summary
      const summary: StockSummary = {
        total_movements: mockMovements.length,
        stock_in: mockMovements.filter(m => m.movement_type === 'in').length,
        stock_out: mockMovements.filter(m => m.movement_type === 'out').length,
        adjustments: mockMovements.filter(m => m.movement_type === 'adjustment').length,
        transfers: mockMovements.filter(m => m.movement_type === 'transfer').length,
        total_value_in: mockMovements.filter(m => m.movement_type === 'in').reduce((sum, m) => sum + (m.total_value || 0), 0),
        total_value_out: mockMovements.filter(m => m.movement_type === 'out').reduce((sum, m) => sum + (m.total_value || 0), 0)
      };

      setMovements(mockMovements);
      setProducts(mockProducts);
      setStockSummary(summary);

    } catch (error) {
      console.error('Error loading stock movement data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter movements
  const filteredMovements = movements.filter(movement => {
    const matchesSearch = movement.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (movement.reference_number && movement.reference_number.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'all' || movement.movement_type === typeFilter;
    const matchesStatus = statusFilter === 'all' || movement.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter === 'today') {
      const today = new Date().toDateString();
      matchesDate = new Date(movement.created_at).toDateString() === today;
    } else if (dateFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesDate = new Date(movement.created_at) >= weekAgo;
    } else if (dateFilter === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      matchesDate = new Date(movement.created_at) >= monthAgo;
    }

    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  const formatCurrency = (amount: number, currency: string = 'SAR') => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMovementTypeColor = (type: string) => {
    switch (type) {
      case 'in': return 'bg-green-100 text-green-800';
      case 'out': return 'bg-red-100 text-red-800';
      case 'adjustment': return 'bg-yellow-100 text-yellow-800';
      case 'transfer': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMovementTypeIcon = (type: string) => {
    switch (type) {
      case 'in': return <ArrowUp className="h-4 w-4" />;
      case 'out': return <ArrowDown className="h-4 w-4" />;
      case 'adjustment': return <RefreshCw className="h-4 w-4" />;
      case 'transfer': return <Package className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getMovementTypeText = (type: string) => {
    switch (type) {
      case 'in': return 'إدخال';
      case 'out': return 'إخراج';
      case 'adjustment': return 'تعديل';
      case 'transfer': return 'تحويل';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'cancelled': return <AlertTriangle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'مؤكد';
      case 'pending': return 'قيد الانتظار';
      case 'cancelled': return 'ملغى';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل حركات المخزون...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">تتبع حركات المخزون</h1>
              <p className="mt-1 text-sm text-gray-600">
                مراقبة وتسجيل جميع حركات الدخول والخروج للمخزون
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowNewMovementModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                حركة جديدة
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        {stockSummary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg ml-4">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">إجمالي الحركات</p>
                  <p className="text-2xl font-bold text-gray-900">{stockSummary.total_movements}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg ml-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">إدخال المخزون</p>
                  <p className="text-2xl font-bold text-gray-900">{stockSummary.stock_in}</p>
                  <p className="text-xs text-green-600">{formatCurrency(stockSummary.total_value_in)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg ml-4">
                  <TrendingDown className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">إخراج المخزون</p>
                  <p className="text-2xl font-bold text-gray-900">{stockSummary.stock_out}</p>
                  <p className="text-xs text-red-600">{formatCurrency(stockSummary.total_value_out)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg ml-4">
                  <RefreshCw className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">التعديلات</p>
                  <p className="text-2xl font-bold text-gray-900">{stockSummary.adjustments}</p>
                  <p className="text-xs text-gray-500">و {stockSummary.transfers} تحويل</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="البحث بالمنتج أو رقم المرجع..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">جميع الأنواع</option>
              <option value="in">إدخال</option>
              <option value="out">إخراج</option>
              <option value="adjustment">تعديل</option>
              <option value="transfer">تحويل</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">جميع الحالات</option>
              <option value="confirmed">مؤكد</option>
              <option value="pending">قيد الانتظار</option>
              <option value="cancelled">ملغى</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">جميع التواريخ</option>
              <option value="today">اليوم</option>
              <option value="week">هذا الأسبوع</option>
              <option value="month">هذا الشهر</option>
            </select>

            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Download className="h-4 w-4" />
              تصدير Excel
            </button>
          </div>
        </div>

        {/* Stock Movements Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
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
                    الرصيد السابق/الجديد
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    القيمة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المرجع
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التاريخ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMovements.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <Package className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد حركات مخزون</h3>
                        <p className="text-gray-500 mb-4">قم بتسجيل حركة مخزون جديدة للبدء</p>
                        <button
                          onClick={() => setShowNewMovementModal(true)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          حركة جديدة
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredMovements.map((movement) => (
                    <tr key={movement.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{movement.product_name}</div>
                          <div className="text-sm text-gray-500">{movement.sku}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium gap-1 ${getMovementTypeColor(movement.movement_type)}`}>
                          {getMovementTypeIcon(movement.movement_type)}
                          {getMovementTypeText(movement.movement_type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <span className="text-gray-500">{movement.previous_quantity}</span>
                          <span className="mx-2">←</span>
                          <span className="font-medium">{movement.new_quantity}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {movement.total_value ? (
                          <div className={`text-sm font-medium ${movement.total_value > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(Math.abs(movement.total_value))}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {movement.reference_number && (
                            <div className="font-medium">{movement.reference_number}</div>
                          )}
                          <div className="text-xs text-gray-500">{movement.reason}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 ml-1" />
                          {formatDate(movement.created_at)}
                        </div>
                        <div className="text-xs text-gray-500">{movement.created_by_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium gap-1 ${getStatusColor(movement.status)}`}>
                          {getStatusIcon(movement.status)}
                          {getStatusText(movement.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedMovement(movement)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="عرض التفاصيل"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Movement Details Modal */}
      {selectedMovement && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                تفاصيل حركة المخزون
              </h3>
              <button
                onClick={() => setSelectedMovement(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Movement Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">معلومات المنتج</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">اسم المنتج:</span> {selectedMovement.product_name}</div>
                    <div><span className="font-medium">رقم المنتج:</span> {selectedMovement.sku}</div>
                    <div>
                      <span className="font-medium">نوع الحركة:</span> 
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium gap-1 mr-2 ${getMovementTypeColor(selectedMovement.movement_type)}`}>
                        {getMovementTypeIcon(selectedMovement.movement_type)}
                        {getMovementTypeText(selectedMovement.movement_type)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">تفاصيل الحركة</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">الكمية:</span> {selectedMovement.quantity > 0 ? '+' : ''}{selectedMovement.quantity}</div>
                    <div><span className="font-medium">الرصيد السابق:</span> {selectedMovement.previous_quantity}</div>
                    <div><span className="font-medium">الرصيد الجديد:</span> {selectedMovement.new_quantity}</div>
                    {selectedMovement.total_value && (
                      <div><span className="font-medium">القيمة:</span> {formatCurrency(selectedMovement.total_value)}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Reference Info */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">معلومات المرجع</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    {selectedMovement.reference_number && (
                      <div><span className="font-medium">رقم المرجع:</span> {selectedMovement.reference_number}</div>
                    )}
                    <div><span className="font-medium">نوع المرجع:</span> {selectedMovement.reference_type}</div>
                    <div><span className="font-medium">السبب:</span> {selectedMovement.reason || 'غير محدد'}</div>
                  </div>
                  <div>
                    {selectedMovement.location_from && (
                      <div><span className="font-medium">من الموقع:</span> {selectedMovement.location_from}</div>
                    )}
                    {selectedMovement.location_to && (
                      <div><span className="font-medium">إلى الموقع:</span> {selectedMovement.location_to}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">معلومات إضافية</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div><span className="font-medium">تم بواسطة:</span> {selectedMovement.created_by_name}</div>
                    <div><span className="font-medium">التاريخ:</span> {formatDate(selectedMovement.created_at)}</div>
                  </div>
                  <div>
                    <div>
                      <span className="font-medium">الحالة:</span> 
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium gap-1 mr-2 ${getStatusColor(selectedMovement.status)}`}>
                        {getStatusIcon(selectedMovement.status)}
                        {getStatusText(selectedMovement.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedMovement.notes && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">ملاحظات</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedMovement.notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => setSelectedMovement(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Movement Modal Placeholder */}
      {showNewMovementModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">تسجيل حركة مخزون جديدة</h3>
              <button
                onClick={() => setShowNewMovementModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="text-center py-8">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">قريباً</h3>
              <p className="text-gray-500">سيتم إضافة نموذج تسجيل حركة مخزون جديدة قريباً</p>
              <button
                onClick={() => setShowNewMovementModal(false)}
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
