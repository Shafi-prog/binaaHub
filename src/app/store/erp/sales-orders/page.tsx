'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { ClientIcon } from '@/components/icons';
import SimpleLayout from '@/components/layouts/SimpleLayout';
import { getTempAuthUser, verifyTempAuth } from '@/lib/temp-auth';
import ERPProjectOrderComponent from '@/components/project/ERPProjectOrderComponent';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  ShoppingCart
} from 'lucide-react';

interface ERPSalesOrder {
  id: string;
  name: string;
  customer_id: string;
  store_id: string;
  transaction_date: string;
  delivery_date?: string;
  po_no?: string;
  total_qty: number;
  grand_total: number;
  status: string;
  delivery_status: string;
  billing_status: string;
  per_delivered: number;
  per_billed: number;
  customer_name?: string;
  created_at: string;
  updated_at: string;
}

export default function ERPSalesOrdersPage() {
  const [orders, setOrders] = useState<ERPSalesOrder[]>([]);  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const router = useRouter();

  useEffect(() => {
    loadSalesOrders();
  }, []);

  const loadSalesOrders = async () => {
    try {
      setLoading(true);
      
      // Use temp auth instead of Supabase
      const authResult = await verifyTempAuth(3);
      
      if (!authResult?.user) {
        console.log('❌ [ERP Sales Orders] No authenticated user found');
        router.push('/login');
        return;
      }

      const { user } = authResult;

      // Check if user is a store
      if (user.account_type !== 'store') {
        console.log('❌ [ERP Sales Orders] User is not a store account');
        router.push('/user/dashboard');
        return;
      }

      console.log('✅ [ERP Sales Orders] Store user authenticated:', user.email);
      setCurrentUser(user);

      // Try to fetch sales orders from API, use mock data if not available
      try {
        const response = await fetch(`/api/erp/sales-orders?storeId=${user.id}&limit=100`);        if (response.ok) {
          const result = await response.json();
          setOrders(result.data || []);
        } else {
          console.log('⚠️ [ERP Sales Orders] API not available, using mock data');
          setOrders([]);
        }
      } catch (apiError) {
        console.log('⚠️ [ERP Sales Orders] API error, using fallback data:', apiError);
        setOrders([]);
      }
      
    } catch (err) {
      console.error('❌ [ERP Sales Orders] Error loading sales orders:', err);
      setError(err instanceof Error ? err.message : 'خطأ في تحميل أوامر المبيعات');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = () => {
    setShowCreateModal(true);
  };

  const handleOrderAction = async (orderId: string, action: string) => {
    try {
      const response = await fetch('/api/erp/sales-orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, action })
      });

      if (response.ok) {
        loadSalesOrders(); // Reload orders
      } else {
        throw new Error(`Failed to ${action} order`);
      }
    } catch (err) {
      alert(`فشل في ${action} الطلب`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-emerald-100 text-emerald-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft': return <Clock className="w-4 h-4" />;
      case 'submitted': return <ShoppingCart className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.po_no?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const statuses = [...new Set(orders.map(order => order.status))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <SimpleLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">أوامر المبيعات (ERP)</h1>
              <p className="text-gray-600 mt-1">إدارة شاملة لأوامر المبيعات</p>
            </div>
            <button
              onClick={handleCreateOrder}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              إنشاء أمر مبيعات جديد
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">إجمالي الأوامر</p>
                <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">أوامر مؤكدة</p>
                <p className="text-2xl font-bold text-gray-800">
                  {orders.filter(order => order.status === 'confirmed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">قيد الانتظار</p>
                <p className="text-2xl font-bold text-gray-800">
                  {orders.filter(order => order.status === 'draft' || order.status === 'submitted').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <ClientIcon type="money" size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">إجمالي القيمة</p>
                <p className="text-2xl font-bold text-gray-800">
                  {formatCurrency(
                    orders.reduce((sum, order) => sum + order.grand_total, 0)
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="البحث في الأوامر..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">جميع الحالات</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    رقم الأمر
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    العميل
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تاريخ الأمر
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الكمية
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    إجمالي المبلغ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التسليم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.customer_name || 'عميل غير محدد'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.transaction_date).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.total_qty}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(order.grand_total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${order.per_delivered}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-600">{order.per_delivered}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/store/erp/sales-orders/${order.id}`)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="عرض التفاصيل"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {order.status === 'draft' && (
                          <button
                            onClick={() => handleOrderAction(order.id, 'submit')}
                            className="text-green-600 hover:text-green-900 transition-colors"
                            title="تأكيد الأمر"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        
                        {(order.status === 'draft' || order.status === 'submitted') && (
                          <button
                            onClick={() => handleOrderAction(order.id, 'cancel')}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="إلغاء الأمر"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد أوامر مبيعات</h3>
              <p className="mt-1 text-sm text-gray-500">ابدأ بإنشاء أمر مبيعات جديد</p>
              <div className="mt-6">
                <button
                  onClick={handleCreateOrder}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  إنشاء أمر مبيعات جديد
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Create Order Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">إنشاء أمر مبيعات جديد</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
                <ERPProjectOrderComponent
                projectId="general-order"
                projectName="طلب عام"
                onOrderCreated={() => {
                  setShowCreateModal(false);
                  loadSalesOrders();
                }}
                onCancel={() => setShowCreateModal(false)}
              />
            </div>
          </div>
        )}
      </div>
    </SimpleLayout>
  );
}
