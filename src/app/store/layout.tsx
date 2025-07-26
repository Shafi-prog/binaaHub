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
  User,
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
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    inventory: false,
    hr: false,
    accounting: false
  });
  
  // All hooks must be called before any conditional logic or early returns
  useEffect(() => {
    setIsClientSide(true);
  }, []);

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
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
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
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 flex-shrink-0">
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
          
          {/* Scroll hint at bottom of navigation */}
          <div className="text-center border-t border-gray-100 pt-3 mb-3">
            <div className="inline-flex items-center text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
              <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
              اسحب لرؤية المزيد
              <div className="w-1 h-1 bg-gray-400 rounded-full ml-2"></div>
            </div>
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
                href="/store/marketplace"
                className="group flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                onClick={() => setSidebarOpen(false)}
              >
                <Search className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                تصفح سريع
              </Link>
              <Link
                href="/store/admin"
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





