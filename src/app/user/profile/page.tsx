'use client';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { verifyAuthWithRetry } from '@/lib/auth-recovery';
import { Card, LoadingSpinner } from '../../../components/ui';
import { MapPicker } from '../../../components/maps/MapPicker';

interface Coordinates {
  lat: number;
  lng: number;
}

interface UserData {
  name: string;
  countryCode: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  coordinates: Coordinates | null;
}

const validatePhoneNumber = (phone: string, countryCode: string) => {
  // Remove any non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');

  // Check if empty
  if (!cleanPhone) return { valid: true, error: null };

  // Validation rules by country code
  const rules: { [key: string]: { pattern: RegExp; length: number } } = {
    '+966': { pattern: /^(5)\d+$/, length: 9 }, // Saudi: 5XXXXXXXX
    '+971': { pattern: /^(5|4|2|3|6|7)\d+$/, length: 9 }, // UAE
    '+974': { pattern: /^(3|5|6|7)\d+$/, length: 8 }, // Qatar
    '+973': { pattern: /^(3|6)\d+$/, length: 8 }, // Bahrain
    '+965': { pattern: /^(5|6|9)\d+$/, length: 8 }, // Kuwait
    '+968': { pattern: /^(7|9)\d+$/, length: 8 }, // Oman
  };

  const rule = rules[countryCode];
  if (!rule) {
    return { valid: false, error: 'رمز الدولة غير مدعوم' };
  }

  if (cleanPhone.length !== rule.length) {
    return {
      valid: false,
      error: `يجب أن يتكون رقم الهاتف من ${rule.length} أرقام${rule.pattern.toString().includes('5') ? ' ويبدأ برقم 5' : ''}`,
    };
  }

  if (!rule.pattern.test(cleanPhone)) {
    return { valid: false, error: 'رقم الهاتف غير صحيح' };
  }

  return { valid: true, error: null };
};

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formFieldErrors, setFormFieldErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Coordinates | null>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    countryCode: '+966', // Default to Saudi Arabia
    phone: '',
    address: '',
    city: '',
    region: '',
    coordinates: null as Coordinates | null,
  });

  const countryCodeOptions = [
    { value: '+966', label: '🇸🇦 السعودية (+966)' },
    { value: '+971', label: '🇦🇪 الإمارات (+971)' },
    { value: '+974', label: '🇶َ�َ قطر (+974)' },
    { value: '+973', label: '🇧َحَرين (+973)' },
    { value: '+965', label: '🇰🇼 الكويت (+965)' },
    { value: '+968', label: '🇴🇲 عمان (+968)' },
  ];

  useEffect(() => {
    const checkUser = async () => {
      try {
        const authResult = await verifyAuthWithRetry();
        if (authResult.error || !authResult.user) {
          router.push('/login');
          return;
        }
        setUser(authResult.user);

        // Fetch user data from the database
        const { data, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authResult.user.id)
          .single();

        if (fetchError) {
          console.error('Error fetching user data:', fetchError);
          return;
        }

        if (data) {
          setUserData(data);
          setFormData({
            name: data.name || '',
            countryCode: data.countryCode || '+966',
            phone: data.phone || '',
            address: data.address || '',
            city: data.city || '',
            region: data.region || '',
            coordinates: data.coordinates || null,
          });
          if (data.coordinates) {
            setSelectedLocation(data.coordinates);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [supabase, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Clear previous errors
    setFormFieldErrors((prev) => ({ ...prev, [name]: '' }));

    // For phone numbers, only allow digits and optionally a plus sign
    if (name === 'phone') {
      const cleanValue = value.replace(/[^\d+]/g, '');
      setFormData((prev) => ({ ...prev, [name]: cleanValue }));
    } else if (name === 'countryCode') {
      // When country code changes, validate phone number
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (formData.phone) {
        const { valid, error } = validatePhoneNumber(formData.phone, value);
        if (!valid) {
          setFormFieldErrors((prev) => ({ ...prev, phone: error || '' }));
        }
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLocationSelect = (coordinates: Coordinates) => {
    setSelectedLocation(coordinates);
    setFormData((prev) => ({
      ...prev,
      coordinates,
    }));
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};
    let isValid = true;

    // Required field validation with improved checks
    if (!formData.name.trim()) {
      errors.name = 'الاسم مطلوب';
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      errors.name = 'يجب أن يحتوي الاسم على حرفين على الأقل';
      isValid = false;
    }

    // Phone number validation with improved error messages
    if (formData.phone) {
      const { valid, error } = validatePhoneNumber(formData.phone, formData.countryCode);
      if (!valid) {
        errors.phone = error || 'رقم الهاتف غير صحيح';
        isValid = false;
      }
    }

    // Address validation
    if (formData.address?.trim()) {
      if (!formData.city?.trim()) {
        errors.city = 'المدينة مطلوبة عند إدخال العنوان';
        isValid = false;
      }
      if (!formData.region?.trim()) {
        errors.region = 'المنطقة مطلوبة عند إدخال العنوان';
        isValid = false;
      }
      if (formData.address.trim().length < 5) {
        errors.address = 'يرجى إدخال عنوان تفصيلي صحيح';
        isValid = false;
      }
    }

    // City validation
    if (formData.city?.trim() && !formData.region?.trim()) {
      errors.region = 'يرجى اختيار المنطقة';
      isValid = false;
    }

    // Location validation if address is provided
    if ((formData.address?.trim() || formData.city?.trim()) && !selectedLocation) {
      errors.location = 'يرجى تحديد الموقع على الخريطة';
      isValid = false;
    }

    setFormFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      setFormError('يرجى تسجيل الدخول للمتابعة');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setFormError(null);
    setSuccessMessage(null);

    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        const updateData = {
          name: formData.name.trim(),
          countryCode: formData.countryCode,
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          region: formData.region.trim(),
          coordinates: selectedLocation,
          updated_at: new Date().toISOString(),
        };

        // First validate if phone number is unique if changed
        if (formData.phone !== userData?.phone) {
          const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('phone', formData.phone)
            .not('id', 'eq', user.id)
            .maybeSingle();

          if (existingUser) {
            setFormError('رقم الهاتف مستخدم بالفعل. يرجى استخدام رقم آخر.');
            setSaving(false);
            return;
          }
        }

        const { error } = await supabase.from('users').update(updateData).eq('id', user.id);

        if (error) {
          throw error;
        }

        console.log('✅ Profile updated successfully');
        setSuccessMessage('تم تحديث الملف الشخصي بنجاح');
        setEditMode(false);
        setUserData({ ...userData, ...updateData });

        // Clear any previous errors
        setFormFieldErrors({});
        setFormError(null);
        break;
      } catch (error: any) {
        console.error('Error in profile update:', error);

        if (error.code === '23505') {
          setFormError('رقم الهاتف مستخدم بالفعل. يرجى استخدام رقم آخر.');
        } else if (error.code === '23503') {
          setFormError('حدث خطأ في تحديث البيانات. يرجى تسجيل الخروج وإعادة تسجيل الدخول.');
        } else if (error.message?.includes('network') || error.message?.includes('timeout')) {
          retryCount++;
          if (retryCount < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount));
            continue;
          }
          setFormError('حدث خطأ في الاتصال. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.');
        } else {
          setFormError('حدث خطأ في تحديث الملف الشخصي. يرجى المحاولة مرة أخرى.');
        }
        break;
      }
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <div className="p-6">
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
            <h1 className="text-2xl font-bold">إعدادات الملف الشخصي</h1>
          </div>

          {formError && (
            <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">{formError}</div>
          )}

          {successMessage && (
            <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-md">{successMessage}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">الاسم</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500
                    ${formFieldErrors.name ? 'border-red-300' : 'border-gray-300'}`}
                />
                {formFieldErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{formFieldErrors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">رمز الدولة</label>
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {countryCodeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">رقم الهاتف</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500
                      ${formFieldErrors.phone ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {formFieldErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">{formFieldErrors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">العنوان</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">المدينة</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500
                      ${formFieldErrors.city ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {formFieldErrors.city && (
                    <p className="mt-1 text-sm text-red-600">{formFieldErrors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">المنطقة</label>
                  <input
                    type="text"
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500
                      ${formFieldErrors.region ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {formFieldErrors.region && (
                    <p className="mt-1 text-sm text-red-600">{formFieldErrors.region}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الموقع</label>
                {editMode ? (
                  <MapPicker
                    onLocationSelect={handleLocationSelect}
                    initialLocation={selectedLocation}
                  />
                ) : (
                  <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
                    {selectedLocation ? (
                      <span>
                        الموقع: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                      </span>
                    ) : (
                      <span>لم يتم تحديد موقع</span>
                    )}
                  </div>
                )}
              </div>

              {editMode && (
                <div className="flex justify-end space-x-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {saving ? (
                      <div className="flex items-center gap-2">
                        <LoadingSpinner size="sm" />
                        جاري الحفظ...
                      </div>
                    ) : (
                      'حفظ التغييرات'
                    )}
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
