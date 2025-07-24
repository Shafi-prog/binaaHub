'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useState, useEffect } from "react";
import { cn } from "@/core/shared/utils";
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';
import { 
  Store, 
  Users, 
  TrendingUp, 
  ShoppingCart, 
  BarChart3, 
  CreditCard,
  Package,
  MessageSquare,
  Globe,
  MapPin,
  Share2,
  Bell,
  Search,
  Heart,
  Star,
  Shield,
  Truck,
  Award,
  Zap,
  Wallet,
  Activity,
  ExternalLink,
  Filter,
  ChevronDown,
  SlidersHorizontal,
  Calendar,
  Book
} from "lucide-react";

interface PriceData {
  product: string;
  category: string;
  price: number;
  change: number;
  store: string;
  city: string;
  lastUpdated: string;
}

const mockPriceData: PriceData[] = [
  // Metal Products
  { product: "طن حديد", category: "معادن", price: 450, change: +12.5, store: "شركة الخليج للحديد", city: "الرياض", lastUpdated: "منذ ساعتين" },
  { product: "كيلو نحاس", category: "معادن", price: 8.75, change: -3.2, store: "عالم المعادن", city: "دبي", lastUpdated: "منذ ساعة" },
  { product: "طن ألمونيوم", category: "معادن", price: 2100, change: +5.8, store: "المنارة للمعادن", city: "الكويت", lastUpdated: "منذ 30 دقيقة" },
  { product: "طن حديد تسليح", category: "معادن", price: 520, change: +8.2, store: "مملكة الحديد", city: "الرياض", lastUpdated: "منذ 3 ساعات" },
  { product: "كيلو زنك", category: "معادن", price: 3.20, change: -1.5, store: "شركة الخليج للحديد", city: "دبي", lastUpdated: "منذ ساعة" },
  
  // Precious Metals
  { product: "جرام ذهب", category: "معادن ثمينة", price: 235, change: +1.2, store: "قصر الذهب", city: "الدوحة", lastUpdated: "منذ 15 دقيقة" },
  { product: "أونصة فضة", category: "معادن ثمينة", price: 24.50, change: -0.8, store: "نجمة الفضة", city: "المنامة", lastUpdated: "منذ 45 دقيقة" },
  { product: "جرام بلاتين", category: "معادن ثمينة", price: 32.5, change: +2.1, store: "شركة المعادن الثمينة", city: "الرياض", lastUpdated: "منذ ساعتين" },
  
  // Construction Materials
  { product: "كيس إسمنت 50كغ", category: "مواد بناء", price: 18.5, change: +3.4, store: "أساتذة البناء", city: "الرياض", lastUpdated: "منذ 4 ساعات" },
  { product: "طن رمل", category: "مواد بناء", price: 45, change: +5.2, store: "البناء بلس", city: "دبي", lastUpdated: "منذ 3 ساعات" },
  { product: "طن حصى", category: "مواد بناء", price: 55, change: -2.1, store: "أساتذة البناء", city: "الكويت", lastUpdated: "منذ ساعتين" },
  { product: "1000 طوبة", category: "مواد بناء", price: 280, change: +4.5, store: "مصنع الطوب", city: "الدوحة", lastUpdated: "منذ 5 ساعات" },
  { product: "بلاط للمتر المربع", category: "مواد بناء", price: 85, change: -1.2, store: "عالم البلاط", city: "المنامة", lastUpdated: "منذ 3 ساعات" },
  
  // Electronics
  { product: "سلك نحاس 100م", category: "إلكترونيات", price: 125, change: +6.8, store: "الكهرباء المحترفة", city: "الرياض", lastUpdated: "منذ ساعة" },
  { product: "لمبة LED", category: "إلكترونيات", price: 15.5, change: -2.3, store: "بيت الإضاءة", city: "دبي", lastUpdated: "منذ ساعتين" },
  { product: "مفتاح كهرباء", category: "إلكترونيات", price: 25, change: +1.8, store: "الكهرباء المحترفة", city: "الكويت", lastUpdated: "منذ 4 ساعات" },
  
  // Textiles
  { product: "متر قماش قطني", category: "منسوجات", price: 12.5, change: +2.8, store: "أرض الأقمشة", city: "الرياض", lastUpdated: "منذ 6 ساعات" },
  { product: "متر قماش حريري", category: "منسوجات", price: 45, change: -1.5, store: "الأقمشة الفاخرة", city: "دبي", lastUpdated: "منذ 3 ساعات" },
  { product: "متر قماش صوفي", category: "منسوجات", price: 28, change: +3.2, store: "أرض الأقمشة", city: "الدوحة", lastUpdated: "منذ 4 ساعات" },
  
  // Food & Commodities
  { product: "طن قمح", category: "غذائيات", price: 320, change: +4.5, store: "سوق الحبوب", city: "الرياض", lastUpdated: "منذ 5 ساعات" },
  { product: "طن أرز", category: "غذائيات", price: 580, change: -2.1, store: "مركز الغذاء", city: "دبي", lastUpdated: "منذ 3 ساعات" },
  { product: "طن سكر", category: "غذائيات", price: 450, change: +1.8, store: "إمداد الحلويات", city: "الكويت", lastUpdated: "منذ ساعتين" },
  { product: "Coffee Kg", category: "Food", price: 25, change: +5.2, store: "Coffee Masters", city: "Manama", lastUpdated: "1 hour ago" },
];

