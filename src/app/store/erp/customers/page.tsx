'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/database';
import { LoadingSpinner } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { ClientIcon } from '@/components/icons';
import SimpleLayout from '@/components/layouts/SimpleLayout';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Users, 
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Building
} from 'lucide-react';

interface ERPCustomer {
  id: string;
  name: string;
  customer_name: string;
  customer_type: string;
  customer_group: string;
  territory: string;
  gender?: string;
  default_currency: string;
  is_internal_customer: boolean;
  is_frozen: boolean;
  disabled: boolean;
  customer_details?: string;
  market_segment?: string;
  industry?: string;
  website?: string;
  language: string;
  customer_credit_limit: number;
  bypass_credit_limit_check: boolean;
  created_at: string;
  updated_at: string;
}

export default function ERPCustomersPage() {
  const [customers, setCustomers] = useState<ERPCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<ERPCustomer | null>(null);
  
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/erp/customers?storeId=${session.user.id}&limit=100`);
      if (response.ok) {
        const result = await response.json();
        setCustomers(result.data || []);
      } else {
        throw new Error('Failed to load customers');
      }
    } catch (err) {
      console.error('Error loading customers:', err);
      setError(err instanceof Error ? err.message : 'Error loading customers');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = () => {
    setEditingCustomer(null);
    setShowCreateModal(true);
  };

  const handleEditCustomer = (customer: ERPCustomer) => {
    setEditingCustomer(customer);
    setShowCreateModal(true);
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العميل؟')) return;

    try {
      const response = await fetch('/api/erp/customers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: customerId })
      });

      if (response.ok) {
        setCustomers(customers.filter(customer => customer.id !== customerId));
      } else {
        throw new Error('Failed to delete customer');
      }
    } catch (err) {
      alert('فشل في حذف العميل');
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = !selectedGroup || customer.customer_group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const customerGroups = [...new Set(customers.map(customer => customer.customer_group))];

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
              <h1 className="text-2xl font-bold text-gray-800">إدارة العملاء (ERP)</h1>
              <p className="text-gray-600 mt-1">إدارة شاملة لبيانات العملاء</p>
            </div>
            <button
              onClick={handleCreateCustomer}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              إضافة عميل جديد
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">إجمالي العملاء</p>
                <p className="text-2xl font-bold text-gray-800">{customers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <ClientIcon type="shield" size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">عملاء نشطون</p>
                <p className="text-2xl font-bold text-gray-800">
                  {customers.filter(customer => !customer.disabled && !customer.is_frozen).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Building className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">عملاء شركات</p>
                <p className="text-2xl font-bold text-gray-800">
                  {customers.filter(customer => customer.customer_type === 'Company').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">حد ائتماني متوسط</p>
                <p className="text-2xl font-bold text-gray-800">
                  {formatCurrency(
                    customers.reduce((sum, customer) => sum + customer.customer_credit_limit, 0) / (customers.length || 1)
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
                  placeholder="البحث في العملاء..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">جميع المجموعات</option>
                {customerGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    اسم العميل
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    نوع العميل
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المجموعة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المنطقة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    حد الائتمان
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
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center ml-3">
                          <Users className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{customer.customer_name}</div>
                          <div className="text-sm text-gray-500">{customer.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        customer.customer_type === 'Company' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {customer.customer_type === 'Company' ? 'شركة' : 'فرد'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.customer_group}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.territory}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(customer.customer_credit_limit)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            !customer.disabled && !customer.is_frozen
                              ? 'bg-green-100 text-green-800'
                              : customer.is_frozen
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {!customer.disabled && !customer.is_frozen 
                            ? 'نشط' 
                            : customer.is_frozen 
                              ? 'مجمد' 
                              : 'معطل'
                          }
                        </span>
                        {customer.is_internal_customer && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                            عميل داخلي
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditCustomer(customer)}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(customer.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد عملاء</h3>
              <p className="mt-1 text-sm text-gray-500">ابدأ بإضافة عميل جديد</p>
              <div className="mt-6">
                <button
                  onClick={handleCreateCustomer}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  إضافة عميل جديد
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Customer Create/Edit Modal */}
        {showCreateModal && (
          <CustomerFormModal
            customer={editingCustomer}
            onClose={() => setShowCreateModal(false)}
            onSave={() => {
              setShowCreateModal(false);
              loadCustomers();
            }}
          />
        )}
      </div>
    </SimpleLayout>
  );
}

// Customer Form Modal Component
function CustomerFormModal({ 
  customer, 
  onClose, 
  onSave 
}: { 
  customer: ERPCustomer | null; 
  onClose: () => void; 
  onSave: () => void; 
}) {
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    customer_name: customer?.customer_name || '',
    customer_type: customer?.customer_type || 'Individual',
    customer_group: customer?.customer_group || 'All Customer Groups',
    territory: customer?.territory || 'All Territories',
    gender: customer?.gender || '',
    default_currency: customer?.default_currency || 'USD',
    market_segment: customer?.market_segment || '',
    industry: customer?.industry || '',
    website: customer?.website || '',
    language: customer?.language || 'en',
    customer_credit_limit: customer?.customer_credit_limit || 0,
    is_internal_customer: customer?.is_internal_customer ?? false,
    is_frozen: customer?.is_frozen ?? false,
    disabled: customer?.disabled ?? false,
    bypass_credit_limit_check: customer?.bypass_credit_limit_check ?? false,
    customer_details: customer?.customer_details || '',
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!formData.customer_name) {
      alert('يرجى ملء اسم العميل');
      return;
    }

    // Generate name if not provided
    if (!formData.name) {
      formData.name = formData.customer_name.replace(/\s+/g, '-').toLowerCase();
    }

    setSaving(true);
    try {
      const method = customer ? 'PATCH' : 'POST';
      const body = customer 
        ? { id: customer.id, ...formData }
        : formData;

      const response = await fetch('/api/erp/customers', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        onSave();
      } else {
        throw new Error('Failed to save customer');
      }
    } catch (error) {
      alert('فشل في حفظ العميل');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {customer ? 'تعديل العميل' : 'إضافة عميل جديد'}
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم العميل *
              </label>
              <input
                type="text"
                value={formData.customer_name}
                onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                المعرف الفريد
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="سيتم إنشاؤه تلقائياً"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نوع العميل
              </label>
              <select
                value={formData.customer_type}
                onChange={(e) => setFormData({...formData, customer_type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Individual">فرد</option>
                <option value="Company">شركة</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                مجموعة العملاء
              </label>
              <input
                type="text"
                value={formData.customer_group}
                onChange={(e) => setFormData({...formData, customer_group: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                المنطقة
              </label>
              <input
                type="text"
                value={formData.territory}
                onChange={(e) => setFormData({...formData, territory: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الجنس
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">غير محدد</option>
                <option value="Male">ذكر</option>
                <option value="Female">أنثى</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                العملة الافتراضية
              </label>
              <select
                value={formData.default_currency}
                onChange={(e) => setFormData({...formData, default_currency: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="USD">دولار أمريكي (USD)</option>
                <option value="SAR">ريال سعودي (SAR)</option>
                <option value="EUR">يورو (EUR)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                حد الائتمان
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.customer_credit_limit}
                onChange={(e) => setFormData({...formData, customer_credit_limit: parseFloat(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                قطاع السوق
              </label>
              <input
                type="text"
                value={formData.market_segment}
                onChange={(e) => setFormData({...formData, market_segment: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الصناعة
              </label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({...formData, industry: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الموقع الإلكتروني
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اللغة
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({...formData, language: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              تفاصيل العميل
            </label>
            <textarea
              value={formData.customer_details}
              onChange={(e) => setFormData({...formData, customer_details: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_internal_customer}
                onChange={(e) => setFormData({...formData, is_internal_customer: e.target.checked})}
                className="ml-2 text-indigo-600"
              />
              عميل داخلي
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_frozen}
                onChange={(e) => setFormData({...formData, is_frozen: e.target.checked})}
                className="ml-2 text-indigo-600"
              />
              مجمد
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.disabled}
                onChange={(e) => setFormData({...formData, disabled: e.target.checked})}
                className="ml-2 text-indigo-600"
              />
              معطل
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.bypass_credit_limit_check}
                onChange={(e) => setFormData({...formData, bypass_credit_limit_check: e.target.checked})}
                className="ml-2 text-indigo-600"
              />
              تجاوز حد الائتمان
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'جاري الحفظ...' : (customer ? 'تحديث' : 'إضافة')}
          </button>
        </div>
      </div>
    </div>
  );
}
