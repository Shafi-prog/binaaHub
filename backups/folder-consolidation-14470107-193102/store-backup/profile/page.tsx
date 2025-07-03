'use client';
import { useEffect, useState, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';

// Lazy load map component (replace with your preferred map lib if needed)
import MapPicker from '../../../components/ui/MapPicker';

function generateInvitationCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return `BinnaHub - ${code}`;
}

function formatInvitationCode(code: string) {
  if (!code) return '';
  return code.startsWith('BinnaHub - ') ? code : `BinnaHub - ${code}`;
}

export default function StoreProfilePage() {
  // Check if this is a post-login redirect and handle URL cleanup
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isPostLogin = urlParams.has('post_login');

    if (isPostLogin) {
      console.log('🔄 [Store Profile] Detected post-login redirect, cleaning URL');
      // Remove the post_login parameter from URL immediately
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

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
    map_url: '', // Add map_url to profile state
  });
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();
  const router = useRouter();

  // Fetch invitation code for the store
  const [invitationCode, setInvitationCode] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [sijil, setSijil] = useState('');
  const [sijilVerified, setSijilVerified] = useState(false);
  const [verifyingSijil, setVerifyingSijil] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [workingHours, setWorkingHours] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [storeId, setStoreId] = useState<string | null>(null);

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
      // Fetch invitation code and full store profile in one query
      const { data: storeData } = await supabase
        .from('stores')
        .select('store_name, description, category, phone, email, address, city, region, invitation_code, location, sijil, sijil_verified, logo_url, working_hours, id, map_url')
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
          map_url: storeData.map_url || '', // Load map_url
        });
        // Invitation code logic
        if (storeData.invitation_code) {
          setInvitationCode(storeData.invitation_code);
        } else {
          // Generate and save a new code
          const newCode = generateInvitationCode();
          setInvitationCode(newCode);
          await supabase.from('stores').update({ invitation_code: newCode }).eq('user_id', session.user.id);
        }
        if (storeData.location) setLocation(storeData.location);
        if (storeData.sijil) setSijil(storeData.sijil);
        if (storeData.sijil_verified) setSijilVerified(storeData.sijil_verified);
        if (storeData.logo_url) setLogoUrl(storeData.logo_url);
        if (storeData.working_hours) setWorkingHours(storeData.working_hours);
        setStoreId(storeData.id);
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
      location: location,
      sijil: sijil,
      sijil_verified: sijilVerified,
      logo_url: logoUrl,
      working_hours: workingHours,
      map_url: profile.map_url.trim(), // Save map_url
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
      // Improved error logging
      console.error('Error updating store profile:', error, JSON.stringify(error));
      const errorMsg = error?.message || error?.error_description || JSON.stringify(error) || 'حدث خطأ في حفظ البيانات. يرجى المحاولة مرة أخرى.';
      if (errorMsg.includes('network') || errorMsg.includes('timeout')) {
        setFormError('حدث خطأ في الاتصال. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.');
      } else if (errorMsg.includes('permission')) {
        setFormError('ليس لديك صلاحية لتحديث بيانات المتجر.');
      } else {
        setFormError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSijilVerify = async () => {
    setVerifyingSijil(true);
    // Call your سجل تجاري API here
    // Example: const result = await fetch('/api/verify-sijil', { method: 'POST', body: JSON.stringify({ sijil }) })
    // For now, simulate success:
    setTimeout(() => {
      setSijilVerified(true);
      toast.success('تم التحقق من السجل التجاري بنجاح');
      setVerifyingSijil(false);
    }, 1500);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const filePath = `store-logos/${user.id}-${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from('public').upload(filePath, file, { upsert: true });
    if (error) {
      toast.error('فشل رفع الشعار');
      return;
    }
    const { data: urlData } = supabase.storage.from('public').getPublicUrl(filePath);
    const url = urlData?.publicUrl || '';
    setLogoUrl(url);
    await supabase.from('stores').update({ logo_url: url }).eq('user_id', user.id);
    toast.success('تم رفع الشعار بنجاح');
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
            {invitationCode ? (
              <span className="ml-auto bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-mono flex items-center gap-2">
                رمز الدعوة: {invitationCode}
                <button type="button" className="ml-2 text-blue-600 hover:underline" onClick={() => {navigator.clipboard.writeText(invitationCode); toast.success('تم نسخ رمز الدعوة!')}}>نسخ</button>
              </span>
            ) : (
              <span className="ml-auto bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-mono">لا يوجد رمز دعوة متاح حالياً</span>
            )}
          </div>

          {formError && (
            <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">{formError}</div>
          )}

          {successMessage && (
            <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-md">{successMessage}</div>
          )}

          {/* سجل تجاري section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">السجل التجاري</label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={sijil}
                onChange={e => setSijil(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none flex-1"
                placeholder="رقم السجل التجاري"
                disabled={sijilVerified}
              />
              <button
                type="button"
                className={`px-4 py-2 rounded-lg text-white ${sijilVerified ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'} transition`}
                onClick={handleSijilVerify}
                disabled={verifyingSijil || sijilVerified}
              >
                {sijilVerified ? 'تم التحقق' : verifyingSijil ? 'جاري التحقق...' : 'تحقق' }
              </button>
            </div>
            {sijilVerified && <div className="text-green-700 mt-2">تم التحقق من السجل التجاري</div>}
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Logo upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">شعار المتجر</label>
              {logoUrl && <img src={logoUrl} alt="شعار المتجر" className="h-20 mb-2 rounded" />}
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleLogoUpload} className="block" />
            </div>
            {/* Working hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ساعات العمل</label>
              <input
                type="text"
                value={workingHours}
                onChange={e => setWorkingHours(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="مثال: 9 صباحاً - 10 مساءً، كل أيام الأسبوع"
              />
            </div>
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
                readOnly
              />
              <span className="text-xs text-gray-500">البريد الإلكتروني لا يمكن تغييره هنا. للتغيير، يرجى التواصل مع الدعم.</span>
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

            {/* Map/geolocation picker for location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الصق رابط موقعك على خرائط Google للموقع المطلوب</label>
              <input
                type="url"
                value={profile.map_url || ''}
                onChange={e => setProfile({ ...profile, map_url: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="الصق رابط Google Maps هنا"
              />
              <div className="text-xs text-gray-500 mt-1">يمكنك نسخ رابط الموقع من خرائط Google ولصقه هنا.</div>
            </div>
            <MapPicker value={location ?? undefined} onChange={setLocation} />
            {location && (
              <div className="mt-2 text-sm text-gray-700">الإحداثيات: {location.lat}, {location.lng}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 mt-8"
            >
              {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          </form>
          {/* Public store page link */}
          {storeId && (
            <div className="mt-6 text-center">
              <a href={`/stores/${storeId}`} target="_blank" rel="noopener" className="text-blue-600 hover:underline font-bold">صفحة المتجر العامة</a>
            </div>
          )}
          {/* Invitation code section with explanation and copy button */}
          {invitationCode && (
            <div className="my-4 p-4 bg-blue-50 border border-blue-200 rounded flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-blue-800">رمز الدعوة: {formatInvitationCode(invitationCode)}</span>
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={async () => {
                    await navigator.clipboard.writeText(formatInvitationCode(invitationCode));
                    toast.dismiss();
                    toast.success('تم نسخ رمز الدعوة!');
                  }}
                >
                  نسخ
                </button>
              </div>
              <div className="text-xs text-gray-700">شارك هذا الرمز مع عملائك أو أصدقاءك ليحصلوا على مزايا، وستحصل أنت على عمولة عند استخدامه في التسجيل أو الشراء.</div>
            </div>
          )}
          {/* Add invitation code activation section */}
          <div className="my-6 p-4 bg-gray-50 border rounded">
            <h2 className="font-bold mb-2 text-blue-700">تفعيل رمز دعوة أو عمولة</h2>
            <form onSubmit={async e => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);
              const code = (formData.get('invitecode') as string)?.trim();
              if (!code) return toast.error('يرجى إدخال رمز الدعوة');
              const res = await fetch('/api/activate-invite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
              });
              const data = await res.json();
              if (data.success) {
                toast.success('تم تفعيل الرمز بنجاح!');
                form.reset();
              } else {
                toast.error(data.error || 'فشل تفعيل الرمز');
              }
            }} className="flex gap-2 items-center">
              <input name="invitecode" className="border rounded px-3 py-2" placeholder="الصق رمز الدعوة هنا" />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">تفعيل</button>
            </form>
            <div className="text-xs text-gray-500 mt-1">يمكنك لصق رمز دعوة من متجر أو مستخدم آخر ليحصل على مزايا أو عمولة.</div>
          </div>
        </div>
      </div>
    </main>
  );
}
