'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Card, LoadingSpinner } from '@/components/ui';
import { verifyAuthWithRetry } from '@/lib/auth-recovery';
import { ArrowRight, Shield } from 'lucide-react';

interface Warranty {
  id: string;
  user_id: string;
  warranty_number: string;
  product_name: string;
  brand?: string;
  model?: string;
  serial_number?: string;
  purchase_date: string;
  warranty_start_date: string;
  warranty_end_date: string;
  warranty_period_months: number;
  warranty_type: 'manufacturer' | 'extended' | 'store' | 'custom';
  coverage_description?: string;
  status: 'active' | 'expired' | 'claimed' | 'void';
  is_transferable: boolean;
  claim_count: number;
  vendor_name?: string;
  vendor_contact?: string;
  created_at: string;
  updated_at: string;
}

interface WarrantyFormData {
  product_name: string;
  brand: string;
  model: string;
  serial_number: string;
  purchase_date: string;
  warranty_period_months: number;
  warranty_type: 'manufacturer' | 'extended' | 'store' | 'custom';
  coverage_description: string;
  is_transferable: boolean;
  vendor_name: string;
  vendor_contact: string;
}

export default function NewWarrantyPage() {
  const [formData, setFormData] = useState<WarrantyFormData>({
    product_name: '',
    brand: '',
    model: '',
    serial_number: '',
    purchase_date: '',
    warranty_period_months: 12,
    warranty_type: 'manufacturer',
    coverage_description: '',
    is_transferable: false,
    vendor_name: '',
    vendor_contact: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      // Verify auth first
      const authResult = await verifyAuthWithRetry();
      if (authResult.error || !authResult.user) {
        console.error('❌ [NewWarranty] Authentication failed');
        router.push('/login');
        return;
      }

      // Calculate warranty dates
      const purchaseDate = new Date(formData.purchase_date);
      const warrantyStartDate = new Date(purchaseDate);
      const warrantyEndDate = new Date(purchaseDate);
      warrantyEndDate.setMonth(warrantyEndDate.getMonth() + formData.warranty_period_months);

      // Generate a warranty number (you might want to make this more sophisticated)
      const warrantyNumber = `WAR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const newWarranty = {
        user_id: authResult.user.id,
        warranty_number: warrantyNumber,
        ...formData,
        warranty_start_date: warrantyStartDate.toISOString(),
        warranty_end_date: warrantyEndDate.toISOString(),
        status: 'active',
        claim_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error: insertError } = await supabase.from('warranties').insert([newWarranty]);

      if (insertError) throw insertError;

      console.log('✅ [NewWarranty] Warranty created successfully');
      router.push('/user/warranties');
      router.refresh();
    } catch (error) {
      console.error('Error creating warranty:', error);
      setError('حدث خطأ في إنشاء الضمان. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <main className="p-4 space-y-6 max-w-3xl mx-auto">
      {' '}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">إضافة ضمان جديد</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/user/warranties')}
            className="bg-white text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 border border-gray-300 flex items-center gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            العودة للضمانات
          </button>
        </div>
      </div>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              معلومات المنتج
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="product_name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  اسم المنتج*
                </label>
                <input
                  type="text"
                  id="product_name"
                  name="product_name"
                  required
                  value={formData.product_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                  العلامة التجارية
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                  الموديل
                </label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="serial_number"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  الرقم التسلسلي
                </label>
                <input
                  type="text"
                  id="serial_number"
                  name="serial_number"
                  value={formData.serial_number}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Warranty Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">معلومات الضمان</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="purchase_date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  تاريخ الشراء*
                </label>
                <input
                  type="date"
                  id="purchase_date"
                  name="purchase_date"
                  required
                  value={formData.purchase_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="warranty_period_months"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  مدة الضمان (بالأشهر)*
                </label>
                <input
                  type="number"
                  id="warranty_period_months"
                  name="warranty_period_months"
                  required
                  min="1"
                  value={formData.warranty_period_months}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="warranty_type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  نوع الضمان*
                </label>
                <select
                  id="warranty_type"
                  name="warranty_type"
                  required
                  value={formData.warranty_type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="manufacturer">ضمان الشركة المصنعة</option>
                  <option value="extended">ضمان ممتد</option>
                  <option value="store">ضمان المتجر</option>
                  <option value="custom">ضمان مخصص</option>
                </select>
              </div>

              <div>
                <label className="flex items-center space-x-3 space-x-reverse mt-6">
                  <input
                    type="checkbox"
                    id="is_transferable"
                    name="is_transferable"
                    checked={formData.is_transferable}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">الضمان قابل للتحويل</span>
                </label>
              </div>
            </div>

            <div>
              <label
                htmlFor="coverage_description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                تفاصيل التغطية
              </label>
              <textarea
                id="coverage_description"
                name="coverage_description"
                rows={3}
                value={formData.coverage_description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="اكتب تفاصيل ما يغطيه الضمان..."
              />
            </div>
          </div>

          {/* Vendor Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">معلومات المورد</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="vendor_name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  اسم المورد
                </label>
                <input
                  type="text"
                  id="vendor_name"
                  name="vendor_name"
                  value={formData.vendor_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="vendor_contact"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  معلومات الاتصال بالمورد
                </label>
                <input
                  type="text"
                  id="vendor_contact"
                  name="vendor_contact"
                  value={formData.vendor_contact}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="رقم الهاتف أو البريد الإلكتروني"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:bg-gray-400"
            >
              {loading ? (
                <>
                  <LoadingSpinner className="w-5 h-5" />
                  جاري الإنشاء...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  إنشاء الضمان
                </>
              )}
            </button>
          </div>
        </form>
      </Card>
    </main>
  );
}
