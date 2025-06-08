'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { Card, LoadingSpinner } from '@/components/ui';
import {
  Search,
  Filter,
  MapPin,
  Star,
  Heart,
  ShoppingCart,
  Store as StoreIcon,
} from 'lucide-react';

interface Store {
  id: string;
  store_name: string;
  description?: string;
  category?: string;
  rating: number;
  total_reviews: number;
  logo_url?: string;
  cover_image_url?: string;
  city?: string;
  region?: string;
  is_verified: boolean;
  delivery_areas?: string[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  images?: string[];
  store: Store;
  category?: string;
  is_featured: boolean;
}

export default function StorePage() {
  const user = useUser();
  const [stores, setStores] = useState<Store[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');

  useEffect(() => {
    loadStoresAndProducts();
  }, []);

  const loadStoresAndProducts = async () => {
    try {
      setLoading(true);

      // Mock data for demonstration
      const mockStores: Store[] = [
        {
          id: '1',
          store_name: 'متجر مواد البناء الحديثة',
          description: 'جميع مواد البناء والأدوات المنزلية بأفضل الأسعار',
          category: 'مواد البناء',
          rating: 4.8,
          total_reviews: 245,
          city: 'الرياض',
          region: 'منطقة الرياض',
          is_verified: true,
          delivery_areas: ['الرياض', 'القصيم', 'حائل'],
        },
        {
          id: '2',
          store_name: 'معرض الأجهزة الكهربائية',
          description: 'أحدث الأجهزة المنزلية والكهربائية',
          category: 'أجهزة كهربائية',
          rating: 4.6,
          total_reviews: 189,
          city: 'جدة',
          region: 'منطقة مكة المكرمة',
          is_verified: true,
          delivery_areas: ['جدة', 'مكة', 'الطائف'],
        },
        {
          id: '3',
          store_name: 'شركة السيراميك والبلاط',
          description: 'أفخر أنواع السيراميك والبلاط المستورد والمحلي',
          category: 'سيراميك وبلاط',
          rating: 4.9,
          total_reviews: 312,
          city: 'الدمام',
          region: 'المنطقة الشرقية',
          is_verified: true,
          delivery_areas: ['الدمام', 'الخبر', 'الجبيل'],
        },
        {
          id: '4',
          store_name: 'متجر الدهانات العصرية',
          description: 'جميع أنواع الدهانات والألوان الحديثة',
          category: 'دهانات',
          rating: 4.5,
          total_reviews: 156,
          city: 'الرياض',
          region: 'منطقة الرياض',
          is_verified: false,
          delivery_areas: ['الرياض'],
        },
      ];

      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'خرسانة جاهزة عالية الجودة',
          price: 250,
          currency: 'SAR',
          store: mockStores[0],
          category: 'خرسانة',
          is_featured: true,
        },
        {
          id: '2',
          name: 'ثلاجة سامسونج 18 قدم',
          price: 2500,
          currency: 'SAR',
          store: mockStores[1],
          category: 'أجهزة منزلية',
          is_featured: true,
        },
        {
          id: '3',
          name: 'سيراميك إيطالي فاخر',
          price: 85,
          currency: 'SAR',
          store: mockStores[2],
          category: 'سيراميك',
          is_featured: true,
        },
        {
          id: '4',
          name: 'دهان جوتن للواجهات',
          price: 180,
          currency: 'SAR',
          store: mockStores[3],
          category: 'دهانات',
          is_featured: true,
        },
      ];

      setStores(mockStores);
      setFeaturedProducts(mockProducts);
    } catch (error) {
      console.error('Error loading stores and products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStores = stores.filter((store) => {
    const matchesSearch =
      store.store_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || store.category === selectedCategory;
    const matchesRegion = selectedRegion === 'all' || store.region === selectedRegion;
    return matchesSearch && matchesCategory && matchesRegion;
  });

  const categories = Array.from(new Set(stores.map((store) => store.category).filter(Boolean)));
  const regions = Array.from(new Set(stores.map((store) => store.region).filter(Boolean)));

  if (loading) {
    return (
      <main className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">تصفح المتاجر</h1>
        </div>
        <LoadingSpinner />
      </main>
    );
  }

  return (
    <main className="p-4 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">تصفح المتاجر</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">{stores.length} متجر</span>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في المتاجر والمنتجات..."
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
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">جميع الفئات</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <MapPin className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">جميع المناطق</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Featured Products */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">المنتجات المميزة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                <ShoppingCart className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{product.store.store_name}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-blue-600">
                  {product.price.toLocaleString()} {product.currency}
                </span>
                <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Stores Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">المتاجر المتاحة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
            <Card key={store.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <StoreIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      {store.store_name}
                      {store.is_verified && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          موثق
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600">{store.category}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-red-500">
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              {store.description && (
                <p className="text-sm text-gray-600 mb-4">{store.description}</p>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">التقييم:</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{store.rating}</span>
                    <span className="text-xs text-gray-500">({store.total_reviews})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">الموقع:</span>
                  <span className="text-sm font-medium">{store.city}</span>
                </div>

                {store.delivery_areas && store.delivery_areas.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">مناطق التوصيل:</span>
                    <span className="text-sm font-medium">{store.delivery_areas.length} منطقة</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium">
                  زيارة المتجر
                </button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 text-sm font-medium">
                  المنتجات
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {filteredStores.length === 0 && (
        <Card className="p-8 text-center">
          <StoreIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد متاجر</h3>
          <p className="text-gray-600">
            {searchTerm || selectedCategory !== 'all' || selectedRegion !== 'all'
              ? 'لم يتم العثور على متاجر تطابق البحث المحدد'
              : 'لا توجد متاجر متاحة حالياً'}
          </p>
        </Card>
      )}
    </main>
  );
}
