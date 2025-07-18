// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import { performLogout } from '@/core/shared/services/logout';

export const dynamic = 'force-dynamic'

export default function ClearAuthPage() {
  const [status, setStatus] = useState('جاري مسح بيانات المصادقة...');

  useEffect(() => {
    const clearAuth = async () => {
      setStatus('جاري مسح بيانات المصادقة...');
      
      try {
        await performLogout({
          showToast: false, // Don't show toast on this page
          redirectUrl: '/login',
          redirectDelay: 2000
        });
        
        setStatus('تم مسح جميع بيانات المصادقة بنجاح! سيتم توجيهك لصفحة تسجيل الدخول...');
        
      } catch (error) {
        console.error('Error clearing auth:', error);
        setStatus('خطأ في مسح بيانات المصادقة. سيتم المحاولة مرة أخرى...');
        
        // Force redirect even if there's an error
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      }
    };

    clearAuth();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">مسح بيانات المصادقة</h1>
        <div className="text-gray-600 mb-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>{status}</p>
        </div>
        <div className="text-sm text-gray-500">
          <p>هذه الصفحة ستقوم بمسح جميع بيانات المصادقة وتوجيهك لصفحة تسجيل الدخول.</p>
          <p className="mt-2">إذا واجهت مشاكل، جرب فتح نافذة خاصة/مخفية.</p>
        </div>
      </div>
    </div>
  );
}
