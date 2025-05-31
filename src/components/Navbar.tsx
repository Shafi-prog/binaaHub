// src/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Session } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/database';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { CartIcon, CartSidebar } from '@/components/cart/CartSidebar';

interface NavbarProps {
  session: Session | null;
}

export default function Navbar(props: NavbarProps) {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [accountType, setAccountType] = useState(null as string | null);
  const [userName, setUserName] = useState(null as string | null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCartSidebar, setShowCartSidebar] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchUserData = async () => {
      try {
        if (!props.session?.user.id) {
          setLoading(false);
          return;
        }

        // Use a single query to get user data and notifications
        const [{ data: userData, error: userError }, { data: notifData, error: notifError }] =
          await Promise.all([
            supabase
              .from('users')
              .select('account_type, name, unread_notifications')
              .eq('id', props.session.user.id)
              .single(),
            supabase
              .from('notifications')
              .select('*')
              .eq('user_id', props.session.user.id)
              .order('created_at', { ascending: false })
              .limit(5),
          ]);

        if (mounted) {
          if (!userError && userData) {
            setAccountType(userData.account_type);
            setUserName(userData.name || props.session.user.email?.split('@')[0]);
          } else {
            console.error('❌ [Navbar] User data error:', userError?.message);
          }

          if (!notifError && notifData) {
            setNotifications(notifData);
          }

          setLoading(false);
        }
      } catch (error) {
        console.error('❌ [Navbar] Error fetching user data:', error);
        if (mounted) setLoading(false);
      }
    };

    if (props.session) {
      fetchUserData();
    } else {
      setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [props.session, supabase]);

  const handleSignOut = async () => {
    try {
      setIsDropdownOpen(false); // Close dropdown before signing out

      // Show loading state first
      toast.loading('جاري تسجيل الخروج...', { id: 'signout' });

      // Create a loading page
      const loadingDiv = document.createElement('div');
      loadingDiv.className =
        'fixed inset-0 bg-white flex flex-col items-center justify-center z-50';
      loadingDiv.innerHTML = `
        <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <div class="text-xl font-bold text-gray-800">جاري تسجيل الخروج...</div>
      `;
      document.body.appendChild(loadingDiv);

      // Wait a bit for visual feedback
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Actually sign out
      await supabase.auth.signOut();

      // Clear any session-related cookies
      document.cookie = 'auth_session_active=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

      toast.success('تم تسجيل الخروج بنجاح', { id: 'signout' });

      // Redirect to login with a parameter to show logout status
      window.location.href = '/login?fromLogout=true';
    } catch (error) {
      console.error('❌ [Navbar] Signout error:', error);
      toast.error('حدث خطأ أثناء تسجيل الخروج', { id: 'signout' });
      window.location.href = '/login?fromLogout=error';
    }
  };
  return (
    <div className="bg-white shadow-md font-tajawal sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="شعار" className="w-10 h-10" />
          <span className="hidden md:inline text-sm font-bold text-blue-700">بناء دون عناء</span>
        </Link>

        <div className="flex items-center gap-6">
          {/* Main Navigation */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/" className="hover:text-blue-500">
              الرئيسية
            </Link>
            <Link href="/stores" className="hover:text-blue-500">
              المتاجر
            </Link>
            <Link href="/#features" className="hover:text-blue-500">
              الخدمات
            </Link>
          </div>

          {/* Cart Icon - Show for all users */}
          <CartIcon 
            onClick={() => setShowCartSidebar(true)}
            className="hover:text-blue-500"
          />

          {/* User Menu */}
          {props.session ? (
            <div className="flex items-center gap-4">
              {/* Show loading skeleton while fetching user data */}
              {loading ? (
                <div className="animate-pulse flex items-center gap-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="w-20 h-4 bg-gray-200 rounded"></div>
                </div>
              ) : (
                <>
                  {/* Notifications */}
                  {notifications.length > 0 && (
                    <div className="relative">
                      <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2 text-gray-600 hover:text-gray-800 relative"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                          />
                        </svg>
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {notifications.length}
                        </span>
                      </button>

                      {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl py-2 z-50">
                          {notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                            >
                              <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                              <p className="text-xs text-gray-500">{notif.message}</p>
                            </div>
                          ))}
                          <div className="border-t mt-2 pt-2 px-4">
                            <Link
                              href="/notifications"
                              className="text-sm text-blue-600 hover:text-blue-700"
                            >
                              عرض كل الإشعارات
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* User Profile Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2 hover:text-blue-500 focus:outline-none"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                        {userName?.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden md:inline">{userName}</span>
                      <svg
                        className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                        <Link
                          href={accountType === 'store' ? '/store/dashboard' : '/user/dashboard'}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          لوحة التحكم
                        </Link>
                        <Link
                          href={accountType === 'store' ? '/store/profile' : '/user/profile'}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          الملف الشخصي
                        </Link>
                        {accountType === 'store' && (
                          <Link
                            href="/store/products"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            إدارة المنتجات
                          </Link>
                        )}
                        <button
                          onClick={handleSignOut}
                          className="block w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          تسجيل الخروج
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4 text-sm">
              <Link href="/login" className="px-4 py-2 text-blue-600 hover:text-blue-700">
                تسجيل الدخول
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                إنشاء حساب
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Cart Sidebar */}
      <CartSidebar 
        isOpen={showCartSidebar}
        onClose={() => setShowCartSidebar(false)}
      />
    </div>
  );
}
