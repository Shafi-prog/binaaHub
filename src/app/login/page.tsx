'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import type { Database } from '@/types/database';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const supabase = createClientComponentClient<Database>();
  // Remove fromLogout parameter handling since we redirect to home page now

  // Form validation
  const validateForm = (): boolean => {
    if (!email) {
      toast.error('يرجى إدخال البريد الإلكتروني');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('يرجى إدخال بريد إلكتروني صحيح');
      return false;
    }
    if (!password) {
      toast.error('يرجى إدخال كلمة المرور');
      return false;
    }
    if (password.length < 6) {
      toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return false;
    }
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Use the sync-login API endpoint for better authentication handling
      const response = await fetch('/api/auth/sync-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          remember_me: rememberMe,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'فشل في تسجيل الدخول');
      }

      toast.success('تم تسجيل الدخول بنجاح! 🎉');

      // Wait a moment for user feedback
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Redirect to the appropriate dashboard
      if (result.redirect_to) {
        window.location.href = result.redirect_to;
      } else {
        // Fallback redirect logic
        const { data: userData } = await supabase
          .from('users')
          .select('account_type')
          .eq('email', email)
          .single();

        const redirectPath =
          userData?.account_type === 'store'
            ? '/store/dashboard'
            : userData?.account_type === 'user' || userData?.account_type === 'client'
              ? '/user/dashboard'
              : userData?.account_type === 'engineer' || userData?.account_type === 'consultant'
                ? '/dashboard/construction-data'
                : '/';

        router.push(redirectPath);
      }
    } catch (error: any) {
      console.error('❌ [Login] Error:', error);
      toast.error(error.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex">
      {/* Left side - Image (hidden on mobile) */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-white">
        <img
          src="/forms-concept-illustration_114360-4957.avif"
          alt="تسجيل الدخول"
          className="object-cover max-w-full max-h-screen"
        />
      </div>

      {/* Right side - Login Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-8 font-tajawal">
            تسجيل الدخول
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-right text-sm mb-1 font-medium text-gray-700">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="ادخل بريدك الإلكتروني"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-right text-sm mb-1 font-medium text-gray-700">
                كلمة المرور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="ادخل كلمة المرور"
                disabled={loading}
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={loading}
                />
                <label htmlFor="remember-me" className="mr-2 block text-sm text-gray-700">
                  تذكرني
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  نسيت كلمة المرور؟
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-semibold mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>

          <div className="text-center text-sm text-gray-500 mt-6">
            ليس لديك حساب؟
            <Link href="/signup" className="text-blue-600 hover:underline mr-1">
              إنشاء حساب جديد
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
