<<<<<<< HEAD
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">تسجيل الدخول</h2>
        <form className="space-y-5">
          <div>
            <label className="block mb-1 text-gray-700 font-medium">البريد الإلكتروني</label>
            <input type="email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="you@email.com" required />
          </div>
          <div>
            <label className="block mb-1 text-gray-700 font-medium">كلمة المرور</label>
            <input type="password" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="••••••••" required />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition">دخول</button>
        </form>
        <div className="text-center mt-6 text-gray-600">
          ليس لديك حساب؟{' '}
          <Link href="/signup" className="text-blue-600 hover:underline font-semibold">إنشاء حساب جديد</Link>
        </div>
      </div>
    </div>
=======
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { 
  Typography, 
  EnhancedCard, 
  EnhancedButton, 
  EnhancedInput 
} from '@/components/ui/enhanced-components';
import type { Database } from '@/types/database';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [lastAttempt, setLastAttempt] = useState(0);
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
  };  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Prevent multiple rapid submissions
    if (loading) {
      return;
    }

    // Rate limiting: prevent requests within 2 seconds of each other
    const now = Date.now();
    if (now - lastAttempt < 2000) {
      toast.error('يرجى الانتظار قليلاً قبل المحاولة مرة أخرى');
      return;
    }
    setLastAttempt(now);

    setLoading(true);    try {
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
        // If rate limited, try direct Supabase auth as fallback
        if (response.status === 429 || result.error?.includes('rate limit')) {
          console.log('🔄 [Login] Rate limited, trying direct auth fallback...');
          
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            throw new Error(error.message);
          }

          // Only redirect, do not show a second toast
          await new Promise((resolve) => setTimeout(resolve, 800));
          router.push('/');
          return;
        }
        
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
      }    } catch (error: any) {
      console.error('❌ [Login] Error:', error);
      
      // Check if it's a rate limit error
      if (error.message?.includes('rate limit') || error.message?.includes('too many requests')) {
        toast.error('تم تجاوز حد المحاولات. يرجى المحاولة بعد دقيقة واحدة.');
        // Add a longer delay for rate limit errors
        setTimeout(() => setLoading(false), 3000);
        return;
      }
      
      toast.error(error.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex font-tajawal">
      {/* Left side - Image (hidden on mobile) */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20"></div>
        <img
          src="/forms-concept-illustration_114360-4957.avif"
          alt="تسجيل الدخول"
          className="object-cover max-w-full max-h-screen relative z-10"
        />
      </div>

      {/* Right side - Login Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8">
        <EnhancedCard variant="elevated" className="p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <Typography variant="heading" size="3xl" weight="bold" className="text-blue-700 mb-2">
              تسجيل الدخول
            </Typography>
            <Typography variant="body" size="sm" className="text-gray-600">
              مرحباً بك في منصة بناء
            </Typography>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <EnhancedInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="البريد الإلكتروني"
              placeholder="ادخل بريدك الإلكتروني"
              disabled={loading}
              required
            />

            <EnhancedInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="كلمة المرور"
              placeholder="ادخل كلمة المرور"
              disabled={loading}
              required
            />

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
                <Typography variant="label" size="sm" className="mr-2">
                  تذكرني
                </Typography>
              </div>
              <div>
                <Link href="#" className="text-blue-600 hover:text-blue-500 text-sm">
                  نسيت كلمة المرور؟
                </Link>
              </div>
            </div>

            <EnhancedButton
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              className="mt-6"
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </EnhancedButton>
          </form>

          <div className="text-center mt-6">
            <Typography variant="body" size="sm" className="text-gray-500">
              ليس لديك حساب؟
              <Link href="/signup" className="text-blue-600 hover:underline mr-1 font-semibold">
                إنشاء حساب جديد
              </Link>
            </Typography>
          </div>
        </EnhancedCard>
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
>>>>>>> e0e83bc2e6a4c393009b329773f07bfad211af6b
  );
}
