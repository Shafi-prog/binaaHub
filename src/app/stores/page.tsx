'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Card, LoadingSpinner, EmptyState } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { Search, MapPin, Star, Filter, Grid, List } from 'lucide-react';

interface Store {
  id: string;
  user_id: string;
  store_name: string;
  description: string | null;
  category: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  region: string | null;
  website: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  rating: number;
  total_reviews: number;
  is_verified: boolean;
  is_active: boolean;
  delivery_areas: string[] | null;
  working_hours: any | null;
  payment_methods: string[] | null;
  created_at: string;
  updated_at: string;
}

interface Product {
  id: string;
  store_id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
}

type ViewMode = 'grid' | 'list';

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isHydrated, setIsHydrated] = useState(false);

  const supabase = createClientComponentClient();

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;    const fetchStores = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔍 [Stores] Fetching active stores...');
        console.log('🔗 [Stores] Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
        console.log('🔑 [Stores] Has Anon Key:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
        
        // Test basic connection first
        const { error: connectionError } = await supabase
          .from('stores')
          .select('count')
          .limit(1);
          
        if (connectionError) {
          console.error('❌ [Stores] Connection test failed:', connectionError);
        } else {
          console.log('✅ [Stores] Connection test successful');
        }
        
        // Fetch active stores
        const { data: storesData, error: storesError } = await supabase
          .from('stores')
          .select('*')
          .eq('is_active', true)
          .order('rating', { ascending: false });if (storesError) {
          console.error('❌ [Stores] Supabase error details:');
          console.error('Error message:', storesError.message || 'Unknown error');
          console.error('Error code:', storesError.code || 'No code');
          console.error('Error hint:', storesError.hint || 'No hint');
          console.error('Error details:', storesError.details || 'No details');
          
          // If there's a database error, use mock data for development
          console.log('🔄 [Stores] Using mock data due to database error');
          const mockStores: Store[] = [
            {
              id: '1',
              user_id: 'user1',
              store_name: 'متجر البناء المحترف',
              description: 'متجر متخصص في مواد البناء والتشييد عالية الجودة',
              category: 'مواد البناء',
              phone: '+966501234567',
              email: 'info@building-pro.com',
              address: 'حي الملك فهد، الرياض',
              city: 'الرياض',
              region: 'الرياض',
              website: 'https://building-pro.com',
              logo_url: null,
              cover_image_url: null,
              rating: 4.8,
              total_reviews: 127,
              is_verified: true,
              is_active: true,
              delivery_areas: ['الرياض', 'جدة', 'الدمام'],
              working_hours: {
                saturday: '8:00-22:00',
                sunday: '8:00-22:00',
                monday: '8:00-22:00',
                tuesday: '8:00-22:00',
                wednesday: '8:00-22:00',
                thursday: '8:00-22:00',
                friday: '14:00-22:00',
              },
              payment_methods: ['cash', 'card', 'transfer'],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: '2',
              user_id: 'user2',
              store_name: 'سوق الأدوات الكهربائية',
              description: 'تشكيلة واسعة من الأدوات الكهربائية والمعدات',
              category: 'أدوات كهربائية',
              phone: '+966507654321',
              email: 'contact@electrical-tools.com',
              address: 'حي العليا، جدة',
              city: 'جدة',
              region: 'مكة المكرمة',
              website: null,
              logo_url: null,
              cover_image_url: null,
              rating: 4.5,
              total_reviews: 89,
              is_verified: true,
              is_active: true,
              delivery_areas: ['جدة', 'مكة', 'الطائف'],
              working_hours: {
                saturday: '9:00-21:00',
                sunday: '9:00-21:00',
                monday: '9:00-21:00',
                tuesday: '9:00-21:00',
                wednesday: '9:00-21:00',
                thursday: '9:00-21:00',
                friday: '15:00-21:00',
              },
              payment_methods: ['cash', 'card'],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: '3',
              user_id: 'user3',
              store_name: 'معرض الإضاءة الحديثة',
              description: 'حلول إضاءة عصرية للمنازل والمكاتب',
              category: 'إضاءة',
              phone: '+966555111222',
              email: 'sales@modern-lighting.sa',
              address: 'شارع التحلية، الخبر',
              city: 'الخبر',
              region: 'الشرقية',
              website: 'https://modern-lighting.sa',
              logo_url: null,
              cover_image_url: null,
              rating: 4.2,
              total_reviews: 45,
              is_verified: false,
              is_active: true,
              delivery_areas: ['الخبر', 'الدمام', 'القطيف'],
              working_hours: {
                saturday: '10:00-20:00',
                sunday: '10:00-20:00',
                monday: '10:00-20:00',
                tuesday: '10:00-20:00',
                wednesday: '10:00-20:00',
                thursday: '10:00-20:00',
                friday: '16:00-20:00',
              },
              payment_methods: ['cash', 'card', 'transfer'],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ];
          
          setStores(mockStores);
          console.log('✅ [Stores] Loaded mock stores:', mockStores.length);
          return;
        }

        setStores(storesData || []);
        console.log('✅ [Stores] Loaded stores:', storesData?.length || 0);
      } catch (error) {
        console.error('❌ [Stores] Error loading stores:', error);
        setError('حدث خطأ في تحميل المتاجر');
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [isHydrated, supabase]);

  // Filter stores based on search and filters
  const filteredStores = stores.filter((store) => {
    const matchesSearch = 
      store.store_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || store.category === selectedCategory;
    const matchesCity = selectedCity === 'all' || store.city === selectedCity;
    
    return matchesSearch && matchesCategory && matchesCity;
  });

  // Get unique categories and cities for filters
  const categories = Array.from(new Set(stores.map(s => s.category).filter(Boolean)));
  const cities = Array.from(new Set(stores.map(s => s.city).filter(Boolean)));

  if (!isHydrated || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="text-blue-600 hover:underline"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-tajawal">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">تصفح المتاجر</h1>
          <p className="text-gray-600">اكتشف المتاجر المتخصصة في مواد البناء والإنشاءات</p>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث في المتاجر..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">جميع الفئات</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">جميع المدن</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              عرض {filteredStores.length} من {stores.length} متجر
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Card>

        {/* Stores Grid/List */}
        {filteredStores.length === 0 ? (
          <EmptyState
            title="لا توجد متاجر"
            description="لم يتم العثور على متاجر تطابق معايير البحث الخاصة بك"
          />
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {filteredStores.map((store) => (
              <StoreCard 
                key={store.id} 
                store={store} 
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Store Card Component
function StoreCard({ store, viewMode }: { store: Store; viewMode: ViewMode }) {
  const isGridView = viewMode === 'grid';

  return (
    <Card className={`hover:shadow-lg transition-shadow ${
      isGridView ? 'p-6' : 'p-4'
    }`}>
      <Link href={`/stores/${store.id}`}>
        <div className={isGridView ? 'space-y-4' : 'flex gap-4'}>
          {/* Store Logo/Cover */}
          <div className={isGridView ? 'w-full h-48' : 'w-24 h-24 flex-shrink-0'}>
            {store.cover_image_url || store.logo_url ? (
              <img
                src={store.cover_image_url || store.logo_url || ''}
                alt={store.store_name}
                className={`w-full h-full object-cover rounded-lg ${
                  !isGridView ? 'rounded-lg' : ''
                }`}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center`}>
                <span className="text-white font-bold text-2xl">
                  {store.store_name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Store Info */}
          <div className={isGridView ? 'space-y-3' : 'flex-1 space-y-2'}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className={`font-bold text-gray-800 hover:text-blue-600 transition-colors ${
                  isGridView ? 'text-xl' : 'text-lg'
                }`}>
                  {store.store_name}
                  {store.is_verified && (
                    <span className="inline-block mr-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      موثق
                    </span>
                  )}
                </h3>
                {store.category && (
                  <p className="text-sm text-gray-500 mt-1">{store.category}</p>
                )}
              </div>
            </div>

            {store.description && (
              <p className={`text-gray-600 ${
                isGridView ? 'line-clamp-3' : 'line-clamp-2'
              }`}>
                {store.description}
              </p>
            )}

            {/* Rating and Reviews */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-700 mr-1">
                  {store.rating.toFixed(1)}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                ({store.total_reviews} تقييم)
              </span>
            </div>

            {/* Location */}
            {store.city && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{store.city}</span>
                {store.region && (
                  <span className="text-sm text-gray-500">، {store.region}</span>
                )}
              </div>
            )}

            {/* Payment Methods */}
            {store.payment_methods && store.payment_methods.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {store.payment_methods.slice(0, 3).map((method, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                  >
                    {method}
                  </span>
                ))}
                {store.payment_methods.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{store.payment_methods.length - 3} المزيد
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
}
