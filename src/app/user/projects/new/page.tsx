'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import { Card, LoadingSpinner } from '../../../../components/ui';
import { createProject } from '../../../../lib/api/dashboard';

export default function NewProjectPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [formFieldErrors, setFormFieldErrors] = useState<{ [key: string]: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    project_type: '',
    location: '',
    address: '',
    city: '',
    region: '',
    budget_estimate: '',
    expected_completion_date: '',
    priority: 'medium' as const,
  });

  const router = useRouter();
  const supabase = createClientComponentClient();

  // Validation helper function
  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};
    let isValid = true;

    // Required fields validation
    if (!formData.name.trim()) {
      errors.name = 'اسم المشروع مطلوب';
      isValid = false;
    } else if (formData.name.length < 3) {
      errors.name = 'يجب أن يكون اسم المشروع 3 أحرف على الأقل';
      isValid = false;
    }

    if (!formData.project_type) {
      errors.project_type = 'نوع المشروع مطلوب';
      isValid = false;
    }

    if (!formData.location.trim()) {
      errors.location = 'موقع المشروع مطلوب';
      isValid = false;
    }

    // Budget validation if provided
    if (formData.budget_estimate && isNaN(parseFloat(formData.budget_estimate))) {
      errors.budget_estimate = 'الرجاء إدخال قيمة صحيحة للميزانية';
      isValid = false;
    }

    // Date validation if provided
    if (formData.expected_completion_date) {
      const selectedDate = new Date(formData.expected_completion_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        errors.expected_completion_date = 'تاريخ الإنجاز المتوقع يجب أن يكون في المستقبل';
        isValid = false;
      }
    }

    // City and region validation if address is provided
    if (formData.address && !formData.city) {
      errors.city = 'المدينة مطلوبة عند إدخال العنوان';
      isValid = false;
    }

    if (formData.address && !formData.region) {
      errors.region = 'المنطقة مطلوبة عند إدخال العنوان';
      isValid = false;
    }

    setFormFieldErrors(errors);
    return isValid;
  };

  useEffect(() => {
    let authListener: any;
    let isMounted = true;

    const initializeAuth = async () => {
      setLoading(true);
      setAuthError(null);

      try {
        // Initial session check
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          if (isMounted) {
            setUser(session.user);
          }
        } else {
          // Try to refresh the session
          const {
            data: { session: refreshedSession },
          } = await supabase.auth.refreshSession();
          if (refreshedSession?.user) {
            if (isMounted) {
              setUser(refreshedSession.user);
            }
          } else {
            if (isMounted) {
              setAuthError('يرجى تسجيل الدخول للمتابعة');
              router.push('/login');
            }
          }
        }

        // Set up auth state change listener
        authListener = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.id);

          if (event === 'SIGNED_OUT' || !session) {
            if (isMounted) {
              setUser(null);
              router.push('/login');
            }
            return;
          }

          if (session?.user && isMounted) {
            setUser(session.user);
          }
        });
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMounted) {
          setAuthError('خطأ في المصادقة');
          router.push('/login');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Cleanup
    return () => {
      isMounted = false;
      if (authListener?.unsubscribe) {
        authListener.unsubscribe();
      }
    };
  }, [router, supabase]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Clear previous errors
    setFormFieldErrors((prev) => ({ ...prev, [name]: '' }));

    // Special handling for budget input
    if (name === 'budget_estimate' && value !== '') {
      const numericValue = value.replace(/[^\d]/g, '');
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Reset errors
    setFormError(null);

    // Validate form
    if (!validateForm()) {
      setFormError('الرجاء تصحيح الأخطاء في النموذج');
      return;
    }

    setCreating(true);
    try {
      console.log('Creating project:', formData);

      // Create project data object
      const projectData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        project_type: formData.project_type,
        location: formData.location.trim(),
        address: formData.address.trim() || undefined,
        city: formData.city.trim() || undefined,
        region: formData.region || undefined,
        budget_estimate: formData.budget_estimate
          ? parseFloat(formData.budget_estimate)
          : undefined,
        expected_completion_date: formData.expected_completion_date || undefined,
        priority: formData.priority,
        status: 'planning' as const,
        currency: 'SAR',
        actual_cost: 0,
        progress_percentage: 0,
        is_active: true,
      };

      const result = await createProject(projectData);

      console.log('✅ Project created successfully:', result);
      router.push(`/user/projects/${result.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      setFormError('حدث خطأ في إنشاء المشروع. الرجاء المحاولة مرة أخرى.');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">خطأ في المصادقة</h2>
          <p className="text-gray-600">{authError}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
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
            <h1 className="text-3xl font-bold text-gray-900">إنشاء مشروع جديد</h1>
          </div>
          <p className="text-gray-600">أنشئ مشروعاً جديداً وابدأ في إدارة مهامك بفعالية</p>
        </div>

        {/* Form */}
        <Card className="p-6">
          {formError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{formError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                اسم المشروع *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formFieldErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="أدخل اسم المشروع"
              />
              {formFieldErrors.name && (
                <p className="mt-1 text-sm text-red-600">{formFieldErrors.name}</p>
              )}
            </div>

            {/* Project Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                وصف المشروع
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formFieldErrors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="أدخل وصف مفصل للمشروع"
              />
              {formFieldErrors.description && (
                <p className="mt-1 text-sm text-red-600">{formFieldErrors.description}</p>
              )}
            </div>

            {/* Budget and Deadline Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="budget_estimate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  الميزانية المقدرة (ريال سعودي)
                </label>
                <input
                  type="text"
                  id="budget_estimate"
                  name="budget_estimate"
                  value={formData.budget_estimate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formFieldErrors.budget_estimate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
                {formFieldErrors.budget_estimate && (
                  <p className="mt-1 text-sm text-red-600">{formFieldErrors.budget_estimate}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="expected_completion_date"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  تاريخ الإنجاز المتوقع
                </label>
                <input
                  type="date"
                  id="expected_completion_date"
                  name="expected_completion_date"
                  value={formData.expected_completion_date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formFieldErrors.expected_completion_date
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300'
                  }`}
                />
                {formFieldErrors.expected_completion_date && (
                  <p className="mt-1 text-sm text-red-600">
                    {formFieldErrors.expected_completion_date}
                  </p>
                )}
              </div>
            </div>

            {/* Project Type and Location Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="project_type"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  نوع المشروع *
                </label>
                <select
                  id="project_type"
                  name="project_type"
                  value={formData.project_type}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formFieldErrors.project_type ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">اختر نوع المشروع</option>
                  <option value="residential">سكني</option>
                  <option value="commercial">تجاري</option>
                  <option value="industrial">صناعي</option>
                  <option value="infrastructure">بنية تحتية</option>
                  <option value="renovation">تجديد</option>
                  <option value="other">أخرى</option>
                </select>
                {formFieldErrors.project_type && (
                  <p className="mt-1 text-sm text-red-600">{formFieldErrors.project_type}</p>
                )}
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  الموقع *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formFieldErrors.location ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="أدخل موقع المشروع"
                />
                {formFieldErrors.location && (
                  <p className="mt-1 text-sm text-red-600">{formFieldErrors.location}</p>
                )}
              </div>
            </div>

            {/* Address and City Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان التفصيلي
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formFieldErrors.address ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="أدخل العنوان التفصيلي"
                />
                {formFieldErrors.address && (
                  <p className="mt-1 text-sm text-red-600">{formFieldErrors.address}</p>
                )}
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  المدينة
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formFieldErrors.city ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="أدخل المدينة"
                />
                {formFieldErrors.city && (
                  <p className="mt-1 text-sm text-red-600">{formFieldErrors.city}</p>
                )}
              </div>
            </div>

            {/* Region and Priority Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                  المنطقة
                </label>
                <select
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formFieldErrors.region ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">اختر المنطقة</option>
                  <option value="riyadh">الرياض</option>
                  <option value="makkah">مكة المكرمة</option>
                  <option value="eastern">الشرقية</option>
                  <option value="asir">عسير</option>
                  <option value="qassim">القصيم</option>
                  <option value="ha'il">حائل</option>
                  <option value="madinah">المدينة المنورة</option>
                  <option value="northern_borders">الحدود الشمالية</option>
                  <option value="jazan">جازان</option>
                  <option value="najran">نجران</option>
                  <option value="al_baha">الباحة</option>
                  <option value="tabuk">تبوك</option>
                  <option value="al_jawf">الجوف</option>
                </select>
                {formFieldErrors.region && (
                  <p className="mt-1 text-sm text-red-600">{formFieldErrors.region}</p>
                )}
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                  الأولوية
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">منخفضة</option>
                  <option value="medium">متوسطة</option>
                  <option value="high">عالية</option>
                  <option value="urgent">عاجلة</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={creating}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {creating ? (
                  <>
                    <LoadingSpinner size="sm" />
                    جاري الإنشاء...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    إنشاء المشروع
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                disabled={creating}
                className="flex-1 sm:flex-none border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-6 rounded-lg transition-colors"
              >
                إلغاء
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
