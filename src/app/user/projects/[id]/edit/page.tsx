'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { verifyAuthWithRetry } from '@/lib/auth-recovery';
import { getProjectById, updateProject } from '@/lib/api/dashboard';
import type { ProjectData } from '@/types/project';

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    project_type: '',
    address: '',
    city: '',
    region: '',
    budget: '',
    end_date: '',
    priority: 'medium',
    status: 'planning',
    progress_percentage: '',
    actual_cost: '',
    location_lat: '',
    location_lng: '',
  });

  const supabase = createClientComponentClient();

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('🔍 [Edit Project] Verifying authentication...');
        const user = await verifyAuthWithRetry(3);

        if (user) {
          console.log('✅ [Edit Project] User authenticated:', user.email);
          setUser(user.user);
          setAuthError(null);
          // Load project data
          loadProjectData();
        } else {
          console.error('❌ [Edit Project] Authentication failed');
          setAuthError('يرجى تسجيل الدخول للمتابعة');
          router.push('/login');
        }
      } catch (error) {
        console.error('❌ [Edit Project] Auth error:', error);
        setAuthError('خطأ في المصادقة');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [router, projectId]);
  const loadProjectData = async () => {
    try {
      console.log('🔍 Loading project data for editing:', projectId);

      const projectData = await getProjectById(projectId);

      if (projectData) {
        setFormData({
          name: projectData.name,
          description: projectData.description || '',
          project_type: projectData.project_type,
          address: projectData.address || '',
          city: projectData.city || '',
          region: projectData.region || '',
          budget: projectData.budget?.toString() || '',
          end_date: projectData.expected_completion_date || '',
          priority: projectData.priority,
          status: projectData.status,
          progress_percentage: projectData.progress_percentage?.toString() || '',
          actual_cost: projectData.actual_cost?.toString() || '',
          location_lat: projectData.location ? (JSON.parse(projectData.location).lat || '').toString() : '',
          location_lng: projectData.location ? (JSON.parse(projectData.location).lng || '').toString() : '',
        });
        console.log('✅ Project data loaded for editing');
      } else {
        console.error('❌ Project not found for editing');
        alert('المشروع غير موجود');
        router.push('/user/projects');
      }
    } catch (error) {
      console.error('Error loading project data:', error);
      alert('حدث خطأ في تحميل بيانات المشروع');
      router.push('/user/projects');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      console.log('Updating project:', formData);

      // Create update data object
      const updateData = {
        name: formData.name,
        description: formData.description,
        project_type: formData.project_type,
        address: formData.address || undefined,
        city: formData.city || undefined,
        region: formData.region || undefined,
        budget: formData.budget
          ? parseFloat(formData.budget)
          : undefined,
        expected_completion_date: formData.end_date || undefined,
        priority: formData.priority,
        status: formData.status,
        progress_percentage: formData.progress_percentage ? parseInt(formData.progress_percentage) : undefined,
        actual_cost: formData.actual_cost ? parseFloat(formData.actual_cost) : undefined,
        location: formData.location_lat && formData.location_lng ? JSON.stringify({ lat: parseFloat(formData.location_lat), lng: parseFloat(formData.location_lng) }) : undefined,
      };

      const result = await updateProject(projectId, updateData);

      console.log('✅ Project updated successfully:', result);
      // Redirect back to project detail page
      router.push(`/user/projects/${projectId}`);
    } catch (error) {
      console.error('Error updating project:', error);
      alert('حدث خطأ في تحديث المشروع');
    } finally {
      setSaving(false);
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
            <h1 className="text-3xl font-bold text-gray-900">تعديل المشروع</h1>
          </div>
          <p className="text-gray-600">تحديث تفاصيل المشروع ومعلوماته</p>
        </div>

        {/* Form */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {' '}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>{' '}
            {/* Project Type Row */}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">اختر نوع المشروع</option>
                  <option value="residential">سكني</option>
                  <option value="commercial">تجاري</option>
                  <option value="industrial">صناعي</option>
                  <option value="infrastructure">بنية تحتية</option>
                  <option value="renovation">تجديد</option>
                  <option value="other">أخرى</option>
                </select>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="أدخل العنوان التفصيلي"
                />
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="أدخل المدينة"
                />
              </div>
            </div>
            {/* Region and Status Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                  المنطقة
                </label>
                <input
                  type="text"
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="أدخل المنطقة"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  حالة المشروع
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="planning">تخطيط</option>
                  <option value="design">تصميم</option>
                  <option value="permits">تراخيص</option>
                  <option value="construction">بناء</option>
                  <option value="finishing">تشطيب</option>
                  <option value="completed">مكتمل</option>
                  <option value="on_hold">متوقف</option>
                </select>
              </div>
            </div>
            {/* Budget and Deadline Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="budget"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  الميزانية المقدرة (ريال سعودي)
                </label>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label
                  htmlFor="end_date"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  تاريخ الإنجاز المتوقع
                </label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {/* Priority */}
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
            {/* Progress Percentage */}
            <div>
              <label htmlFor="progress_percentage" className="block text-sm font-medium text-gray-700 mb-2">
                نسبة الإنجاز (%)
              </label>
              <input
                type="number"
                id="progress_percentage"
                name="progress_percentage"
                min={0}
                max={100}
                value={formData.progress_percentage}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0-100"
              />
            </div>
            {/* Actual Cost */}
            <div>
              <label htmlFor="actual_cost" className="block text-sm font-medium text-gray-700 mb-2">
                التكلفة الفعلية (ريال سعودي)
              </label>
              <input
                type="number"
                id="actual_cost"
                name="actual_cost"
                value={formData.actual_cost}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            {/* Location Fields */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="location_lat" className="block text-sm font-medium text-gray-700 mb-2">
                  خط العرض (Latitude)
                </label>
                <input
                  type="number"
                  id="location_lat"
                  name="location_lat"
                  value={formData.location_lat}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="مثال: 24.7136"
                  step="any"
                />
              </div>
              <div>
                <label htmlFor="location_lng" className="block text-sm font-medium text-gray-700 mb-2">
                  خط الطول (Longitude)
                </label>
                <input
                  type="number"
                  id="location_lng"
                  name="location_lng"
                  value={formData.location_lng}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="مثال: 46.6753"
                  step="any"
                />
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              {' '}
              <button
                type="submit"
                disabled={
                  saving ||
                  !formData.name.trim() ||
                  !formData.project_type.trim()
                }
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <LoadingSpinner size="sm" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    حفظ التغييرات
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
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
