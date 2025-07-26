"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Store, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  Clock, 
  Users,
  Package,
  BarChart3,
  ArrowRight,
  Home,
  Search,
  Filter
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface StoreData {
  id: string;
  name: string;
  description?: string;
  category: string;
  rating: number;
  location?: string;
  phone?: string;
  email?: string;
  is_active: boolean;
  created_at: string;
  total_products?: number;
  total_sales?: number;
}

export default function PublicStoresBrowsePage() {
  const [stores, setStores] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { value: 'all', label: 'جميع الفئات' },
    { value: 'materials', label: 'مواد البناء' },
    { value: 'tools', label: 'أدوات ومعدات' },
    { value: 'electrical', label: 'كهربائيات' },
    { value: 'plumbing', label: 'سباكة' },
    { value: 'finishing', label: 'مواد التشطيب' },
    { value: 'decoration', label: 'ديكور' },
    { value: 'services', label: 'خدمات' },
  ];

  const cities = [
    { value: 'all', label: 'جميع المدن' },
    { value: 'الرياض', label: 'الرياض' },
    { value: 'جدة', label: 'جدة' },
    { value: 'الدمام', label: 'الدمام' },
    { value: 'مكة المكرمة', label: 'مكة المكرمة' },
    { value: 'الطائف', label: 'الطائف' },
    { value: 'المدينة المنورة', label: 'المدينة المنورة' },
  ];

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      
      // Using store data that reflects registered stores
      const storesData = getRegisteredStores();
      setStores(storesData);
      
      // TODO: Replace with actual Supabase query when ready
      /*
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false });
      
      if (data) {
        setStores(data);
      }
      */
    } catch (error) {
      console.error('Error fetching stores:', error);
      setStores(getRegisteredStores());
    } finally {
      setLoading(false);
    }
  };

  const getRegisteredStores = (): StoreData[] => [
    {
      id: '1',
      name: 'متجر البناء المتميز',
      description: 'متجر شامل لجميع مواد البناء والتشييد مع خبرة تزيد عن 15 عام',
      category: 'materials',
      rating: 4.5,
      location: 'الرياض، المملكة العربية السعودية',
      phone: '+966 11 123 4567',
      email: 'info@building-store.sa',
      is_active: true,
      created_at: '2023-01-15',
      total_products: 450,
      total_sales: 1250
    },
    {
      id: '2',
      name: 'مؤسسة الحديد والأجهزة',
      description: 'متخصصون في الحديد والمعدات الثقيلة وأدوات البناء المتقدمة',
      category: 'tools',
      rating: 4.2,
      location: 'جدة، المملكة العربية السعودية',
      phone: '+966 12 987 6543',
      email: 'contact@irontools.sa',
      is_active: true,
      created_at: '2023-03-20',
      total_products: 320,
      total_sales: 890
    },
    {
      id: '3',
      name: 'معرض الأدوات الصحية',
      description: 'جميع أنواع الأدوات والتجهيزات الصحية والسباكة عالية الجودة',
      category: 'plumbing',
      rating: 4.7,
      location: 'الدمام، المملكة العربية السعودية',
      phone: '+966 13 456 7890',
      email: 'info@plumbing-store.sa',
      is_active: true,
      created_at: '2023-02-10',
      total_products: 280,
      total_sales: 750
    },
    {
      id: '4',
      name: 'عالم الكهربائيات الحديثة',
      description: 'كل ما تحتاجه من أدوات ومعدات كهربائية ومولدات الطاقة',
      category: 'electrical',
      rating: 4.3,
      location: 'مكة المكرمة، المملكة العربية السعودية',
      phone: '+966 12 555 0123',
      email: 'sales@electrical-world.sa',
      is_active: true,
      created_at: '2023-04-05',
      total_products: 380,
      total_sales: 920
    },
    {
      id: '5',
      name: 'مركز مواد التشطيب',
      description: 'أفضل مواد التشطيب والدهانات والبلاط والسيراميك',
      category: 'finishing',
      rating: 4.6,
      location: 'الطائف، المملكة العربية السعودية',
      phone: '+966 12 777 8899',
      email: 'info@finishing-center.sa',
      is_active: true,
      created_at: '2023-05-12',
      total_products: 520,
      total_sales: 1100
    },
    {
      id: '6',
      name: 'بيت الديكور والتصميم',
      description: 'متخصصون في الديكور الداخلي والخارجي والإكسسوارات',
      category: 'decoration',
      rating: 4.4,
      location: 'المدينة المنورة، المملكة العربية السعودية',
      phone: '+966 14 333 2211',
      email: 'design@decor-house.sa',
      is_active: true,
      created_at: '2023-06-08',
      total_products: 290,
      total_sales: 680
    }
  ];

  // Filter stores based on search criteria
  const filteredStores = stores.filter(store => {
    const matchesCategory = selectedCategory === 'all' || store.category === selectedCategory;
    const matchesCity = selectedCity === 'all' || store.location?.includes(selectedCity);
    const matchesRating = selectedRating === 'all' || 
      (selectedRating === '4+' && store.rating >= 4) ||
      (selectedRating === '3+' && store.rating >= 3);
    const matchesSearch = searchTerm === '' || 
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesCity && matchesRating && matchesSearch;
  });

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.3) 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                منصة بنّا التجارية
              </span>
            </div>
            
            <Link 
              href="/"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 rtl:space-x-reverse"
            >
              <Home className="h-4 w-4" />
              <span>العودة للرئيسية</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Store className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">تصفح المتاجر المسجلة</h1>
          <p className="text-lg text-gray-600">اكتشف أفضل المتاجر المسجلة في منصة بنّا التجارية</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Filter className="ml-2 h-5 w-5" />
            تصفية المتاجر
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الفئة</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">المدينة</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {cities.map(city => (
                  <option key={city.value} value={city.value}>{city.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">التقييم</label>
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع التقييمات</option>
                <option value="4+">4 نجوم فأكثر</option>
                <option value="3+">3 نجوم فأكثر</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">البحث</label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="ابحث عن متجر..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <span>عرض {filteredStores.length} من أصل {stores.length} متجر</span>
            <button 
              onClick={() => {
                setSelectedCategory('all');
                setSelectedCity('all');
                setSelectedRating('all');
                setSearchTerm('');
              }}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              إعادة تعيين
            </button>
          </div>
        </div>

        {/* Stores Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-2xl shadow-xl p-6 h-64"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store) => (
              <div
                key={store.id}
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                      <Store className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{store.name}</h3>
                      <span className="text-sm text-gray-500">{categories.find(c => c.value === store.category)?.label}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{store.description}</p>

                <div className="space-y-2 mb-4">
                  {store.location && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 ml-2" />
                      {store.location}
                    </div>
                  )}
                  {store.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 ml-2" />
                      {store.phone}
                    </div>
                  )}
                  {store.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 ml-2" />
                      {store.email}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4">
                  {renderStarRating(store.rating)}
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 ml-1" />
                    عضو منذ {new Date(store.created_at).getFullYear()}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Package className="w-4 h-4 ml-1" />
                    {store.total_products} منتج
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 ml-1" />
                    {store.total_sales} عملية بيع
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link 
                    href={`/storefront/${store.id}`}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-center text-sm"
                  >
                    زيارة المتجر
                  </Link>
                  <Link 
                    href={`/storefront?store=${store.id}`}
                    className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg transition-colors text-center text-sm border border-gray-200"
                  >
                    عرض المنتجات
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredStores.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Store className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد متاجر</h3>
            <p className="text-gray-600">جرب تغيير معايير البحث أو الفلاتر</p>
          </div>
        )}
      </main>
    </div>
  );
}
