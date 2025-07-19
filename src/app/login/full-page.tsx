'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, EnhancedCard, Button } from '@/core/shared/components/ui/enhanced-components';
import { TempUser } from '@/core/shared/services/auth';
import { Mail, Lock, Eye, EyeOff, User, Store, AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'user' as 'user' | 'store'
  });

  // Clear auth state on component mount
  React.useEffect(() => {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Basic validation
      if (!formData.email || !formData.password) {
        setError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
        setIsLoading(false);
        return;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create mock user (in real app, this would be an API call)
      const mockUser: TempUser = formData.userType === 'store' 
        ? {
            id: '2',
            email: formData.email,
            name: 'مدير المتجر',
            role: 'store_admin',
            type: 'store',
            isAuthenticated: true
          }
        : {
            id: '3',
            email: formData.email,
            name: 'مستخدم عادي',
            role: 'user',
            type: 'user',
            isAuthenticated: true
          };

      // Store in sessionStorage for persistence
      sessionStorage.setItem('temp_user', JSON.stringify(mockUser));
      sessionStorage.setItem('temp_auth_timestamp', Date.now().toString());
      
      // Set a minimal cookie for middleware authentication
      const cookiePayload = {
        email: mockUser.email,
        type: mockUser.type,
        account_type: mockUser.type,
        isAuthenticated: true
      };
      document.cookie = `temp_auth_user=${encodeURIComponent(JSON.stringify(cookiePayload))}; path=/; max-age=86400; SameSite=Lax`;

      // Redirect to appropriate dashboard
      const dashboardRoute = formData.userType === 'store' ? '/store/dashboard' : '/user/dashboard';
      window.location.href = dashboardRoute;

    } catch (err) {
      setError('حدث خطأ في تسجيل الدخول. يرجى المحاولة مرة أخرى.');
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (userType: 'user' | 'store') => {
    setIsLoading(true);
    
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

    sessionStorage.setItem('temp_user', JSON.stringify(mockUser));
    sessionStorage.setItem('temp_auth_timestamp', Date.now().toString());
    
    const cookiePayload = {
      email: mockUser.email,
      type: mockUser.type,
      account_type: mockUser.type,
      isAuthenticated: true
    };
    document.cookie = `temp_auth_user=${encodeURIComponent(JSON.stringify(cookiePayload))}; path=/; max-age=86400; SameSite=Lax`;

    const dashboardRoute = userType === 'store' ? '/store/dashboard' : '/user/dashboard';
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
            سجل دخولك للوصول إلى حسابك
          </Typography>
        </div>

        {/* User Type Selection */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, userType: 'user' }))}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              formData.userType === 'user'
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <User className="w-4 h-4 inline ml-2" />
            مستخدم
          </button>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, userType: 'store' }))}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              formData.userType === 'store'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Store className="w-4 h-4 inline ml-2" />
            متجر
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <Typography variant="caption" size="sm" className="text-red-700">
              {error}
            </Typography>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 mb-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل بريدك الإلكتروني"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              كلمة المرور
            </label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pr-10 pl-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل كلمة المرور"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
              formData.userType === 'store'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </Button>
        </form>

        {/* Quick Login Section */}
        <div className="border-t pt-6">
          <Typography variant="body" size="sm" className="text-center text-gray-600 mb-4">
            أو دخول سريع للاختبار
          </Typography>
          
          <div className="space-y-2">
            <button
              onClick={() => handleQuickLogin('store')}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Store className="w-5 h-5" />
              دخول سريع كمدير متجر
            </button>

            <button
              onClick={() => handleQuickLogin('user')}
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <User className="w-5 h-5" />
              دخول سريع كمستخدم
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <Typography variant="caption" size="sm" className="text-gray-500">
            يمكنك استخدام أي بريد إلكتروني وكلمة مرور للاختبار
          </Typography>
        </div>
      </EnhancedCard>
    </div>
  );
}
