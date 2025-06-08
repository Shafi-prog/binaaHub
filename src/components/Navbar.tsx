'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Session } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/database';
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
  DollarSign,
  Calendar
} from 'lucide-react';
import { Button, LogoutButton } from '@/components/ui';
import { NotificationService } from '@/lib/notifications';
import { CartIcon } from '@/components/cart/CartSidebar';
import { useSession } from '@supabase/auth-helpers-react';

interface NavbarProps {
  session?: Session | null;
  accountType?: string | null;
}

interface UserData {
  id: string;
  name: string | null;
  account_type: string;
  email: string;
}

export default function Navbar({ session, accountType }: NavbarProps) {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const supabaseSession = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState<string | null>(null);
  const [journeyOpen, setJourneyOpen] = useState(false);
  const journeyRef = useRef<HTMLDivElement>(null);

  // Load user data if session exists
  useEffect(() => {
    // Always use Supabase Auth user ID as the source of truth
    const authUser = supabaseSession?.user || session?.user;
    if (authUser) {
      setUserData({
        id: authUser.id,
        name: authUser.user_metadata?.name || authUser.email || null,
        account_type: accountType || authUser.user_metadata?.account_type || 'user',
        email: authUser.email || '',
      });
    } else if (session?.user?.email) {
      // fallback: load from users table if needed
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
  }, [session, supabase, supabaseSession, accountType]);

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

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (journeyRef.current && !journeyRef.current.contains(event.target as Node)) {
        setJourneyOpen(false);
      }
    }
    if (journeyOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [journeyOpen]);

  // Fetch unread count and recent notifications
  useEffect(() => {
    if (!userData?.id) return;
    let unsub: (() => void) | undefined;
    const fetchNotifications = async () => {
      const count = await NotificationService.getUnreadCount(userData.id);
      setUnreadCount(count);
      // Fetch recent notifications (limit 10)
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userData.id)
        .order('created_at', { ascending: false })
        .limit(10);
      if (!error && data) setNotifications(data);
    };
    fetchNotifications();
    // Subscribe to real-time notifications
    NotificationService.getInstance().subscribeToNotifications(userData.id, (notif) => {
      setUnreadCount((c) => c + 1);
      setNotifications((prev) => [notif, ...prev].slice(0, 10));
    });
    unsub = () => NotificationService.getInstance().unsubscribeFromNotifications(userData.id);
    return unsub;
  }, [userData?.id]);

  // Mark notification as read
  const handleMarkAsRead = async (id: string) => {
    await NotificationService.markAsRead(id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
    setUnreadCount((c) => Math.max(0, c - 1));
  };

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

  // Helper for links to unimplemented/placeholder pages
  const handleComingSoon = (label: string) => {
    setShowComingSoon(label);
    setTimeout(() => setShowComingSoon(null), 2000);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white shadow-xl sticky top-0 z-50" dir="rtl">
      {/* Toast for coming soon pages */}
      {showComingSoon && (
        <div className="fixed top-20 right-1/2 translate-x-1/2 z-50 bg-yellow-100 text-yellow-900 px-6 py-3 rounded-lg shadow-lg border border-yellow-300 animate-fade-in">
          <span className="font-bold">{showComingSoon}</span> - هذه الصفحة قيد التطوير وستتوفر قريبًا
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo on far right */}
        <div className="flex items-center gap-6 order-2 md:order-1">
          <Link href="/" className="text-2xl font-bold">بِنَّا</Link>
        </div>
        {/* Navigation links center (hidden on small screens if needed) */}
        <div className="flex-1 flex items-center justify-center gap-6 order-1 md:order-2">
          {/* Role-based navigation links */}
          {userData?.account_type === 'store' ? (
            <>
              <Link href="/store/dashboard" className="hover:underline flex items-center gap-1"><Home className="w-5 h-5" />لوحة المتجر</Link>
              <Link href="/store/products" className="hover:underline flex items-center gap-1"><Package className="w-5 h-5" />منتجاتي</Link>
              <Link href="/store/orders" className="hover:underline flex items-center gap-1"><FileText className="w-5 h-5" />الطلبات</Link>
              <Link href="/store/analytics" className="hover:underline flex items-center gap-1"><Calculator className="w-5 h-5" />التحليلات</Link>
              <Link href="/store/warranty" className="hover:underline flex items-center gap-1"><Shield className="w-5 h-5" />الضمانات</Link>
              <Link href="/store/documents" className="hover:underline flex items-center gap-1"><FileText className="w-5 h-5" />الملفات والفواتير</Link>
              <Link href="/store/support" className="hover:underline flex items-center gap-1"><Bell className="w-5 h-5" />الدعم الفني</Link>
            </>
          ) : userData?.account_type === 'user' || userData?.account_type === 'client' ? (
            <>
              <Link href="/user/dashboard" className="hover:underline flex items-center gap-1"><Home className="w-5 h-5" />لوحة المستخدم</Link>
              <Link href="/user/projects" className="hover:underline flex items-center gap-1"><Building2 className="w-5 h-5" />مشاريعي</Link>
              <Link href="/user/orders" className="hover:underline flex items-center gap-1"><Package className="w-5 h-5" />طلباتي</Link>
              <Link href="/user/warranty" className="hover:underline flex items-center gap-1"><Shield className="w-5 h-5" />الضمانات</Link>
              <Link href="/user/documents" className="hover:underline flex items-center gap-1"><FileText className="w-5 h-5" />ملفاتي</Link>
              <Link href="/user/favorites" className="hover:underline flex items-center gap-1"><Users className="w-5 h-5" />المتاجر المفضلة</Link>
              <Link href="/user/support" className="hover:underline flex items-center gap-1"><Bell className="w-5 h-5" />الدعم الفني</Link>
              <Link href="/stores" className="hover:underline flex items-center gap-1"><Package className="w-5 h-5" />المتاجر</Link>
            </>
          ) : (
            // Not logged in
            <>
              <Link href="/projects" className="hover:underline flex items-center gap-1"><Building2 className="w-5 h-5" />المشاريع</Link>
              <Link href="/stores" className="hover:underline flex items-center gap-1"><Package className="w-5 h-5" />المتاجر</Link>
              <Link href="/login" className="hover:underline flex items-center gap-1">تسجيل الدخول</Link>
              <Link href="/signup" className="hover:underline flex items-center gap-1">تسجيل حساب</Link>
            </>
          )}

          {/* Construction Journey Dropdown - only for users */}
          {userData?.account_type !== 'store' && (
            <div className="relative" ref={journeyRef}>
              <button
                className="flex items-center gap-1 px-3 py-2 rounded hover:bg-blue-900 focus:outline-none transition-colors text-white font-medium"
                style={{ background: journeyOpen ? 'rgba(30, 64, 175, 0.15)' : 'none' }}
                onClick={() => setJourneyOpen((v) => !v)}
                type="button"
              >
                <Calendar className="w-5 h-5" />
                <span className="ml-1">رحلة البناء</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${journeyOpen ? 'rotate-180' : ''}`} />
              </button>
              {journeyOpen && (
                <div className="absolute z-50 mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-2xl min-w-[240px] text-right animate-fade-in overflow-visible">
                  <div className="p-4 border-b font-bold text-gray-700">مراحل رحلة البناء</div>
                  <ul className="divide-y divide-gray-100">
                    <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">اختيار الأرض</li>
                    <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">تخطيط المشروع</li>
                    <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">تصميم معماري وإنشائي</li>
                    <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">الحصول على التراخيص</li>
                    <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">تنفيذ البناء</li>
                    <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">التشطيبات والتسليم</li>
                    <li className="px-4 py-2 hover:bg-blue-50 cursor-pointer font-bold"><Link href='/stores'>البحث عن متجر</Link></li>
                    <li className="px-4 py-2 hover:bg-blue-50 cursor-pointer font-bold"><Link href='/user/orders'>تتبع الطلبات</Link></li>
                    <li className="px-4 py-2 hover:bg-blue-50 cursor-pointer font-bold"><Link href='/user/warranty'>الضمانات</Link></li>
                    <li className="px-4 py-2 hover:bg-blue-50 cursor-pointer font-bold"><Link href='/support'>الدعم الفني</Link></li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Dropdown and notifications on far left */}
        <div className="flex items-center gap-4 order-3 md:order-3">
          {/* Notifications Bell for users and stores */}
          {userData && (
            <div className="relative hover:underline flex items-center gap-1 mr-2">
              <button
                className="relative"
                onClick={() => setShowNotifications((v) => !v)}
                aria-label="عرض الإشعارات"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white rounded-full px-1">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute left-0 mt-2 w-80 bg-white text-gray-900 border rounded shadow-lg z-50 min-w-max text-right max-h-96 overflow-y-auto">
                  <div className="flex justify-between items-center px-4 py-2 border-b">
                    <span className="font-bold">الإشعارات</span>
                    <button className="text-xs text-blue-600 hover:underline" onClick={() => setShowNotifications(false)}>إغلاق</button>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-4 text-gray-500 text-center">لا توجد إشعارات جديدة</div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`px-4 py-3 border-b last:border-b-0 cursor-pointer hover:bg-blue-50 ${notif.is_read ? '' : 'bg-blue-100'}`}
                        onClick={() => handleMarkAsRead(notif.id)}
                      >
                        <div className="font-medium text-sm mb-1">{notif.title || 'إشعار جديد'}</div>
                        <div className="text-xs text-gray-700">{notif.message}</div>
                        <div className="text-xs text-gray-400 mt-1">{new Date(notif.created_at).toLocaleString('ar-EG')}</div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
          {/* Show dropdown and sign out only if logged in */}
          {userData && (
            <div className="relative" ref={userMenuRef}>
              <button
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-900"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <span>{userData.name || 'الحساب'}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {isUserMenuOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white text-gray-900 border rounded shadow-lg z-50 min-w-max text-right">
                  {userData.account_type === 'store' ? (
                    <>
                      <Link href="/store/dashboard" className="block px-4 py-2 hover:bg-gray-100 flex items-center gap-2"><Home className="w-5 h-5" />لوحة المتجر</Link>
                      <Link href="/store/products" className="block px-4 py-2 hover:bg-gray-100 flex items-center gap-2"><Package className="w-5 h-5" />منتجاتي</Link>
                      <Link href="/store/orders" className="block px-4 py-2 hover:bg-gray-100 flex items-center gap-2"><FileText className="w-5 h-5" />الطلبات</Link>
                      <Link href="/store/profile" className="block px-4 py-2 hover:bg-gray-100 flex items-center gap-2"><User className="w-5 h-5" />الملف الشخصي</Link>
                      <Link href="/store/settings" className="block px-4 py-2 hover:bg-gray-100 flex items-center gap-2"><Settings className="w-5 h-5" />الإعدادات</Link>
                      <Link href="/store/documents" className="block px-4 py-2 hover:bg-gray-100 flex items-center gap-2"><FileText className="w-5 h-5" />الملفات والفواتير</Link>
                      <Link href="/store/warranty" className="block px-4 py-2 hover:bg-gray-100 flex items-center gap-2"><Shield className="w-5 h-5" />الضمانات</Link>
                      <Link href="/store/analytics" className="block px-4 py-2 hover:bg-gray-100 flex items-center gap-2"><Calculator className="w-5 h-5" />التحليلات</Link>
                      <Link href="/store/support" className="block px-4 py-2 hover:bg-gray-100 flex items-center gap-2"><Bell className="w-5 h-5" />الدعم الفني</Link>
                    </>
                  ) : (
                    <>
                      <Link href="/user/dashboard" className="block px-4 py-2 hover:bg-gray-100 flex items-center gap-2"><Home className="w-5 h-5" />لوحة المستخدم</Link>
                      <Link href="/user/projects" className="block px-4 py-2 hover:bg-gray-100 flex items-center gap-2"><Building2 className="w-5 h-5" />مشاريعي</Link>
                      <Link href="/user/orders" className="block px-4 py-2 hover:bg-gray-100 flex items-center gap-2"><Package className="w-5 h-5" />طلباتي</Link>
                      <Link href="/user/profile" className="block px-4 py-2 hover:bg-gray-100 flex items-center gap-2"><User className="w-5 h-5" />الملف الشخصي</Link>
                      <Link href="/user/settings" className="block px-4 py-2 hover:bg-gray-100 flex items-center gap-2"><Settings className="w-5 h-5" />الإعدادات</Link>
                      <Link href="/user/documents" className="block px-4 py-2 hover:bg-gray-100 flex items-center gap-2"><FileText className="w-5 h-5" />ملفاتي</Link>
                      <Link href="/user/warranty" className="block px-4 py-2 hover:bg-gray-100 flex items-center gap-2"><Shield className="w-5 h-5" />الضمانات</Link>
                      <Link href="/user/favorites" className="block px-4 py-2 hover:bg-gray-100 flex items-center gap-2"><Users className="w-5 h-5" />المتاجر المفضلة</Link>
                      <Link href="/user/support" className="block px-4 py-2 hover:bg-gray-100 flex items-center gap-2"><Bell className="w-5 h-5" />الدعم الفني</Link>
                      <Link href="/user/orders/history" className="block px-4 py-2 hover:bg-gray-100 flex items-center gap-2"><Package className="w-5 h-5" />سجل الطلبات</Link>
                    </>
                  )}
                  <button
                    onClick={async () => {
                      setLoading(true);
                      await supabase.auth.signOut();
                      setLoading(false);
                      setUserData(null);
                      router.push('/login');
                    }}
                    className="w-full text-right px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center gap-2 border-t mt-2"
                  >
                    <LogOut className="w-5 h-5" />تسجيل الخروج
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
