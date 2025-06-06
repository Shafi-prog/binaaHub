'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { Card, LoadingSpinner, EmptyState } from '@/components/ui';
import { verifyAuthWithRetry } from '@/lib/auth-recovery';
import { formatCurrency } from '@/lib/utils';

interface Product {
  id: string;
  store_id: string;
  name: string;
  description: string | null;
  barcode: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

interface ProductFormData {
  name: string;
  description: string;
  barcode: string;
  price: string;
  stock: string;
  image_url: string;
}

export default function ProductsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    barcode: '',
    price: '',
    stock: '',
    image_url: '',
  });
  const [formError, setFormError] = useState<string | null>(null);

  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verify authentication
        const authResult = await verifyAuthWithRetry(3);
        if (authResult.error || !authResult.user) {
          console.error('❌ [Products] Authentication failed');
          router.push('/login');
          return;
        }

        setUser(authResult.user);

        // Fetch products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('store_id', authResult.user.id)
          .order('created_at', { ascending: false });

        if (productsError) {
          throw productsError;
        }

        setProducts(productsData || []);
      } catch (error) {
        console.error('❌ [Products] Error loading data:', error);
        setError('حدث خطأ في تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase, router]);

  // --- Product Management UI Improvements ---
  // Quick stats
  const totalProducts = products.length;
  const inStock = products.filter((p) => p.stock > 0).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;
  // Search/filter state
  const [search, setSearch] = useState('');
  // --- Advanced Filters State ---
  const [stockFilter, setStockFilter] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const filteredProducts = products.filter((p) => {
    if (stockFilter === 'in' && p.stock <= 0) return false;
    if (stockFilter === 'out' && p.stock > 0) return false;
    if (minPrice && p.price < Number(minPrice)) return false;
    if (maxPrice && p.price > Number(maxPrice)) return false;
    return (
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (p.barcode?.toLowerCase().includes(search.toLowerCase()) ?? false)
    );
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setFormError('اسم المنتج مطلوب');
      return false;
    }
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      setFormError('يرجى إدخال سعر صحيح');
      return false;
    }
    if (!formData.stock || isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      setFormError('يرجى إدخال كمية صحيحة');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !validateForm()) return;

    setSaving(true);
    setFormError(null);

    try {
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        barcode: formData.barcode.trim() || null,
        price: Number(formData.price),
        stock: Number(formData.stock),
        image_url: formData.image_url.trim() || null,
        store_id: user.id,
        updated_at: new Date().toISOString(),
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;

        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? { ...p, ...productData } : p))
        );
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert([{ ...productData, created_at: new Date().toISOString() }])
          .select()
          .single();

        if (error) throw error;
        if (data) setProducts((prev) => [data, ...prev]);
      }

      // Reset form
      setFormData({
        name: '',
        description: '',
        barcode: '',
        price: '',
        stock: '',
        image_url: '',
      });
      setShowAddForm(false);
      setEditingProduct(null);
    } catch (error: any) {
      console.error('❌ [Products] Error saving product:', error);
      setFormError('حدث خطأ في حفظ المنتج. يرجى المحاولة مرة أخرى.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      barcode: product.barcode || '',
      price: product.price.toString(),
      stock: product.stock.toString(),
      image_url: product.image_url || '',
    });
    setShowAddForm(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;

    try {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) throw error;

      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (error) {
      console.error('❌ [Products] Error deleting product:', error);
      alert('حدث خطأ في حذف المنتج');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      barcode: '',
      price: '',
      stock: '',
      image_url: '',
    });
    setShowAddForm(false);
    setEditingProduct(null);
    setFormError(null);
  };

  // --- Bulk Actions State ---
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const allSelected = filteredProducts.length > 0 && filteredProducts.every((p) => selectedProducts.includes(p.id));
  const toggleSelectAll = () => {
    if (allSelected) setSelectedProducts([]);
    else setSelectedProducts(filteredProducts.map((p) => p.id));
  };
  const toggleSelectProduct = (id: string) => {
    setSelectedProducts((prev) => prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]);
  };
  const handleBulkDelete = async () => {
    if (!selectedProducts.length) return;
    if (!confirm('هل أنت متأكد من حذف المنتجات المحددة؟')) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('products').delete().in('id', selectedProducts);
      if (error) throw error;
      setProducts((prev) => prev.filter((p) => !selectedProducts.includes(p.id)));
      setSelectedProducts([]);
    } catch (error) {
      alert('حدث خطأ في حذف المنتجات المحددة');
    } finally {
      setSaving(false);
    }
  };

  // --- Export to CSV ---
  function exportToCSV(data: Product[]) {
    const csvRows = [
      ['ID', 'Name', 'Description', 'Barcode', 'Price', 'Stock', 'Image URL', 'Created At', 'Updated At'],
      ...data.map((p) => [p.id, p.name, p.description, p.barcode, p.price, p.stock, p.image_url, p.created_at, p.updated_at]),
    ];
    const csvContent = csvRows.map((row) => row.map((v) => '"' + (v ?? '') + '"').join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-tajawal">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">إدارة المنتجات</h1>
            <p className="text-gray-600">إضافة وإدارة منتجات متجرك</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/store/dashboard"
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              العودة للوحة التحكم
            </Link>
            <Link
              href="/store/products/import"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              استيراد Excel
            </Link>
            <Link
              href="/barcode-scanner"
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              ماسح الباركود
            </Link>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              إضافة منتج جديد
            </button>
          </div>
        </div>

        {error && <div className="mb-6 p-4 text-red-700 bg-red-100 rounded-md">{error}</div>}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-700">{totalProducts}</div>
            <div className="text-sm text-gray-700">إجمالي المنتجات</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-700">{inStock}</div>
            <div className="text-sm text-gray-700">منتجات متوفرة</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-700">{outOfStock}</div>
            <div className="text-sm text-gray-700">منتجات منتهية</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="ابحث باسم المنتج أو الباركود..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Bulk Actions & Export */}
        <div className="flex flex-wrap gap-4 mb-4 items-center">
          <button
            onClick={handleBulkDelete}
            disabled={!selectedProducts.length || saving}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            حذف المنتجات المحددة ({selectedProducts.length})
          </button>
          <button
            onClick={() => exportToCSV(filteredProducts)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            تصدير إلى CSV
          </button>
        </div>

        {/* Advanced Filters */}
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="all">كل المنتجات</option>
            <option value="in">المتوفر فقط</option>
            <option value="out">المنتهي فقط</option>
          </select>
          <input
            type="number"
            placeholder="السعر الأدنى"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="px-3 py-2 border rounded-lg w-32"
          />
          <input
            type="number"
            placeholder="السعر الأعلى"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="px-3 py-2 border rounded-lg w-32"
          />
        </div>

        {/* Add/Edit Product Form */}
        {showAddForm && (
          <Card className="mb-8">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
                </h2>
                <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {formError && (
                <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">{formError}</div>
              )}

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم المنتج *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الباركود</label>
                  <input
                    type="text"
                    name="barcode"
                    value={formData.barcode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    السعر (ريال) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الكمية في المخزن *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رابط الصورة
                  </label>
                  <input
                    type="url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">وصف المنتج</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2 flex gap-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    {saving ? 'جاري الحفظ...' : editingProduct ? 'تحديث المنتج' : 'إضافة المنتج'}
                  </button>
                </div>
              </form>
            </div>
          </Card>
        )}

        {/* Products List */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">منتجات المتجر</h2>
            {filteredProducts.length === 0 ? (
              <EmptyState
                title="لا توجد منتجات"
                description="ابدأ بإضافة منتجات لمتجرك لتتمكن من استقبال الطلبات"
                actionLabel="إضافة منتج جديد"
                onAction={() => setShowAddForm(true)}
              />
            ) : (
              <div>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="mr-2"
                  />
                  <span className="text-sm">تحديد الكل</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow relative ${selectedProducts.includes(product.id) ? 'ring-2 ring-blue-400' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleSelectProduct(product.id)}
                        className="absolute top-2 left-2 z-10"
                      />
                      {product.image_url && (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}

                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-800">{product.name}</h3>

                        {product.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                        )}

                        <div className="flex justify-between items-center text-sm">
                          <span className="text-lg font-bold text-green-600">
                            {formatCurrency(product.price)}
                          </span>
                          <span
                            className={`px-2 py-1 rounded ${
                              product.stock > 10
                                ? 'bg-green-100 text-green-800'
                                : product.stock > 0
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {product.stock} في المخزن
                          </span>
                        </div>

                        {product.barcode && (
                          <p className="text-xs text-gray-500">الباركود: {product.barcode}</p>
                        )}

                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-3 rounded transition-colors"
                          >
                            تعديل
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-3 rounded transition-colors"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
