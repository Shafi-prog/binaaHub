// @ts-nocheck
'use client';

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button, EnhancedCard, Typography } from '@/core/shared/components/ui/enhanced-components';
import { Store } from 'lucide-react';

export const dynamic = 'force-dynamic'
export default function StoreLogin() {
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    const mockUser = {
      id: '2',
      email: 'store@binna.com',
      name: 'مدير المتجر',
      role: 'store_admin',
      type: 'store',
      isAuthenticated: true
    };
    
    // Set cookie for middleware authentication
    document.cookie = `temp_auth_user=${JSON.stringify(mockUser)}; path=/; max-age=86400; SameSite=Lax`;
    
    login('store');
    router.push('/store/pages/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-4" dir="rtl">
      <EnhancedCard variant="elevated" className="w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <Typography variant="heading" size="3xl" weight="bold" className="text-gray-900 mb-2">
            دخول المتجر
          </Typography>
          <Typography variant="body" size="lg" className="text-gray-600">
            اضغط للدخول كمدير متجر
          </Typography>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          <div className="flex items-center justify-center gap-3">
            <Store className="w-6 h-6" />
            <span className="text-lg">دخول كمدير متجر</span>
          </div>
        </Button>
      </EnhancedCard>
    </div>
  );
}