interface Feature {
  icon: React.ReactElement;
  title: string;
  description: string;
  color: string;
  link?: string;
}

const userFeatures: Feature[] = [
  {
    icon: <Search className="w-6 h-6" />,
    title: "البحث الذكي",
    description: "ابحث عن المنتجات والمتاجر بسهولة",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: <ShoppingCart className="w-6 h-6" />,
    title: "سلة التسوق",
    description: "إدارة مشترياتك بكل سهولة",
    color: "from-green-500 to-green-600"
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "قائمة الأمنيات",
    description: "احفظ منتجاتك المفضلة",
    color: "from-red-500 to-red-600"
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "التقييمات والمراجعات",
    description: "شارك تجربتك مع المنتجات",
    color: "from-yellow-500 to-yellow-600"
  },
  {
    icon: <Bell className="w-6 h-6" />,
    title: "التنبيهات الذكية",
    description: "تنبيهات الأسعار والعروض",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: <CreditCard className="w-6 h-6" />,
    title: "الدفع الآمن",
    description: "طرق دفع متعددة وآمنة",
    color: "from-indigo-500 to-indigo-600"
  },
  {
    icon: <Truck className="w-6 h-6" />,
    title: "تتبع الشحنات",
    description: "تابع طلباتك لحظة بلحظة",
    color: "from-cyan-500 to-cyan-600"
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "الدعم الفوري",
    description: "دعم عملاء على مدار الساعة",
    color: "from-teal-500 to-teal-600"
  }
];

const storeFeatures: Feature[] = [
  {
    icon: <Store className="w-6 h-6" />,
    title: "إدارة المتجر",
    description: "لوحة تحكم شاملة لمتجرك",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: <Package className="w-6 h-6" />,
    title: "إدارة المخزون",
    description: "تتبع المنتجات والكميات",
    color: "from-green-500 to-green-600"
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "تحليلات المبيعات",
    description: "تقارير مفصلة ورؤى تجارية",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "إدارة العملاء",
    description: "قاعدة عملاء متقدمة",
    color: "from-orange-500 to-orange-600"
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "تحسين الأداء",
    description: "نصائح لزيادة المبيعات",
    color: "from-red-500 to-red-600"
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "التسويق الرقمي",
    description: "أدوات ترويج متقدمة",
    color: "from-indigo-500 to-indigo-600"
  },
  {
    icon: <Wallet className="w-6 h-6" />,
    title: "الإدارة المالية",
    description: "تتبع الأرباح والمصروفات",
    color: "from-cyan-500 to-cyan-600"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "الأمان والحماية",
    description: "حماية بياناتك ومعاملاتك",
    color: "from-teal-500 to-teal-600"
  }
];

