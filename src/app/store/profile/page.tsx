'use client';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function StoreProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [profile, setProfile] = useState({
    store_name: '',
    description: '',
    category: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    region: '',
    website: '',
  });
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setUser(session.user);
      // Check if store profile is incomplete (e.g., missing store_name, phone, city, region)
      const { data: storeData } = await supabase
        .from('stores')
        .select('store_name, phone, city, region')
        .eq('user_id', session.user.id)
        .single();
      if (!storeData || !storeData.store_name || !storeData.phone || !storeData.city || !storeData.region) {
        // Already on profile page, so do nothing
      } else {
        // If profile is complete and this is a forced redirect, optionally redirect to dashboard
      }

      // جلب بيانات المتجر من جدول stores
      const { data: storeData } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (storeData) {
        setProfile({
          store_name: storeData.store_name || '',
          description: storeData.description || '',
          category: storeData.category || '',
          phone: storeData.phone || '',
          email: storeData.email || '',
          address: storeData.address || '',
          city: storeData.city || '',
          region: storeData.region || '',
          website: storeData.website || '',
        });
      }
    };
    getUser();
  }, [supabase, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);
    setSuccessMessage(null);

    if (!profile.store_name.trim()) {
      setFormError('اسم المتجر مطلوب');
      setLoading(false);
      return;
    }

    const updateData = {
      store_name: profile.store_name.trim(),
      description: profile.description.trim(),
      category: profile.category.trim(),
      phone: profile.phone.trim(),
      email: profile.email.trim(),
      address: profile.address.trim(),
      city: profile.city.trim(),
      region: profile.region.trim(),
      website: profile.website.trim(),
      updated_at: new Date().toISOString(),
    };

    try {
      // أولاً، تحقق من وجود سجل متجر موجود
      const { data: existingStore } = await supabase
        .from('stores')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (existingStore) {
        // تحديث المتجر الموجود
        const { error } = await supabase
          .from('stores')
          .update(updateData)
          .eq('user_id', user?.id);

        if (error) throw error;
      } else {
        // إنشاء متجر جديد
        const { error } = await supabase
          .from('stores')
          .insert({
            user_id: user?.id,
            ...updateData,
          });

        if (error) throw error;
      }

      setSuccessMessage('تم حفظ بيانات المتجر بنجاح');
      console.log('✅ Store profile updated successfully');
    } catch (error: any) {
      console.error('Error updating store profile:', error);
      if (error.message?.includes('network') || error.message?.includes('timeout')) {
        setFormError('حدث خطأ في الاتصال. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.');
      } else if (error.message?.includes('permission')) {
        setFormError('ليس لديك صلاحية لتحديث بيانات المتجر.');
      } else {
        setFormError('حدث خطأ في حفظ البيانات. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 font-tajawal">
      <div className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8 max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
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
            <h1 className="text-2xl font-bold text-gray-800">ملف المتجر</h1>
          </div>

          {formError && (
            <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">{formError}</div>
          )}

          {successMessage && (
            <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-md">{successMessage}</div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">اسم المتجر</label>
              <input
                type="text"
                value={profile.store_name}
                onChange={(e) => setProfile({ ...profile, store_name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="اسم متجرك"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">وصف المتجر</label>
              <textarea
                value={profile.description}
                onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="وصف مختصر عن متجرك وخدماتك"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">فئة المتجر</label>
                <select
                  value={profile.category}
                  onChange={(e) => setProfile({ ...profile, category: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">اختر فئة المتجر</option>
                  <option value="مواد البناء">مواد البناء</option>
                  <option value="أدوات كهربائية">أدوات كهربائية</option>
                  <option value="سيراميك وبلاط">سيراميك وبلاط</option>
                  <option value="دهانات">دهانات</option>
                  <option value="أجهزة كهربائية">أجهزة كهربائية</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="+966XXXXXXXXX"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="store@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
              <input
                type="text"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="عنوان المتجر"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المدينة</label>
                <input
                  type="text"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="المدينة"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المنطقة</label>
                <select
                  value={profile.region}
                  onChange={(e) => setProfile({ ...profile, region: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">اختر المنطقة</option>
                  <option value="الرياض">منطقة الرياض</option>
                  <option value="مكة المكرمة">منطقة مكة المكرمة</option>
                  <option value="المدينة المنورة">منطقة المدينة المنورة</option>
                  <option value="الشرقية">المنطقة الشرقية</option>
                  <option value="عسير">منطقة عسير</option>
                  <option value="تبوك">منطقة تبوك</option>
                  <option value="القصيم">منطقة القصيم</option>
                  <option value="حائل">منطقة حائل</option>
                  <option value="الجوف">منطقة الجوف</option>
                  <option value="جازان">منطقة جازان</option>
                  <option value="نجران">منطقة نجران</option>
                  <option value="الباحة">منطقة الباحة</option>
                  <option value="الحدود الشمالية">منطقة الحدود الشمالية</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الموقع الإلكتروني
              </label>
              <input
                type="url"
                value={profile.website}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="https://example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
            >
              {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
