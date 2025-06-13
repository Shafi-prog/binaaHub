'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit, Trash2, ChevronRight, Folder, FolderOpen } from 'lucide-react';
import { Card, LoadingSpinner } from '@/components/ui';
import SimpleLayout from '@/components/layouts/SimpleLayout';
import { verifyTempAuth } from '@/lib/temp-auth';
import { ConstructionCategory } from '@/types/construction';

interface CategoryFormData {
  name_ar: string;
  name_en?: string;
  parent_id?: string;
  sort_order: number;
  is_active: boolean;
}

export default function ConstructionCategoriesPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<ConstructionCategory[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ConstructionCategory | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name_ar: '',
    name_en: '',
    parent_id: '',
    sort_order: 0,
    is_active: true,
  });
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    const loadPage = async () => {
      try {
        const authResult = await verifyTempAuth(5);
        if (!authResult?.user) {
          router.push('/login');
          return;
        }
        setUser(authResult.user);
        await loadCategories();
      } catch (error) {
        console.error('Error loading page:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [router]);

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/construction-categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const openAddForm = (parentId?: string) => {
    setFormData({
      name_ar: '',
      name_en: '',
      parent_id: parentId || '',
      sort_order: 0,
      is_active: true,
    });
    setEditingCategory(null);
    setShowForm(true);
    setErrors({});
  };

  const openEditForm = (category: ConstructionCategory) => {
    setFormData({
      name_ar: category.name_ar,
      name_en: category.name_en || '',
      parent_id: category.parent_id || '',
      sort_order: category.sort_order,
      is_active: category.is_active,
    });
    setEditingCategory(category);
    setShowForm(true);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.name_ar.trim()) {
      newErrors.name_ar = 'اسم الفئة مطلوب';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const url = editingCategory 
        ? `/api/construction-categories/${editingCategory.id}`
        : '/api/construction-categories';
      
      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await loadCategories();
        setShowForm(false);
        alert(editingCategory ? 'تم تحديث الفئة بنجاح!' : 'تم إضافة الفئة بنجاح!');
      } else {
        const error = await response.json();
        alert(`خطأ في حفظ الفئة: ${error.error || 'خطأ غير معروف'}`);
      }
    } catch (error) {
      console.error('Error saving category:', error);
      alert('خطأ في حفظ الفئة');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الفئة؟ سيتم حذف جميع الفئات الفرعية أيضاً.')) {
      return;
    }

    try {
      const response = await fetch(`/api/construction-categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadCategories();
        alert('تم حذف الفئة بنجاح');
      } else {
        const error = await response.json();
        alert(`خطأ في حذف الفئة: ${error.error || 'خطأ غير معروف'}`);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('خطأ في حذف الفئة');
    }
  };

  const renderCategory = (category: ConstructionCategory, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);

    return (
      <div key={category.id} className="space-y-2">
        <div 
          className={`flex items-center justify-between p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow ${
            level > 0 ? 'mr-6' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            {hasChildren && (
              <button
                onClick={() => toggleCategory(category.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                <ChevronRight 
                  className={`w-4 h-4 transition-transform ${
                    isExpanded ? 'rotate-90' : ''
                  }`} 
                />
              </button>
            )}
            
            {!hasChildren && level > 0 && <div className="w-4" />}
            
            <div className="flex items-center gap-2">
              {hasChildren ? (
                <FolderOpen className="w-5 h-5 text-blue-600" />
              ) : (
                <Folder className="w-5 h-5 text-gray-600" />
              )}
              
              <div>
                <h3 className="font-medium text-gray-900">{category.name_ar}</h3>
                {category.name_en && (
                  <p className="text-sm text-gray-500">{category.name_en}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>المستوى: {category.level}</span>
                  <span>المنتجات: {category.product_count || 0}</span>
                  {!category.is_active && (
                    <span className="text-red-600">غير نشط</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openAddForm(category.id)}
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg"
              title="إضافة فئة فرعية"
            >
              <Plus className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => openEditForm(category)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
              title="تعديل"
            >
              <Edit className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => handleDelete(category.id)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
              title="حذف"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Render children */}
        {hasChildren && isExpanded && (
          <div className="space-y-2">
            {category.children!.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/store/construction-products"
              className="inline-flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5 ml-2" />
              العودة للمنتجات
            </Link>
          </div>
          <button
            onClick={() => openAddForm()}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 ml-2" />
            إضافة فئة رئيسية
          </button>
        </div>

        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">فئات مواد البناء</h1>
          <p className="text-gray-600">إدارة التصنيف الهرمي لمواد البناء والتشييد</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الفئات</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
              <Folder className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">الفئات الرئيسية</p>
                <p className="text-2xl font-bold text-green-600">
                  {categories.filter(c => c.level === 0).length}
                </p>
              </div>
              <FolderOpen className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">الفئات النشطة</p>
                <p className="text-2xl font-bold text-purple-600">
                  {categories.filter(c => c.is_active).length}
                </p>
              </div>
              <Folder className="w-8 h-8 text-purple-600" />
            </div>
          </Card>
        </div>

        {/* Categories Tree */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">شجرة الفئات</h2>
            <button
              onClick={() => {
                const allIds = new Set(categories.map(c => c.id));
                setExpandedCategories(
                  expandedCategories.size === allIds.size ? new Set() : allIds
                );
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {expandedCategories.size === categories.length ? 'طي الكل' : 'توسيع الكل'}
            </button>
          </div>

          <div className="space-y-3">
            {categories.filter(c => c.level === 0).map(category => renderCategory(category))}
          </div>

          {categories.length === 0 && (
            <div className="text-center py-8">
              <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد فئات</h3>
              <p className="text-gray-600 mb-4">ابدأ بإضافة فئة رئيسية لمواد البناء</p>
              <button
                onClick={() => openAddForm()}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة أول فئة
              </button>
            </div>
          )}
        </Card>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {editingCategory ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم الفئة (عربي) *
                  </label>
                  <input
                    type="text"
                    value={formData.name_ar}
                    onChange={(e) => setFormData(prev => ({ ...prev, name_ar: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name_ar ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="مثال: أسمنت ومواد البناء"
                  />
                  {errors.name_ar && (
                    <p className="text-red-500 text-sm mt-1">{errors.name_ar}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم الفئة (إنجليزي)
                  </label>
                  <input
                    type="text"
                    value={formData.name_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, name_en: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Example: Cement & Building Materials"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الفئة الأب
                  </label>
                  <select
                    value={formData.parent_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, parent_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">فئة رئيسية</option>
                    {categories.filter(c => c.id !== editingCategory?.id).map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name_ar}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ترتيب العرض
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.sort_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="category_is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="category_is_active" className="mr-2 text-sm font-medium text-gray-700">
                    فئة نشطة
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'جاري الحفظ...' : 'حفظ'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </SimpleLayout>
  );
}
