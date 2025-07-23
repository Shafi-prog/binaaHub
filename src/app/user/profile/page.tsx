// @ts-nocheck
'use client';
import { useEffect, useState } from 'react';
import UserProfileForm from '@/core/shared/components/UserProfileForm';
import ConstructionProfileAdvice from '@/core/shared/components/ConstructionProfileAdvice';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/shared/components/ui/tabs';
import { User, Building2, Settings, HelpCircle } from 'lucide-react';

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
      <div className="max-w-6xl mx-auto">
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

        {/* Tabbed Interface */}
        <div className="bg-white rounded-lg shadow">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                الملف الشخصي
              </TabsTrigger>
              <TabsTrigger value="construction" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                دليل البناء
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                الإعدادات
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="p-6">
              <UserProfileForm user={user} />
            </TabsContent>
            
            <TabsContent value="construction" className="p-6">
              <ConstructionProfileAdvice />
            </TabsContent>
            
            <TabsContent value="settings" className="p-6">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800">الإعدادات العامة</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700">تفضيلات الإشعارات</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">إشعارات البريد الإلكتروني</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">تحديثات المشاريع</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" />
                        <span className="text-sm">نصائح البناء الأسبوعية</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700">تفضيلات العرض</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="theme" defaultChecked />
                        <span className="text-sm">الوضع الفاتح</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="theme" />
                        <span className="text-sm">الوضع الداكن</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="theme" />
                        <span className="text-sm">تلقائي</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t">
                  <h4 className="font-medium text-gray-700 mb-4">إدارة الحساب</h4>
                  <div className="flex gap-4">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => alert('Button clicked')}>
                      تصدير البيانات
                    </button>
                    <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" onClick={() => alert('Button clicked')}>
                      حذف الحساب
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
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
            <li>✅ دليل البناء والموارد متاح</li>
          </ul>
        </div>
      </div>
    </div>
  );
}