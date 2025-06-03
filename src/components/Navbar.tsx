'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Session } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/database';
import { CartIcon } from '@/components/cart';
import { 
  Menu, 
  X, 
  User, 
  Settings, 
  LogOut, 
  Bell, 
  Building2,
  FileText,
  Calculator,
  Shield,
  Users,
  ChevronDown,
  Home,
  Package,
  DollarSign
} from 'lucide-react';
import { Button, LogoutButton } from '@/components/ui';

interface NavbarProps {
  session?: Session | null;
}

interface UserData {
  id: string;
  name: string | null;
  account_type: string;
  email: string;
}

export default function Navbar({ session }: NavbarProps) {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient<Database>();

  // Load user data if session exists
  useEffect(() => {
    if (session?.user?.email) {
      const loadUserData = async () => {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('id, name, account_type, email')
            .eq('email', session.user.email)
            .single();

          if (data && !error) {
            setUserData(data);
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      };

      loadUserData();
    }
  }, [session, supabase]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getDashboardRoute = () => {
    if (!userData) return '/';
    
    switch (userData.account_type) {
      case 'store':
        return '/store/dashboard';
      case 'user':
      case 'client':
        return '/user/dashboard';
      case 'engineer':
      case 'consultant':
        return '/dashboard/construction-data';
      default:
        return '/';
    }
  };

  const navigationItems = [
    {
      label: t('home'),
      href: '/',
      icon: Home,
      requiresAuth: false
    },
    {
      label: t('projects'),
      href: '/projects',
      icon: Building2,
      requiresAuth: false
    },
    {
      label: t('services'),
      href: '/#features',
      icon: Package,
      requiresAuth: false
    },
    {
      label: t('pricing'),
      href: '/#pricing',
      icon: DollarSign,
      requiresAuth: false
    }
  ];

  const userMenuItems = [
    {
      label: 'لوحة التحكم',
      href: getDashboardRoute(),
      icon: Home
    },
    {
      label: 'الملف الشخصي',
      href: '/user/profile',
      icon: User
    },
    {
      label: 'المشاريع',
      href: '/user/projects',
      icon: Building2
    },
    {
      label: 'الطلبات',
      href: '/user/orders',
      icon: Package
    },
    {
      label: 'الإعدادات',
      href: '/user/settings',
      icon: Settings
    }
  ];

  // Store-specific menu items
  const storeMenuItems = [
    {
      label: 'لوحة تحكم المتجر',
      href: '/store/dashboard',
      icon: Home
    },
    {
      label: 'المنتجات',
      href: '/store/products',
      icon: Package
    },
    {
      label: 'الطلبات',
      href: '/store/orders',
      icon: FileText
    },
    {
      label: 'العملاء',
      href: '/store/customers',
      icon: Users
    },
    {
      label: 'الإعدادات',
      href: '/store/settings',
      icon: Settings
    }
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white shadow-xl sticky top-0 z-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-bold">بِنَّا</Link>
          {/* Dynamic navbar links based on account type */}
          {userData?.account_type === 'store' ? (
            <>
              <Link href="/store/dashboard" className="hover:underline flex items-center gap-1"><Home className="w-5 h-5" />الرئيسية</Link>
              <Link href="/store/products" className="hover:underline flex items-center gap-1"><Package className="w-5 h-5" />المنتجات</Link>
              <Link href="/store/orders" className="hover:underline flex items-center gap-1"><FileText className="w-5 h-5" />الطلبات</Link>
              <Link href="/store/customers" className="hover:underline flex items-center gap-1"><Users className="w-5 h-5" />العملاء</Link>
              <Link href="/store/settings" className="hover:underline flex items-center gap-1"><Settings className="w-5 h-5" />الإعدادات</Link>
            </>
          ) : (
            <>
              <Link href="/user/dashboard" className="hover:underline flex items-center gap-1"><Home className="w-5 h-5" />الرئيسية</Link>
              <Link href="/user/projects" className="hover:underline flex items-center gap-1"><Building2 className="w-5 h-5" />المشاريع</Link>
              <Link href="/user/orders" className="hover:underline flex items-center gap-1"><Package className="w-5 h-5" />الطلبات</Link>
              <Link href="/user/profile" className="hover:underline flex items-center gap-1"><User className="w-5 h-5" />الملف الشخصي</Link>
              <Link href="/user/settings" className="hover:underline flex items-center gap-1"><Settings className="w-5 h-5" />الإعدادات</Link>
            </>
          )}
        </div>
        <button className="flex items-center gap-2 hover:text-red-500">
          <LogOut className="w-5 h-5" />
          تسجيل الخروج
        </button>
      </div>
    </nav>
  );
}
