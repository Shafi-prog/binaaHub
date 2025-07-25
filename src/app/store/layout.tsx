// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/core/shared/components/ui/button';
import { 
  Store,
  ShoppingCart,
  Package,
  BarChart3,
  Users,
  Settings,
  Home,
  Search,
  Heart,
  Menu,
  X,
  Calculator,
  Package2,
  CreditCard,
  TrendingUp,
  Warehouse,
  Shield,
  Truck,
  FileText,
  Receipt,
  DollarSign,
  Calculator as CalculatorIcon,
  Building2,
  Users2,
  Bell,
  User
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ALL HOOKS MUST BE CALLED IN THE SAME ORDER EVERY TIME - NO EARLY RETURNS BEFORE ALL HOOKS!
  const pathname = usePathname();
  
  // Safe auth hook usage that handles SSG
  let user = null;
  let loading = false;
  try {
    const authResult = useAuth();
    user = authResult.user;
    loading = authResult.loading;
  } catch (error) {
    // During SSG, useAuth might not be available, use defaults
    user = null;
    loading = false;
  }
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isClientSide, setIsClientSide] = useState(false);
  
  // All hooks must be called before any conditional logic or early returns
  useEffect(() => {
    setIsClientSide(true);
  }, []);

  // Check if user is a store owner
  const isStoreOwner = user?.account_type === 'store' || pathname.includes('/admin') || pathname.includes('/dashboard');

  const userNavItems = [
    { href: '/store', label: 'الرئيسية', icon: Home },
    { href: '/store/marketplace', label: 'تصفح المنتجات', icon: Search },
    { href: '/store/cart', label: 'السلة', icon: ShoppingCart },
    { href: '/store/wishlist', label: 'المفضلة', icon: Heart },
  ];

  const storeAdminNavItems = [
    { href: '/store/dashboard', label: 'لوحة التحكم', icon: BarChart3 },
    { href: '/store/admin', label: 'لوحة الإدارة', icon: Store },
    
    // POS & Sales
    { href: '/store/pos', label: 'نقطة البيع', icon: CreditCard },
    { href: '/store/pos/offline', label: 'نقطة البيع غير متصل ✅', icon: Package2 },
    { href: '/store/cash-registers', label: 'صناديق النقد', icon: DollarSign },
    
    // Inventory & Products
    { href: '/store/products', label: 'المنتجات', icon: Package },
    { href: '/store/inventory', label: 'المخزون', icon: Warehouse },
    
    // ERP Features
    { href: '/store/purchase-orders', label: 'أوامر الشراء', icon: FileText },
    { href: '/store/suppliers', label: 'الموردين', icon: Users2 },
    { href: '/store/expenses', label: 'إدارة المصروفات', icon: CalculatorIcon },
    
    // Operations
    { href: '/store/orders', label: 'الطلبات', icon: ShoppingCart },
    { href: '/store/delivery', label: 'التوصيل', icon: Truck },
    { href: '/store/customers', label: 'العملاء', icon: Users },
    
    // Management
    { href: '/store/permissions', label: 'الصلاحيات', icon: Shield },
    { href: '/store/analytics', label: 'تحليلات السوق ✅', icon: TrendingUp },
    { href: '/store/reports', label: 'التقارير المتقدمة ✅', icon: BarChart3 },
    
    // Integration & Tools
    { href: '/store/search', label: 'البحث الذكي ✅', icon: Search },
    { href: '/store/notifications', label: 'الإشعارات ✅', icon: Settings },
    { href: '/store/payments', label: 'بوابة الدفع ✅', icon: CreditCard },
    { href: '/store/shipping', label: 'الشحن واللوجستيات ✅', icon: Truck },
    { href: '/store/erp', label: 'تكامل نظام ERP ✅', icon: Building2 },
    { href: '/store/settings', label: 'الإعدادات', icon: Settings },
  ];

  const navItems = isStoreOwner ? storeAdminNavItems : userNavItems;

  // Get current page name
  const getCurrentPageName = () => {
    const currentItem = navItems.find(item => {
      if (item.href === '/store' && pathname === '/store') return true;
      if (item.href !== '/store' && pathname.startsWith(item.href)) return true;
      return pathname === item.href;
    });
    return currentItem?.label || 'لوحة التحكم';
  };

  // NOW we can do conditional rendering - all hooks have been called
  if (!isClientSide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Always Fixed */}
      <div className={`fixed inset-y-0 right-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg">
              <Store className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-white">
              <h1 className="text-lg font-bold">متجر بينا</h1>
              <p className="text-xs text-blue-100">
                {isStoreOwner ? 'لوحة الإدارة' : 'منصة التجارة'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:bg-white hover:bg-opacity-20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/store' && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600 font-bold shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className={`h-5 w-5 transition-all ${
                    isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                  }`} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Switch between admin and user views */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="px-4 py-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                وضع العرض
              </p>
            </div>
            <div className="space-y-2">
              <Link
                href="/store/marketplace"
                className="group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                onClick={() => setSidebarOpen(false)}
              >
                <ShoppingCart className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                عرض العميل
              </Link>
              {user?.account_type === 'store' && (
                <Link
                  href="/store/admin"
                  className="group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Store className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                  لوحة الإدارة
                </Link>
              )}
            </div>
          </div>

          {/* User Profile Section */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || 'مدير المتجر'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || 'admin@store.com'}
                </p>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Main content - Properly positioned beside sidebar */}
      <div className="flex-1 lg:mr-72 min-h-screen">
        {/* Enhanced Top bar */}
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="lg:hidden">
                  <Store className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {getCurrentPageName()}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {isStoreOwner ? 'إدارة المتجر' : 'منصة التجارة الإلكترونية'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
              </Button>
              
              {/* User Menu */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden md:block">
                  {user?.name || 'المدير'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}





