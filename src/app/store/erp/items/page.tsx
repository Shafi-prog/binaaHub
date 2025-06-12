'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/database';
import { LoadingSpinner } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { ClientIcon } from '@/components/icons';
import SimpleLayout from '@/components/layouts/SimpleLayout';
import { Plus, Search, Filter, Edit, Trash2, Package, AlertTriangle } from 'lucide-react';

interface ERPItem {
  id: string;
  item_code: string;
  item_name: string;
  item_group: string;
  stock_uom: string;
  has_variants: boolean;
  is_stock_item: boolean;
  is_purchase_item: boolean;
  is_sales_item: boolean;
  standard_rate: number;
  valuation_rate: number;
  min_order_qty: number;
  safety_stock: number;
  lead_time_days: number;
  warranty_period: number;
  has_batch_no: boolean;
  has_serial_no: boolean;
  shelf_life_in_days?: number;
  end_of_life?: string;
  brand?: string;
  manufacturer?: string;
  description?: string;
  image_url?: string;
  disabled: boolean;
  created_at: string;
  updated_at: string;
}

export default function ERPItemsPage() {
  const [items, setItems] = useState<ERPItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ERPItem | null>(null);
  
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/erp/items?storeId=${session.user.id}&limit=100`);
      if (response.ok) {
        const result = await response.json();
        setItems(result.data || []);
      } else {
        throw new Error('Failed to load items');
      }
    } catch (err) {
      console.error('Error loading items:', err);
      setError(err instanceof Error ? err.message : 'Error loading items');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = () => {
    setEditingItem(null);
    setShowCreateModal(true);
  };

  const handleEditItem = (item: ERPItem) => {
    setEditingItem(item);
    setShowCreateModal(true);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) return;

    try {
      const response = await fetch('/api/erp/items', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemId })
      });

      if (response.ok) {
        setItems(items.filter(item => item.id !== itemId));
      } else {
        throw new Error('Failed to delete item');
      }
    } catch (err) {
      alert('فشل في حذف العنصر');
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.item_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.item_group === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(items.map(item => item.item_group))];

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
              <h1 className="text-2xl font-bold text-gray-800">إدارة العناصر (ERP)</h1>
              <p className="text-gray-600 mt-1">إدارة شاملة لعناصر المخزون</p>
            </div>
            <button
              onClick={handleCreateItem}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              إضافة عنصر جديد
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">إجمالي العناصر</p>
                <p className="text-2xl font-bold text-gray-800">{items.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <ClientIcon type="settings" size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">عناصر نشطة</p>
                <p className="text-2xl font-bold text-gray-800">
                  {items.filter(item => !item.disabled).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">مخزون منخفض</p>
                <p className="text-2xl font-bold text-gray-800">
                  {items.filter(item => item.safety_stock > 0).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <ClientIcon type="chart" size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">متوسط السعر</p>
                <p className="text-2xl font-bold text-gray-800">
                  {formatCurrency(
                    items.reduce((sum, item) => sum + item.standard_rate, 0) / (items.length || 1)
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
                  placeholder="البحث في العناصر..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">جميع الفئات</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    كود العنصر
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    اسم العنصر
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الفئة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    السعر القياسي
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    وحدة القياس
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
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.item_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.item_name}
                            className="w-8 h-8 rounded-lg object-cover ml-3"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center ml-3">
                            <Package className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.item_name}</div>
                          {item.brand && (
                            <div className="text-sm text-gray-500">{item.brand}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.item_group}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.standard_rate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.stock_uom}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          !item.disabled
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {!item.disabled ? 'نشط' : 'معطل'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditItem(item)}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
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

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد عناصر</h3>
              <p className="mt-1 text-sm text-gray-500">ابدأ بإضافة عنصر جديد لمخزونك</p>
              <div className="mt-6">
                <button
                  onClick={handleCreateItem}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  إضافة عنصر جديد
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Item Create/Edit Modal */}
        {showCreateModal && (
          <ItemFormModal
            item={editingItem}
            onClose={() => setShowCreateModal(false)}
            onSave={() => {
              setShowCreateModal(false);
              loadItems();
            }}
          />
        )}
      </div>
    </SimpleLayout>
  );
}

// Item Form Modal Component
function ItemFormModal({ 
  item, 
  onClose, 
  onSave 
}: { 
  item: ERPItem | null; 
  onClose: () => void; 
  onSave: () => void; 
}) {
  const [formData, setFormData] = useState({
    item_code: item?.item_code || '',
    item_name: item?.item_name || '',
    item_group: item?.item_group || 'All Item Groups',
    stock_uom: item?.stock_uom || 'Nos',
    standard_rate: item?.standard_rate || 0,
    valuation_rate: item?.valuation_rate || 0,
    min_order_qty: item?.min_order_qty || 0,
    safety_stock: item?.safety_stock || 0,
    lead_time_days: item?.lead_time_days || 0,
    warranty_period: item?.warranty_period || 0,
    brand: item?.brand || '',
    manufacturer: item?.manufacturer || '',
    description: item?.description || '',
    is_stock_item: item?.is_stock_item ?? true,
    is_purchase_item: item?.is_purchase_item ?? true,
    is_sales_item: item?.is_sales_item ?? true,
    has_batch_no: item?.has_batch_no ?? false,
    has_serial_no: item?.has_serial_no ?? false,
    disabled: item?.disabled ?? false,
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!formData.item_name || !formData.item_code) {
      alert('يرجى ملء الحقول المطلوبة');
      return;
    }

    setSaving(true);
    try {
      const method = item ? 'PATCH' : 'POST';
      const body = item 
        ? { id: item.id, ...formData }
        : formData;

      const response = await fetch('/api/erp/items', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        onSave();
      } else {
        throw new Error('Failed to save item');
      }
    } catch (error) {
      alert('فشل في حفظ العنصر');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {item ? 'تعديل العنصر' : 'إضافة عنصر جديد'}
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                كود العنصر *
              </label>
              <input
                type="text"
                value={formData.item_code}
                onChange={(e) => setFormData({...formData, item_code: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم العنصر *
              </label>
              <input
                type="text"
                value={formData.item_name}
                onChange={(e) => setFormData({...formData, item_name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                فئة العنصر
              </label>
              <input
                type="text"
                value={formData.item_group}
                onChange={(e) => setFormData({...formData, item_group: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                وحدة القياس
              </label>
              <input
                type="text"
                value={formData.stock_uom}
                onChange={(e) => setFormData({...formData, stock_uom: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                السعر القياسي
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.standard_rate}
                onChange={(e) => setFormData({...formData, standard_rate: parseFloat(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                سعر التقييم
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.valuation_rate}
                onChange={(e) => setFormData({...formData, valuation_rate: parseFloat(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                العلامة التجارية
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الشركة المصنعة
              </label>
              <input
                type="text"
                value={formData.manufacturer}
                onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الوصف
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_stock_item}
                onChange={(e) => setFormData({...formData, is_stock_item: e.target.checked})}
                className="ml-2 text-indigo-600"
              />
              عنصر مخزون
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_purchase_item}
                onChange={(e) => setFormData({...formData, is_purchase_item: e.target.checked})}
                className="ml-2 text-indigo-600"
              />
              عنصر شراء
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_sales_item}
                onChange={(e) => setFormData({...formData, is_sales_item: e.target.checked})}
                className="ml-2 text-indigo-600"
              />
              عنصر مبيعات
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.has_batch_no}
                onChange={(e) => setFormData({...formData, has_batch_no: e.target.checked})}
                className="ml-2 text-indigo-600"
              />
              رقم دفعة
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.has_serial_no}
                onChange={(e) => setFormData({...formData, has_serial_no: e.target.checked})}
                className="ml-2 text-indigo-600"
              />
              رقم مسلسل
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
            {saving ? 'جاري الحفظ...' : (item ? 'تحديث' : 'إضافة')}
          </button>
        </div>
      </div>
    </div>
  );
}
