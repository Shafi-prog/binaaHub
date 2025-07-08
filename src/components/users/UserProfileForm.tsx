// @ts-nocheck
import { useState, useEffect } from 'react';
import { EnhancedInput, EnhancedSelect, Button } from '@/components/ui/enhanced-components';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const TRADES = [
  { value: 'mason', label: 'عامل بناء' },
  { value: 'concrete', label: 'فني خرسانة' },
  { value: 'steel', label: 'فني حديد' },
  { value: 'carpenter', label: 'نجار' },
  { value: 'plumber', label: 'سباك' },
  { value: 'electrician', label: 'كهربائي' },
  { value: 'tiler', label: 'مبلط' },
  { value: 'flooring', label: 'فني أرضيات' },
  { value: 'roofer', label: 'فني أسطح' },
  { value: 'plasterer', label: 'مبيض محارة' },
  { value: 'drywaller', label: 'عامل جبس' },
];

const REGIONS = [
  { value: '', label: 'اختر المنطقة' },
  { value: 'riyadh', label: 'الرياض' },
  { value: 'makkah', label: 'مكة المكرمة' },
  { value: 'eastern', label: 'المنطقة الشرقية' },
];

const CITIES = {
  riyadh: [
    { value: '', label: 'اختر المدينة' },
    { value: 'riyadh', label: 'الرياض' },
    { value: 'diriyah', label: 'الدرعية' },
  ],
  makkah: [
    { value: '', label: 'اختر المدينة' },
    { value: 'makkah', label: 'مكة' },
    { value: 'jeddah', label: 'جدة' },
  ],
  eastern: [
    { value: '', label: 'اختر المدينة' },
    { value: 'dammam', label: 'الدمام' },
    { value: 'khobar', label: 'الخبر' },
  ],
};

const COUNTRY_CODES = [
  { value: '+966', label: '🇸🇦 +966' },
  { value: '+971', label: '🇦🇪 +971' },
  { value: '+974', label: '🇶🇦 +974' },
  { value: '+973', label: '🇧َ +973' },
  { value: '+965', label: '🇰🇼 +965' },
  { value: '+968', label: '🇴🇲 +968' },
];

