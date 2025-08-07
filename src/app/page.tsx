// @ts-nocheck
"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { cn } from "@/core/shared/utils";
import { supabaseDataService } from "@/services/supabase-data-service";
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

// Default price data for fallback
const defaultPriceData: PriceData[] = [
  {
    product: "اسمنت عادي",
    category: "مواد خام",
    price: 142,
    change: 2.5,
    store: "مؤسسة البناء الحديث",
    city: "الرياض",
    lastUpdated: "2024-01-15T10:30:00Z"
  },
  {
    product: "اسمنت مقاوم",
    category: "مواد خام",
    price: 165,
    change: -1.2,
    store: "شركة الخليج للمواد",
    city: "جدة",
    lastUpdated: "2024-01-15T10:45:00Z"
  },
  {
    product: "حديد التسليح 12مم",
    category: "حديد",
    price: 3200,
    change: 5.8,
    store: "مجموعة الحديد الوطني",
    city: "الدمام",
    lastUpdated: "2024-01-15T11:00:00Z"
  },
  {
    product: "حديد التسليح 16مم",
    category: "حديد",
    price: 3450,
    change: 4.2,
    store: "مؤسسة البناء الحديث",
    city: "الرياض",
    lastUpdated: "2024-01-15T11:15:00Z"
  },
  {
    product: "طوب احمر",
    category: "طوب",
    price: 0.85,
    change: -0.5,
    store: "مصنع الطوب الأحمر",
    city: "الرياض",
    lastUpdated: "2024-01-15T11:30:00Z"
  },
  {
    product: "طوب اسمنتي",
    category: "طوب",
    price: 1.20,
    change: 1.8,
    store: "شركة الخليج للمواد",
    city: "جدة",
    lastUpdated: "2024-01-15T11:45:00Z"
  },
  {
    product: "رمل مغسول",
    category: "رمل",
    price: 85,
    change: 0.0,
    store: "مقالع الرمل الذهبي",
    city: "الرياض",
    lastUpdated: "2024-01-15T12:00:00Z"
  },
  {
    product: "حصى ناعم",
    category: "حصى",
    price: 95,
    change: 2.1,
    store: "مجموعة الحديد الوطني",
    city: "الدمام",
    lastUpdated: "2024-01-15T12:15:00Z"
  },
  {
    product: "دهان داخلي",
    category: "دهانات",
    price: 45,
    change: -2.8,
    store: "معرض الألوان",
    city: "جدة",
    lastUpdated: "2024-01-15T12:30:00Z"
  },
  {
    product: "دهان خارجي",
    category: "دهانات",
    price: 65,
    change: 1.5,
    store: "مؤسسة البناء الحديث",
    city: "الرياض",
    lastUpdated: "2024-01-15T12:45:00Z"
  },
  {
    product: "بلاط سيراميك 40x40",
    category: "بلاط",
    price: 25,
    change: 0.8,
    store: "معرض السيراميك الفاخر",
    city: "الرياض",
    lastUpdated: "2024-01-15T13:00:00Z"
  },
  {
    product: "بلاط بورسلين 60x60",
    category: "بلاط",
    price: 45,
    change: 3.2,
    store: "شركة الخليج للمواد",
    city: "جدة",
    lastUpdated: "2024-01-15T13:15:00Z"
  },
  {
    product: "رخام كرارة",
    category: "رخام",
    price: 180,
    change: -1.8,
    store: "معرض الرخام الإيطالي",
    city: "الرياض",
    lastUpdated: "2024-01-15T13:30:00Z"
  },
  {
    product: "جرانيت أسود",
    category: "جرانيت",
    price: 220,
    change: 4.5,
    store: "مجموعة الحديد الوطني",
    city: "الدمام",
    lastUpdated: "2024-01-15T13:45:00Z"
  },
  {
    product: "كابلات كهرباء 2.5مم",
    category: "كهرباء",
    price: 12,
    change: 2.0,
    store: "محل الكهرباء المتقدم",
    city: "جدة",
    lastUpdated: "2024-01-15T14:00:00Z"
  },
  {
    product: "مواسير PVC 4 انش",
    category: "سباكة",
    price: 35,
    change: -0.8,
    store: "مؤسسة البناء الحديث",
    city: "الرياض",
    lastUpdated: "2024-01-15T14:15:00Z"
  },
  {
    product: "خشب صنوبر",
    category: "خشب",
    price: 450,
    change: 6.2,
    store: "معرض الأخشاب الطبيعية",
    city: "الرياض",
    lastUpdated: "2024-01-15T14:30:00Z"
  },
  {
    product: "زجاج مضاعف 6مم",
    category: "زجاج",
    price: 85,
    change: 1.2,
    store: "شركة الخليج للمواد",
    city: "جدة",
    lastUpdated: "2024-01-15T14:45:00Z"
  },
  {
    product: "عازل حراري",
    category: "عزل",
    price: 25,
    change: 0.5,
    store: "مجموعة الحديد الوطني",
    city: "الدمام",
    lastUpdated: "2024-01-15T15:00:00Z"
  },
  {
    product: "بويه أساس",
    category: "دهانات",
    price: 35,
    change: -1.5,
    store: "معرض الألوان",
    city: "جدة",
    lastUpdated: "2024-01-15T15:15:00Z"
  }
];

