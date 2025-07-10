// @ts-nocheck
'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/domains/shared/components/ui/button';
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
  X
} from 'lucide-react';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if user is a store owner
  const isStoreOwner = user?.account_type === 'store' || pathname.includes('/admin') || pathname.includes('/dashboard');

  const userNavItems = [
    { href: '/store', label: 'Home', icon: Home },
    { href: '/store/marketplace', label: 'Browse Products', icon: Search },
    { href: '/store/cart', label: 'Cart', icon: ShoppingCart },
    { href: '/store/wishlist', label: 'Wishlist', icon: Heart },
  ];

  const storeAdminNavItems = [
    { href: '/store/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/store/admin', label: 'Admin Panel', icon: Store },
    { href: '/store/products', label: 'Products', icon: Package },
    { href: '/store/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/store/customers', label: 'Customers', icon: Users },
    { href: '/store/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/store/settings', label: 'Settings', icon: Settings },
  ];

  const navItems = isStoreOwner ? storeAdminNavItems : userNavItems;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center gap-2">
            <Store className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-semibold">
              {isStoreOwner ? 'Store Admin' : 'Binna Store'}
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
                View Mode
              </p>
            </div>
            <div className="space-y-1">
              <Link
                href="/store/marketplace"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                onClick={() => setSidebarOpen(false)}
              >
                <ShoppingCart className="h-4 w-4" />
                Customer View
              </Link>
              {user?.account_type === 'store' && (
                <Link
                  href="/store/admin"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Store className="h-4 w-4" />
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
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
              {isStoreOwner ? 'Store Admin' : 'Binna Store'}
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





