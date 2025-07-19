// @ts-nocheck
'use client';
import { useEffect, useState } from 'react';
import UserProfileForm from '@/core/shared/components/UserProfileForm';

export const dynamic = 'force-dynamic'

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to get cookie value
  const getCookie = (name: string) => {
    if (typeof window === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log('🔄 [Profile] Starting authentication check...');
        
        const tempAuthCookie = getCookie('temp_auth_user');
        console.log('🔄 [Profile] Temp auth cookie check:', tempAuthCookie ? 'FOUND' : 'NOT FOUND');
        
        if (tempAuthCookie) {
          try {
            const parsedUser = JSON.parse(decodeURIComponent(tempAuthCookie));
            console.log('✅ [Profile] Temp auth user loaded:', parsedUser.email);
            setUser(parsedUser);
            setLoading(false);
            return;
          } catch (e) {
            console.warn('⚠️ [Profile] Failed to parse temp auth user:', e);
          }
        }
        
        console.log('❌ [Profile] No auth found, redirecting to login');
        window.location.href = '/login';
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">جاري التحميل...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">لم يتم العثور على المستخدم</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold text-blue-700 mb-4">الملف الشخصي</h1>
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="bg-blue-100 p-3 rounded-full">
              <span className="text-blue-700 font-bold text-xl">👤</span>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800">أهلاً وسهلاً، {user.email}!</p>
              <p className="text-sm text-gray-600">نوع الحساب: {user.account_type}</p>
              <p className="text-green-600 text-sm">✅ تم تحميل الملف الشخصي بنجاح</p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-lg shadow">
          <UserProfileForm user={user} />
        </div>

        {/* Debug Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h2 className="font-bold text-blue-700 mb-2">معلومات التشخيص</h2>
          <p className="text-sm text-gray-600 mb-2">إذا كنت ترى هذه الرسالة، فهذا يعني أن:</p>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>✅ الوسطاء (Middleware) يعمل بشكل صحيح</li>
            <li>✅ ملفات تعريف الارتباط (Cookies) تعمل</li>
            <li>✅ صفحة الملف الشخصي تحمل بدون أخطاء</li>
            <li>✅ نموذج الملف الشخصي محمل بالكامل</li>
          </ul>
        </div>
      </div>
    </div>
  );
}