// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Scan, Camera, Plus, X } from 'lucide-react';
import { Card, LoadingSpinner } from '@/core/shared/components/ui';
import SimpleLayout from '@/components/layout/SimpleLayout';
import { verifyTempAuth } from '@/core/shared/services/temp-auth';
import BarcodeScanner from '@/components/barcode/BarcodeScanner';
import { ConstructionCategory, Supplier, ProductFormData } from '@/core/shared/types/construction';


export const dynamic = 'force-dynamic'
// Force dynamic rendering to avoid SSG auth context issues


export default function NewConstructionProductPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<ConstructionCategory[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    name_ar: '',
    category_id: '',
    price: 0,
    cost: 0,
    stock_quantity: 0,
    min_stock_level: 5,
    unit: 'قطعة',
    is_active: true,
  });
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const router = useRouter();

  const units = [
    'قطعة', 'متر', 'متر مربع', 'متر مكعب', 'كيلوجرام', 'طن', 'لتر', 'جالون',
    'كيس', 'علبة', 'صندوق', 'لوح', 'حبة', 'زجاجة', 'عبوة'
  ];

  useEffect(() => {
    const loadPage = async () => {
      try {
        const authResult = await verifyTempAuth(5);
        if (!authResult?.user) {
          router.push('/login');
          return;
        }
        setUser(authResult.user);
        await loadData();
      } catch (error) {
        console.error('Error loading page:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    loadPage().catch(error => {
      console.error('Error in loadPage:', error);
      setLoading(false);
      router.push('/login');
    });
  }, [router]);

  const loadData = async () => {
    try {
      // Load categories
      const categoriesResponse = await fetch('/api/construction-categories');
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.categories);
      }

      // Load suppliers (if exists in your system)
      try {
        const suppliersResponse = await fetch('/api/suppliers');
        if (suppliersResponse.ok) {
          const suppliersData = await suppliersResponse.json();
          setSuppliers(suppliersData.suppliers || []);
        }
      } catch (e) {
        // Suppliers might not exist yet
        console.log('Suppliers not available');
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleBarcodeScanned = (barcode: string) => {
    setFormData(prev => ({ ...prev, barcode }));
    setShowScanner(false);
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.name_ar?.trim()) {
      newErrors.name_ar = 'اسم المنتج مطلوب';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'فئة المنتج مطلوبة';
    }

    if ((formData.price || 0) <= 0) {
      newErrors.price = 'السعر يجب أن يكون أكبر من صفر';
    }

    if ((formData.cost || 0) < 0) {
      newErrors.cost = 'التكلفة لا يمكن أن تكون سالبة';
    }

    if ((formData.stock_quantity || 0) < 0) {
      newErrors.stock_quantity = 'كمية المخزون لا يمكن أن تكون سالبة';
    }

    if ((formData.min_stock_level || 0) < 0) {
      newErrors.min_stock_level = 'الحد الأدنى للمخزون لا يمكن أن يكون سالباً';
    }

    // Validate Saudi barcode format if provided
    if (formData.barcode && !isValidSaudiBarcode(formData.barcode)) {
      newErrors.barcode = 'تنسيق الباركود السعودي غير صحيح';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidSaudiBarcode = (barcode: string): boolean => {
    // Saudi barcodes typically start with 628 and are 13 digits total
    const saudiPrefix = /^628\d{10}$/;
    return saudiPrefix.test(barcode) || /^\d{8,14}$/.test(barcode); // Also allow standard formats
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/construction-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          store_id: user.id,
        }),
      });

      if (response.ok) {
        alert('تم إضافة المنتج بنجاح!');
        router.push('/store/construction-products');
      } else {
        const error = await response.json();
        alert(`خطأ في إضافة المنتج: ${error.error || 'خطأ غير معروف'}`);
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('خطأ في إضافة المنتج');
    } finally {
      setSaving(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <SimpleLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/store/construction-products"
              className="inline-flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5 ml-2" />
              العودة للمنتجات
            </Link>
          </div>
        </div>

        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إضافة منتج بناء جديد</h1>
          <p className="text-gray-600">أضف منتج بناء جديد مع دعم الباركود السعودي والمواصفات التقنية</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">المعلومات الأساسية</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم المنتج (عربي) *
                </label>
                <input
                  type="text"
                  value={formData.name_ar}
                  onChange={(e) => updateFormData('name_ar', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name_ar ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="مثال: أسمنت مقاوم"
                />
                {errors.name_ar && (
                  <p className="text-red-500 text-sm mt-1">{errors.name_ar}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم المنتج (إنجليزي)
                </label>
                <input
                  type="text"
                  value={formData.name_en || ''}
                  onChange={(e) => updateFormData('name_en', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Example: Resistant Cement"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وصف المنتج (عربي)
              </label>
              <textarea
                value={formData.description_ar || ''}
                onChange={(e) => updateFormData('description_ar', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="وصف تفصيلي للمنتج ومواصفاته..."
              />
            </div>
          </Card>

          {/* Category and Classification */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">التصنيف والفئة</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  فئة المنتج *
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => updateFormData('category_id', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.category_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">اختر الفئة</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name_ar}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  كود البناء السعودي
                </label>
                <input
                  type="text"
                  value={formData.saudi_building_code || ''}
                  onChange={(e) => updateFormData('saudi_building_code', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="SBC-XXX-XXXX"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الباركود
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.barcode || ''}
                  onChange={(e) => updateFormData('barcode', e.target.value)}
                  className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.barcode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="628XXXXXXXXXX (باركود سعودي)"
                />
                <button
                  type="button"
                  onClick={() => setShowScanner(true)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Scan className="w-4 h-4" />
                </button>
              </div>
              {errors.barcode && (
                <p className="text-red-500 text-sm mt-1">{errors.barcode}</p>
              )}
            </div>
          </Card>

          {/* Pricing and Stock */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">التسعير والمخزون</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  السعر (ر.س) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => updateFormData('price', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التكلفة (ر.س)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.cost}
                  onChange={(e) => updateFormData('cost', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.cost ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.cost && (
                  <p className="text-red-500 text-sm mt-1">{errors.cost}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  كمية المخزون
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock_quantity}
                  onChange={(e) => updateFormData('stock_quantity', parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.stock_quantity ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.stock_quantity && (
                  <p className="text-red-500 text-sm mt-1">{errors.stock_quantity}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحد الأدنى للمخزون
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.min_stock_level}
                  onChange={(e) => updateFormData('min_stock_level', parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.min_stock_level ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.min_stock_level && (
                  <p className="text-red-500 text-sm mt-1">{errors.min_stock_level}</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وحدة القياس
              </label>
              <select
                value={formData.unit}
                onChange={(e) => updateFormData('unit', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </Card>

          {/* Dimensions */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">الأبعاد والقياسات</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الطول (سم)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.dimensions?.length || ''}
                  onChange={(e) => updateFormData('dimensions', {
                    ...formData.dimensions,
                    length: parseFloat(e.target.value) || undefined
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العرض (سم)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.dimensions?.width || ''}
                  onChange={(e) => updateFormData('dimensions', {
                    ...formData.dimensions,
                    width: parseFloat(e.target.value) || undefined
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الارتفاع (سم)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.dimensions?.height || ''}
                  onChange={(e) => updateFormData('dimensions', {
                    ...formData.dimensions,
                    height: parseFloat(e.target.value) || undefined
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوزن (كجم)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.dimensions?.weight || ''}
                  onChange={(e) => updateFormData('dimensions', {
                    ...formData.dimensions,
                    weight: parseFloat(e.target.value) || undefined
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </Card>

          {/* Supplier */}
          {suppliers.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">المورد</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اختر المورد
                </label>
                <select
                  value={formData.supplier_id || ''}
                  onChange={(e) => updateFormData('supplier_id', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">لا يوجد مورد محدد</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>
            </Card>
          )}

          {/* Status */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">الحالة</h2>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => updateFormData('is_active', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="is_active" className="mr-2 text-sm font-medium text-gray-700">
                منتج نشط ومتاح للبيع
              </label>
            </div>
          </Card>

          {/* Form Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <LoadingSpinner />
              ) : (
                <>
                  <Save className="w-5 h-5 ml-2" />
                  حفظ المنتج
                </>
              )}
            </button>

            <Link
              href="/store/construction-products"
              className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              إلغاء
            </Link>
          </div>
        </form>

        {/* Barcode Scanner Modal */}
        {showScanner && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">مسح الباركود</h3>
                <button
                  onClick={() => setShowScanner(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <BarcodeScanner 
                onScan={handleBarcodeScanned} 
                onClose={() => setShowScanner(false)}
              />
            </div>
          </div>
        )}
      </div>
    </SimpleLayout>
  );
}


