// Enhanced login page that uses the proxy approach directly
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EnhancedLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: 'testuser3@binna.com',
    password: 'password123',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('🔐 Attempting login with proxy approach...');
      
      // Use the proxy login directly
      const response = await fetch('/api/auth/proxy-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();
      console.log('Login result:', result);

      if (!result.success) {
        setError(result.error || 'فشل في تسجيل الدخول');
        return;
      }

      // Store session for the app to use
      const sessionData = {
        user: {
          id: result.user.id,
          email: result.user.email,
          email_confirmed_at: result.user.emailConfirmed ? new Date().toISOString() : null,
          user_metadata: {
            name: result.profile?.displayName || result.user.email.split('@')[0],
          },
        },
        access_token: 'proxy-token-' + Date.now(),
        refresh_token: 'proxy-refresh-' + Date.now(),
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: 'bearer',
      };

      // Store in localStorage
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        currentSession: sessionData,
        expiresAt: sessionData.expires_at
      }));

      console.log('✅ Login successful, redirecting to dashboard...');
      
      // Force redirect to dashboard
      window.location.href = '/user/dashboard';

    } catch (error) {
      console.error('Login error:', error);
      setError('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            مرحباً بك في بِنّا
          </h1>
          <p className="text-lg text-gray-600">
            تسجيل الدخول إلى حسابك (Enhanced)
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              البريد الإلكتروني
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="أدخل بريدك الإلكتروني"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              كلمة المرور
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="أدخل كلمة المرور"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            هذه نسخة محسنة تستخدم الـ Proxy للتجاوز على مشاكل الشبكة
          </p>
        </div>
      </div>
    </div>
  );
}
