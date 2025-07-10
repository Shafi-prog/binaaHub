// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Package, Search, Filter, ScanLine, Edit, Trash2, Download } from 'lucide-react';
import { Card, LoadingSpinner } from '@/domains/shared/components/ui';
import SimpleLayout from '@/components/layout/SimpleLayout';

// Force dynamic rendering for this page to avoid SSG issues with auth context
import { verifyTempAuth } from '@/domains/shared/services/temp-auth';
import ProductCatalog from '@/components/construction/ProductCatalog';
import BarcodeScanner from '@/components/barcode/BarcodeScanner';
import { ConstructionProduct, ConstructionCategory } from '@/domains/shared/types/construction';


export const dynamic = 'force-dynamic'
// Force dynamic rendering to avoid SSG auth context issues

export default function ConstructionProductsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ConstructionProduct[]>([]);
  const [categories, setCategories] = useState<ConstructionCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ConstructionProduct | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
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

      // Load products
      const productsResponse = await fetch('/api/construction-products');
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setProducts(productsData.products);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleBarcodeScanned = async (barcode: string) => {
    try {
      const response = await fetch(`/api/construction-products?barcode=${barcode}`);
      if (response.ok) {
        const data = await response.json();
        if (data.products.length > 0) {
          setSelectedProduct(data.products[0]);
          setShowProductForm(true);
        } else {
          alert(`لم يتم العثور على منتج بالباركود: ${barcode}`);
        }
      }
      setShowScanner(false);
    } catch (error) {
      console.error('Error searching by barcode:', error);
      alert('خطأ في البحث عن المنتج');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;

    try {
      const response = await fetch(`/api/construction-products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id !== productId));
        alert('تم حذف المنتج بنجاح');
      } else {
        alert('خطأ في حذف المنتج');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('خطأ في حذف المنتج');
    }
  };

  const exportProducts = () => {
    const csvContent = [
      ['الاسم', 'الباركود', 'الفئة', 'السعر', 'التكلفة', 'المخزون', 'الوحدة'],
      ...products.map(p => [
        p.name_ar,
        p.barcode || '',
        p.category_name || '',
        p.price,
        p.cost,
        p.stock_quantity,
        p.unit
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'construction-products.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode?.includes(searchTerm) ||
      product.category_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      product.category_id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

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
              href="/store/dashboard"
              className="inline-flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5 ml-2" />
              العودة للوحة التحكم
            </Link>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowScanner(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Scan className="w-4 h-4 ml-2" />
              مسح باركود
            </button>
            <button
              onClick={exportProducts}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4 ml-2" />
              تصدير
            </button>
            <Link
              href="/store/construction-products/new"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 ml-2" />
              إضافة منتج
            </Link>
          </div>
        </div>

        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">مواد البناء والتشييد</h1>
          <p className="text-gray-600">إدارة شاملة لمواد البناء مع دعم الباركود السعودي</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المنتجات</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">المنتجات النشطة</p>
                <p className="text-2xl font-bold text-green-600">
                  {products.filter(p => p.is_active).length}
                </p>
              </div>
              <Package className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">مخزون منخفض</p>                <p className="text-2xl font-bold text-orange-600">
                  {products.filter(p => (p.stock_quantity || 0) <= (p.min_stock_level || 0)).length}
                </p>
              </div>
              <Package className="w-8 h-8 text-orange-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الفئات</p>
                <p className="text-2xl font-bold text-purple-600">{categories.length}</p>
              </div>
              <Package className="w-8 h-8 text-purple-600" />
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="البحث في المنتجات (الاسم، الباركود، الفئة...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-48"
              >
                <option value="all">جميع الفئات</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name_ar}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name_ar}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.category_name}</p>
                  {product.barcode && (
                    <p className="text-xs font-mono text-gray-500">
                      باركود: {product.barcode}
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowProductForm(true);
                    }}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">                  <span className="text-sm text-gray-600">السعر:</span>
                  <span className="font-semibold text-green-600">
                    {(product.price || product.selling_price || 0).toLocaleString()} ر.س
                  </span>
                </div>
                
                <div className="flex justify-between items-center">                  <span className="text-sm text-gray-600">المخزون:</span>
                  <span className={`font-semibold ${
                    (product.stock_quantity || 0) <= (product.min_stock_level || 0)
                      ? 'text-red-600' 
                      : 'text-gray-900'
                  }`}>
                    {product.stock_quantity || 0} {product.unit || product.unit_of_measure}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">الحالة:</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    product.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.is_active ? 'نشط' : 'غير نشط'}
                  </span>
                </div>

                {product.supplier_name && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">المورد:</span>
                    <span className="text-sm text-gray-900">{product.supplier_name}</span>
                  </div>
                )}
              </div>

              {product.description_ar && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {product.description_ar}
                </p>
              )}
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <Card className="p-8 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد منتجات</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCategory !== 'all'
                ? 'لم يتم العثور على منتجات تطابق البحث المحدد'
                : 'لا توجد منتجات مضافة حالياً'}
            </p>
            <Link
              href="/store/construction-products/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 ml-2" />
              إضافة أول منتج
            </Link>
          </Card>
        )}

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
                  ×
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


