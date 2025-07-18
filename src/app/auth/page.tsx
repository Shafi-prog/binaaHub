'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { verifyTempAuth } from '@/core/shared/services/auth';

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authResult = verifyTempAuth();
        
        if (authResult?.user) {
          // User is authenticated, redirect to appropriate dashboard
          if (authResult.user.role === 'store') {
            router.replace('/store/dashboard');
          } else {
            router.replace('/user/dashboard');
          }
        } else {
          // Not authenticated, redirect to login
          router.replace('/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.replace('/login');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-xl max-w-md">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold text-gray-800 mb-2">التحقق من الهوية</h1>
        <p className="text-gray-600">جاري التحقق من بيانات الدخول...</p>
      </div>
    </div>
  );
}