'use client';
import { useEffect, useState, Suspense } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { LoadingSpinner } from '@/components/ui';
import SupervisorChat from '@/components/SupervisorChat';
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

function ChatPageContent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const supervisorId = searchParams.get('supervisorId');
  const projectId = searchParams.get('projectId');
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

        console.log('🔍 [Chat] Verifying authentication...');

        // Use robust authentication recovery
        const authResult = await verifyAuthWithRetry();
        if (authResult.error || !authResult.user) {
          console.error('❌ [Chat] Authentication failed');
          setAuthError('المستخدم غير مسجل الدخول');
          router.push('/login');
          return;
        }

        console.log('✅ [Chat] User authenticated:', authResult.user.email);
        setUser(authResult.user);

        // Verify that we have at least a supervisorId or projectId
        if (!supervisorId && !projectId) {
          setError('لم يتم تحديد المشرف أو المشروع');
        }
      } catch (error) {
        console.error('❌ [Chat] Error during authentication:', error);
        setError('حدث خطأ أثناء التحقق من المستخدم');
      } finally {
        setLoading(false);
      }
    };

    verifyAuthentication();
  }, [isHydrated, router, supervisorId, projectId]);

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
              <h1 className="text-3xl font-bold text-gray-800 mb-2">المحادثات</h1>
              <p className="text-gray-600">التواصل مع المشرفين ومتابعة المشاريع</p>
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
              href="/user/services/supervision"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              طلب مشرف
            </Link>
          </div>
        </div>

        {/* Chat Container */}
        <div className="mb-8">
          {user && (
            <SupervisorChat 
              userId={user.id} 
              supervisorId={supervisorId || undefined} 
              projectId={projectId || undefined} 
              className="w-full"
            />          )}
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<LoadingProgressIndicator />}>
      <ChatPageContent />
    </Suspense>
  );
}
