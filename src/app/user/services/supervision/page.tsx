'use client';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { LoadingSpinner } from '@/components/ui';
import SupervisorRequests from '@/components/SupervisorRequests';
import { verifyAuthWithRetry } from '@/lib/auth-recovery';

const LoadingProgressIndicator = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="animate-pulse space-y-8">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-[600px] bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  </div>
);

export default function SupervisionPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return; // Wait for hydration

    const verifyAuthentication = async () => {
      try {
        setLoading(true);
        setError(null);
        setAuthError(null);

        console.log('🔍 [Supervision] Verifying authentication...');

        // Use robust authentication recovery
        const authResult = await verifyAuthWithRetry();
        if (authResult.error || !authResult.user) {
          console.error('❌ [Supervision] Authentication failed');
          setAuthError('المستخدم غير مسجل الدخول');
          router.push('/login');
          return;
        }

        console.log('✅ [Supervision] User authenticated:', authResult.user.email);
        setUser(authResult.user);
      } catch (error) {
        console.error('❌ [Supervision] Error during authentication:', error);
        setError('حدث خطأ أثناء التحقق من المستخدم');
      } finally {
        setLoading(false);
      }
    };

    verifyAuthentication();
  }, [isHydrated, router]);

  if (loading) {
    return <LoadingProgressIndicator />;
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{authError}</div>
          <Link href="/login" className="text-blue-600 hover:underline">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <Link href="/user/dashboard" className="text-blue-600 hover:underline">
            العودة للوحة التحكم
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-tajawal">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">خدمات الإشراف</h1>
              <p className="text-gray-600">طلب خدمات الإشراف ومتابعة المشاريع</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Link
              href="/user/dashboard"
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              العودة للوحة التحكم
            </Link>
            <Link
              href="/user/chat"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              المحادثات
            </Link>
          </div>
        </div>

        {/* Supervisor Requests */}
        <div className="mb-8">
          {user && (
            <SupervisorRequests 
              userId={user.id} 
              isUser={true} 
              className="w-full"
            />
          )}
        </div>
      </div>
    </div>
  );
}
