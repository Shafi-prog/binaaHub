import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { Eye, EyeOff, User, Store, AlertCircle, CheckCircle } from 'lucide-react';

export default function SupabaseLoginPage() {
  const router = useRouter();
  const { signIn, signUp, user, isLoading, error, testConnection } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    accountType: 'user' as 'user' | 'store',
  });
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    connected: boolean;
    error?: string;
    tested: boolean;
    usingMock?: boolean;
  }>({ connected: false, tested: false });

  // Test Supabase connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      const result = await testConnection();
      setConnectionStatus({
        connected: result.connected,
        error: result.error,
        tested: true,
        usingMock: result.usingMock,
      });
    };
    checkConnection();
  }, [testConnection]);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      const redirectPath = user.role === 'store_admin' ? '/store/dashboard' : '/user/dashboard';
      router.push(redirectPath);
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    try {
      // Validation
      if (!formData.email || !formData.password) {
        throw new Error('يرجى ملء جميع الحقول المطلوبة');
      }

      if (formData.password.length < 6) {
        throw new Error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      }

      if (isSignUp && formData.password !== formData.confirmPassword) {
        throw new Error('كلمة المرور وتأكيد كلمة المرور غير متطابقان');
      }

      if (isSignUp && !formData.name.trim()) {
        throw new Error('يرجى إدخال الاسم');
      }

      let result;
      if (isSignUp) {
        result = await signUp(formData.email, formData.password, {
          name: formData.name,
          role: formData.accountType === 'store' ? 'store_admin' : 'user',
          account_type: 'free',
        });
      } else {
        result = await signIn(formData.email, formData.password);
      }

      if (!result.success) {
        throw new Error(result.error || 'فشل في تسجيل الدخول');
      }

    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'حدث خطأ غير متوقع');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (accountType: 'user' | 'store') => {
    setIsSubmitting(true);
    setFormError('');

    try {
      // Demo credentials
      const demoCredentials = {
        user: { email: 'demo.user@binna.sa', password: 'demo123456' },
        store: { email: 'demo.store@binna.sa', password: 'demo123456' }
      };

      const creds = demoCredentials[accountType];
      const result = await signIn(creds.email, creds.password);

      if (!result.success) {
        // If demo user doesn't exist, create them
        const signUpResult = await signUp(creds.email, creds.password, {
          name: accountType === 'store' ? 'متجر تجريبي' : 'مستخدم تجريبي',
          role: accountType === 'store' ? 'store_admin' : 'user',
          account_type: 'free',
        });

        if (!signUpResult.success) {
          throw new Error(signUpResult.error || 'فشل في إنشاء حساب تجريبي');
        }
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'فشل في تسجيل الدخول التجريبي');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            مرحباً بك في بِنّا
          </h1>
          <p className="text-lg text-gray-600">
            {isSignUp ? 'إنشاء حساب جديد' : 'تسجيل الدخول إلى حسابك'}
          </p>
        </div>

        {/* Connection Status */}
        {connectionStatus.tested && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            connectionStatus.connected 
              ? connectionStatus.usingMock
                ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                : 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {connectionStatus.connected ? (
              <>
                <CheckCircle className="h-5 w-5" />
                <div>
                  <div>
                    {connectionStatus.usingMock 
                      ? 'استخدام بيانات تجريبية محلية' 
                      : 'متصل بقاعدة البيانات بنجاح'
                    }
                  </div>
                  {connectionStatus.usingMock && (
                    <div className="text-sm mt-1">
                      سيتم حفظ البيانات محلياً فقط
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5" />
                <div>
                  <div>فشل في الاتصال بقاعدة البيانات</div>
                  {connectionStatus.error && (
                    <div className="text-sm mt-1">خطأ: {connectionStatus.error}</div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Error Display */}
        {(formError || error) && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200 flex items-center gap-3">
            <AlertCircle className="h-5 w-5" />
            <span>{formError || error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name field (only for sign up) */}
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الاسم
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل اسمك"
                required={isSignUp}
              />
            </div>
          )}

          {/* Email field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="أدخل بريدك الإلكتروني"
              required
            />
          </div>

          {/* Password field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                placeholder="أدخل كلمة المرور"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password field (only for sign up) */}
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  placeholder="أكد كلمة المرور"
                  required={isSignUp}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          )}

          {/* Account type selection (only for sign up) */}
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع الحساب
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, accountType: 'user' }))}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    formData.accountType === 'user'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <User className="h-6 w-6 mx-auto mb-2" />
                  <div className="font-medium">مستخدم</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, accountType: 'store' }))}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    formData.accountType === 'store'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Store className="h-6 w-6 mx-auto mb-2" />
                  <div className="font-medium">متجر</div>
                </button>
              </div>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg text-lg transition-all duration-200 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                جاري المعالجة...
              </div>
            ) : (
              isSignUp ? 'إنشاء حساب' : 'تسجيل الدخول'
            )}
          </button>
        </form>

        {/* Toggle between sign in/sign up */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setFormError('');
            }}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {isSignUp ? 'هل لديك حساب؟ تسجيل الدخول' : 'ليس لديك حساب؟ إنشاء حساب جديد'}
          </button>
        </div>

        {/* Demo login buttons */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600 mb-4">أو جرب الدخول التجريبي</p>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleDemoLogin('user')}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 p-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 rounded-lg transition-all"
            >
              <User className="h-5 w-5" />
              مستخدم تجريبي
            </button>
            <button
              onClick={() => handleDemoLogin('store')}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 p-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 rounded-lg transition-all"
            >
              <Store className="h-5 w-5" />
              متجر تجريبي
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
