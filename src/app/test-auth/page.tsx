'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setTempAuthUser, getTempAuthUser, clearTempAuth } from '@/lib/temp-auth';
import { Card } from '@/components/ui';

export default function TestAuth() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(() => getTempAuthUser());

  const loginAsStore = () => {
    const storeUser = {
      id: 'store-test-123',
      email: 'store@test.com',
      account_type: 'store' as const,
      name: 'متجر الاختبار'
    };
    
    setTempAuthUser(storeUser);
    setCurrentUser(storeUser);
    alert('تم تسجيل الدخول كمتجر بنجاح!');
  };

  const loginAsUser = () => {
    const normalUser = {
      id: 'user-test-123',
      email: 'user@test.com',
      account_type: 'user' as const,
      name: 'مستخدم الاختبار'
    };
    
    setTempAuthUser(normalUser);
    setCurrentUser(normalUser);
    alert('تم تسجيل الدخول كمستخدم عادي بنجاح!');
  };

  const logout = () => {
    clearTempAuth();
    setCurrentUser(null);
    alert('تم تسجيل الخروج بنجاح!');
  };

  const goToStoreDashboard = () => {
    router.push('/store/dashboard');
  };

  const goToMainDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
      <Card className="p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">صفحة اختبار المصادقة</h1>
        
        {currentUser ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800">مسجل الدخول حالياً:</h3>
              <p className="text-green-700">{currentUser.name}</p>
              <p className="text-sm text-green-600">{currentUser.email}</p>
              <p className="text-sm text-green-600">نوع الحساب: {currentUser.account_type}</p>
            </div>
            
            <div className="space-y-2">
              {currentUser.account_type === 'store' && (
                <button
                  onClick={goToStoreDashboard}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  الذهاب إلى لوحة تحكم المتجر
                </button>
              )}
              
              <button
                onClick={goToMainDashboard}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                الذهاب إلى لوحة التحكم الرئيسية
              </button>
              
              <button
                onClick={logout}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-gray-600 mb-6">
              اختر نوع المستخدم للاختبار:
            </p>
            
            <button
              onClick={loginAsStore}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              تسجيل الدخول كمتجر
            </button>
            
            <button
              onClick={loginAsUser}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              تسجيل الدخول كمستخدم عادي
            </button>
          </div>
        )}
        
        <div className="mt-6 pt-4 border-t">
          <p className="text-sm text-gray-500 text-center">
            هذه صفحة اختبار للمصادقة المؤقتة
          </p>
        </div>
      </Card>
    </div>
  );
}
