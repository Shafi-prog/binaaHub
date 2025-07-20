'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ExternalLink, BarChart3, Package, ShoppingCart, Users, Layers, Settings, AlertTriangle, Store, LogOut, FileText, Calculator, DollarSign, Receipt } from 'lucide-react';

export const dynamic = 'force-dynamic'

const storeDashboardStats = [
  {
    title: 'المنتجات النشطة',
    value: 48,
    icon: <Package className="w-6 h-6" />,
    href: '/store/products',
    color: 'bg-blue-500',
  },
  {
    title: 'الطلبات الجديدة',
    value: 12,
    icon: <ShoppingCart className="w-6 h-6" />,
    href: '/store/orders',
    color: 'bg-green-500',
  },
  {
    title: 'العملاء المسجلين',
    value: 156,
    icon: <Users className="w-6 h-6" />,
    href: '/store/customers',
    color: 'bg-purple-500',
  },
  {
    title: 'المبيعات اليوم',
    value: '12,450 ر.س',
    icon: <BarChart3 className="w-6 h-6" />,
    href: '/store/analytics',
    color: 'bg-orange-500',
  },
  {
    title: 'أوامر الشراء',
    value: 8,
    icon: <FileText className="w-6 h-6" />,
    href: '/store/purchase-orders',
    color: 'bg-indigo-500',
  },
  {
    title: 'إجمالي المصروفات',
    value: '3,250 ر.س',
    icon: <Calculator className="w-6 h-6" />,
    href: '/store/expenses',
    color: 'bg-red-500',
  },
];

const medusaFeatures = [
  {
    name: 'إدارة المنتجات',
    description: 'إدارة كتالوج المنتجات والفئات والمتغيرات',
    icon: <Package className="w-8 h-8 text-blue-600 mb-2" />,
    link: '/store/products',
  },
  {
    name: 'الطلبات',
    description: 'عرض ومعالجة طلبات العملاء',
    icon: <ShoppingCart className="w-8 h-8 text-orange-600 mb-2" />,
    link: '/store/orders',
  },
  {
    name: 'المخزون',
    description: 'تتبع وإدارة المخزون عبر المواقع',
    icon: <Layers className="w-8 h-8 text-green-600 mb-2" />,
    link: '/store/inventory',
  },
  {
    name: 'أوامر الشراء ✨',
    description: 'إدارة أوامر الشراء والموردين والفواتير',
    icon: <FileText className="w-8 h-8 text-indigo-600 mb-2" />,
    link: '/store/purchase-orders',
  },
  {
    name: 'إدارة المصروفات ✨',
    description: 'تتبع المصروفات والتصنيفات الضريبية',
    icon: <Calculator className="w-8 h-8 text-red-600 mb-2" />,
    link: '/store/expenses',
  },
  {
    name: 'صناديق النقد ✨',
    description: 'إدارة الصناديق والفتح والإغلاق اليومي',
    icon: <DollarSign className="w-8 h-8 text-emerald-600 mb-2" />,
    link: '/store/cash-registers',
  },
  {
    name: 'نقطة البيع العربية ✨',
    description: 'واجهة نقطة البيع بالعربية مع الباركود',
    icon: <Receipt className="w-8 h-8 text-cyan-600 mb-2" />,
    link: '/store/pos/arabic',
  },
  {
    name: 'العملاء',
    description: 'إدارة حسابات العملاء وتفاصيلهم',
    icon: <Users className="w-8 h-8 text-purple-600 mb-2" />,
    link: '/store/customers',
  },
  {
    name: 'التحليلات',
    description: 'عرض المبيعات والإيرادات وتحليلات الأداء',
    icon: <BarChart3 className="w-8 h-8 text-cyan-600 mb-2" />,
    link: '/store/analytics',
  },
  {
    name: 'الإعدادات',
    description: 'تكوين المتجر والمناطق والضرائب والمزيد',
    icon: <Settings className="w-8 h-8 text-gray-600 mb-2" />,
    link: '/store/settings',
  },
];

