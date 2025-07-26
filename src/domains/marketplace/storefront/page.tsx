'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Heart, ShoppingCart, Star, MapPin } from 'lucide-react';

interface Store {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviewCount: number;
  location: string;
  category: string;
  isVerified: boolean;
}

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  store: Store;
  rating: number;
  reviewCount: number;
  category: string;
  tags: string[];
  inStock: boolean;
}

export default function MarketplaceStorefront() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'products' | 'stores'>('products');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const categories = [
    { id: 'all', name: 'جميع الفئات', count: 1250 },
    { id: 'construction', name: 'مواد البناء', count: 450 },
    { id: 'tools', name: 'أدوات وآلات', count: 320 },
    { id: 'electrical', name: 'كهربائيات', count: 280 },
    { id: 'plumbing', name: 'سباكة وصحي', count: 200 },
  ];

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'أسمنت بورتلاندي عادي 50 كيلو',
      price: 25.50,
      originalPrice: 28.00,
      image: '/api/placeholder/300/300',
      store: {
        id: 'store1',
        name: 'متجر البناء الحديث',
        logo: '/api/placeholder/50/50',
        rating: 4.5,
        reviewCount: 234,
        location: 'الرياض',
        category: 'مواد البناء',
        isVerified: true
      },
      rating: 4.3,
      reviewCount: 87,
      category: 'construction',
      tags: ['أسمنت', 'مواد البناء', 'عروض'],
      inStock: true
    },
    {
      id: '2',
      name: 'مثقاب كهربائي بوش 18 فولت',
      price: 299.99,
      image: '/api/placeholder/300/300',
      store: {
        id: 'store2',
        name: 'متجر الأدوات المتقدمة',
        logo: '/api/placeholder/50/50',
        rating: 4.7,
        reviewCount: 156,
        location: 'جدة',
        category: 'أدوات وآلات',
        isVerified: true
      },
      rating: 4.6,
      reviewCount: 143,
      category: 'tools',
      tags: ['مثقاب', 'كهربائي', 'بوش'],
      inStock: true
    }
  ];

  const mockStores: Store[] = [
    {
      id: 'store1',
      name: 'متجر البناء الحديث',
      logo: '/api/placeholder/100/100',
      rating: 4.5,
      reviewCount: 234,
      location: 'الرياض',
      category: 'مواد البناء',
      isVerified: true
    },
    {
      id: 'store2',
      name: 'متجر الأدوات المتقدمة',
      logo: '/api/placeholder/100/100',
      rating: 4.7,
      reviewCount: 156,
      location: 'جدة',
      category: 'أدوات وآلات',
      isVerified: true
    }
  ];

  const ProductCard = ({ product }: { product: Product }) => (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-purple-200/30">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover rounded-t-2xl"
        />
        <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:bg-white/95 hover:shadow-xl transition-all" onClick={() => alert('Button clicked')}>
          <Heart className="w-5 h-5 text-gray-600" />
        </button>
        {product.originalPrice && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-xl text-sm font-medium shadow-lg">
            خصم {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 text-lg">{product.name}</h3>
        
        <div className="flex items-center gap-2 mb-3">
          <img 
            src={product.store.logo} 
            alt={product.store.name}
            className="w-7 h-7 rounded-full border-2 border-purple-200"
          />
          <span className="text-sm text-gray-600 font-medium">{product.store.name}</span>
          {product.store.isVerified && (
            <span className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-2 py-1 rounded-lg font-medium">موثق</span>
          )}
        </div>
        
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm text-gray-600 font-medium">{product.rating}</span>
          <span className="text-sm text-gray-500">({product.reviewCount})</span>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{product.price} ر.س</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">{product.originalPrice} ر.س</span>
          )}
        </div>
        
        <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-medium" onClick={() => alert('Button clicked')}>
          <ShoppingCart className="w-4 h-4" />
          إضافة للسلة
        </button>
      </div>
    </div>
  );

  const StoreCard = ({ store }: { store: Store }) => (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 p-6 border border-purple-200/30">
      <div className="flex items-center gap-4 mb-4">
        <img 
          src={store.logo} 
          alt={store.name}
          className="w-16 h-16 rounded-full object-cover border-3 border-purple-200 shadow-lg"
        />
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">{store.name}</h3>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            {store.location}
          </div>
        </div>
        {store.isVerified && (
          <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-3 py-1 rounded-xl text-xs font-medium">موثق</span>
        )}
      </div>
      
      <div className="flex items-center gap-1 mb-4">
        <Star className="w-4 h-4 text-yellow-400 fill-current" />
        <span className="text-sm text-gray-600 font-medium">{store.rating}</span>
        <span className="text-sm text-gray-500">({store.reviewCount} تقييم)</span>
      </div>
      
      <div className="text-sm text-gray-600 mb-6 font-medium">
        التخصص: {store.category}
      </div>
      
      <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-medium" onClick={() => alert('Button clicked')}>
        زيارة المتجر
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-purple-50/30 to-indigo-100/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 25%), 
                            radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 0%, transparent 25%)`
        }}></div>
        
        <div className="text-center relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-purple-200/30">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-purple-50/30 to-indigo-100/20"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 25%), 
                          radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 0%, transparent 25%)`
      }}></div>
      
      {/* Header */}
      <div className="relative bg-white/80 backdrop-blur-md shadow-xl border-b border-purple-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">سوق بناء</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="ابحث عن المنتجات والمتاجر..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-96 pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-lg hover:shadow-xl transition-all"
                />
              </div>
              <button className="p-3 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all border border-gray-200" onClick={() => alert('Button clicked')}>
                <Filter className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-purple-200/30">
              <h2 className="font-semibold text-gray-900 mb-4">الفئات</h2>
              <ul className="space-y-2">
                {categories.map(category => (
                  <li key={category.id}>
                    <button
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-right p-3 rounded-xl transition-all ${
                        selectedCategory === category.id
                          ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-md'
                          : 'hover:bg-gray-100/70 hover:shadow-md'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{category.name}</span>
                        <span className="text-sm text-gray-500">({category.count})</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* View Toggle */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-1 border border-purple-200/30">
                <button
                  onClick={() => setViewMode('products')}
                  className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                    viewMode === 'products'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  المنتجات
                </button>
                <button
                  onClick={() => setViewMode('stores')}
                  className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                    viewMode === 'stores'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  المتاجر
                </button>
              </div>
              
              <div className="text-sm text-gray-600 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-xl shadow-md">
                {viewMode === 'products' ? '1,250 منتج' : '125 متجر'}
              </div>
            </div>

            {/* Products Grid */}
            {viewMode === 'products' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mockProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockStores.map(store => (
                  <StoreCard key={store.id} store={store} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