const statsData = [
  {
    title: "إجمالي المستخدمين",
    value: "15,847",
    change: "+12.5%",
    icon: Users,
    color: "from-blue-500 to-blue-600",
    changeColor: "text-green-600"
  },
  {
    title: "المتاجر النشطة", 
    value: "2,431",
    change: "+8.2%",
    icon: Store,
    color: "from-purple-500 to-purple-600",
    changeColor: "text-green-600"
  },
  {
    title: "المعاملات اليومية",
    value: "8,924",
    change: "+15.3%",
    icon: TrendingUp,
    color: "from-green-500 to-green-600", 
    changeColor: "text-green-600"
  },
  {
    title: "حجم المبيعات",
    value: "2.4M ريال",
    change: "+22.1%",
    icon: DollarSign,
    color: "from-orange-500 to-orange-600",
    changeColor: "text-green-600"
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
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load price data from Supabase
  useEffect(() => {
    const loadPriceData = async () => {
      try {
        setIsLoading(true);
        const data = await supabaseDataService.getMaterialPrices();
        
        // Additional validation to ensure we have valid data
        if (Array.isArray(data) && data.length > 0) {
          setPriceData(data);
        } else {
          console.warn('No real data available, using default data');
          setPriceData(defaultPriceData);
        }
      } catch (error) {
        console.error('Error loading price data:', error);
        // Use default data as fallback to prevent display issues
        setPriceData(defaultPriceData);
      } finally {
        setIsLoading(false);
      }
    };

    loadPriceData();
  }, []);

  const cities = ['all', ...Array.from(new Set(priceData.map(item => item.city)))];
  const stores = ['all', ...Array.from(new Set(priceData.map(item => item.store)))];
  const categories = ['all', ...Array.from(new Set(priceData.map(item => item.category)))];

  // Filter data based on selected filters
  const filteredData = priceData.filter(item => {
    const matchesCity = selectedCity === 'all' || item.city === selectedCity;
    const matchesStore = selectedStore === 'all' || item.store === selectedStore;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.store.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCity && matchesStore && matchesCategory && matchesSearch;
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    let compareValue = 0;
    
    switch (sortBy) {
      case 'price':
        compareValue = a.price - b.price;
        break;
      case 'change':
        compareValue = a.change - b.change;
        break;
      case 'updated':
        compareValue = new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
        break;
    }
    
    return sortOrder === 'asc' ? compareValue : -compareValue;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
                  placeholder="البحث في المواد..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-3 pr-10 py-2 border border-gray-200 rounded-lg bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64"
                />
              </div>
              
              <Link href="/auth" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium">
                تسجيل الدخول
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              منصة <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">بنّا</span> التجارية
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              أول منصة رقمية متكاملة لتجارة مواد البناء في المملكة العربية السعودية
            </p>
            <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse pt-6">
              <Link href="/auth" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium text-lg">
                ابدأ الآن
              </Link>
              <Link href="#features" className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-300 font-medium text-lg">
                اعرف المزيد
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsData.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className={`text-sm font-medium ${stat.changeColor}`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-gray-600 text-sm mb-2">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Price Tracking Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              تتبع أسعار مواد البناء في الوقت الفعلي
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              احصل على أحدث أسعار مواد البناء من جميع أنحاء المملكة مع إمكانية المقارنة والتتبع
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المدينة</label>
                <select 
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="price">السعر</option>
                  <option value="change">التغيير</option>
                  <option value="updated">آخر تحديث</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الترتيب</label>
                <select 
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="asc">تصاعدي</option>
                  <option value="desc">تنازلي</option>
                </select>
              </div>
            </div>
          </div>

          {/* Price Data Table */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">المادة</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">الفئة</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">السعر</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">التغيير</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">المتجر</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">المدينة</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">آخر تحديث</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        جاري تحميل البيانات...
                      </td>
                    </tr>
                  ) : sortedData.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        لا توجد بيانات متاحة
                      </td>
                    </tr>
                  ) : (
                    sortedData.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.product}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.category}</td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">{formatPrice(item.price)}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`font-medium ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatChange(item.change)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.store}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.city}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{formatDate(item.lastUpdated)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              لماذا تختار منصة بنّا؟
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              نوفر لك جميع الأدوات والخدمات التي تحتاجها لإدارة مشاريع البناء بكفاءة وفعالية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: "تتبع الأسعار في الوقت الفعلي",
                description: "احصل على أحدث أسعار مواد البناء من جميع الموردين مع إمكانية المقارنة والتحليل"
              },
              {
                icon: Store,
                title: "شبكة موردين موثوقين",
                description: "اكتشف آلاف الموردين المعتمدين واحصل على أفضل الأسعار والعروض الحصرية"
              },
              {
                icon: Shield,
                title: "أمان ومصداقية",
                description: "جميع المعاملات محمية ومضمونة مع نظام تقييم شامل للموردين والمنتجات"
              },
              {
                icon: Truck,
                title: "توصيل سريع",
                description: "خدمة توصيل سريعة وموثوقة لجميع أنحاء المملكة مع تتبع الشحنات في الوقت الفعلي"
              },
              {
                icon: CreditCard,
                title: "طرق دفع متنوعة",
                description: "ادفع بالطريقة التي تناسبك - نقداً عند التسليم، تحويل بنكي، أو بطاقات الائتمان"
              },
              {
                icon: MessageSquare,
                title: "دعم فني متميز",
                description: "فريق دعم فني متخصص متاح على مدار الساعة لمساعدتك في جميع استفساراتك"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              ابدأ رحلتك مع منصة بنّا اليوم
            </h2>
            <p className="text-lg mb-8 opacity-90">
              انضم إلى آلاف المقاولين والموردين واستفد من أكبر منصة لتجارة مواد البناء في المملكة
            </p>
            <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse">
              <Link href="/auth" className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 font-medium text-lg">
                انشئ حسابك الآن
              </Link>
              <Link href="/contact" className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 font-medium text-lg">
                تواصل معنا
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">منصة بنّا</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                أول منصة رقمية متكاملة لتجارة مواد البناء في المملكة العربية السعودية
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">روابط سريعة</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">من نحن</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">خدماتنا</Link></li>
                <li><Link href="/suppliers" className="hover:text-white transition-colors">الموردين</Link></li>
                <li><Link href="/projects" className="hover:text-white transition-colors">المشاريع</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">الدعم</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">مركز المساعدة</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">تواصل معنا</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">الشروط والأحكام</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">سياسة الخصوصية</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">تابعنا</h3>
              <div className="flex space-x-3 rtl:space-x-reverse">
                <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                  <Share2 className="h-5 w-5" />
                </a>
                <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                  <MessageSquare className="h-5 w-5" />
                </a>
                <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                  <Globe className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 منصة بنّا. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}




