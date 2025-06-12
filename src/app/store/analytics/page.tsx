'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import StoreAnalyticsDashboard from '@/components/analytics/StoreAnalyticsDashboard';
import { toast } from 'react-hot-toast';

export default function StoreAnalytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [storeId, setStoreId] = useState<string | null>(null);

  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Session error:', sessionError);
        router.push('/login');
        return;
      }

      if (!session?.user) {
        router.push('/login');
        return;
      }

      setUser(session.user);

      // Get store information for this user
      const { data: store, error: storeError } = await supabase
        .from('stores')
        .select('id, store_name, status, is_verified')
        .eq('user_id', session.user.id)
        .single();

      if (storeError) {
        console.error('Store fetch error:', storeError);
        setError('Failed to fetch store information');
        return;
      }

      if (!store) {
        setError('لم يتم العثور على متجر لهذا المستخدم');
        return;
      }

      // Check store status (using correct column names from schema)
      if (store.status !== 'active') {
        setError('المتجر غير نشط حالياً');
        return;
      }

      if (!store.is_verified) {
        setError('المتجر في انتظار التحقق');
        return;
      }

      setStoreId(store.id);

      // Track the store view
      try {
        const { trackStoreView } = await import('@/lib/api/store-views');
        await trackStoreView(store.id, session.user.id, 'analytics');
      } catch (trackError) {
        console.warn('Could not track store view:', trackError);
      }

    } catch (err) {
      console.error('Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ في تحميل بيانات المتجر';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-tajawal">
        <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-md">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 text-lg">جاري تحميل بيانات المتجر...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !storeId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-tajawal">
        <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-md">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              <strong className="font-bold">عذراً! </strong>
              <span className="block sm:inline">
                {error || 'لم يتم العثور على متجر لهذا المستخدم'}
              </span>
            </div>
            <div className="flex space-x-4 rtl:space-x-reverse justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                إعادة المحاولة
              </button>
              <button
                onClick={() => router.push('/store/dashboard')}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                العودة للوحة التحكم
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <StoreAnalyticsDashboard storeId={storeId} />;
}
