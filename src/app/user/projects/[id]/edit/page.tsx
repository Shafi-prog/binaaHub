"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { verifyAuthWithRetry } from '@/lib/auth-recovery';
import { getProjectById, updateProject, getSpendingByCategory, getRecentExpenses } from '@/lib/api/dashboard';
import type { ProjectData } from '@/types/project';
import { StatCard } from '@/components/user/DashboardComponents';
import { DollarSign, TrendingUp, Calendar, FileText, BarChart2, CheckCircle, AlertTriangle } from 'lucide-react';

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
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [spendingByCategory, setSpendingByCategory] = useState<any[]>([]);
  const [recentExpenses, setRecentExpenses] = useState<any[]>([]);

  const supabase = createClientComponentClient();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await verifyAuthWithRetry(3);
        if (user) {
          setUser(user.user);
          setAuthError(null);
          loadProjectData();
        } else {
          setAuthError('يرجى تسجيل الدخول للمتابعة');
          router.push('/login');
        }
      } catch (error) {
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
      } else {
        alert('المشروع غير موجود');
        router.push('/user/projects');
      }
    } catch (error) {
      alert('حدث خطأ في تحميل بيانات المشروع');
      router.push('/user/projects');
    }
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [spending, expenses] = await Promise.all([
          getSpendingByCategory(user?.id || '', projectId),
          getRecentExpenses(user?.id || '', 5),
        ]);
        setSpendingByCategory(spending);
        setRecentExpenses(expenses.filter(e => e.project_id === projectId));
      } catch (e) {
        // ignore
      }
    };
    if (user) fetchDashboard();
  }, [user, projectId]);

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
      router.push(`/user/projects/${projectId}`);
    } catch (error) {
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
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Edit Form */}
          <div className="lg:col-span-2">
            <Card className="p-8 mb-6">
              <h2 className="text-2xl font-bold mb-6 text-blue-700">تعديل بيانات المشروع</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">اسم المشروع *</label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label htmlFor="project_type" className="block text-sm font-medium text-gray-700 mb-2">نوع المشروع</label>
                    <Input id="project_type" name="project_type" value={formData.project_type} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
                    <select id="status" name="status" value={formData.status} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2">
                      <option value="planning">تخطيط</option>
                      <option value="active">قيد التنفيذ</option>
                      <option value="completed">مكتمل</option>
                      <option value="on_hold">معلق</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">الأولوية</label>
                    <select id="priority" name="priority" value={formData.priority} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2">
                      <option value="low">منخفضة</option>
                      <option value="medium">متوسطة</option>
                      <option value="high">مرتفعة</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">الميزانية (ر.س)</label>
                    <Input id="budget" name="budget" type="number" value={formData.budget} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label htmlFor="actual_cost" className="block text-sm font-medium text-gray-700 mb-2">التكلفة الفعلية (ر.س)</label>
                    <Input id="actual_cost" name="actual_cost" type="number" value={formData.actual_cost} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label htmlFor="progress_percentage" className="block text-sm font-medium text-gray-700 mb-2">نسبة الإنجاز (%)</label>
                    <Input id="progress_percentage" name="progress_percentage" type="number" value={formData.progress_percentage} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">تاريخ الانتهاء المتوقع</label>
                    <Input id="end_date" name="end_date" type="date" value={formData.end_date} onChange={handleInputChange} />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
                    <textarea id="description" name="description" rows={3} value={formData.description} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
                    <Input id="address" name="address" value={formData.address} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">المدينة</label>
                    <Input id="city" name="city" value={formData.city} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">المنطقة</label>
                    <Input id="region" name="region" value={formData.region} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label htmlFor="location_lat" className="block text-sm font-medium text-gray-700 mb-2">خط العرض</label>
                    <Input id="location_lat" name="location_lat" value={formData.location_lat} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label htmlFor="location_lng" className="block text-sm font-medium text-gray-700 mb-2">خط الطول</label>
                    <Input id="location_lng" name="location_lng" value={formData.location_lng} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="flex justify-end mt-8">
                  <Button type="submit" disabled={saving} className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700">
                    {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Right: Project Dashboard */}
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
              <h3 className="text-lg font-bold mb-4 text-blue-800 flex items-center gap-2"><BarChart2 className="w-5 h-5 text-blue-500" /> لوحة المشروع</h3>
              <div className="grid grid-cols-1 gap-4">
                <StatCard title="الميزانية" value={formData.budget || '-'} icon={<DollarSign className="w-6 h-6 text-blue-600" />} />
                <StatCard title="التكلفة الفعلية" value={formData.actual_cost || '-'} icon={<TrendingUp className="w-6 h-6 text-green-600" />} />
                <StatCard title="نسبة الإنجاز" value={formData.progress_percentage ? `${formData.progress_percentage}%` : '-'} icon={<CheckCircle className="w-6 h-6 text-indigo-600" />} />
                <StatCard title="تاريخ الانتهاء المتوقع" value={formData.end_date || '-'} icon={<Calendar className="w-6 h-6 text-purple-600" />} />
              </div>
            </Card>
            <Card className="p-6">
              <h4 className="text-md font-semibold mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-orange-500" /> المصروفات حسب الفئة</h4>
              {spendingByCategory.length === 0 ? (
                <div className="text-gray-500">لا توجد مصروفات مسجلة لهذا المشروع</div>
              ) : (
                <ul className="space-y-2">
                  {spendingByCategory.map((cat) => (
                    <li key={cat.category_id} className="flex items-center gap-3">
                      <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: cat.color || '#888' }}></span>
                      <span className="font-medium">{cat.category_name_ar || cat.category_name}</span>
                      <span className="ml-auto font-bold">{cat.total_amount.toLocaleString()} ر.س</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
            <Card className="p-6">
              <h4 className="text-md font-semibold mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-green-500" /> المصروفات الأخيرة</h4>
              {recentExpenses.length === 0 ? (
                <div className="text-gray-500">لا توجد مصروفات حديثة</div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {recentExpenses.map((exp) => (
                    <li key={exp.id} className="py-2 flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{exp.title}</span>
                        <span className="text-sm text-gray-500">{exp.amount.toLocaleString()} {exp.currency || 'ر.س'}</span>
                      </div>
                      <div className="text-xs text-gray-400 flex gap-2">
                        <span>{exp.category?.name_ar || exp.category?.name}</span>
                        <span>•</span>
                        <span>{new Date(exp.expense_date).toLocaleDateString('ar-SA')}</span>
                        {exp.vendor_name && <><span>•</span><span>{exp.vendor_name}</span></>}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
