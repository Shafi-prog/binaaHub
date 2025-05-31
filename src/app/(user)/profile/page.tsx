'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { Card, LoadingSpinner } from '@/components/ui';
import { verifyAuthWithRetry } from '@/lib/auth-recovery';

interface UserData {
  name: string;
  email: string;
  phone?: string;
  account_type: 'user' | 'store';
  address?: string;
  city?: string;
  region?: string;
  created_at: string;
  updated_at?: string;
}

export default function UserProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const router = useRouter();
  const supabase = createClientComponentClient();

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔍 [User Profile] Verifying authentication...');
        const authResult = await verifyAuthWithRetry(3);

        if (!authResult.user) {
          console.error('❌ [User Profile] Authentication failed');
          router.push('/login');
          return;
        }

        console.log('✅ [User Profile] User authenticated:', authResult.user.email);
        setUser(authResult.user);

        // Fetch user data from database
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authResult.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          setError('حدث خطأ في تحميل بيانات الملف الشخصي');
          return;
        }

        if (profile) {
          setUserData(profile);
        }

        console.log('✅ [User Profile] Profile data loaded successfully');
      } catch (error) {
        console.error('❌ [User Profile] Error:', error);
        setError('حدث خطأ في تحميل الملف الشخصي');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [isHydrated, router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md mx-auto">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              إعادة المحاولة
            </button>
            <Link
              href="/user/dashboard"
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              العودة للوحة التحكم
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-tajawal">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">الملف الشخصي</h1>
            <p className="text-gray-600">عرض وإدارة معلومات حسابك الشخصي</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-12 h-12 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {userData?.name || 'المستخدم'}
              </h2>
              <p className="text-gray-600 mb-4">{userData?.email}</p>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {userData?.account_type === 'user' ? 'مستخدم' : 'متجر'}
              </div>
              <div className="mt-6">
                <Link
                  href="/user/profile"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors inline-block text-center"
                >
                  تعديل الملف الشخصي
                </Link>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">إجراءات سريعة</h3>
              <div className="space-y-3">
                <Link
                  href="/user/projects"
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">مشاريعي</span>
                </Link>
                <Link
                  href="/user/orders"
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">طلباتي</span>
                </Link>
                <Link
                  href="/user/balance"
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">المحفظة</span>
                </Link>
              </div>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">معلومات الحساب</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم الكامل
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-800">
                    {userData?.name || 'غير محدد'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-800">
                    {userData?.email || 'غير محدد'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-800">
                    {userData?.phone || 'غير محدد'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نوع الحساب</label>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-800">
                    {userData?.account_type === 'user' ? 'مستخدم' : 'متجر'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المدينة</label>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-800">
                    {userData?.city || 'غير محدد'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المنطقة</label>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-800">
                    {userData?.region || 'غير محدد'}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-800">
                    {userData?.address || 'غير محدد'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاريخ إنشاء الحساب
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-800">
                    {userData?.created_at
                      ? new Date(userData.created_at).toLocaleDateString('ar-SA')
                      : 'غير محدد'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">آخر تحديث</label>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-800">
                    {userData?.updated_at
                      ? new Date(userData.updated_at).toLocaleDateString('ar-SA')
                      : 'لم يتم التحديث'}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex gap-4">
                  <Link
                    href="/user/profile"
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    تعديل المعلومات
                  </Link>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors">
                    تغيير كلمة المرور
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
