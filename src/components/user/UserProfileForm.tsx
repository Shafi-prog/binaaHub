import { useState } from 'react';
import { EnhancedInput, EnhancedSelect, EnhancedButton } from '@/components/ui/enhanced-components';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const TRADES = [
  { value: 'painter', label: 'دهان – طلاء الجدران والأسقف' },
  { value: 'drywaller', label: 'عامل جبس – تركيب الجبس' },
  { value: 'plasterer', label: 'مبيض محارة – أعمال المحارة' },
  { value: 'tiler', label: 'مبلط – تركيب البلاط' },
  { value: 'flooring', label: 'فني أرضيات – تركيب الأرضيات' },
  { value: 'electrician', label: 'كهربائي' },
  { value: 'plumber', label: 'سباك' },
  { value: 'hvac', label: 'فني تكييف' },
  { value: 'fire', label: 'فني رشاشات الحريق' },
  { value: 'carpenter', label: 'نجار' },
  { value: 'steel', label: 'فني حديد' },
  { value: 'mason', label: 'عامل بناء' },
  { value: 'concrete', label: 'فني خرسانة' },
  { value: 'roofer', label: 'فني أسطح' },
];

const REGIONS = [
  { value: '', label: 'اختر المنطقة' },
  { value: 'riyadh', label: 'الرياض' },
  { value: 'makkah', label: 'مكة المكرمة' },
  { value: 'eastern', label: 'المنطقة الشرقية' },
  // ... add more regions as needed
];
const CITIES = {
  riyadh: [
    { value: '', label: 'اختر المدينة' },
    { value: 'riyadh', label: 'الرياض' },
    { value: 'diriyah', label: 'الدرعية' },
    // ...
  ],
  makkah: [
    { value: '', label: 'اختر المدينة' },
    { value: 'makkah', label: 'مكة' },
    { value: 'jeddah', label: 'جدة' },
    // ...
  ],
  eastern: [
    { value: '', label: 'اختر المدينة' },
    { value: 'dammam', label: 'الدمام' },
    { value: 'khobar', label: 'الخبر' },
    // ...
  ],
};

