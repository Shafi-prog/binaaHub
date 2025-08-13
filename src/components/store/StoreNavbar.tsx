'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Bell, LogOut, Menu, Store } from 'lucide-react';

type StoreNavbarProps = {
  title: string;
  subtitle?: string;
  onOpenSidebar?: () => void;
  user?: { name?: string | null } | null;
  storeName?: string | null;
  storeLogoUrl?: string | null;
  onLogout?: () => void;
  logoutLoading?: boolean;
};

export default function StoreNavbar({ title, subtitle, onOpenSidebar, user, storeName, storeLogoUrl, onLogout, logoutLoading }: StoreNavbarProps) {
  usePathname(); // keep hook call structure stable if needed later

  return (
    <header
      className="border-b border-transparent shadow-sm sticky top-0 z-30 text-white"
      style={{ background: 'linear-gradient(to right, var(--store-from), var(--store-to))' }}
    >
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 text-white">
        {/* Left: Mobile menu + Title */}
        <div className="flex items-center gap-4">
          {onOpenSidebar && (
            <Button variant="ghost" size="sm" onClick={onOpenSidebar} className="lg:hidden text-white hover:bg-white/10">
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center gap-3">
            <div className="lg:hidden">
              <Store className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold leading-tight">{title}</h1>
              {subtitle && <p className="text-xs sm:text-sm text-blue-100">{subtitle}</p>}
            </div>
          </div>
        </div>

        {/* Right: Context actions + utilities */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Contextual actions intentionally omitted in navbar per requirements */}

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative text-white hover:bg-white/10">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </Button>

          {/* Logout */}
          {onLogout && (
            <Button variant="ghost" size="sm" onClick={onLogout} disabled={!!logoutLoading} className="text-red-100 hover:text-white hover:bg-red-500/20">
              <LogOut className="h-5 w-5" />
              {logoutLoading && <span className="ml-1">...</span>}
            </Button>
          )}

          {/* User chip */}
          <div className="hidden sm:flex items-center gap-3 px-3 py-2 rounded-lg bg-white/10">
            {storeLogoUrl ? (
              <img
                src={storeLogoUrl}
                alt={storeName || 'شعار المتجر'}
                className="w-8 h-8 rounded-full object-cover bg-white"
              />
            ) : (
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-700 text-sm font-bold">
                  {(storeName || user?.name || 'م').trim().charAt(0)}
                </span>
              </div>
            )}
            <span className="text-sm font-medium truncate max-w-[200px]">{storeName || user?.name || 'المدير'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
