'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EnhancedInput, EnhancedSelect, Button } from '@/components/ui/enhanced-components';
import { Card, CardContent } from '@/components/ui/card';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ARAB_COUNTRIES, SAUDI_REGIONS, SAUDI_DISTRICTS } from '@/lib/geo-data';
import { MapPicker } from '@/components/maps/MapPicker';
import { createProject } from '@/lib/api/dashboard';

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    project_type: '',
    country: 'SA',
    region: '',
    city: '',
    district: '',
    lat: 24.7136,
    lng: 46.6753,
    budget: '',
    start_date: '',
    end_date: '',
    priority: 'medium',
    status: 'planning',
    is_active: true,
    image: null as File | null,
    for_sale: false,
    images: [] as File[],
  });
  const [districtOptions, setDistrictOptions] = useState<{ value: string; label: string }[]>([]);
  const [cityOptions, setCityOptions] = useState<{ value: string; label: string }[]>([]);
  const supabase = createClientComponentClient();

  // Dynamic region/city/district logic
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = e.target.value;
    setForm((prev) => ({ ...prev, country, region: '', city: '', district: '' }));
    setCityOptions([]);
    setDistrictOptions([]);
  };
  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const region = e.target.value;
    setForm((prev) => ({ ...prev, region, city: '', district: '' }));
    const regionObj = SAUDI_REGIONS.find((r) => r.value === region);
    setCityOptions(regionObj ? regionObj.cities : []);
    setDistrictOptions([]);
  };
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = e.target.value;
    setForm((prev) => ({ ...prev, city, district: '' }));
    setDistrictOptions(SAUDI_DISTRICTS[city] || []);
  };
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, district: e.target.value }));
  };
  const handleLocationSelect = (loc: { lat: number; lng: number }) => {
    setForm((prev) => ({ ...prev, lat: loc.lat, lng: loc.lng }));
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };
  const handleActiveToggle = () => {
    setForm((prev) => ({ ...prev, is_active: !prev.is_active }));
  };
  const handleForSaleToggle = () => {
    setForm((prev) => ({ ...prev, for_sale: !prev.for_sale }));
  };
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setForm((prev) => ({ ...prev, images: Array.from(e.target.files!) }));
    } else {
      setForm((prev) => ({ ...prev, images: [] }));
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Construction stage logic (example)
  const STAGE_ITEMS: Record<string, string[]> = {
    planning: ['الحصول على تصاريح', 'تحديد الميزانية', 'اختيار المقاول'],
    design: ['تصميم معماري', 'تصميم إنشائي'],
    permits: ['الحصول على رخصة بناء'],
    construction: ['الهيكل الخرساني', 'الجدران', 'الأسقف'],
    finishing: ['الدهانات', 'الأرضيات', 'الأبواب والنوافذ'],
    completed: ['تسليم المشروع'],
    on_hold: ['متابعة الإجراءات'],
  };
  const relevantItems = STAGE_ITEMS[form.status] || [];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    let imageUrl = null;
    let imageUrls: string[] = [];
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setError('يجب تسجيل الدخول أولاً');
        setLoading(false);
        return;
      }
      // Upload multiple images
      if (form.images && form.images.length > 0) {
        for (const file of form.images) {
          const { data: uploadData, error: uploadError } = await supabase.storage.from('project-images').upload(`user-${user.id}/${Date.now()}-${file.name}`, file);
          if (!uploadError && uploadData?.path) {
            const url = supabase.storage.from('project-images').getPublicUrl(uploadData.path).data.publicUrl;
            if (url) imageUrls.push(url);
          }
        }
      }
      // Single image backward compatibility
      if (form.image && imageUrls.length === 0) {
        const { data: uploadData, error: uploadError } = await supabase.storage.from('project-images').upload(`user-${user.id}/${Date.now()}-${form.image.name}`, form.image);
        if (!uploadError && uploadData?.path) {
          imageUrl = supabase.storage.from('project-images').getPublicUrl(uploadData.path).data.publicUrl;
        }
      }
      const projectData = {
        ...form,
        budget: form.budget ? Number(form.budget) : null,
        image_url: imageUrl || imageUrls[0] || null,
        images: imageUrls,
        lat: undefined,
        lng: undefined,
      };
      await createProject(projectData);
      router.push('/user/projects');
    } catch (error: any) {
      setError('حدث خطأ غير متوقع أثناء حفظ المشروع' + (error?.message ? `: ${error.message}` : ''));
      setLoading(false);
    }
  };

  // Construction stage progress bar for the selected stage
  const STAGES = [
    { value: 'planning', label: 'تخطيط' },
    { value: 'design', label: 'تصميم' },
    { value: 'permits', label: 'رخص' },
    { value: 'construction', label: 'تنفيذ' },
    { value: 'finishing', label: 'تشطيب' },
    { value: 'completed', label: 'مكتمل' },
    { value: 'on_hold', label: 'معلق' },
  ];
  function StageProgress({ status }: { status: string }) {
    const currentIdx = STAGES.findIndex((s) => s.value === status);
    return (
      <div className="flex flex-col gap-2 mt-4">
        <div className="flex items-center gap-2">
          {STAGES.map((stage, idx) => (
            <div key={stage.value} className="flex items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${idx <= currentIdx ? 'bg-blue-600' : 'bg-gray-300'}`}>{idx + 1}</div>
              {idx < STAGES.length - 1 && <div className={`h-1 w-8 ${idx < currentIdx ? 'bg-blue-600' : 'bg-gray-200'}`}></div>}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-700 mt-1">
          {STAGES.map((stage) => (
            <span key={stage.value} className="w-8 text-center">{stage.label}</span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4" dir="rtl">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-6 text-blue-700">إنشاء مشروع جديد</h1>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <EnhancedInput
              label="اسم المشروع *"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="مثال: فيلا سكنية في الرياض"
            />
            <div>
              <label className="block text-sm font-medium mb-1">وصف المشروع *</label>
              <textarea
                name="description"
                required
                value={form.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-tajawal"
                rows={4}
                placeholder="يرجى كتابة وصف مختصر للمشروع..."
              ></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EnhancedSelect
                label="نوع المشروع *"
                name="project_type"
                required
                value={form.project_type}
                onChange={handleChange}
                options={[
                  { value: '', label: 'اختر نوع المشروع' },
                  { value: 'residential', label: 'سكني' },
                  { value: 'commercial', label: 'تجاري' },
                  { value: 'industrial', label: 'صناعي' },
                  { value: 'infrastructure', label: 'بنية تحتية' },
                  { value: 'renovation', label: 'ترميم' },
                  { value: 'other', label: 'أخرى' },
                ]}
              />
              <EnhancedInput
                label="الميزانية (اختياري)"
                name="budget"
                type="number"
                value={form.budget}
                onChange={handleChange}
                placeholder="مثال: 500000"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EnhancedInput
                label="تاريخ البداية المتوقع"
                name="start_date"
                type="date"
                value={form.start_date}
                onChange={handleChange}
                placeholder="اختر تاريخ البداية"
              />
              <EnhancedInput
                label="تاريخ الانتهاء المتوقع"
                name="end_date"
                type="date"
                value={form.end_date}
                onChange={handleChange}
                placeholder="اختر تاريخ الانتهاء"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <EnhancedSelect
                label="الدولة"
                name="country"
                value={form.country}
                onChange={handleCountryChange}
                options={ARAB_COUNTRIES}
              />
              <EnhancedSelect
                label="المنطقة"
                name="region"
                value={form.region}
                onChange={handleRegionChange}
                options={SAUDI_REGIONS.map(r => ({ value: r.value, label: r.label }))}
                placeholder="اختر المنطقة"
                disabled={form.country !== 'SA'}
              />
              <EnhancedSelect
                label="المدينة"
                name="city"
                value={form.city}
                onChange={handleCityChange}
                options={cityOptions}
                placeholder="اختر المدينة"
                disabled={!form.region}
              />
              <EnhancedSelect
                label="الحي/المنطقة الفرعية"
                name="district"
                value={form.district}
                onChange={handleDistrictChange}
                options={districtOptions}
                placeholder="اختر الحي"
                disabled={!form.city}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">تحديد الموقع على الخريطة</label>
              <div className="h-48 w-full border rounded-lg overflow-hidden">
                <MapPicker initialLocation={{ lat: form.lat, lng: form.lng }} onLocationSelect={handleLocationSelect} />
              </div>
              <div className="mt-2 text-xs text-gray-500">خط العرض: {form.lat.toFixed(6)}, خط الطول: {form.lng.toFixed(6)}</div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">صورة المشروع (اختياري)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-tajawal"
              />
              {form.image && (
                <div className="mt-2 text-xs text-gray-500">تم اختيار صورة: {form.image.name}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">صور المشروع (يمكن اختيار عدة صور)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-tajawal"
              />
              {form.images && form.images.length > 0 && (
                <div className="mt-2 text-xs text-gray-500">{form.images.length} صورة مختارة</div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">تفعيل الإشراف على المشروع</label>
              <button type="button" onClick={handleActiveToggle} className={`w-12 h-6 rounded-full transition-colors duration-200 ${form.is_active ? 'bg-blue-600' : 'bg-gray-300'}`}> 
                <span className={`block w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-200 ${form.is_active ? 'translate-x-6' : ''}`}></span>
              </button>
              <span className="text-xs text-gray-500">{form.is_active ? 'مفعل' : 'غير مفعل'}</span>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">عرض المشروع للبيع</label>
              <button type="button" onClick={handleForSaleToggle} className={`w-12 h-6 rounded-full transition-colors duration-200 ${form.for_sale ? 'bg-red-600' : 'bg-gray-300'}`}> 
                <span className={`block w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-200 ${form.for_sale ? 'translate-x-6' : ''}`}></span>
              </button>
              <span className="text-xs text-gray-500">{form.for_sale ? 'معروض للبيع' : 'غير معروض للبيع'}</span>
            </div>
            <>
              <div>
                <label className="block text-sm font-medium mb-2">المرحلة الحالية للمشروع</label>
                <EnhancedSelect
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  options={[
                    { value: 'planning', label: 'تخطيط' },
                    { value: 'design', label: 'تصميم' },
                    { value: 'permits', label: 'رخص' },
                    { value: 'construction', label: 'تنفيذ' },
                    { value: 'finishing', label: 'تشطيب' },
                    { value: 'completed', label: 'مكتمل' },
                    { value: 'on_hold', label: 'معلق' },
                  ]}
                />
                {relevantItems.length > 0 && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <div className="font-bold text-blue-700 mb-2">أهم البنود لهذه المرحلة:</div>
                    <ul className="list-disc pr-6 text-blue-800">
                      {relevantItems.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Construction stage progress bar */}
                <StageProgress status={form.status} />
              </div>
            </>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EnhancedSelect
                label="الأولوية"
                name="priority"
                value={form.priority}
                onChange={handleChange}
                options={[
                  { value: 'low', label: 'منخفضة' },
                  { value: 'medium', label: 'متوسطة' },
                  { value: 'high', label: 'مرتفعة' },
                  { value: 'urgent', label: 'عاجلة' },
                ]}
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              className="mt-6"
            >
              {loading ? 'جاري إنشاء المشروع...' : 'إنشاء المشروع'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
