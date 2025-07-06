"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { verifyAuthWithRetry } from '@/lib/auth-recovery';
import { getProjectById, updateProject, getSpendingByCategory, getRecentExpenses, deleteProject, getAllProjects } from '@/lib/api/dashboard';
import type { ProjectData } from '@/types/project';
import { StatCard } from '@/components/users/DashboardComponents';
import { DollarSign, TrendingUp, Calendar, FileText, BarChart2, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getAllProjectStatuses, canProjectBeForSale } from '@/lib/project-utils';
import ForSaleModal from '@/components/ForSaleModal';

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);  const [formData, setFormData] = useState({
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
    for_sale: false,
    advertisement_number: '',
    sale_price: '',
    sale_description: '',
  });
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [spendingByCategory, setSpendingByCategory] = useState<any[]>([]);
  const [recentExpenses, setRecentExpenses] = useState<any[]>([]);  const [showImportModal, setShowImportModal] = useState(false);
  const [importedProjects, setImportedProjects] = useState<any[]>([]);
  const [showForSaleModal, setShowForSaleModal] = useState(false);
  const [originalStatus, setOriginalStatus] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [projectFilter, setProjectFilter] = useState({
    search: '',
    status: 'all',
    limit: 10,
    sort: 'updated_at',
    sortDir: 'desc',
  });
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);

  const supabase = createClientComponentClient();
  const lastAuthErrorRef = useRef<string | null>(null);
  const lastLoadErrorRef = useRef<string | null>(null);

  // Define loadProjectData function before useEffects
  const loadProjectData = useCallback(async () => {
    try {
      const projectData = await getProjectById(projectId);
      if (projectData) {        setFormData({
          name: projectData.name,
          description: projectData.description || '',
          project_type: projectData.project_type || '',
          address: projectData.address || '',
          city: projectData.city || '',
          region: projectData.region || '',
          budget: projectData.budget?.toString() || '',
          end_date: projectData.expected_completion_date || '',
          priority: projectData.priority || '',
          status: projectData.status,
          progress_percentage: projectData.progress_percentage?.toString() || '',
          actual_cost: projectData.actual_cost?.toString() || '',
          location_lat: projectData.location ? (() => {
            try {
              const loc = JSON.parse(projectData.location);
              return (loc.lat || '').toString();
            } catch (e) {
              return '';
            }
          })() : '',
          location_lng: projectData.location ? (() => {
            try {
              const loc = JSON.parse(projectData.location);
              return (loc.lng || '').toString();
            } catch (e) {
              return '';
            }
          })() : '',
          for_sale: projectData.for_sale || false,
          advertisement_number: projectData.advertisement_number || '',
          sale_price: projectData.sale_price?.toString() || '',
          sale_description: projectData.sale_description || '',        });
        setOriginalStatus(projectData.status || 'planning');
        setLoadError(null);} else {
        setLoadError('المشروع غير موجود أو ليس لديك صلاحية الوصول إليه');
      }
    } catch (error: any) {
      console.error('Error loading project:', error);
      
      // Handle specific error messages
      if (error.message && error.message.includes('غير موجود في قاعدة البيانات')) {
        setLoadError('المشروع غير موجود في قاعدة البيانات');
      } else if (error.message && error.message.includes('ليس لديك صلاحية')) {
        setLoadError('ليس لديك صلاحية للوصول إلى هذا المشروع. تأكد من تسجيل الدخول بالحساب الصحيح.');
      } else if (error.message && error.message.includes('تسجيل الدخول')) {
        setLoadError('يرجى تسجيل الدخول أولاً');
      } else {
        setLoadError('حدث خطأ في تحميل بيانات المشروع');
      }
    }
  }, [projectId]);
  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await verifyAuthWithRetry(3);
        if (user) {
          setUser(user.user);
          setAuthError(null);
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
  }, [router]);
  // Separate useEffect for loading project data when user and projectId are available
  useEffect(() => {
    if (user && projectId && !loading) {
      loadProjectData();
    }
  }, [user, projectId, loading, loadProjectData]);

  // Unified notification for loading and error (improved)
  useEffect(() => {
    const toastId = 'project-loading-toast';
    if (loading) {
      toast.dismiss(toastId);
      toast.loading('جاري تحميل بيانات المشروع...', { id: toastId as any });
      lastAuthErrorRef.current = null;
      lastLoadErrorRef.current = null;
    } else {
      toast.dismiss(toastId);
      // Show auth error toast only if it changed
      if (authError && lastAuthErrorRef.current !== authError) {
        toast.error(authError, { id: toastId as any });
        lastAuthErrorRef.current = authError;
      }
      // Show load error toast only if it changed and not the special case handled below
      if (
        loadError &&
        loadError !== 'المشروع غير موجود أو ليس لديك صلاحية الوصول إليه' &&
        lastLoadErrorRef.current !== loadError
      ) {
        // Show more specific error if possible
        if (loadError.includes('غير موجود')) {
          toast.error('المشروع غير موجود في قاعدة البيانات', { id: toastId as any });
        } else if (loadError.includes('صلاحية')) {
          toast.error('ليس لديك صلاحية للوصول إلى هذا المشروع. تأكد من تسجيل الدخول بالحساب الصحيح.', { id: toastId as any });
        } else if (loadError.includes('تسجيل الدخول')) {
          toast.error('يرجى تسجيل الدخول أولاً', { id: toastId as any });
        } else {
          toast.error('حدث خطأ في تحميل بيانات المشروع', { id: toastId as any });
        }
        lastLoadErrorRef.current = loadError;
      }
    }  }, [loading, authError, loadError]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Since construction_expenses table is empty and causing errors,
        // we'll skip these calls for now and just set empty arrays
        setSpendingByCategory([]);
        setRecentExpenses([]);
      } catch (e) {
        // ignore
      }
    };
    if (user) fetchDashboard();
  }, [user, projectId]);
  // Fetch all user projects for display/filtering
  useEffect(() => {
    const fetchAllProjects = async () => {
      if (!user) return;
      try {
        const projects = await getAllProjects(user.id);
        setAllProjects(projects || []);
      } catch (e) {
        setAllProjects([]);
      }
    };
    fetchAllProjects();
  }, [user]);  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    // Check if status is changing to 'completed' from a non-completed status
    if (name === 'status' && value === 'completed' && originalStatus !== 'completed') {
      setShowForSaleModal(true);
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {      const updateData = {
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
        location: formData.location_lat && formData.location_lng ? JSON.stringify({ lat: parseFloat(formData.location_lat), lng: parseFloat(formData.location_lng) }) : undefined,        // For-sale related fields
        for_sale: formData.for_sale || false,
        advertisement_number: formData.for_sale ? formData.advertisement_number : undefined,
        sale_price: formData.for_sale && formData.sale_price ? parseFloat(formData.sale_price) : undefined,
        sale_description: formData.for_sale ? formData.sale_description : undefined,
      };

      const result = await updateProject(projectId, updateData);
      router.push(`/user/projects/${projectId}`);
    } catch (error) {
      alert('حدث خطأ في تحديث المشروع');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المشروع؟ لا يمكن التراجع عن هذا الإجراء.')) return;
    setDeleting(true);
    try {
      await deleteProject(projectId);
      router.push('/user/projects');
    } catch (error) {
      alert('حدث خطأ أثناء حذف المشروع');
    } finally {
      setDeleting(false);
    }
  };
  const handleImportProjects = async () => {
    if (!user) return;
    try {
      const allProjects = await getAllProjects(user.id);
      setImportedProjects(allProjects || []);
      setShowImportModal(true);
    } catch (error) {
      alert('حدث خطأ أثناء استيراد المشاريع');
    }
  };
  // Handle for-sale modal submission
  const handleForSaleSubmit = async (forSaleData: {
    for_sale: boolean;
    advertisement_number: string;
    sale_price: string;
    sale_description: string;
    profit_percentage: number;
  }) => {
    try {
      setSaving(true);
      
      // Update form data with for-sale information
      setFormData(prev => ({
        ...prev,
        for_sale: forSaleData.for_sale,
        advertisement_number: forSaleData.advertisement_number,
        sale_price: forSaleData.sale_price,
        sale_description: forSaleData.sale_description,
      }));

      // Prepare update data
      const updateData = {
        name: formData.name,
        description: formData.description,
        project_type: formData.project_type,
        address: formData.address || undefined,
        city: formData.city || undefined,
        region: formData.region || undefined,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        expected_completion_date: formData.end_date || undefined,
        priority: formData.priority,
        status: 'completed',
        progress_percentage: formData.progress_percentage ? parseInt(formData.progress_percentage) : undefined,
        actual_cost: formData.actual_cost ? parseFloat(formData.actual_cost) : undefined,
        location: formData.location_lat && formData.location_lng ? 
          JSON.stringify({ lat: parseFloat(formData.location_lat), lng: parseFloat(formData.location_lng) }) : undefined,        // For-sale related fields
        for_sale: forSaleData.for_sale,
        advertisement_number: forSaleData.for_sale ? forSaleData.advertisement_number : undefined,
        sale_price: forSaleData.for_sale && forSaleData.sale_price ? parseFloat(forSaleData.sale_price) : undefined,
        sale_description: forSaleData.for_sale ? forSaleData.sale_description : undefined,
      };

      const result = await updateProject(projectId, updateData);
      
      setShowForSaleModal(false);
      setOriginalStatus('completed');
      
      if (forSaleData.for_sale) {
        toast.success('تم حفظ المشروع كمكتمل وعرضه للبيع بنجاح!');
      } else {
        toast.success('تم حفظ المشروع كمكتمل بنجاح!');
      }
      
      // Optionally redirect to project detail page
      router.push(`/user/projects/${projectId}`);
      
    } catch (error) {
      toast.error('حدث خطأ في حفظ المشروع');
      console.error('Error updating project:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleForSaleModalClose = () => {
    setShowForSaleModal(false);
    // Reset status to original value if user cancels
    setFormData(prev => ({
      ...prev,
      status: originalStatus,
    }));
  };

  // Filtering logic for all projects
  const filteredProjects = allProjects
    .filter((p) =>
      (projectFilter.status === 'all' || p.status === projectFilter.status) &&
      (projectFilter.search === '' || (p.name && p.name.toLowerCase().includes(projectFilter.search.toLowerCase())))
    )
    .sort((a, b) => {
      if (projectFilter.sortDir === 'desc') {
        return new Date(b[projectFilter.sort]).getTime() - new Date(a[projectFilter.sort]).getTime();
      } else {
        return new Date(a[projectFilter.sort]).getTime() - new Date(b[projectFilter.sort]).getTime();
      }
    })
    .slice(0, projectFilter.limit);

  // Navigation for next/prev project
  const handlePrevProject = () => {
    setSelectedProjectIndex((prev) => (prev > 0 ? prev - 1 : filteredProjects.length - 1));
    const prevProject = filteredProjects[selectedProjectIndex > 0 ? selectedProjectIndex - 1 : filteredProjects.length - 1];
    if (prevProject) router.push(`/user/projects/${prevProject.id}/edit`);
  };
  const handleNextProject = () => {
    setSelectedProjectIndex((prev) => (prev < filteredProjects.length - 1 ? prev + 1 : 0));
    const nextProject = filteredProjects[selectedProjectIndex < filteredProjects.length - 1 ? selectedProjectIndex + 1 : 0];
    if (nextProject) router.push(`/user/projects/${nextProject.id}/edit`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  // Only show error page if project is truly missing or access denied
  if (authError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">خطأ</h2>
          <p className="text-gray-600">{authError}</p>
          <Button onClick={() => router.push('/login')} className="mt-4">العودة لتسجيل الدخول</Button>
        </Card>
      </div>
    );
  }
  // Only show error page if project is truly missing or access denied
  if (loadError === 'المشروع غير موجود أو ليس لديك صلاحية الوصول إليه') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">خطأ</h2>
          <p className="text-gray-600">{loadError}</p>
          <Button onClick={() => router.push('/user/projects')} className="mt-4">العودة للمشاريع</Button>
        </Card>
      </div>
    );
  }
  // For other errors, show a toast but keep the UI visible
  if (loadError) {
    toast.error(loadError);
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
                <div className="flex gap-4 mb-4">
                  <Button variant="destructive" onClick={handleDeleteProject} disabled={deleting}>
                    {deleting ? 'جاري الحذف...' : 'حذف المشروع'}
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">اسم المشروع *</label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label htmlFor="project_type" className="block text-sm font-medium text-gray-700 mb-2">نوع المشروع</label>
                    <Input id="project_type" name="project_type" value={formData.project_type} onChange={handleInputChange} />
                  </div>                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
                    <select id="status" name="status" value={formData.status} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2">
                      {getAllProjectStatuses().map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label} ({status.progress}%)
                        </option>
                      ))}
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
                  </div>                  <div>
                    <label htmlFor="location_lng" className="block text-sm font-medium text-gray-700 mb-2">خط الطول</label>
                    <Input id="location_lng" name="location_lng" value={formData.location_lng} onChange={handleInputChange} />
                  </div>
                </div>

                {/* For Sale Section - Only show when project is completed */}
                {canProjectBeForSale({ status: formData.status }) && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4 text-green-700">عرض المشروع للبيع</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <input
                          id="for_sale"
                          name="for_sale"
                          type="checkbox"
                          checked={formData.for_sale}
                          onChange={handleInputChange}
                          className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                        />
                        <label htmlFor="for_sale" className="text-sm font-medium text-gray-700">
                          عرض هذا المشروع للبيع على الصفحة العامة
                        </label>
                      </div>
                      
                      {formData.for_sale && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-green-50 rounded-lg">
                          <div>
                            <label htmlFor="advertisement_number" className="block text-sm font-medium text-gray-700 mb-2">رقم الإعلان *</label>
                            <Input 
                              id="advertisement_number" 
                              name="advertisement_number" 
                              value={formData.advertisement_number} 
                              onChange={handleInputChange}
                              placeholder="مثال: AD-2025-001"
                              required={formData.for_sale}
                            />
                          </div>
                          <div>
                            <label htmlFor="sale_price" className="block text-sm font-medium text-gray-700 mb-2">سعر البيع (ر.س)</label>
                            <Input 
                              id="sale_price" 
                              name="sale_price" 
                              type="number"
                              value={formData.sale_price} 
                              onChange={handleInputChange}
                              placeholder="مثال: 1500000"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label htmlFor="sale_description" className="block text-sm font-medium text-gray-700 mb-2">وصف الإعلان</label>
                            <textarea 
                              id="sale_description" 
                              name="sale_description" 
                              rows={3}
                              value={formData.sale_description} 
                              onChange={handleInputChange}
                              className="w-full border rounded-lg px-3 py-2"
                              placeholder="اكتب وصف جذاب للمشروع لعرضه للمشترين المحتملين..."
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

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
        {/* All User Projects Section with Filters */}
        <div className="my-8 p-4 bg-gray-50 rounded-lg border">
          <h2 className="text-lg font-bold mb-2">جميع مشاريع المستخدم</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            <input
              type="text"
              placeholder="بحث بالاسم..."
              value={projectFilter.search}
              onChange={e => setProjectFilter(f => ({ ...f, search: e.target.value }))}
              className="border px-2 py-1 rounded"
            />
            <select
              value={projectFilter.status}
              onChange={e => setProjectFilter(f => ({ ...f, status: e.target.value }))}
              className="border px-2 py-1 rounded"
            >
              <option value="all">كل الحالات</option>
              <option value="planning">تخطيط</option>
              <option value="design">تصميم</option>
              <option value="permits">تراخيص</option>
              <option value="construction">تنفيذ</option>
              <option value="finishing">تشطيب</option>
              <option value="completed">مكتمل</option>
              <option value="on_hold">موقوف</option>
              <option value="active">نشط</option>
            </select>
            <select
              value={projectFilter.limit}
              onChange={e => setProjectFilter(f => ({ ...f, limit: Number(e.target.value) }))}
              className="border px-2 py-1 rounded"
            >
              {[5, 10, 20, 50, 100].map(n => <option key={n} value={n}>{n} مشروع</option>)}
            </select>
            <select
              value={projectFilter.sort}
              onChange={e => setProjectFilter(f => ({ ...f, sort: e.target.value }))}
              className="border px-2 py-1 rounded"
            >
              <option value="updated_at">الأحدث</option>
              <option value="created_at">تاريخ الإنشاء</option>
              <option value="name">الاسم</option>
            </select>
            <select
              value={projectFilter.sortDir}
              onChange={e => setProjectFilter(f => ({ ...f, sortDir: e.target.value }))}
              className="border px-2 py-1 rounded"
            >
              <option value="desc">تنازلي</option>
              <option value="asc">تصاعدي</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end mb-4">
            <button onClick={handlePrevProject} className="p-2 bg-gray-200 rounded hover:bg-gray-300" title="المشروع السابق">
              ◀
            </button>
            <button onClick={handleNextProject} className="p-2 bg-gray-200 rounded hover:bg-gray-300" title="المشروع التالي">
              ▶
            </button>
          </div>
          <ul className="divide-y">
            {filteredProjects.map((proj, idx) => (
              <li key={proj.id} className={`py-2 flex flex-col md:flex-row md:items-center md:gap-4 ${idx === selectedProjectIndex ? 'bg-blue-50' : ''}`}>
                <span className="font-medium">{proj.name}</span>
                <span className="text-gray-500">{proj.status}</span>
                <span className="text-xs text-gray-400">{proj.updated_at ? new Date(proj.updated_at).toLocaleString('ar-EG') : ''}</span>
              </li>
            ))}            {filteredProjects.length === 0 && <li className="text-gray-400">لا توجد مشاريع مطابقة</li>}
          </ul>
        </div>
      </div>      {/* For Sale Modal */}
      <ForSaleModal
        isOpen={showForSaleModal}
        onClose={handleForSaleModalClose}
        onSubmit={handleForSaleSubmit}
        projectName={formData.name}
        totalCost={formData.actual_cost ? parseFloat(formData.actual_cost) : 0}
        budget={formData.budget ? parseFloat(formData.budget) : 0}
        loading={saving}
      />
    </div>
  );
}