export default function MainLandingPage() {
  const [selectedTab, setSelectedTab] = useState<'users' | 'stores'>('users');
  const [isMounted, setIsMounted] = useState(false);
  
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedStore, setSelectedStore] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Ensure client-side rendering for locale-dependent content
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Consistent number formatting function
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  // Consistent date formatting function
  const formatDate = (date: string): string => {
    if (!isMounted) return date; // Return raw date on server
    return new Date(date).toLocaleDateString('ar');
  };

  // Get unique values for filters
  const cities = ['all', ...Array.from(new Set(mockPriceData.map(item => item.city)))];
  const stores = ['all', ...Array.from(new Set(mockPriceData.map(item => item.store)))];
  const categories = ['all', ...Array.from(new Set(mockPriceData.map(item => item.category)))];

  // Filter products based on search and filters
  const filteredProducts = mockPriceData.filter(item => {
    const matchesSearch = item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.store.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === 'all' || item.city === selectedCity;
    const matchesStore = selectedStore === 'all' || item.store === selectedStore;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCity && matchesStore && matchesCategory;
  });

  const shareData = () => {
    const text = "تابع أسعار المنتجات لحظة بلحظة على منصة بنّا التجارية";
    const url = typeof window !== "undefined" ? window.location.origin : "";
    
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: "منصة بنّا - متابعة الأسعار",
        text: text,
        url: url,
      });
    } else if (typeof window !== "undefined") {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      window.open(twitterUrl, '_blank');
    }
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

      {/* Header */}
      <div className="relative z-10 pt-8 pb-4">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-white font-bold text-3xl">بـ</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">منصة بنّا التجارية</h1>
          <p className="text-lg text-gray-600">منصتك الشاملة للتجارة الإلكترونية في الخليج العربي</p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Search className="w-6 h-6 text-blue-600" />
              ابحث في المنتجات
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              فلاتر متقدمة
              <ChevronDown className={cn("w-4 h-4 transition-transform", showFilters && "rotate-180")} />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث عن المنتجات أو المتاجر..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
            />
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              {/* City Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المدينة</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {cities.map(city => (
                    <option key={city} value={city}>
                      {city === 'all' ? 'جميع المدن' : city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Store Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المتجر</label>
                <select
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {stores.map(store => (
                    <option key={store} value={store}>
                      {store === 'all' ? 'جميع المتاجر' : store}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الفئة</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'جميع الفئات' : 
                       category === 'Metal' ? 'معادن' :
                       category === 'Precious' ? 'معادن ثمينة' :
                       category === 'Construction' ? 'مواد بناء' :
                       category === 'Electronics' ? 'إلكترونيات' :
                       category === 'Textiles' ? 'منسوجات' :
                       category === 'Food' ? 'مواد غذائية' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>عرض {filteredProducts.length} من أصل {mockPriceData.length} منتج</span>
            {(searchQuery || selectedCity !== 'all' || selectedStore !== 'all' || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCity('all');
                  setSelectedStore('all');
                  setSelectedCategory('all');
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                مسح الفلاتر
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-8 space-y-8">
        {/* Price Tracker Dashboard - Filtered Results */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                متابع الأسعار المباشر
              </h2>
              <p className="text-gray-600">تابع أسعار المنتجات لحظة بلحظة من جميع المتاجر</p>
            </div>
            <button
              onClick={shareData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              مشاركة
            </button>
          </div>

          {/* No Results Message */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد منتجات مطابقة</h3>
              <p className="text-gray-500">جرب تغيير معايير البحث أو الفلاتر</p>
            </div>
          )}

          {/* Price Data Grid - Filtered */}
          {filteredProducts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {filteredProducts.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">{item.product}</h3>
                    <span className={cn(
                      "text-sm font-medium px-2 py-1 rounded-full",
                      item.change > 0 
                        ? "bg-green-100 text-green-600" 
                        : "bg-red-100 text-red-600"
                    )}>
                      {item.change > 0 ? '+' : ''}{item.change}%
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">السعر:</span>
                      <span className="font-semibold text-gray-800">{formatPrice(item.price)} ر.س</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">الفئة:</span>
                      <span className="text-gray-700">
                        {item.category === 'Metal' ? 'معادن' :
                         item.category === 'Precious' ? 'معادن ثمينة' :
                         item.category === 'Construction' ? 'مواد بناء' :
                         item.category === 'Electronics' ? 'إلكترونيات' :
                         item.category === 'Textiles' ? 'منسوجات' :
                         item.category === 'Food' ? 'مواد غذائية' : item.category}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">المتجر:</span>
                      <span className="text-gray-700">{item.store}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">المدينة:</span>
                      <span className="text-gray-700 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.city}
                      </span>
                    </div>
                    <div className="text-gray-500 text-xs">
                      آخر تحديث: {item.lastUpdated}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg">
              <Activity className="w-4 h-4" />
              يتم تحديث الأسعار كل 15 دقيقة • مقدم من منصة بنّا
            </div>
          </div>
        </div>

        {/* Feature Showcase Tabs */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Tab Headers */}
          <div className="flex bg-gray-50 border-b border-gray-200">
            <button
              onClick={() => setSelectedTab('users')}
              className={cn(
                "flex-1 px-6 py-4 text-lg font-semibold transition-colors flex items-center justify-center gap-2",
                selectedTab === 'users'
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-blue-600"
              )}
            >
              <Users className="w-5 h-5" />
              ميزات المستخدمين
            </button>
            <button
              onClick={() => setSelectedTab('stores')}
              className={cn(
                "flex-1 px-6 py-4 text-lg font-semibold transition-colors flex items-center justify-center gap-2",
                selectedTab === 'stores'
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-blue-600"
              )}
            >
              <Store className="w-5 h-5" />
              ميزات المتاجر
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(selectedTab === 'users' ? userFeatures : storeFeatures).map((feature, index) => {
                const FeatureCard = (
                  <div
                    key={index}
                    className="group p-6 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50 cursor-pointer"
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl bg-gradient-to-r mb-4 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300",
                      feature.color
                    )}>
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                    {feature.link && (
                      <div className="mt-3 flex items-center text-blue-600 text-sm group-hover:text-blue-700">
                        <span>استكشف المزيد</span>
                        <ExternalLink className="w-4 h-4 mr-1" />
                      </div>
                    )}
                  </div>
                );

                return feature.link ? (
                  <Link key={index} href={feature.link} className="block">
                    {FeatureCard}
                  </Link>
                ) : (
                  FeatureCard
                );
              })}
            </div>
          </div>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Store className="w-8 h-8" />
              <span className="text-2xl font-bold">2,500+</span>
            </div>
            <p className="text-blue-100">متجر مسجل</p>
          </div>
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-8 h-8" />
              <span className="text-2xl font-bold">50,000+</span>
            </div>
            <p className="text-green-100">مستخدم نشط</p>
          </div>
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-8 h-8" />
              <span className="text-2xl font-bold">100,000+</span>
            </div>
            <p className="text-purple-100">منتج متاح</p>
          </div>
          <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-8 h-8" />
              <span className="text-2xl font-bold">99.9%</span>
            </div>
            <p className="text-orange-100">نسبة الرضا</p>
          </div>
        </div>

        {/* Featured Projects Marketplace */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Store className="w-6 h-6 text-blue-600" />
                  مشاريع مميزة للبيع
                </h2>
                <p className="text-gray-600">اكتشف المشاريع المكتملة المعروضة للبيع من المطورين</p>
              </div>
              <Link 
                href="/user/projects-marketplace"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>عرض الكل</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Sample Featured Projects */}
              {[
                {
                  id: '1',
                  name: 'فيلا عصرية - حي الملك فهد',
                  location: 'الرياض',
                  price: 850000,
                  totalCost: 650000,
                  profitPercentage: 30.8,
                  area: 400,
                  rooms: 5,
                  image: '/api/placeholder/300/200',
                  completionDate: '2024-01-15',
                  features: ['حديقة خاصة', 'مسبح', 'مرآب']
                },
                {
                  id: '2', 
                  name: 'شقة فاخرة - برج الأعمال',
                  location: 'جدة',
                  price: 520000,
                  totalCost: 420000,
                  profitPercentage: 23.8,
                  area: 180,
                  rooms: 3,
                  image: '/api/placeholder/300/200',
                  completionDate: '2024-02-20',
                  features: ['إطلالة بحرية', 'أمن 24/7', 'جيم']
                },
                {
                  id: '3',
                  name: 'مجمع تجاري صغير',
                  location: 'الدمام',
                  price: 1200000,
                  totalCost: 950000,
                  profitPercentage: 26.3,
                  area: 600,
                  rooms: 8,
                  image: '/api/placeholder/300/200',
                  completionDate: '2024-03-10',
                  features: ['موقف سيارات', 'مصعد', 'أمن']
                }
              ].map((project) => (
                <div key={project.id} className="group bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
                  {/* Project Image */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">صورة المشروع</p>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      للبيع
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                      {project.area} م²
                    </div>
                  </div>
                  
                  {/* Project Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {project.name}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{project.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>اكتمل: {formatDate(project.completionDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        <span>{project.rooms} غرف</span>
                      </div>
                    </div>
                    
                    {/* Features */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.features.slice(0, 2).map((feature, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                          {feature}
                        </span>
                      ))}
                      {project.features.length > 2 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          +{project.features.length - 2}
                        </span>
                      )}
                    </div>
                    
                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {formatPrice(project.price)} ر.س
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatPrice(Math.round(project.price / project.area))} ر.س/م²
                        </div>
                        {/* Profit Information */}
                        <div className="text-xs text-blue-600 mt-1">
                          ربح {project.profitPercentage.toFixed(1)}% • تكلفة {formatPrice(project.totalCost)} ر.س
                        </div>
                      </div>
                      <Link
                        href={`/user/projects-marketplace/${project.id}`}
                        className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
                      >
                        <span>عرض</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Browse All Link */}
            <div className="text-center mt-6">
              <Link
                href="/user/projects-marketplace"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              >
                <Store className="w-5 h-5" />
                <span>تصفح جميع المشاريع</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Construction Features Section */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Package className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">خدمات البناء والتشييد</h2>
              <p className="text-lg text-gray-600">دليل شامل لمساعدتك في إنجاز مشروع البناء بكفاءة ووفقاً للمعايير السعودية</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* Construction Steps Guide */}
              <Link href="/construction-data" 
                    className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 hover:shadow-lg transition-all group">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-blue-800">خطوات البناء</h3>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  دليل مفصل لجميع مراحل البناء من التخطيط حتى التسليم
                </p>
                <div className="flex items-center text-blue-600 text-sm font-medium">
                  <span>اطلع على الدليل</span>
                  <ExternalLink className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Building Advice */}
              <Link href="/user/building-advice" 
                    className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 hover:shadow-lg transition-all group">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-green-800">نصائح البناء</h3>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  نصائح تفاعلية من خبراء البناء مع أدلة PDF رسمية
                </p>
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <span>احصل على النصائح</span>
                  <ExternalLink className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Project Creation */}
              <Link href="/user/projects/create" 
                    className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 hover:shadow-lg transition-all group">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                    <Store className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-purple-800">إنشاء مشروع</h3>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  ابدأ مشروعك مع تتبع المراحل ورفع صور التقدم
                </p>
                <div className="flex items-center text-purple-600 text-sm font-medium">
                  <span>أنشئ مشروعك</span>
                  <ExternalLink className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Pages Documentation */}
              <Link href="/platform-pages" 
                    className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl border border-indigo-200 hover:shadow-lg transition-all group">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mr-3">
                    <Book className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-indigo-800">دليل الصفحات</h3>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  دليل شامل لجميع صفحات المنصة مع روابط مباشرة للاختبار
                </p>
                <div className="flex items-center text-indigo-600 text-sm font-medium">
                  <span>استعرض الصفحات</span>
                  <ExternalLink className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Construction Materials Prices */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-orange-800">أسعار مواد البناء</h3>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  تابع أسعار مواد البناء لحظة بلحظة في الأسواق المحلية
                </p>
                <div className="flex items-center text-orange-600 text-sm font-medium">
                  <span>متوفر بالأسفل</span>
                  <Activity className="w-4 h-4 mr-2" />
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
                <p className="text-gray-600">خطوة بناء مفصلة</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">25+</div>
                <p className="text-gray-600">دليل PDF رسمي</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">100+</div>
                <p className="text-gray-600">نصيحة من الخبراء</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">109+</div>
                <p className="text-gray-600">صفحة موثقة</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer">
            <Zap className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="text-xl font-semibold">ابدأ رحلتك التجارية الآن</span>
            <ExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center py-6 text-gray-500 text-sm">
        <p>© 2024 منصة بنّا التجارية - جميع الحقوق محفوظة</p>
        <p className="mt-1">مقدم لك بواسطة فريق بنّا للتطوير</p>
      </div>
    </div>
  );
}
