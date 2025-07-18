// NOTE: Email/password login is intentionally disabled for feature investigation and QA.
// To re-enable email/password login, restore the form and logic here.
// Only direct login as 'user' or 'store admin' is available on this page.
'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { TempUser } from '@/core/shared/services/auth';
import { Button, EnhancedCard, Typography } from '@/core/shared/components/ui/enhanced-components';
import { User, Store } from 'lucide-react';

export default function DirectLoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Robust: clear all possible auth state on every visit
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
  }, []);

  const handleLogin = (userType: 'user' | 'store') => {
    console.log(`🔐 Login attempted for userType: ${userType}`);

    // Create mock user based on type
    const mockUser: TempUser = userType === 'store'
      ? {
          id: '2',
          email: 'store@binna.com',
          name: 'مدير المتجر',
          role: 'store_admin',
          type: 'store',
          isAuthenticated: true
        }
      : {
          id: '3',
          email: 'user@binna.com',
          name: 'مستخدم عادي',
          role: 'user',
          type: 'user',
          isAuthenticated: true
        };

    console.log(`� Created user:`, mockUser);

    // Store in sessionStorage for persistence
    sessionStorage.setItem('temp_user', JSON.stringify(mockUser));
    sessionStorage.setItem('temp_auth_timestamp', Date.now().toString());

    // Set a minimal cookie for middleware authentication
    // Only store the fields needed for routing and auth
    const cookiePayload = {
      email: mockUser.email,
      type: mockUser.type,
      account_type: mockUser.type, // for middleware compatibility
      isAuthenticated: true
    };
    document.cookie = `temp_auth_user=${encodeURIComponent(JSON.stringify(cookiePayload))}; path=/; max-age=86400; SameSite=Strict`;

    console.log(`💾 Stored user in sessionStorage and cookies`);

    // Determine the correct redirect route
    const dashboardRoute = userType === 'store' ? '/store/dashboard' : '/user/dashboard';
    console.log(`� Redirecting ${userType} to: ${dashboardRoute}`);

    // Force immediate redirect
    window.location.href = dashboardRoute;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-4" dir="rtl">
      <EnhancedCard variant="elevated" className="w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <Typography variant="heading" size="3xl" weight="bold" className="text-gray-900 mb-2">
            مرحباً بك في بِنّا
          </Typography>
          <Typography variant="body" size="lg" className="text-gray-600">
            اختر نوع الحساب للدخول مباشرة
          </Typography>
        </div>

        <div className="space-y-4">
          {/* Store Admin Login Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('🏪 Store button clicked!');
              handleLogin('store');
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-8 rounded-xl text-xl border-none outline-none"
            style={{
              zIndex: 9999,
              position: 'relative',
              display: 'block',
              width: '100%'
            }}
          >
            🏪 دخول كمدير متجر
          </button>

          {/* User Login Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('👤 User button clicked!');
              handleLogin('user');
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 px-8 rounded-xl text-xl border-none outline-none"
            style={{
              zIndex: 9999,
              position: 'relative',
              display: 'block',
              width: '100%'
            }}
          >
            👤 دخول كمستخدم
          </button>
        </div>

        <div className="text-center mt-8">
          <Typography variant="caption" size="sm" className="text-gray-500">
            تم إلغاء متطلبات كلمة المرور لسهولة اختبار الميزات
          </Typography>
        </div>
      </EnhancedCard>
    </div>
  );
}
