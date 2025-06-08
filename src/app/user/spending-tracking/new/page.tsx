'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Card, LoadingSpinner } from '@/components/ui';
import { verifyAuthWithRetry } from '@/lib/auth-recovery';
import { ArrowRight, DollarSign } from 'lucide-react';
import type { ConstructionCategory, ConstructionExpense } from '@/types/spending-tracking';

interface ExpenseFormData {
  title: string;
  description: string;
  amount: number;
  currency: string;
  expense_date: string;
  category_id: string;
  is_budgeted: boolean;
  vendor: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
}

export default function NewExpensePage() {
  const [formData, setFormData] = useState<ExpenseFormData>({
    title: '',
    description: '',
    amount: 0,
    currency: 'SAR',
    expense_date: new Date().toISOString().split('T')[0],
    category_id: '',
    is_budgeted: true,
    vendor: '',
    status: 'pending',
  });

  const [categories, setCategories] = useState<ConstructionCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data: categoriesData, error } = await supabase
          .from('construction_categories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (error) throw error;
        setCategories(categoriesData || []);
      } catch (error) {
        console.error('Error loading categories:', error);
        setError('حدث خطأ في تحميل الفئات');
      }
    };

    loadCategories();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      // Verify auth first
      const authResult = await verifyAuthWithRetry();
      if (authResult.error || !authResult.user) {
        console.error('❌ [NewExpense] Authentication failed');
        router.push('/login');
        return;
      }

      const newExpense = {
        user_id: authResult.user.id,
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: authResult.user.id,
      };

      const { error: insertError } = await supabase
        .from('construction_expenses')
        .insert([newExpense]);

      if (insertError) throw insertError;

      console.log('✅ [NewExpense] Expense created successfully');
      router.push('/user/spending-tracking');
      router.refresh();
    } catch (error) {
      console.error('Error creating expense:', error);
      setError('حدث خطأ في إنشاء المصروف. يرجى المحاولة مرة أخرى.');
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
        <h1 className="text-3xl font-bold text-gray-900">إضافة مصروف جديد</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/user/spending-tracking')}
            className="bg-white text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 border border-gray-300 flex items-center gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            العودة للمصروفات
          </button>
        </div>
      </div>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              معلومات المصروف
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  عنوان المصروف*
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="category_id"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  الفئة*
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  required
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">اختر الفئة</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name_ar || category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  المبلغ*
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  required
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                  العملة*
                </label>
                <select
                  id="currency"
                  name="currency"
                  required
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="SAR">ريال سعودي</option>
                  <option value="USD">دولار أمريكي</option>
                  <option value="EUR">يورو</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="expense_date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  تاريخ المصروف*
                </label>
                <input
                  type="date"
                  id="expense_date"
                  name="expense_date"
                  required
                  value={formData.expense_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  حالة الدفع*
                </label>
                <select
                  id="status"
                  name="status"
                  required
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">معلق</option>
                  <option value="paid">مدفوع</option>
                  <option value="overdue">متأخر</option>
                  <option value="cancelled">ملغي</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                الوصف
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="اكتب وصفاً تفصيلياً للمصروف..."
              />
            </div>

            <div>
              <label htmlFor="vendor" className="block text-sm font-medium text-gray-700 mb-1">
                المورد
              </label>
              <input
                type="text"
                id="vendor"
                name="vendor"
                value={formData.vendor}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="اسم المورد أو الشركة..."
              />
            </div>

            <div>
              <label className="flex items-center space-x-3 space-x-reverse">
                <input
                  type="checkbox"
                  id="is_budgeted"
                  name="is_budgeted"
                  checked={formData.is_budgeted}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  مصروف مخطط له (ضمن الميزانية)
                </span>
              </label>
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
                  <DollarSign className="w-5 h-5" />
                  إنشاء المصروف
                </>
              )}
            </button>
          </div>
        </form>
      </Card>
    </main>
  );
}