export default function UserProfileForm({ user }: { user: any }) {
  const supabase = createClientComponentClient();
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [emailVerified, setEmailVerified] = useState(user.email_verified || false);
  const [countryCode, setCountryCode] = useState(user.country_code || '+966');
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
  const [apiLoading, setApiLoading] = useState(false);

  // Invitation code state
  const [invitationCode, setInvitationCode] = useState<string | null>(null);
  // Fetch invitation code on mount
  useEffect(() => {
    if (user && user.id) {
      const supabase = createClientComponentClient();
      supabase
        .from('users')
        .select('invitation_code')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data?.invitation_code) setInvitationCode(data.invitation_code);
        });
    }
  }, [user]);

  // Handle geolocation via browser
  const handleLocate = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setSuccess('تم تحديد الموقع بنجاح عبر GPS');
      },
      () => setError('تعذر تحديد الموقع عبر GPS')
    );
  };

  // Handle location fetch via National Address API
  const handleNationalAddress = async () => {
    setApiLoading(true);
    setError(null);
    setSuccess(null);    try {
      const response = await fetch('http://apina.address.gov.sa/NationalAddress/v3.1/maps/map-engine', {
        method: 'GET',
        headers: {
          'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_ADDRESS_API_KEY || '',
          'Content-Type': 'application/json',
        },
        // If the API requires query parameters like region/city, uncomment and adjust:
        // mode: 'cors', // Enable if CORS is needed
        // Example with query params:
        // 'http://apina.address.gov.sa/NationalAddress/v3.1/maps/map-engine?region=riyadh&city=riyadh&subscription-key=' + process.env.NEXT_PUBLIC_ADDRESS_API_KEY
      });

      if (!response.ok) {
        throw new Error(`فشل طلب API: ${response.status}`);
      }

      const data = await response.json();
      // Assuming the API returns coordinates in the format { lat, lng }
      // Adjust based on actual API response structure
      if (data && data.lat && data.lng) {
        setLocation({ lat: data.lat, lng: data.lng });
        setSuccess('تم جلب الموقع من العنوان الوطني بنجاح');
        // Optionally update other fields like neighborhood, city, or region if API provides them
        if (data.neighborhood) setNeighborhood(data.neighborhood);
        if (data.city) setCity(data.city);
        if (data.region) setRegion(data.region);
      } else {
        setError('بيانات الموقع غير متوفرة من API');
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء جلب الموقع من العنوان الوطني');
      // Fallback to opening the map in a new tab
      window.open(`http://apina.address.gov.sa/NationalAddress/v3.1/maps/map-engine?subscription-key=${process.env.NEXT_PUBLIC_ADDRESS_API_KEY}`, '_blank');
    } finally {
      setApiLoading(false);
    }
  };

  // Simulate sending code (replace with real API integration)
  const handleVerifyEmail = async () => {
    setEmailVerificationStep('sent');
    setSuccess('تم إرسال رمز التحقق إلى بريدك الإلكتروني');
  };
  const handleConfirmEmailCode = async () => {
    if (emailCode === '1234') {
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
    if (phoneCode === '5678') {
      setPhoneVerificationStep('verified');
      setSuccess('تم التحقق من رقم الجوال بنجاح');
    } else {
      setError('رمز التحقق غير صحيح');
    }
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
      if (authUser.email !== email) {
        const { error: emailErr } = await supabase.auth.updateUser({ email });
        if (emailErr) throw emailErr;
      }
      // Save to users table instead of user_profiles
      const userUpdateData = {
        name,
        email,
        country_code: countryCode,
        phone,
        role,
        region,
        city,
        neighborhood,
        // Only include fields that exist in your users table schema
      };
      const { error: userError } = await supabase
        .from('users')
        .update(userUpdateData)
        .eq('id', authUser.id);
      if (userError) throw userError;

      // Supervisor activation logic
      if (role === 'supervisor') {
        // Upsert supervisor record
        const { error: supervisorError } = await supabase
          .from('construction_supervisors')
          .upsert({
            user_id: authUser.id,
            full_name: name,
            phone: phone,
            email: email,
            area: city,
            is_available: true,
            is_verified: false,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' });
        if (supervisorError) throw supervisorError;
      }
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
            <Button type="button" variant="secondary" onClick={handleVerifyEmail}>
              تحقق من البريد الإلكتروني
            </Button>
          )}
          {emailVerificationStep === 'sent' && (
            <>
              <EnhancedInput
                label="رمز التحقق"
                value={emailCode}
                onChange={e => setEmailCode(e.target.value)}
                placeholder="أدخل رمز التحقق"
              />
              <Button type="button" variant="primary" onClick={handleConfirmEmailCode}>
                تأكيد
              </Button>
            </>
          )}
          {emailVerificationStep === 'verified' && (
            <span className="text-green-600 font-bold">تم التحقق</span>
          )}
        </div>
        <div className="flex gap-2 items-end">
          <select
            className="border rounded px-2 py-2 text-sm bg-gray-50"
            value={countryCode}
            onChange={e => setCountryCode(e.target.value)}
            style={{ minWidth: 90 }}
            required
          >
            {COUNTRY_CODES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <EnhancedInput
            label="رقم الجوال"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="أدخل رقم الجوال بدون صفر"
            type="tel"
            required
            disabled={phoneVerificationStep === 'verified'}
            style={{ direction: 'ltr' }}
          />
          {phoneVerificationStep === 'idle' && (
            <Button type="button" variant="secondary" onClick={handleVerifyPhone}>
              تحقق من رقم الجوال
            </Button>
          )}
          {phoneVerificationStep === 'sent' && (
            <>
              <EnhancedInput
                label="رمز التحقق"
                value={phoneCode}
                onChange={e => setPhoneCode(e.target.value)}
                placeholder="أدخل رمز التحقق"
              />
              <Button type="button" variant="primary" onClick={handleConfirmPhoneCode}>
                تأكيد
              </Button>
            </>
          )}
          {phoneVerificationStep === 'verified' && (
            <span className="text-green-600 font-bold">تم التحقق</span>
          )}
        </div>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-2">الدور في المنصة</label>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="role" value="user" checked={role === 'user'} onChange={() => setRole('user')} />
            مستخدم
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="role" value="supervisor" checked={role === 'supervisor'} onChange={() => setRole('supervisor')} />
            مشرف
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="role" value="worker" checked={role === 'worker'} onChange={() => setRole('worker')} />
            عامل/فني
          </label>
        </div>
      </div>
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
        <div className="mb-4 text-blue-700 font-medium border p-3 rounded-lg bg-blue-50">
          ستظهر هنا طلبات الإشراف على المنازل (قريباً)
        </div>
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
        <div className="flex gap-2 items-center mb-2">
          <Button
            type="button"
            variant="primary"
            onClick={handleNationalAddress}
            loading={apiLoading}
          >
            {apiLoading ? 'جاري جلب الموقع...' : 'جلب الموقع من العنوان الوطني'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => window.open(`http://apina.address.gov.sa/NationalAddress/v3.1/maps/map-engine?subscription-key=${process.env.NEXT_PUBLIC_ADDRESS_API_KEY}`, '_blank')}
          >
            فتح خريطة العنوان الوطني
          </Button>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={handleLocate}
        >
          حدد موقعي على الخريطة (GPS)
        </Button>
        {location && (
          <div className="mt-2 text-sm text-gray-700">
            الإحداثيات: {location.lat}, {location.lng}
          </div>
        )}
      </div>
      <Button
        type="submit"
        variant="primary"
        loading={saving}
        className="w-full"
      >
        {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
      </Button>
      {invitationCode && (
        <div className="mt-4 text-xs text-blue-700 bg-blue-50 rounded p-2 font-mono text-center">
          رمز الدعوة الخاص بك: <b>{invitationCode}</b>
        </div>
      )}
    </form>
  );
}


