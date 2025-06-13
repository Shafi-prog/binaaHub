'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { ClientIcon } from '@/components/icons';
import SimpleLayout from '@/components/layouts/SimpleLayout';
import { Plus, Search, Filter, Edit, Trash2, Package, AlertTriangle, Settings, BarChart, Eye, EyeOff } from 'lucide-react';
import { verifyTempAuth } from '@/lib/temp-auth';

// Unified Product interface that supports both basic and advanced features
interface UnifiedProduct {
  // Basic product fields (original)
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
  
  // Advanced ERP fields (optional)
  item_code?: string;
  item_group?: string;
  stock_uom?: string;
  has_variants?: boolean;
  is_stock_item?: boolean;
  is_purchase_item?: boolean;
  is_sales_item?: boolean;
  standard_rate?: number;
  valuation_rate?: number;
  min_order_qty?: number;
  safety_stock?: number;
  lead_time_days?: number;
  warranty_period?: number;
  has_batch_no?: boolean;
  has_serial_no?: boolean;
  shelf_life_in_days?: number;
  end_of_life?: string;
  brand?: string;
  manufacturer?: string;
  disabled?: boolean;
}

export default function UnifiedProductsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [products, setProducts] = useState<UnifiedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'basic' | 'advanced'>('basic');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const router = useRouter();
  useEffect(() => {
    // Check URL parameters for view mode
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');
    if (viewParam === 'advanced') {
      setViewMode('advanced');
    }
    
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use temp auth
      const authResult = await verifyTempAuth(3);
      
      if (!authResult?.user) {
        console.log('❌ [Products] No authenticated user found');
        router.push('/login');
        return;
      }

      const { user } = authResult;

      if (user.account_type !== 'store') {
        console.log('❌ [Products] User is not a store account');
        router.push('/user/dashboard');
        return;
      }

      console.log('✅ [Products] Store user authenticated:', user.email);
      setCurrentUser(user);

      // Try to fetch products from both sources and merge
      try {
        // For now, using mock data with both basic and advanced features
        const mockProducts: UnifiedProduct[] = [
          {
            id: '1',
            store_id: user.id,
            name: 'لابتوب ديل XPS 13',
            description: 'لابتوب عالي الأداء مناسب للأعمال والطلاب',
            barcode: 'DELL-XPS-13-001',
            price: 3500.00,
            stock: 15,
            image_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            // Advanced ERP fields
            item_code: 'LAPTOP-001',
            item_group: 'أجهزة كمبيوتر',
            stock_uom: 'قطعة',
            brand: 'Dell',
            manufacturer: 'Dell Technologies',
            safety_stock: 5,
            min_order_qty: 1,
            lead_time_days: 7,
            warranty_period: 365,
            is_stock_item: true,
            is_sales_item: true,
            is_purchase_item: true,
            standard_rate: 3500.00,
            valuation_rate: 3200.00,
          },
          {
            id: '2',
            store_id: user.id,
            name: 'ماوس لوجيتك MX Master 3',
            description: 'ماوس لاسلكي متقدم للمحترفين',
            barcode: 'LOG-MX-MASTER-3',
            price: 320.00,
            stock: 25,
            image_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            // Advanced ERP fields
            item_code: 'MOUSE-001',
            item_group: 'ملحقات كمبيوتر',
            stock_uom: 'قطعة',
            brand: 'Logitech',
            manufacturer: 'Logitech International',
            safety_stock: 10,
            min_order_qty: 5,
            lead_time_days: 3,
            warranty_period: 90,
            is_stock_item: true,
            is_sales_item: true,
            is_purchase_item: true,
            standard_rate: 320.00,
            valuation_rate: 280.00,
          },
          {
            id: '3',
            store_id: user.id,
            name: 'شاشة سامسونج 27 بوصة',
            description: 'شاشة عالية الدقة للألعاب والتصميم',
            barcode: 'SAM-MON-27-4K',
            price: 1200.00,
            stock: 8,
            image_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            // Advanced ERP fields
            item_code: 'MONITOR-001',
            item_group: 'شاشات عرض',
            stock_uom: 'قطعة',
            brand: 'Samsung',
            manufacturer: 'Samsung Electronics',
            safety_stock: 2,
            min_order_qty: 1,
            lead_time_days: 5,
            warranty_period: 730,
            is_stock_item: true,
            is_sales_item: true,
            is_purchase_item: true,
            standard_rate: 1200.00,
            valuation_rate: 1050.00,
          }
        ];
        
        setProducts(mockProducts);

      } catch (apiError) {
        console.log('⚠️ [Products] Error fetching data:', apiError);
        setProducts([]);
      }

    } catch (error) {
      console.error('❌ [Products] Error loading data:', error);
      setError('حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.item_code?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || 
      product.item_group === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const categories = [...new Set(products.map(p => p.item_group).filter(Boolean))];

  // Stats
  const totalProducts = products.length;
  const inStock = products.filter(p => p.stock > 0).length;
  const outOfStock = products.filter(p => p.stock === 0).length;
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= (p.safety_stock || 5)).length;

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
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">إدارة المنتجات الموحدة</h1>
              <p className="text-blue-100 text-sm sm:text-base">
                إدارة شاملة للمنتجات مع ميزات ERP المتقدمة
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
                href="/store/products/new"
                className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
              >
                <Plus size={20} />
                إضافة منتج
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي المنتجات</p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">متوفر</p>
                <p className="text-2xl font-bold text-green-600">{inStock}</p>
              </div>
              <BarChart className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">نفد المخزون</p>
                <p className="text-2xl font-bold text-red-600">{outOfStock}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">مخزون منخفض</p>
                <p className="text-2xl font-bold text-yellow-600">{lowStock}</p>
              </div>
              <Package className="w-8 h-8 text-yellow-500" />
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
                  placeholder="البحث عن منتج..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">جميع الفئات</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid/Table */}
        <div className="bg-white rounded-xl shadow-sm border">
          {filteredProducts.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد منتجات</h3>
              <p className="text-gray-500 mb-4">ابدأ بإضافة منتجات لمتجرك</p>
              <Link
                href="/store/products/new"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                إضافة منتج جديد
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-right p-4 font-medium text-gray-700">المنتج</th>
                    <th className="text-right p-4 font-medium text-gray-700">السعر</th>
                    <th className="text-right p-4 font-medium text-gray-700">المخزون</th>
                    {viewMode === 'advanced' && (
                      <>
                        <th className="text-right p-4 font-medium text-gray-700">رمز الصنف</th>
                        <th className="text-right p-4 font-medium text-gray-700">الفئة</th>
                        <th className="text-right p-4 font-medium text-gray-700">الوحدة</th>
                        <th className="text-right p-4 font-medium text-gray-700">المخزون الآمن</th>
                      </>
                    )}
                    <th className="text-right p-4 font-medium text-gray-700">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            {product.image_url ? (
                              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <Package className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{product.name}</h3>
                            <p className="text-sm text-gray-500">{product.description}</p>
                            {product.barcode && (
                              <p className="text-xs text-gray-400">الباركود: {product.barcode}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-gray-900">{formatCurrency(product.price)}</span>
                        {viewMode === 'advanced' && product.valuation_rate && (
                          <p className="text-xs text-gray-500">التكلفة: {formatCurrency(product.valuation_rate)}</p>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          product.stock === 0 ? 'bg-red-100 text-red-700' :
                          product.stock <= (product.safety_stock || 5) ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {product.stock} {product.stock_uom || 'قطعة'}
                        </span>
                      </td>
                      {viewMode === 'advanced' && (
                        <>
                          <td className="p-4">
                            <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                              {product.item_code || '-'}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-gray-700">{product.item_group || '-'}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-gray-700">{product.stock_uom || 'قطعة'}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-gray-700">{product.safety_stock || 0}</span>
                          </td>
                        </>
                      )}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit size={16} />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={16} />
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

        {/* Migration Notice */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Settings className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800 mb-2">نظام إدارة المنتجات الموحد</h3>
              <p className="text-green-700 text-sm mb-3">
                تم دمج نظام إدارة المنتجات الأساسي مع نظام ERP المتقدم في واجهة واحدة موحدة. 
                يمكنك الآن التبديل بين العرض البسيط والمتقدم حسب احتياجاتك.
              </p>
              <div className="flex gap-3">
                <Link 
                  href="/store/products/import"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  استيراد منتجات من Excel
                </Link>
                <Link 
                  href="/barcode-scanner"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  ماسح الباركود
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SimpleLayout>
  );
}
