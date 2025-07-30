// Direct dashboard access page that handles authentication
'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/core/shared/auth/AuthProvider';

export default function DirectDashboardPage() {
  const { signIn, user, isLoading } = useAuth();
  const [status, setStatus] = useState('authenticating');

  useEffect(() => {
    const handleAuthentication = async () => {
      try {
        console.log('🔑 Direct dashboard access - checking auth...');
        
        if (user) {
          console.log('✅ User already authenticated:', user.email);
          setStatus('redirecting');
          window.location.href = '/user/dashboard';
          return;
        }

        console.log('🔐 No user found, attempting auto-login...');
        setStatus('logging_in');
        
        // Auto-login with known credentials
        const result = await signIn('testuser3@binna.com', 'password123');
        
        if (result.success) {
          console.log('✅ Auto-login successful, redirecting...');
          setStatus('redirecting');
          setTimeout(() => {
            window.location.href = '/user/dashboard';
          }, 1000);
        } else {
          console.log('❌ Auto-login failed:', result.error);
          setStatus('error');
        }
      } catch (error) {
        console.error('❌ Authentication error:', error);
        setStatus('error');
      }
    };

    if (!isLoading) {
      handleAuthentication();
    }
  }, [user, isLoading, signIn]);

  const goToDashboardManually = () => {
    console.log('🚀 Manual dashboard access...');
    window.location.href = '/user/dashboard';
  };

  const goToLogin = () => {
    window.location.href = '/auth/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          الوصول المباشر للوحة التحكم
        </h1>

        {status === 'authenticating' && (
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري التحقق من الهوية...</p>
          </div>
        )}

        {status === 'logging_in' && (
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تسجيل الدخول...</p>
          </div>
        )}

        {status === 'redirecting' && (
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري التوجيه للوحة التحكم...</p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <p className="text-red-600 mb-4">حدث خطأ في المصادقة</p>
            <div className="space-y-3">
              <button
                onClick={goToDashboardManually}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700"
              >
                🚀 الذهاب للوحة التحكم مباشرة
              </button>
              <button
                onClick={goToLogin}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700"
              >
                العودة لصفحة تسجيل الدخول
              </button>
            </div>
          </div>
        )}

        {user && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-green-800 font-medium">مرحباً {user.name}</p>
            <p className="text-green-700 text-sm">{user.email}</p>
            <button
              onClick={goToDashboardManually}
              className="mt-3 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 text-sm"
            >
              الذهاب للوحة التحكم
            </button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t text-sm text-gray-500">
          <p>هذه الصفحة تتعامل مع المصادقة تلقائياً وتوجهك لوحة التحكم</p>
        </div>
      </div>
    </div>
  );
}
