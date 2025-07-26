// @ts-nocheck
"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { cn } from "@/core/shared/utils";
import Link from 'next/link';
import { 
  Store, 
  Users, 
  TrendingUp, 
  ShoppingCart, 
  BarChart3, 
  CreditCard,
  Package,
  MessageSquare,
  Settings,
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
  Target,
  Wallet,
  DollarSign,
  LineChart,
  Activity,
  Download,
  ExternalLink,
  Filter,
  Building2,
  Clock,
  TrendingDown,
  Plus,
  Home
} from "lucide-react";

export const dynamic = 'force-dynamic';

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

// Public Pages Features for navigation
const publicFeatures = [
  {
    id: 'stores',
    title: 'تصفح المتاجر',
    description: 'اكتشف أفضل متاجر مواد البناء والخدمات في المملكة',
    icon: <Store className="w-6 h-6" />,
    href: '/stores-browse',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'products',
    title: 'جميع المنتجات',
    description: 'تصفح آلاف المنتجات من جميع المتاجر في مكان واحد',
    icon: <Package className="w-6 h-6" />,
    href: '/storefront',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'calculator',
    title: 'حاسبة البناء',
    description: 'احسب كميات مواد البناء وتكلفة المشاريع',
    icon: <Activity className="w-6 h-6" />,
    href: '/calculator',
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'projects',
    title: 'مشاريع للبيع',
    description: 'اكتشف أفضل المشاريع العقارية المتاحة للبيع',
    icon: <Building2 className="w-6 h-6" />,
    href: '/projects-for-sale',
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'material-prices',
    title: 'أسعار المواد',
    description: 'تابع أسعار مواد البناء في جميع المدن السعودية',
    icon: <DollarSign className="w-6 h-6" />,
    href: '/material-prices',
    color: 'from-cyan-500 to-cyan-600'
  }
];

export default function HomePage() {
  const [selectedTab, setSelectedTab] = useState<'users' | 'stores'>('users');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedStore, setSelectedStore] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'change' | 'updated'>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const cities = ['all', ...Array.from(new Set(mockPriceData.map(item => item.city)))];
  const stores = ['all', ...Array.from(new Set(mockPriceData.map(item => item.store)))];
  const categories = ['all', ...Array.from(new Set(mockPriceData.map(item => item.category)))];

  // Filter and sort products
  const filteredProducts = mockPriceData.filter(item => {
    const matchesCity = selectedCity === 'all' || item.city === selectedCity;
    const matchesStore = selectedStore === 'all' || item.store === selectedStore;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.store.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCity && matchesStore && matchesCategory && matchesSearch;
  }).sort((a, b) => {
    let aValue: number | string = a[sortBy];
    let bValue: number | string = b[sortBy];
    
    if (sortBy === 'updated') {
      aValue = a.lastUpdated;
      bValue = b.lastUpdated;
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return sortOrder === 'asc' 
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
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
            
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="ابحث عن المنتجات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                />
              </div>
              
              <Link 
                href="/login"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 rtl:space-x-reverse"
              >
                <Plus className="h-4 w-4" />
                <span>تسجيل الدخول</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

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

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-8 space-y-8">
        
        {/* Public Pages Navigation */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Globe className="w-6 h-6 text-blue-600" />
              الصفحات العامة
            </h2>
            <div className="flex gap-2">
              <Link href="/stores-browse" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                عرض الكل
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {publicFeatures.map((feature) => (
              <Link key={feature.id} href={feature.href}>
                <div className="group relative">
                  <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-transparent hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Price Tracker Dashboard */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                متابع الأسعار المباشر
              </h2>
              <p className="text-gray-600 mt-1">تابع أسعار المنتجات والمواد الخام لحظة بلحظة</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={shareData}
                className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                مشاركة
              </button>
              <button className="bg-green-50 hover:bg-green-100 text-green-600 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                تصدير
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Filter className="ml-2 h-5 w-5" />
              تصفية النتائج
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المدينة</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">جميع المدن</option>
                  {cities.filter(city => city !== 'all').map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المتجر</label>
                <select
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">جميع المتاجر</option>
                  {stores.filter(store => store !== 'all').map(store => (
                    <option key={store} value={store}>{store}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الفئة</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">جميع الفئات</option>
                  {categories.filter(category => category !== 'all').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ترتيب حسب</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'price' | 'change' | 'updated')}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="price">السعر</option>
                  <option value="change">التغيير</option>
                  <option value="updated">آخر تحديث</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع الترتيب</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="asc">تصاعدي</option>
                  <option value="desc">تنازلي</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <span>عرض {filteredProducts.length} من أصل {mockPriceData.length} منتج</span>
              <button 
                onClick={() => {
                  setSelectedCity('all');
                  setSelectedStore('all');
                  setSelectedCategory('all');
                  setSearchTerm('');
                  setSortBy('price');
                  setSortOrder('asc');
                }}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                إعادة تعيين
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {filteredProducts.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{item.product}</h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {item.category}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-600">
                      <span className="flex items-center">
                        <Building2 className="ml-1 h-4 w-4" />
                        {item.store}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="ml-1 h-4 w-4" />
                        {item.city}
                      </span>
                      <span className="flex items-center">
                        <Clock className="ml-1 h-4 w-4" />
                        {item.lastUpdated}
                      </span>
                    </div>
                  </div>

                  <div className="text-left">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {item.price.toLocaleString()} ر.س
                    </div>
                    <div className={`flex items-center text-sm font-medium ${
                      item.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.change >= 0 ? (
                        <TrendingUp className="ml-1 h-4 w-4" />
                      ) : (
                        <TrendingDown className="ml-1 h-4 w-4" />
                      )}
                      {item.change >= 0 ? '+' : ''}{item.change}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد نتائج</h3>
              <p className="text-gray-600">جرب تغيير معايير البحث أو الفلاتر</p>
            </div>
          )}
        </div>

        {/* Features Tabs */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setSelectedTab('users')}
                className={cn(
                  "flex-1 px-6 py-4 text-center font-medium transition-colors relative",
                  selectedTab === 'users'
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                )}
              >
                <div className="flex items-center justify-center gap-2">
                  <Users className="w-5 h-5" />
                  ميزات المستخدمين
                </div>
                {selectedTab === 'users' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>
              <button
                onClick={() => setSelectedTab('stores')}
                className={cn(
                  "flex-1 px-6 py-4 text-center font-medium transition-colors relative",
                  selectedTab === 'stores'
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                )}
              >
                <div className="flex items-center justify-center gap-2">
                  <Store className="w-5 h-5" />
                  ميزات المتاجر
                </div>
                {selectedTab === 'stores' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                )}
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(selectedTab === 'users' ? userFeatures : storeFeatures).map((feature, index) => (
                <div key={index} className="group relative">
                  <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-transparent hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                    {feature.link && (
                      <div className="mt-4">
                        <Link 
                          href={feature.link}
                          className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          اكتشف المزيد
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-center py-6 text-gray-500 text-sm">
          <p>© 2024 منصة بنّا التجارية - جميع الحقوق محفوظة</p>
          <p className="mt-1">مقدم لك بواسطة فريق بنّا للتطوير</p>
        </div>
      </div>
    </div>
  );
}
