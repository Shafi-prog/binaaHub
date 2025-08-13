// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { Button } from '@/components/ui/Button';
import StoreNavbar from '@/components/store/StoreNavbar';
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
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  ArrowRightLeft,
  Clipboard,
  QrCode,
  DollarSign as PayrollIcon,
  CalendarDays,
  UserCheck,
  Clock,
  Banknote,
  TaxIcon as TaxSymbol
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ALL HOOKS MUST BE CALLED IN THE SAME ORDER EVERY TIME - NO EARLY RETURNS BEFORE ALL HOOKS!
  const pathname = usePathname();
  const router = useRouter();
  
  // Safe auth hook usage that handles SSG
  let user = null;
  let loading = false;
  let signOut: (() => Promise<void>) | null = null;
  const [storeName, setStoreName] = useState<string | null>(null);
  const [storeLogoUrl, setStoreLogoUrl] = useState<string | null>(null);
  const [storeThemeFrom, setStoreThemeFrom] = useState<string>('#2563eb'); // blue-600
  const [storeThemeTo, setStoreThemeTo] = useState<string>('#1d4ed8');   // blue-700
  try {
    const authResult = useAuth();
    user = authResult.user;
    loading = authResult.loading;
    signOut = authResult.signOut;
  } catch (error) {
    // During SSG, useAuth might not be available, use defaults
    user = null;
    loading = false;
    signOut = null;
  }
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isClientSide, setIsClientSide] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    inventory: false,
    hr: false,
    accounting: false
  });
  
  // All hooks must be called before any conditional logic or early returns
  useEffect(() => {
    setIsClientSide(true);
  }, []);

  // Fetch store name/logo from user_profiles if available
  useEffect(() => {
    const fetchStoreName = async () => {
      try {
        if (!user?.id) return;
        const res = await fetch('/api/auth/profile', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        // Try common keys
        const name = data?.store_name || data?.storeName || data?.profile?.store_name || data?.profile?.display_name || null;
        const logo = data?.profile?.logo_url || data?.logo_url || null;
        if (name) setStoreName(name);
        if (logo) setStoreLogoUrl(logo);

  // Theme colors: attempt multiple naming conventions
  const profile = data?.profile || {};
  const tryKeys = (...keys: string[]) => keys.map(k => profile?.[k] ?? data?.[k]).find(v => typeof v === 'string' && v);
  const fromCandidate = tryKeys('store_theme_from', 'theme_from', 'brand_color_from', 'brand_from', 'primary_color', 'brand_primary');
  const toCandidate = tryKeys('store_theme_to', 'theme_to', 'brand_color_to', 'brand_to', 'secondary_color', 'brand_secondary');
  const isCssColor = (v?: string) => typeof v === 'string' && (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(v) || v.startsWith('rgb') || v.startsWith('hsl'));
  if (isCssColor(fromCandidate)) setStoreThemeFrom(fromCandidate!);
  if (isCssColor(toCandidate)) setStoreThemeTo(toCandidate!);
      } catch (e) {
        // ignore
      }
    };
    fetchStoreName();
  }, [user?.id]);

  // Logout handler
  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      console.log('🚪 [Store Layout] Starting logout process...');
      
      // Call our logout API
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        console.log('✅ [Store Layout] Logout API successful');
      } else {
        console.warn('⚠️ [Store Layout] Logout API failed, continuing with client-side cleanup');
      }
      
      // Clear client-side auth state if signOut function available
      if (signOut) {
        await signOut();
      }
      
      // Redirect to login
      router.push('/auth/login');
      console.log('✅ [Store Layout] Logout complete, redirecting to login');
    } catch (error) {
      console.error('❌ [Store Layout] Logout error:', error);
      // Even if API fails, clear client state and redirect
      if (signOut) {
        await signOut();
      }
      router.push('/auth/login');
    } finally {
      setLogoutLoading(false);
    }
  };

  // Always show full store navigation - remove conditional logic
  const navItems = [
    // Core Navigation
    { href: '/store/dashboard', label: 'لوحة التحكم', icon: BarChart3 },
    { href: '/store/marketplace', label: 'تصفح المنتجات', icon: Search },
    
    // POS & Sales
    { href: '/store/pos', label: 'نقطة البيع', icon: CreditCard },
    { href: '/store/pos/offline', label: 'نقطة البيع غير متصل', icon: Package2 },
    { href: '/store/cash-registers', label: 'صناديق النقد', icon: DollarSign },
    
    // Products
    { href: '/store/products', label: 'المنتجات', icon: Package },
    
    // ERP Features
    { href: '/store/purchase-orders', label: 'أوامر الشراء', icon: FileText },
    { href: '/store/suppliers', label: 'الموردين', icon: Users2 },
    { href: '/store/expenses', label: 'إدارة المصروفات', icon: CalculatorIcon },
    
    // Operations
    { href: '/store/orders', label: 'الطلبات', icon: ShoppingCart },
    { href: '/store/delivery', label: 'التوصيل', icon: Truck },
    { href: '/store/customers', label: 'العملاء', icon: Users },
    
    // User Features (Store purchasing from suppliers)
    { href: '/store/cart', label: 'سلة المشتريات من الموردين', icon: ShoppingCart },
    { href: '/store/wishlist', label: 'قائمة المشتريات المرغوبة', icon: Heart },
    
    // Management
    { href: '/store/permissions', label: 'الصلاحيات', icon: Shield },
    { href: '/store/reports', label: 'التقارير المتقدمة', icon: BarChart3 },
    
    // Integration & Tools
    { href: '/store/search', label: 'البحث الذكي', icon: Search },
    { href: '/store/notifications', label: 'الإشعارات', icon: Bell },
    { href: '/store/payments', label: 'بوابة الدفع', icon: CreditCard },
    { href: '/store/shipping', label: 'الشحن واللوجستيات', icon: Truck },
    { href: '/store/erp', label: 'تكامل نظام ERP', icon: Building2 },
    { href: '/store/settings', label: 'الإعدادات', icon: Settings },
  ];

  // Grouped navigation sections with dropdowns
  const navSections = [
    // Core Navigation
    {
      title: 'القائمة الرئيسية',
      items: [
        { href: '/store/dashboard', label: 'لوحة التحكم', icon: BarChart3 },
        { href: '/store/marketplace', label: 'تصفح المنتجات', icon: Search },
      ]
    },
    
    // POS & Sales
    {
      title: 'نقطة البيع والمبيعات',
      items: [
        { href: '/store/pos', label: 'نقطة البيع', icon: CreditCard },
        { href: '/store/cash-registers', label: 'صناديق النقد', icon: DollarSign },
        { href: '/store/orders', label: 'الطلبات', icon: ShoppingCart },
      ]
    },

    // Products & Basic Inventory
    {
      title: 'المنتجات',
      items: [
        { href: '/store/products', label: 'إدارة المنتجات', icon: Package },
        { href: '/store/inventory', label: 'المخزون الأساسي', icon: Warehouse },
      ]
    },

    // Advanced Inventory Management (Dropdown)
    {
      title: 'إدارة المخزون المتقدمة',
      isDropdown: true,
      key: 'inventory',
      icon: Warehouse,
      items: [
        { href: '/store/inventory/stock-transfers', label: 'نقل المخزون', icon: ArrowRightLeft },
        { href: '/store/inventory/stock-adjustments', label: 'تعديل المخزون', icon: Clipboard },
        { href: '/store/inventory/stock-take', label: 'جرد المخزون', icon: Clipboard },
        { href: '/store/inventory/barcode-generation', label: 'إنتاج الباركود', icon: QrCode },
      ]
    },

    // HR Management (Dropdown)
    {
      title: 'إدارة الموارد البشرية',
      isDropdown: true,
      key: 'hr',
      icon: Users2,
      items: [
        { href: '/store/hr/payroll', label: 'إدارة الرواتب', icon: PayrollIcon },
        { href: '/store/hr/attendance', label: 'الحضور والانصراف', icon: UserCheck },
        { href: '/store/hr/leave-management', label: 'إدارة الإجازات', icon: CalendarDays },
        { href: '/store/hr/claims', label: 'المطالبات والتعويضات', icon: Receipt },
      ]
    },

    // Accounting & Finance (Dropdown)
    {
      title: 'المحاسبة والمالية',
      isDropdown: true,
      key: 'accounting',
      icon: CalculatorIcon,
      items: [
        { href: '/store/accounting/manual-journals', label: 'اليومية اليدوية', icon: FileText },
        { href: '/store/accounting/bank-reconciliation', label: 'تسوية البنوك', icon: Banknote },
        { href: '/store/accounting/vat-management', label: 'إدارة ضريبة القيمة المضافة', icon: Receipt },
        { href: '/store/expenses', label: 'إدارة المصروفات', icon: CalculatorIcon },
      ]
    },

    // Operations
    {
      title: 'العمليات والخدمات',
      items: [
        { href: '/store/purchase-orders', label: 'أوامر الشراء', icon: FileText },
        { href: '/store/suppliers', label: 'الموردين', icon: Users2 },
        { href: '/store/delivery', label: 'التوصيل', icon: Truck },
        { href: '/store/customers', label: 'العملاء', icon: Users },
      ]
    },

    // User Features
    {
      title: 'المشتريات من الموردين',
      items: [
        { href: '/store/cart', label: 'سلة المشتريات من الموردين', icon: ShoppingCart },
        { href: '/store/wishlist', label: 'قائمة المشتريات المرغوبة', icon: Heart },
      ]
    },

    // Management & Reports
    {
      title: 'الإدارة والتقارير',
      items: [
        { href: '/store/permissions', label: 'الصلاحيات', icon: Shield },
        { href: '/store/reports', label: 'التقارير المتقدمة', icon: BarChart3 },
      ]
    },

    // Tools & Integration
    {
      title: 'الأدوات والتكامل',
      items: [
        { href: '/store/search', label: 'البحث الذكي', icon: Search },
        { href: '/store/notifications', label: 'الإشعارات', icon: Bell },
        { href: '/store/payments', label: 'بوابة الدفع', icon: CreditCard },
        { href: '/store/shipping', label: 'الشحن واللوجستيات', icon: Truck },
        { href: '/store/erp', label: 'تكامل نظام ERP', icon: Building2 },
        { href: '/store/settings', label: 'الإعدادات', icon: Settings },
      ]
    }
  ];

  // Keep track of store owner status for other UI elements
  const isStoreOwner = user?.account_type === 'store' || pathname.includes('/admin') || pathname.includes('/dashboard');

  // Get current page name
  const getCurrentPageName = () => {
    // Check dropdown items first
    for (const section of navSections) {
      if (section.items) {
        const currentItem = section.items.find(item => {
          if (item.href === '/store' && pathname === '/store') return true;
          if (item.href !== '/store' && pathname.startsWith(item.href)) return true;
          return pathname === item.href;
        });
        if (currentItem) return currentItem.label;
      }
    }
    return 'لوحة التحكم';
  };

  // Toggle dropdown sections
  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Auto-expand sections based on current path
  useEffect(() => {
    if (pathname.startsWith('/store/inventory/')) {
      setExpandedSections(prev => ({ ...prev, inventory: true }));
    } else if (pathname.startsWith('/store/hr/')) {
      setExpandedSections(prev => ({ ...prev, hr: true }));
    } else if (pathname.startsWith('/store/accounting/')) {
      setExpandedSections(prev => ({ ...prev, accounting: true }));
    }
  }, [pathname]);

  // NOW we can do conditional rendering - all hooks have been called
  if (!isClientSide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-50 flex"
      dir="rtl"
      // Shared store theme variables (dynamic with fallbacks)
      style={{
        ['--store-from' as any]: storeThemeFrom,
        ['--store-to' as any]: storeThemeTo,
      }}
    >
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Always Fixed with improved scrolling */}
      <div className={`fixed inset-y-0 right-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        {/* Sidebar Header */}
        <div
          className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0"
          style={{ background: 'linear-gradient(to right, var(--store-from), var(--store-to))' }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg">
              <Store className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-white">
              <h1 className="text-base font-bold">متجر بينا</h1>
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

        {/* Navigation - Improved scrolling */}
        <nav className="flex-1 px-4 py-3 overflow-y-auto min-h-0" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#CBD5E0 #F7FAFC'
        }}>
          
          <div className="space-y-6 pb-4">
            {navSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-2">
                {/* Section Header */}
                <div className="flex items-center justify-between px-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {section.title}
                  </p>
                  {section.items && (
                    <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                      {section.items.length}
                    </div>
                  )}
                </div>

                {/* Dropdown Section */}
                {section.isDropdown ? (
                  <div className="space-y-1">
                    {/* Dropdown Header */}
                    <button
                      onClick={() => toggleSection(section.key!)}
                      className={`w-full group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                        expandedSections[section.key!] || section.items?.some(item => 
                          pathname === item.href || (item.href !== '/store' && pathname.startsWith(item.href))
                        )
                          ? 'bg-blue-50 text-blue-700 font-bold shadow-sm'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium'
                      }`}
                    >
                      <section.icon className={`h-4 w-4 transition-all flex-shrink-0 ${
                        expandedSections[section.key!] || section.items?.some(item => 
                          pathname === item.href || (item.href !== '/store' && pathname.startsWith(item.href))
                        )
                          ? 'text-blue-600'
                          : 'text-gray-400 group-hover:text-gray-600'
                      }`} />
                      <span className="flex-1 truncate text-right">{section.title}</span>
                      {expandedSections[section.key!] ? (
                        <ChevronDown className="h-4 w-4 transition-transform" />
                      ) : (
                        <ChevronRight className="h-4 w-4 transition-transform" />
                      )}
                    </button>

                    {/* Dropdown Items */}
                    {expandedSections[section.key!] && section.items && (
                      <div className="mr-6 space-y-1 border-r-2 border-blue-100">
                        {section.items.map((item) => {
                          const Icon = item.icon;
                          const isActive = pathname === item.href || (item.href !== '/store' && pathname.startsWith(item.href));
                          
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                isActive
                                  ? 'bg-blue-100 text-blue-800 border-r-4 border-blue-600 font-bold shadow-sm'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'
                              }`}
                              onClick={() => setSidebarOpen(false)}
                            >
                              <Icon className={`h-4 w-4 transition-all flex-shrink-0 ${
                                isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-600'
                              }`} />
                              <span className="flex-1 truncate">{item.label}</span>
                              {isActive && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Regular Section Items */
                  section.items && (
                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || (item.href !== '/store' && pathname.startsWith(item.href));
                        
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                              isActive
                                ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600 font-bold shadow-sm'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium'
                            }`}
                            onClick={() => setSidebarOpen(false)}
                          >
                            <Icon className={`h-4 w-4 transition-all flex-shrink-0 ${
                              isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                            }`} />
                            <span className="flex-1 truncate">{item.label}</span>
                            {isActive && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
          
          {/* Quick Access Section - More compact */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="px-2 py-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                وصول سريع
              </p>
            </div>
            <div className="space-y-1">
              <Link
                href="/store/search"
                className="group flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                onClick={() => setSidebarOpen(false)}
              >
                <Search className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                تصفح سريع
              </Link>
              <Link
                href="/store/dashboard"
                className="group flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                onClick={() => setSidebarOpen(false)}
              >
                <Store className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                لوحة الإدارة المتقدمة
              </Link>
            </div>
          </div>

          {/* User Profile Section - More compact */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-3 w-3 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate">
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
        {/* Unified Store Navbar */}
        <StoreNavbar
          title={getCurrentPageName()}
          subtitle={isStoreOwner ? 'إدارة المتجر' : 'منصة التجارة الإلكترونية'}
          onOpenSidebar={() => setSidebarOpen(true)}
          user={user}
          storeName={storeName}
          storeLogoUrl={storeLogoUrl}
          onLogout={handleLogout}
          logoutLoading={logoutLoading}
        />

        {/* Page content */}
        <main className="bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}

