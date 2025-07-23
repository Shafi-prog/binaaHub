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
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50" onClick={() => alert('Button clicked')}>
          <Heart className="w-5 h-5 text-gray-600" />
        </button>
        {product.originalPrice && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
            خصم {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        
        <div className="flex items-center gap-2 mb-2">
          <img 
            src={product.store.logo} 
            alt={product.store.name}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm text-gray-600">{product.store.name}</span>
          {product.store.isVerified && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">موثق</span>
          )}
        </div>
        
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm text-gray-600">{product.rating}</span>
          <span className="text-sm text-gray-500">({product.reviewCount})</span>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">{product.price} ر.س</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">{product.originalPrice} ر.س</span>
          )}
        </div>
        
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2" onClick={() => alert('Button clicked')}>
          <ShoppingCart className="w-4 h-4" />
          إضافة للسلة
        </button>
      </div>
    </div>
  );

  const StoreCard = ({ store }: { store: Store }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
      <div className="flex items-center gap-4 mb-4">
        <img 
          src={store.logo} 
          alt={store.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-gray-900">{store.name}</h3>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            {store.location}
          </div>
        </div>
        {store.isVerified && (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">موثق</span>
        )}
      </div>
      
      <div className="flex items-center gap-1 mb-4">
        <Star className="w-4 h-4 text-yellow-400 fill-current" />
        <span className="text-sm text-gray-600">{store.rating}</span>
        <span className="text-sm text-gray-500">({store.reviewCount} تقييم)</span>
      </div>
      
      <div className="text-sm text-gray-600 mb-4">
        التخصص: {store.category}
      </div>
      
      <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors" onClick={() => alert('Button clicked')}>
        زيارة المتجر
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">سوق بناء</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="ابحث عن المنتجات والمتاجر..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-96 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200" onClick={() => alert('Button clicked')}>
                <Filter className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="font-semibold text-gray-900 mb-4">الفئات</h2>
              <ul className="space-y-2">
                {categories.map(category => (
                  <li key={category.id}>
                    <button
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-right p-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'hover:bg-gray-100'
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
              <div className="flex bg-white rounded-lg shadow-sm p-1">
                <button
                  onClick={() => setViewMode('products')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'products'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  المنتجات
                </button>
                <button
                  onClick={() => setViewMode('stores')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'stores'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  المتاجر
                </button>
              </div>
              
              <div className="text-sm text-gray-600">
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
