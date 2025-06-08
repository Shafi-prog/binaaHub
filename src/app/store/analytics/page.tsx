'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import StoreAnalyticsDashboard from '@/components/analytics/StoreAnalyticsDashboard';
import type { Database } from '@/types/database';

type Store = Database['public']['Tables']['stores']['Row'];

export default function AnalyticsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [storeId, setStoreId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const getUser = async () => {
      try {
        // Get session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw new Error('Failed to get session: ' + sessionError.message);
        }

        if (!session) {
          router.push('/login');
          return;
        }

        setUser(session.user);

        // Get store ID and track view
        const { data: store, error: storeError } = await supabase
          .from('stores')
          .select('id, is_active, is_verified')
          .eq('user_id', session.user.id)
          .single();

        if (storeError) {
          throw new Error('Failed to fetch store: ' + storeError.message);
        }

        if (!store) {
          throw new Error('لم يتم العثور على متجر لهذا المستخدم');
        }

        if (!store.is_active) {
          throw new Error('المتجر غير نشط حالياً');
        }

        if (!store.is_verified) {
          throw new Error('المتجر في انتظار التحقق');
        }

        setStoreId(store.id);

        // Track the store view
        const { trackStoreView } = await import('@/lib/api/store-views');
        await trackStoreView(store.id, session.user.id, 'analytics');
      } catch (err) {
        console.error('Error:', err);
        const errorMessage = err instanceof Error ? err.message : 'حدث خطأ في تحميل بيانات المتجر';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [supabase, router]);

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
