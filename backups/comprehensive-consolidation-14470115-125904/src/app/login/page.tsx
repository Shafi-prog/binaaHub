// NOTE: Email/password login is intentionally disabled for feature investigation and QA.
// To re-enable email/password login, restore the form and logic here.
// Only direct login as 'user' or 'store admin' is available on this page.
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { TempUser } from '@/core/shared/services/temp-auth';

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

    // Store in sessionStorage for persistence
    sessionStorage.setItem('temp_user', JSON.stringify(mockUser));
    sessionStorage.setItem('temp_auth_timestamp', Date.now().toString());

    // Redirect to appropriate dashboard
    if (userType === 'store') {
      router.push('/store/dashboard');
    } else {
      router.push('/user/dashboard');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, rgb(239 246 255) 0%, rgb(255 255 255) 50%, rgb(199 210 254) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        padding: '32px',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: 'rgb(17 24 39)',
            margin: '0 0 8px 0'
          }}>
            مرحباً بك في بِنّا
          </h1>
          <p style={{ color: 'rgb(75 85 99)', margin: '0' }}>
            اختر نوع الحساب للدخول مباشرة
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button
            onClick={() => handleLogin('store')}
            style={{
              width: '100%',
              fontWeight: '600',
              padding: '16px 24px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, rgb(37 99 235) 0%, rgb(29 78 216) 100%)',
              color: 'white',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}
          >
            <span>🏪</span>
            <span>دخول كمدير متجر</span>
          </button>

          <button
            onClick={() => handleLogin('user')}
            style={{
              width: '100%',
              fontWeight: '600',
              padding: '16px 24px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, rgb(34 197 94) 0%, rgb(21 128 61) 100%)',
              color: 'white',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}
          >
            <span>👤</span>
            <span>دخول كمستخدم</span>
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <p style={{ color: 'rgb(107 114 128)', fontSize: '14px' }}>
            تم إلغاء متطلبات كلمة المرور لسهولة اختبار الميزات
          </p>
        </div>
      </div>
    </div>
  );
}
