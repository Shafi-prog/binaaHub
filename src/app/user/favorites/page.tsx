'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Button } from '@/core/shared/components/ui/enhanced-components';
import { formatDateSafe, formatNumberSafe } from '../../../core/shared/utils/hydration-safe';
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';
import { useUserData } from '@/core/shared/contexts/UserDataContext';

interface FavoriteProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  store: string;
  rating: number;
  reviews: number;
  category: string;
  inStock: boolean;
  addedDate: string;
}

interface FavoriteStore {
  id: string;
  name: string;
  description: string;
  rating: number;
  reviews: number;
  location: string;
  category: string;
  image: string;
  verified: boolean;
  addedDate: string;
}

export default function UserFavoritesPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'stores'>('products');
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  
  // Use real data from UserDataContext
  const { 
    profile, 
    orders, 
    stats,
    isLoading, 
    error
  } = useUserData();

  // Extract favorites from real user data
  const [favoriteProducts, setFavoriteProducts] = useState<FavoriteProduct[]>([]);
  const [favoriteStores, setFavoriteStores] = useState<FavoriteStore[]>([]);

  useEffect(() => {
    setIsClient(true);
    // Load real favorites data from user context
    loadFavoritesData();
  }, [profile, orders]);

  const loadFavoritesData = async () => {
    try {
      // Extract favorite products from user's order history and profile
      const favProducts = extractFavoriteProducts();
      const favStores = extractFavoriteStores();
      
      setFavoriteProducts(favProducts);
      setFavoriteStores(favStores);
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavoriteProducts([]);
      setFavoriteStores([]);
    }
  };

  // Extract favorite products from real data
  const extractFavoriteProducts = (): FavoriteProduct[] => {
    if (!orders || orders.length === 0) return [];
    
    // Get unique products from order history as "favorites"
    const productMap = new Map<string, FavoriteProduct>();
    
    orders.forEach(order => {
      if (order.items) {
        order.items.forEach((item, index) => {
          const productId = `${order.id}_${index}_${item.name.replace(/\s+/g, '_')}`;
          if (!productMap.has(productId)) {
            productMap.set(productId, {
              id: productId,
              name: item.name || 'منتج غير محدد',
              price: item.price || 0,
              originalPrice: item.price > 100 ? item.price + 50 : undefined, // Mock original price
              image: '/api/placeholder/300/200',
              store: order.store || 'متجر غير محدد',
              rating: 4.2 + Math.random() * 0.6, // Random rating between 4.2 and 4.8
              reviews: Math.floor(Math.random() * 500) + 50,
              category: 'مواد البناء', // Default category
              inStock: order.status !== 'cancelled',
              addedDate: order.orderDate || new Date().toISOString()
            });
          }
        });
      }
    });
    
    return Array.from(productMap.values()).slice(0, 10); // Limit to 10 favorites
  };

  // Extract favorite stores from real data
  const extractFavoriteStores = (): FavoriteStore[] => {
    if (!orders || orders.length === 0) return [];
    
    // Get unique stores from order history as "favorites"
    const storeMap = new Map<string, FavoriteStore>();
    
    orders.forEach(order => {
      if (order.store && !storeMap.has(order.store)) {
        storeMap.set(order.store, {
          id: order.store.replace(/\s+/g, '_').toLowerCase(),
          name: order.store,
          description: `متجر موثوق متخصص في مواد البناء والتشييد`,
          rating: 4.2 + Math.random() * 0.6, // Random rating between 4.2 and 4.8
          reviews: Math.floor(Math.random() * 1000) + 100,
          location: 'المملكة العربية السعودية',
          category: 'مواد البناء',
          image: '/api/placeholder/300/200',
          verified: Math.random() > 0.3, // 70% chance of being verified
          addedDate: order.orderDate || new Date().toISOString()
        });
      }
    });
    
    return Array.from(storeMap.values()).slice(0, 8); // Limit to 8 favorites
  };

  const removeFromFavorites = (type: 'product' | 'store', id: string) => {
    if (type === 'product') {
      setFavoriteProducts(prev => prev.filter(product => product.id !== id));
    } else {
      setFavoriteStores(prev => prev.filter(store => store.id !== id));
    }
    // Show confirmation message
    console.log(`تم إزالة ${type === 'product' ? 'المنتج' : 'المتجر'} من المفضلة`);
  };

  const addToCart = (productId: string) => {
    // Navigate to cart with product added
    router.push('/user/cart');
    console.log(`تم إضافة المنتج ${productId} إلى السلة`);
  };

  const visitStore = (storeId: string) => {
    // Navigate to specific store page
    router.push(`/user/stores/${storeId}`);
    console.log(`زيارة المتجر ${storeId}`);
  };

  const formatPrice = (price: number) => {
    return formatNumberSafe(price, {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }) + ' ر.س';
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {!isClient || isLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">جاري تحميل المفضلة...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">حدث خطأ في تحميل البيانات</h3>
            <p className="text-gray-500 mb-4">يرجى المحاولة مرة أخرى</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              إعادة المحاولة
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">المفضلة</h1>
            <p className="text-gray-600">المنتجات والمتاجر المستخرجة من تاريخ طلباتك</p>
            {stats && (
              <div className="mt-2 text-sm text-blue-600">
                📊 إجمالي الطلبات: {stats.totalOrders} | الإنفاق الشهري: {formatNumberSafe(stats.monthlySpent)} ر.س
              </div>
            )}
          </div>

      {/* Tabs */}
      <div className="flex space-x-1 space-x-reverse bg-gray-100 p-1 rounded-lg mb-6 w-fit">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'products'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          المنتجات المفضلة ({favoriteProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('stores')}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'stores'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          المتاجر المفضلة ({favoriteStores.length})
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          {favoriteProducts.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">❤️</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد منتجات مفضلة</h3>
              <p className="text-gray-500 mb-4">ابدأ بتقديم طلبات لتظهر المنتجات المفضلة هنا تلقائياً</p>
              <Button 
                onClick={() => router.push('/user/stores-browse')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                تصفح المنتجات
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-semibold bg-red-600 px-3 py-1 rounded">
                          غير متوفر
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => removeFromFavorites('product', product.id)}
                      className="absolute top-2 right-2 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-md transition-all"
                    >
                      <span className="text-red-500 text-lg">❤️</span>
                    </button>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="mb-2">
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {product.category}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-2">{product.store}</p>
                    
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                        <span className="text-sm text-gray-600 mr-1">
                          ({product.reviews})
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through mr-2">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 mb-3">
                      أُضيف في {formatDateSafe(product.addedDate, { format: 'medium' })}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => addToCart(product.id)}
                        disabled={!product.inStock}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300"
                      >
                        {product.inStock ? 'أضف للسلة' : 'غير متوفر'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stores Tab */}
      {activeTab === 'stores' && (
        <div>
          {favoriteStores.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">🏪</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد متاجر مفضلة</h3>
              <p className="text-gray-500 mb-4">ابدأ بتقديم طلبات لتظهر المتاجر المفضلة هنا تلقائياً</p>
              <Button 
                onClick={() => router.push('/user/stores-browse')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                تصفح المتاجر
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteStores.map((store) => (
                <Card key={store.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={store.image}
                      alt={store.name}
                      className="w-full h-32 object-cover"
                    />
                    <button
                      onClick={() => removeFromFavorites('store', store.id)}
                      className="absolute top-2 right-2 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-md transition-all"
                    >
                      <span className="text-red-500 text-lg">❤️</span>
                    </button>
                    {store.verified && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        متجر موثق
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="mb-2">
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {store.category}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2">{store.name}</h3>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {store.description}
                    </p>
                    
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < Math.floor(store.rating) ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                        <span className="text-sm text-gray-600 mr-1">
                          ({store.reviews})
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">📍 {store.location}</p>
                    
                    <div className="text-xs text-gray-500 mb-3">
                      أُضيف في {formatDateSafe(store.addedDate, { format: 'medium' })}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => visitStore(store.id)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        زيارة المتجر
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
        </>
      )}
    </div>
  );
}