export default function StoreDashboardPage() {
  const [medusaRunning, setMedusaRunning] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Debug: Check if Arabic fonts are available
    console.log('📝 Available fonts:', document.fonts?.size);
    console.log('🌏 Arabic text test: مرحباً');
    
    // Check if Medusa admin is running
    fetch('http://localhost:9000/admin', { 
      method: 'HEAD',
      mode: 'no-cors'
    })
    .then(() => setMedusaRunning(true))
    .catch(() => setMedusaRunning(false));
  }, []);

  const openMedusa = (url: string) => {
    window.open(url, '_blank');
  };

  const startMedusaServer = () => {
    window.open('/store/medusa-develop', '_blank');
  };

  const handleLogout = () => {
    // Clear all authentication data
    if (typeof window !== 'undefined') {
      sessionStorage.clear();
      localStorage.clear();
      // Remove all cookies
      document.cookie.split(';').forEach(cookie => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
      });
    }
    // Redirect to login page
    router.push('/login');
  };

  return (
    <div className="p-6 font-tajawal text-right" dir="rtl" style={{ fontFamily: "'Tajawal', 'Cairo', 'Arial Unicode MS', 'Tahoma', sans-serif" }}>
      {/* Arabic Font Test */}
      <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
        <p className="text-sm">
          <strong>Arabic Font Test:</strong> 
          <span style={{ fontFamily: "'Tajawal', 'Cairo', 'Arial Unicode MS', 'Tahoma', sans-serif", fontSize: '16px' }}>
            مرحباً بك في لوحة تحكم المتجر - اختبار الخط العربي
          </span>
        </p>
        <p className="text-xs text-gray-600 mt-1">
          If you see squares or English instead of Arabic, the font is not loading properly.
        </p>
      </div>

      {/* Logout Button */}
      <div className="mb-4 flex justify-between items-center">
        <div></div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-tajawal"
        >
          <LogOut className="w-4 h-4" />
          <span style={{ fontFamily: "'Tajawal', 'Cairo', 'Arial Unicode MS', sans-serif" }}>تسجيل الخروج</span>
        </button>
      </div>

      {/* Success Message */}
      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-3">
          <Store className="w-5 h-5 text-green-600" />
          <div className="flex-1">
            <h3 className="font-semibold text-green-800 mb-1 font-tajawal" style={{ fontFamily: "'Tajawal', 'Cairo', 'Arial Unicode MS', sans-serif" }}>
              مرحباً بك في لوحة تحكم المتجر!
            </h3>
            <p className="text-sm text-green-700 font-tajawal" style={{ fontFamily: "'Tajawal', 'Cairo', 'Arial Unicode MS', sans-serif" }}>
              إدارة متجرك ومنتجاتك وطلباتك من مكان واحد
            </p>
          </div>
          <div className="mr-auto">
            <button 
              onClick={() => openMedusa('http://localhost:9000/admin')} 
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm" 
              disabled={!medusaRunning}
            >
              <ExternalLink className="w-4 h-4" />
              فتح Medusa Admin
            </button>
          </div>
        </div>
      </div>

      {/* Medusa Status Alert */}
      {!medusaRunning && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-4">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-800 mb-1">
                خادم Medusa غير متصل
              </h3>
              <p className="text-sm text-yellow-700 mb-3">
                ابدأ خادم Medusa للوصول إلى جميع الميزات
              </p>
              <div className="flex gap-2">
                <button onClick={startMedusaServer} className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm">
                  تشغيل الخادم
                </button>
                <button onClick={() => window.open('/store/medusa-develop/README.md', '_blank')} className="px-3 py-1 border border-yellow-300 text-yellow-800 rounded hover:bg-yellow-100 text-sm">
                  دليل الإعداد
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 arabic-text">
        <h1 className="text-3xl font-bold text-gray-800 mb-3 font-tajawal" style={{ fontFamily: "'Tajawal', 'Cairo', 'Arial Unicode MS', sans-serif" }}>
          لوحة تحكم المتجر 🏪
        </h1>
        <p className="text-lg text-gray-600 font-tajawal" style={{ fontFamily: "'Tajawal', 'Cairo', 'Arial Unicode MS', sans-serif" }}>
          إليك نظرة عامة على أداء متجرك ونشاطه
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {storeDashboardStats.map((card, index) => (
          <Link key={index} href={card.href} className="block">
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="arabic-text">
                  <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-800 arabic-numbers">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-xl shadow-lg`}>
                  <div className="text-white">{card.icon}</div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Medusa Features */}
      <div className="mb-8 arabic-text">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          ميزات إدارة المتجر
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medusaFeatures.map((feature) => (
            <div
              key={feature.name}
              className="cursor-pointer p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow group"
              onClick={() => openMedusa(feature.link)}
            >
              <div className="flex flex-col items-start arabic-text">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {feature.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center gap-1 text-blue-600 text-sm font-medium">
                  <ExternalLink className="w-4 h-4" />
                  <span>الانتقال إلى {feature.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
