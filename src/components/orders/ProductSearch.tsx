'use client';

import { useState, useEffect } from 'react';
import { X, Search, Package, Filter, Star } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  barcode?: string;
  price: number;
  stock: number;
  description?: string;
  category?: string;
  image?: string;
}

interface ProductSearchProps {
  onProductSelect: (product: Product, quantity?: number) => void;
  onClose: () => void;
}

export default function ProductSearch({ onProductSelect, onClose }: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock products data - replace with actual API
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'iPhone 14 Pro',
      barcode: '1234567890123',
      price: 4999,
      stock: 10,
      category: 'هواتف ذكية',
      description: 'آيفون 14 برو - 256 جيجابايت'
    },
    {
      id: '2',
      name: 'Samsung Galaxy S23',
      barcode: '2345678901234',
      price: 3999,
      stock: 15,
      category: 'هواتف ذكية',
      description: 'سامسونج جالكسي S23 - 128 جيجابايت'
    },
    {
      id: '3',
      name: 'MacBook Pro M2',
      barcode: '3456789012345',
      price: 9999,
      stock: 5,
      category: 'أجهزة كمبيوتر',
      description: 'ماك بوك برو M2 - 512 جيجابايت'
    },
    {
      id: '4',
      name: 'iPad Air',
      barcode: '4567890123456',
      price: 2499,
      stock: 8,
      category: 'أجهزة لوحية',
      description: 'آيباد إير - 64 جيجابايت'
    },
    {
      id: '5',
      name: 'AirPods Pro',
      barcode: '5678901234567',
      price: 899,
      stock: 20,
      category: 'سماعات',
      description: 'إير بودز برو - الجيل الثاني'
    },
    {
      id: '6',
      name: 'Apple Watch Series 8',
      barcode: '6789012345678',
      price: 1999,
      stock: 12,
      category: 'ساعات ذكية',
      description: 'آبل واتش سيريز 8 - 45 مم'
    }
  ];

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  const loadConstructionProducts = async () => {
    try {
      const response = await fetch('/api/construction-products');
      if (response.ok) {
        const data = await response.json();
        return data.products.map((product: any) => ({
          id: product.id,
          name: product.name_ar,
          barcode: product.barcode,
          price: product.price,
          stock: product.stock_quantity,
          description: product.description_ar,
          category: product.category_name || 'مواد البناء',
        }));
      }
    } catch (error) {
      console.error('Error loading construction products:', error);
    }
    return [];
  };

  useEffect(() => {
    // Load both mock and construction products
    const loadAllProducts = async () => {
      setLoading(true);
      const constructionProducts = await loadConstructionProducts();
      const allProducts = [...mockProducts, ...constructionProducts];
      setProducts(allProducts);
      setFilteredProducts(allProducts);
      setLoading(false);
    };
    
    loadAllProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode?.includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  const handleProductSelect = (product: Product) => {
    onProductSelect(product, 1);
    onClose();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'نفذ المخزون', color: 'text-red-600' };
    if (stock < 5) return { text: 'مخزون قليل', color: 'text-yellow-600' };
    return { text: 'متوفر', color: 'text-green-600' };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">البحث عن منتج</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث بالاسم أو الباركود أو الوصف..."
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">جميع الفئات</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="mr-3 text-gray-600">جاري التحميل...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">لم يتم العثور على منتجات</p>
              {searchTerm && (
                <p className="text-sm text-gray-400 mt-2">
                  جرب تعديل كلمات البحث أو تغيير الفئة
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock);
                return (
                  <div
                    key={product.id}
                    onClick={() => handleProductSelect(product)}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-blue-300 transition-all duration-300 cursor-pointer group"
                  >
                    {/* Product Image Placeholder */}
                    <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                      <Package className="text-gray-400" size={32} />
                    </div>

                    {/* Product Info */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                      
                      {product.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {product.description}
                        </p>
                      )}

                      {product.barcode && (
                        <p className="text-xs text-gray-500 font-mono">
                          الباركود: {product.barcode}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-blue-600">
                          {formatPrice(product.price)}
                        </span>
                        <span className={`text-sm font-medium ${stockStatus.color}`}>
                          {stockStatus.text}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>المخزون: {product.stock}</span>
                        {product.category && (
                          <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                            {product.category}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Add Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductSelect(product);
                      }}
                      disabled={product.stock === 0}
                      className="w-full mt-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    >
                      {product.stock === 0 ? 'نفذ المخزون' : 'إضافة للطلب'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              عرض {filteredProducts.length} من {products.length} منتج
            </span>
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>متوفر</span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>مخزون قليل</span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>نفذ المخزون</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
