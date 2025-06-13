'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ClientIcon } from '@/components/icons';
import SimpleLayout from '@/components/layouts/SimpleLayout';
import { Plus, Search, Filter, Edit, Eye, Package, Clock, CheckCircle, AlertTriangle, Settings } from 'lucide-react';
import { verifyTempAuth } from '@/lib/temp-auth';

// Unified Order interface that supports both basic and ERP orders
interface UnifiedOrder {
  // Basic order fields
  id: string;
  store_id: string;
  customer_name: string;
  customer_email?: string;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  
  // ERP Sales Order fields (optional)
  name?: string; // ERP order name
  customer_id?: string;
  transaction_date?: string;
  delivery_date?: string;
  po_no?: string;
  total_qty?: number;
  grand_total?: number;
  delivery_status?: string;
  billing_status?: string;
  per_delivered?: number;
  per_billed?: number;
  
  // Source identification
  source: 'basic' | 'erp' | 'medusa';
}

export default function UnifiedOrdersPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [orders, setOrders] = useState<UnifiedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'basic' | 'advanced'>('basic');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    // Check URL parameters for view mode and filters
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');
    const statusParam = urlParams.get('status');
    
    if (viewParam === 'advanced') {
      setViewMode('advanced');
    }
    if (statusParam) {
      setSelectedStatus(statusParam);
    }
    
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use temp auth
      const authResult = await verifyTempAuth(3);
      
      if (!authResult?.user) {
        console.log('❌ [Orders] No authenticated user found');
        router.push('/login');
        return;
      }

      const { user } = authResult;

      if (user.account_type !== 'store') {
        console.log('❌ [Orders] User is not a store account');
        router.push('/user/dashboard');
        return;
      }

      console.log('✅ [Orders] Store user authenticated:', user.email);
      setCurrentUser(user);

      // Mock unified orders data with all three sources
      const mockUnifiedOrders: UnifiedOrder[] = [
        // Basic store orders
        {
          id: '1',
          store_id: user.id,
          customer_name: 'أحمد محمد',
          customer_email: 'ahmed@example.com',
          total_amount: 1250.00,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          source: 'basic'
        },
        {
          id: '2',
          store_id: user.id,
          customer_name: 'فاطمة علي',
          customer_email: 'fatima@example.com',
          total_amount: 800.00,
          status: 'completed',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString(),
          source: 'basic'
        },
        // ERP Sales Orders
        {
          id: 'erp-3',
          store_id: user.id,
          customer_name: 'شركة التقنية المتقدمة',
          customer_email: 'info@techadvanced.com',
          total_amount: 15000.00,
          status: 'to_deliver',
          created_at: new Date(Date.now() - 172800000).toISOString(),
          updated_at: new Date(Date.now() - 172800000).toISOString(),
          // ERP specific fields
          name: 'SAL-ORD-2024-001',
          customer_id: 'CUST-001',
          transaction_date: new Date(Date.now() - 172800000).toISOString(),
          delivery_date: new Date(Date.now() + 604800000).toISOString(),
          po_no: 'PO-2024-001',
          total_qty: 50,
          grand_total: 15000.00,
          delivery_status: 'To Deliver',
          billing_status: 'Not Billed',
          per_delivered: 0,
          per_billed: 0,
          source: 'erp'
        },
        // Medusa e-commerce orders
        {
          id: 'medusa-4',
          store_id: user.id,
          customer_name: 'سارة أحمد (متجر إلكتروني)',
          customer_email: 'sara@example.com',
          total_amount: 650.00,
          status: 'shipped',
          created_at: new Date(Date.now() - 43200000).toISOString(),
          updated_at: new Date(Date.now() - 43200000).toISOString(),
          source: 'medusa'
        },
        {
          id: 'medusa-5',
          store_id: user.id,
          customer_name: 'محمد حسن (متجر إلكتروني)',
          customer_email: 'mohamed@example.com',
          total_amount: 2200.00,
          status: 'processing',
          created_at: new Date(Date.now() - 21600000).toISOString(),
          updated_at: new Date(Date.now() - 21600000).toISOString(),
          source: 'medusa'
        }
      ];
      
      setOrders(mockUnifiedOrders);

    } catch (error) {
      console.error('❌ [Orders] Error loading data:', error);
      setError('حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on search, status, and source
  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchTerm || 
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.po_no?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !selectedStatus || order.status === selectedStatus;
    const matchesSource = !selectedSource || order.source === selectedSource;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  // Get unique statuses and sources for filters
  const statuses = [...new Set(orders.map(o => o.status))];
  const sources = [...new Set(orders.map(o => o.source))];

  // Stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'delivered').length;
  const erpOrders = orders.filter(o => o.source === 'erp').length;

  // Status badge styling
  const getStatusBadge = (status: string, source: string) => {
    const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
    
    if (source === 'erp') {
      switch (status) {
        case 'to_deliver':
          return `${baseClasses} bg-blue-100 text-blue-700`;
        case 'delivered':
          return `${baseClasses} bg-green-100 text-green-700`;
        default:
          return `${baseClasses} bg-gray-100 text-gray-700`;
      }
    }
    
    switch (status) {
      case 'pending':
      case 'processing':
        return `${baseClasses} bg-yellow-100 text-yellow-700`;
      case 'completed':
      case 'delivered':
      case 'shipped':
        return `${baseClasses} bg-green-100 text-green-700`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-700`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700`;
    }
  };

  const getSourceBadge = (source: string) => {
    const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
    
    switch (source) {
      case 'basic':
        return `${baseClasses} bg-blue-100 text-blue-700`;
      case 'erp':
        return `${baseClasses} bg-purple-100 text-purple-700`;
      case 'medusa':
        return `${baseClasses} bg-green-100 text-green-700`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <SimpleLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">إدارة الطلبات الموحدة</h1>
              <p className="text-blue-100 text-sm sm:text-base">
                إدارة شاملة للطلبات من جميع المصادر (متجر أساسي، ERP، تجارة إلكترونية)
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode(viewMode === 'basic' ? 'advanced' : 'basic')}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                {viewMode === 'basic' ? <Settings size={20} /> : <Eye size={20} />}
                {viewMode === 'basic' ? 'العرض المتقدم' : 'العرض البسيط'}
              </button>
              <Link
                href="/store/orders/new"
                className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
              >
                <Plus size={20} />
                إضافة طلب
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي الطلبات</p>
                <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">قيد التنفيذ</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">مكتملة</p>
                <p className="text-2xl font-bold text-green-600">{completedOrders}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">طلبات ERP</p>
                <p className="text-2xl font-bold text-purple-600">{erpOrders}</p>
              </div>
              <Settings className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="البحث عن طلب أو عميل..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="sm:w-40">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">جميع الحالات</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            
            <div className="sm:w-40">
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">جميع المصادر</option>
                <option value="basic">متجر أساسي</option>
                <option value="erp">ERP</option>
                <option value="medusa">تجارة إلكترونية</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border">
          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد طلبات</h3>
              <p className="text-gray-500 mb-4">ستظهر هنا طلبات العملاء من جميع المصادر</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-right p-4 font-medium text-gray-700">الطلب</th>
                    <th className="text-right p-4 font-medium text-gray-700">العميل</th>
                    <th className="text-right p-4 font-medium text-gray-700">المبلغ</th>
                    <th className="text-right p-4 font-medium text-gray-700">الحالة</th>
                    <th className="text-right p-4 font-medium text-gray-700">المصدر</th>
                    {viewMode === 'advanced' && (
                      <>
                        <th className="text-right p-4 font-medium text-gray-700">رقم الطلب</th>
                        <th className="text-right p-4 font-medium text-gray-700">تاريخ التسليم</th>
                        <th className="text-right p-4 font-medium text-gray-700">حالة التسليم</th>
                      </>
                    )}
                    <th className="text-right p-4 font-medium text-gray-700">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {order.name || `طلب #${order.id.slice(-6)}`}
                          </h3>
                          <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <h3 className="font-medium text-gray-900">{order.customer_name}</h3>
                          {order.customer_email && (
                            <p className="text-sm text-gray-500">{order.customer_email}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-gray-900">
                          {formatCurrency(order.grand_total || order.total_amount)}
                        </span>
                        {viewMode === 'advanced' && order.total_qty && (
                          <p className="text-xs text-gray-500">{order.total_qty} عنصر</p>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={getStatusBadge(order.status, order.source)}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={getSourceBadge(order.source)}>
                          {order.source === 'basic' ? 'أساسي' : 
                           order.source === 'erp' ? 'ERP' : 
                           'إلكتروني'}
                        </span>
                      </td>
                      {viewMode === 'advanced' && (
                        <>
                          <td className="p-4">
                            <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                              {order.po_no || '-'}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-gray-700">
                              {order.delivery_date ? formatDate(order.delivery_date) : '-'}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-gray-700">
                              {order.delivery_status || '-'}
                            </span>
                          </td>
                        </>
                      )}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye size={16} />
                          </button>
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <Edit size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Unification Notice */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Settings className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800 mb-2">نظام إدارة الطلبات الموحد</h3>
              <p className="text-green-700 text-sm mb-3">
                تم دمج جميع أنظمة الطلبات (المتجر الأساسي، نظام ERP، التجارة الإلكترونية) في واجهة واحدة موحدة. 
                يمكنك الآن رؤية وإدارة جميع الطلبات من مكان واحد.
              </p>
              <div className="flex gap-3">
                <Link 
                  href="/store/erp/sales-orders"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  أوامر مبيعات ERP
                </Link>
                <Link 
                  href="/store/medusa/orders"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  طلبات التجارة الإلكترونية
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SimpleLayout>
  );
}