export default function UserProfileForm({ user }: { user: any }) {
  const supabase = createClientComponentClient();
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [emailVerified, setEmailVerified] = useState(user.email_verified || false);
  const [phone, setPhone] = useState(user.phone || '');
  const [phoneVerified, setPhoneVerified] = useState(user.phone_verified || false);
  const [role, setRole] = useState(user.role || '');
  const [trades, setTrades] = useState(user.trades || []);
  const [region, setRegion] = useState(user.region || '');
  const [city, setCity] = useState(user.city || '');
  const [neighborhood, setNeighborhood] = useState(user.neighborhood || '');
  const [location, setLocation] = useState(user.location || null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [storeRequestSent, setStoreRequestSent] = useState(false);
  const [emailVerificationStep, setEmailVerificationStep] = useState<'idle' | 'sent' | 'verifying' | 'verified'>(emailVerified ? 'verified' : 'idle');
  const [emailCode, setEmailCode] = useState('');
  const [phoneVerificationStep, setPhoneVerificationStep] = useState<'idle' | 'sent' | 'verifying' | 'verified'>(phoneVerified ? 'verified' : 'idle');
  const [phoneCode, setPhoneCode] = useState('');

  const handleLocate = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => setError('تعذر تحديد الموقع')
    );
  };

  // Simulate sending code (replace with real API integration)
  const handleVerifyEmail = async () => {
    setEmailVerificationStep('sent');
    setSuccess('تم إرسال رمز التحقق إلى بريدك الإلكتروني');
  };
  const handleConfirmEmailCode = async () => {
    if (emailCode === '1234') { // Simulate correct code
      setEmailVerificationStep('verified');
      setSuccess('تم التحقق من البريد الإلكتروني بنجاح');
    } else {
      setError('رمز التحقق غير صحيح');
    }
  };
  const handleVerifyPhone = async () => {
    setPhoneVerificationStep('sent');
    setSuccess('تم إرسال رمز التحقق إلى رقم الجوال');
  };
  const handleConfirmPhoneCode = async () => {
    if (phoneCode === '5678') { // Simulate correct code
      setPhoneVerificationStep('verified');
      setSuccess('تم التحقق من رقم الجوال بنجاح');
    } else {
      setError('رمز التحقق غير صحيح');
    }
  };

  const handleStoreRequest = async () => {
    // Placeholder for real store conversion request (Wathq, etc.)
    setStoreRequestSent(true);
    setSuccess('تم إرسال طلب التحويل إلى متجر. سيتم التواصل معك قريباً.');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!name.trim()) {
      setError('يرجى إدخال الاسم');
      return;
    }
    if (!email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }
    if (!phone.trim() || phone.length < 8) {
      setError('يرجى إدخال رقم هاتف صحيح');
      return;
    }
    if (!role) {
      setError('يرجى اختيار الدور');
      return;
    }
    if (role === 'worker' && trades.length === 0) {
      setError('يرجى اختيار تخصص واحد على الأقل');
      return;
    }
    if (!region || !city) {
      setError('يرجى تحديد المنطقة والمدينة');
      return;
    }
    setSaving(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('يرجى تسجيل الدخول');
      // Update user auth info if changed
      if (authUser.email !== email) {
        const { error: emailErr } = await supabase.auth.updateUser({ email });
        if (emailErr) throw emailErr;
      }      // Update user profile info in the correct table and format
      // First, update the auth.users metadata
      const { error: authUpdateError } = await supabase.auth.updateUser({
        data: { 
          name: name.trim(),
          phone: phone.trim(),
          full_name: name.trim()
        }
      });
      if (authUpdateError) throw authUpdateError;      // Then, upsert user_profiles table with proper schema
      const profileData = {
        user_id: authUser.id,
        occupation: role === 'worker' ? trades.join(', ') : role,
        company_name: role === 'worker' ? 'Freelancer' : null,
        preferred_language: 'ar',
        notification_preferences: {
          email: true,
          sms: true,
          push: true
        },
        coordinates: location ? { lat: location.lat, lng: location.lng } : null,
        country_code: '+966', // Default for Saudi Arabia
        // Include location fields that are now available in user_profiles table
        city: city || null,
        region: region || null,
        neighborhood: neighborhood || null,
        address: `${neighborhood ? neighborhood + ', ' : ''}${city ? city + ', ' : ''}${region || ''}`.trim().replace(/,$/, '') || null,
      };

      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert(profileData, { onConflict: 'user_id' });
      
      if (profileError) throw profileError;
      setSuccess('تم حفظ التغييرات بنجاح');
    } catch (e: any) {
      setError(e.message || 'حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form dir="rtl" className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-6" onSubmit={handleSave}>
      <h2 className="text-2xl font-bold mb-4 text-blue-700">الملف الشخصي</h2>
      {/* Show full name after login for friendliness */}
      {name && (
        <div className="mb-4 text-lg font-semibold text-green-700">مرحباً، {name} 👋</div>
      )}
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>}
      <EnhancedInput
        label="الاسم الكامل"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="أدخل اسمك الكامل"
        required
      />
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-end">
          <EnhancedInput
            label="البريد الإلكتروني"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="أدخل بريدك الإلكتروني"
            type="email"
            required
            disabled={emailVerificationStep === 'verified'}
          />
          {emailVerificationStep === 'idle' && (
            <EnhancedButton type="button" variant="secondary" onClick={handleVerifyEmail}>
              تحقق من البريد الإلكتروني
            </EnhancedButton>
          )}
          {emailVerificationStep === 'sent' && (
            <>
              <EnhancedInput
                label="رمز التحقق"
                value={emailCode}
                onChange={e => setEmailCode(e.target.value)}
                placeholder="أدخل رمز التحقق"
              />
              <EnhancedButton type="button" variant="primary" onClick={handleConfirmEmailCode}>
                تأكيد
              </EnhancedButton>
            </>
          )}
          {emailVerificationStep === 'verified' && (
            <span className="text-green-600 font-bold">تم التحقق</span>
          )}
        </div>
        <div className="flex gap-2 items-end">
          <EnhancedInput
            label="رقم الهاتف"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="أدخل رقم هاتفك"
            type="tel"
            required
            disabled={phoneVerificationStep === 'verified'}
          />
          {phoneVerificationStep === 'idle' && (
            <EnhancedButton type="button" variant="secondary" onClick={handleVerifyPhone}>
              تحقق من رقم الجوال
            </EnhancedButton>
          )}
          {phoneVerificationStep === 'sent' && (
            <>
              <EnhancedInput
                label="رمز التحقق"
                value={phoneCode}
                onChange={e => setPhoneCode(e.target.value)}
                placeholder="أدخل رمز التحقق"
              />
              <EnhancedButton type="button" variant="primary" onClick={handleConfirmPhoneCode}>
                تأكيد
              </EnhancedButton>
            </>
          )}
          {phoneVerificationStep === 'verified' && (
            <span className="text-green-600 font-bold">تم التحقق</span>
          )}
        </div>
      </div>
      <EnhancedSelect
        label="الدور في المنصة"
        value={role}
        onChange={e => {
          setRole(e.target.value);
          if (e.target.value !== 'worker') setTrades([]);
        }}
        options={[
          { value: '', label: 'اختر الدور' },
          { value: 'supervisor', label: 'مشرف (استقبال فرص الإشراف على المشاريع)' },
          { value: 'worker', label: 'عامل/فني (استقبال فرص العمل حسب التخصص)' },
        ]}
        dir="rtl"
      />
      {role === 'worker' && (
        <div>
          <label className="block mb-2 font-medium">التخصصات (اختر تخصصاتك لتصلك فرص العمل المناسبة)</label>
          <div className="grid grid-cols-2 gap-2">
            {TRADES.map(trade => (
              <label key={trade.value} className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={trades.includes(trade.value)}
                  onChange={e => {
                    setTrades(e.target.checked
                      ? [...trades, trade.value]
                      : trades.filter((t: string) => t !== trade.value));
                  }}
                />
                <span>{trade.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      {role === 'supervisor' && (
        <div className="mb-4 text-blue-700 font-medium">ستصلك فرص الإشراف على المشاريع تلقائياً بناءً على منطقتك الجغرافية.</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <EnhancedSelect
          label="المنطقة"
          value={region}
          onChange={e => {
            setRegion(e.target.value);
            setCity('');
          }}
          options={REGIONS}
          dir="rtl"
          required
        />
        <EnhancedSelect
          label="المدينة"
          value={city}
          onChange={e => setCity(e.target.value)}
          options={
            region && Object.prototype.hasOwnProperty.call(CITIES, region)
              ? CITIES[region as keyof typeof CITIES]
              : [{ value: '', label: 'اختر المدينة' }]
          }
          dir="rtl"
          required
        />
        <EnhancedInput
          label="الحي (اختياري)"
          value={neighborhood}
          onChange={e => setNeighborhood(e.target.value)}
          placeholder="اسم الحي"
        />
      </div>
      <div>
        <label className="block mb-2 font-medium">الموقع الجغرافي</label>
        <EnhancedButton
          type="button"
          variant="primary"
          onClick={handleLocate}
        >
          حدد موقعي على الخريطة
        </EnhancedButton>
        {location && (
          <div className="mt-2 text-sm text-gray-700">
            الإحداثيات: {location.lat}, {location.lng}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <EnhancedButton
          type="button"
          variant="secondary"
          onClick={handleStoreRequest}
          disabled={storeRequestSent}
        >
          طلب التحويل إلى متجر (للمتاجر الفردية مثل متاجر الأسمنت، يتطلب تحقق السجل التجاري)
        </EnhancedButton>
        {/* Placeholders for future API integrations */}
        <EnhancedButton type="button" variant="secondary" disabled>
          تحقق من الهوية (نفاذ - Nafath)
        </EnhancedButton>
        <EnhancedButton type="button" variant="secondary" disabled>
          تحقق من العنوان الوطني (SPL)
        </EnhancedButton>
        <EnhancedButton type="button" variant="secondary" disabled>
          تحقق من السجل التجاري (Wathq)
        </EnhancedButton>
        <EnhancedButton type="button" variant="secondary" disabled>
          تحقق من رقم IBAN (SAMA)
        </EnhancedButton>
      </div>
      <EnhancedButton
        type="submit"
        variant="primary"
        loading={saving}
        className="w-full"
      >
        {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
      </EnhancedButton>
    </form>
  );
}
