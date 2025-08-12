"use client";
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const dynamic = 'force-dynamic';

// Simple UI Components
const Card = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const spinnerSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-10 h-10' : 'w-6 h-6';
  return (
    <svg className={`animate-spin text-blue-500 ${spinnerSize}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );
};

interface Store {
  id: string;
  name: string;
  description?: string;
  category: string;
  rating: number;
  location?: string;
  phone?: string;
  email?: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image_url?: string;
  stock_quantity: number;
  is_available: boolean;
  store_id: string;
  store?: Store;
}

export default function StorefrontMainPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<Array<{ id: string; product_id: string; store_id: string; quantity: number; price: number }>>([]);
  const [loadingCart, setLoadingCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStore, setSelectedStore] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchAllProducts();
  }, []);

  // Load authenticated user and cart
  useEffect(() => {
    const loadUserAndCart = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const uid = authData.user?.id ?? null;
      setUserId(uid ?? null);
      if (uid) {
        await fetchCart(uid);
      }
    };
    loadUserAndCart();
    // Listen to auth changes
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      if (uid) fetchCart(uid);
      else setCartItems([]);
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      
      // Try embedded store join first; fallback to simple select if relationship not present
      let { data, error } = await supabase
        .from('products')
        .select(`
          *,
          store:stores(id, name, description, category, rating, location, phone, email)
        `)
        .eq('is_available', true);
      if (error) {
        // Fallback without join to be schema-agnostic
        const fallback = await supabase
          .from('products')
          .select('*')
          .eq('is_available', true);
        if (fallback.error) throw fallback.error;
        data = fallback.data as any[];
      }
      setProducts((data as any[]) ?? []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Server-side cart: marketplace.simple_cart_items
  const fetchCart = async (uid: string) => {
    try {
      setLoadingCart(true);
      const { data, error } = await supabase
        .schema('marketplace')
        .from('simple_cart_items')
        .select('id, product_id, store_id, quantity, price')
        .eq('user_id', uid);
      if (error) throw error;
      setCartItems(data ?? []);
    } catch (e) {
      console.error('Error fetching cart:', e);
    } finally {
      setLoadingCart(false);
    }
  };

  const getQty = (productId: string) => {
    return cartItems.find(ci => ci.product_id === productId)?.quantity ?? 0;
  };

  const addToCart = async (productId: string) => {
    if (!userId) {
      // Optional: redirect to login
      alert('الرجاء تسجيل الدخول لإضافة منتجات إلى السلة');
      return;
    }
    const product = products.find(p => p.id === productId);
    if (!product) return;
    try {
      const existing = cartItems.find(ci => ci.product_id === productId);
      if (existing) {
        const { error } = await supabase
          .schema('marketplace')
          .from('simple_cart_items')
          .update({ quantity: existing.quantity + 1 })
          .eq('id', existing.id)
          .eq('user_id', userId);
        if (error) throw error;
      } else {
  const { error } = await supabase
          .schema('marketplace')
          .from('simple_cart_items')
          .insert({
            user_id: userId,
            product_id: productId,
            quantity: 1,
            price: product.price,
          });
        if (error) throw error;
      }
      await fetchCart(userId);
    } catch (e) {
      console.error('Error adding to cart:', e);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!userId) return;
    try {
      const existing = cartItems.find(ci => ci.product_id === productId);
      if (!existing) return;
      if (existing.quantity > 1) {
        const { error } = await supabase
          .schema('marketplace')
          .from('simple_cart_items')
          .update({ quantity: existing.quantity - 1 })
          .eq('id', existing.id)
          .eq('user_id', userId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .schema('marketplace')
          .from('simple_cart_items')
          .delete()
          .eq('id', existing.id)
          .eq('user_id', userId);
        if (error) throw error;
      }
      await fetchCart(userId);
    } catch (e) {
      console.error('Error removing from cart:', e);
    }
  };

  const getTotalCartItems = () => cartItems.reduce((sum, ci) => sum + ci.quantity, 0);
  const getTotalCartValue = () => cartItems.reduce((sum, ci) => sum + (ci.price * ci.quantity), 0);

  const categories = [
    { value: 'all', label: 'جميع المنتجات' },
    { value: 'cement', label: 'الأسمنت' },
    { value: 'steel', label: 'الحديد' },
    { value: 'bricks', label: 'الطوب' },
    { value: 'sand', label: 'الرمل والحصى' },
    { value: 'tiles', label: 'البلاط والسيراميك' },
    { value: 'paint', label: 'الدهانات' },
    { value: 'tools', label: 'الأدوات والمعدات' },
    { value: 'plumbing', label: 'الأدوات الصحية' },
  ];

  const priceRanges = [
    { value: 'all', label: 'جميع الأسعار' },
    { value: '0-50', label: 'أقل من 50 ر.س' },
    { value: '50-200', label: '50 - 200 ر.س' },
    { value: '200-500', label: '200 - 500 ر.س' },
    { value: '500-1000', label: '500 - 1000 ر.س' },
    { value: '1000+', label: 'أكثر من 1000 ر.س' },
  ];

  const uniqueStores = useMemo(() => {
    const map: Record<string, Store> = {};
    for (const p of products) {
      if (p.store && !map[p.store.id]) map[p.store.id] = p.store;
    }
    return Object.values(map);
  }, [products]);

  const getUniqueStores = () => uniqueStores;

  const filteredAndSortedProducts = useMemo(() => {
    let list = [...products];
    if (selectedCategory !== 'all') list = list.filter(p => p.category === selectedCategory);
    if (selectedStore !== 'all') list = list.filter(p => p.store_id === selectedStore);
    if (priceRange !== 'all') {
      const [minStr, maxStr] = priceRange.split('-');
      const min = minStr === '0' ? 0 : parseFloat(minStr);
      const max = maxStr?.endsWith('+') ? Infinity : parseFloat(maxStr || '0');
      list = list.filter(p => p.price >= min && p.price <= (isFinite(max) ? max : p.price));
    }
    if (searchTerm.trim()) list = list.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    switch (sortBy) {
      case 'price-low':
        list.sort((a, b) => a.price - b.price); break;
      case 'price-high':
        list.sort((a, b) => b.price - a.price); break;
      case 'rating':
        list.sort((a, b) => (b.store?.rating ?? 0) - (a.store?.rating ?? 0)); break;
      default:
        list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [products, selectedCategory, selectedStore, priceRange, searchTerm, sortBy]);

  const sortOptions = [
    { value: 'name', label: 'الاسم' },
    { value: 'price-low', label: 'السعر: الأقل أولاً' },
    { value: 'price-high', label: 'السعر: الأعلى أولاً' },
    { value: 'rating', label: 'التقييم' },
  ];


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">متجر بناء هب</h1>
              <p className="text-gray-600">اكتشف أفضل منتجات البناء والتشييد من المتاجر المتميزة</p>
            </div>
            {getTotalCartItems() > 0 && (
              <div className="bg-green-500 text-white px-4 py-2 rounded-lg">
                السلة ({getTotalCartItems()}) - {getTotalCartValue().toFixed(2)} ر.س
              </div>
            )}
          </div>
          
          <div className="flex gap-4">
            <Link href="/user/stores-browse" className="text-blue-500 hover:text-blue-600">
              تصفح المتاجر
            </Link>
            <span className="text-gray-300">|</span>
            <span className="text-gray-600">جميع المنتجات</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-6">
        <Card className="p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                فئة المنتج
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
              </select>
            </div>

            {/* Store Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المتجر
              </label>
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">جميع المتاجر</option>
                {getUniqueStores().map(store => (
                  <option key={store.id} value={store.id}>{store.name}</option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                السعر
              </label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {priceRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ترتيب حسب
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البحث
              </label>
              <input
                type="text"
                placeholder="ابحث عن منتج..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            تم العثور على {filteredAndSortedProducts.length} منتج
            {selectedCategory !== 'all' && ` في فئة "${categories.find(c => c.value === selectedCategory)?.label}"`}
            {selectedStore !== 'all' && ` من ${getUniqueStores().find(s => s.id === selectedStore)?.name}`}
          </p>
        </div>

        {/* Products Grid */}
        {filteredAndSortedProducts.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد منتجات</h3>
            <p className="text-gray-500">لم يتم العثور على منتجات تطابق معايير البحث</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedProducts.map((product) => (
              <Card key={product.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-4xl text-gray-400">📦</span>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                
                {product.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                )}
                
                {/* Store Info */}
                {product.store && (
                  <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                    <Link 
                      href={`/user/stores-browse`}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {product.store.name}
                    </Link>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={star <= (product.store?.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}
                        >
                          ★
                        </span>
                      ))}
                      <span className="mr-1">({product.store.rating})</span>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-green-600">
                    {product.price.toFixed(2)} ر.س
                  </span>
                  <span className="text-sm text-gray-500">
                    متوفر: {product.stock_quantity}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  {getQty(product.id) > 0 ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold"
                      >
                        -
                      </button>
                      <span className="min-w-[2rem] text-center font-semibold">
                        {getQty(product.id)}
                      </span>
                      <button
                        onClick={() => addToCart(product.id)}
                        className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(product.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm w-full"
                    >
                      إضافة للسلة
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Cart Summary */}
      {getTotalCartItems() > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div>
              <span className="font-semibold">إجمالي السلة: </span>
              <span className="text-green-600 font-bold text-lg">
                {getTotalCartValue().toFixed(2)} ر.س
              </span>
              <span className="text-gray-500 mr-2">({getTotalCartItems()} منتج)</span>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/user/cart/checkout?items=${getTotalCartItems()}`}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                إتمام الطلب
              </Link>
              <Link
                href="/auth/login?redirect=/marketplace"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                تسجيل الدخول
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



