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
  Users2
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

  // NOW we can do conditional rendering - all hooks have been called
  if (!isClientSide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform transition-transform lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center gap-2">
            <Store className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-semibold">
              {isStoreOwner ? 'إدارة المتجر' : 'متجر بينا'}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/store' && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Switch between admin and user views */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="px-3 py-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                وضع العرض
              </p>
            </div>
            <div className="space-y-1">
              <Link
                href="/store/marketplace"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                onClick={() => setSidebarOpen(false)}
              >
                <ShoppingCart className="h-4 w-4" />
                عرض العميل
              </Link>
              {user?.account_type === 'store' && (
                <Link
                  href="/store/admin"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Store className="h-4 w-4" />
                  لوحة الإدارة
                </Link>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pr-64">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 px-6 bg-white border-b lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 text-blue-600" />
            <span className="font-semibold">
              {isStoreOwner ? 'إدارة المتجر' : 'متجر بينا'}
            </span>
          </div>
          <div></div>
        </div>

        {/* Page content */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}





