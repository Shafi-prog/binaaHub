"use client";
// All client-only imports and logic go inside this file
import React from 'react';
const { useState, useEffect } = React;
import { useParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { verifyAuthWithRetry } from '@/lib/auth-recovery';
import { getProjectById, updateProject as updateProjectAPI } from '@/lib/api/dashboard';
import { NotificationService, NotificationTypes } from '@/lib/notifications';
import { useNotification } from '@/components/ui/NotificationSystem';
import { Card, LoadingSpinner, StatusBadge, ProgressBar } from '@/components/ui';
import { formatCurrency, formatDate, translateStatus, calculateProjectProgress } from '@/lib/utils';
import { MapPicker } from '@/components/maps/MapPicker';
import ProjectIntegrationTabs from '@/components/user/ProjectIntegrationTabs';
import ProjectOrderComponent from '@/components/user/ProjectOrderComponent';
import ProjectWarrantyManager from '@/components/user/ProjectWarrantyManager';
import ProjectExpenseTracker from '@/components/user/ProjectExpenseTracker';
import { toast } from 'react-hot-toast';

// Advice for each stage
const STAGE_ADVICE = {
  planning: 'تأكد من جمع كل التصاريح اللازمة وتحديد الميزانية واختيار المقاول المناسب قبل الانتقال للمرحلة التالية.',
  design: 'راجع التصاميم مع المهندس وتأكد من مطابقتها للاحتياجات، وابدأ في تجهيز مستندات الرخص.',
  permits: 'تأكد من استكمال جميع الأوراق الرسمية والحصول على الرخص اللازمة قبل بدء التنفيذ.',
  construction: 'تابع تقدم العمل مع المقاول، واحتفظ بسجلات المصروفات، وراقب الجودة بشكل دوري.',
  finishing: 'اختر مواد التشطيب بعناية، ونسق مع الموردين لضمان التسليم في الوقت المناسب.',
  completed: 'راجع جميع الأعمال المنجزة، واحتفظ بنسخ من الضمانات والفواتير، واحتفل بإنجاز المشروع!',
  on_hold: 'تابع الإجراءات المطلوبة لإعادة تفعيل المشروع أو حل المشكلات العالقة.'
};

function ProjectDetailClient() {
  // ...copy all logic from the previous ProjectDetailClient function here...
  // ...for brevity, use the exact same logic as before...
  // ...existing code from inside ProjectDetailClient...

  // Inline ProjectCompat type as JSDoc for type hints
  /**
   * @typedef {Object} ProjectCompat
   * @property {string} id
   * @property {string} title
   * @property {string} [description]
   * @property {'planning'|'in_progress'|'completed'|'cancelled'} status
   * @property {'low'|'medium'|'high'|'urgent'} priority
   * @property {number} [budget]
   * @property {number} [actual_cost]
   * @property {string} [start_date]
   * @property {string} [end_date]
   * @property {string} [deadline]
   * @property {string} [category]
   * @property {number} [progress_percentage]
   * @property {string} created_at
   * @property {string} updated_at
   * @property {string} [location]
   */
  const params = useParams();
  const router = useRouter();
  // Fix: type projectId as string and handle undefined case
  const projectId = Array.isArray(params.id) ? params.id[0] : params.id;
  
  // Early return if projectId is undefined
  if (!projectId) {
    return <div>خطأ: معرف المشروع غير صحيح</div>;
  }

  // Fix: explicitly type user state as any to avoid type error
  const [user, setUser] = useState<any>(null);  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  // Fix: explicitly type error states as string | null
  const [authError, setAuthError] = useState<string | null>(null);
  const [projectError, setProjectError] = useState<string | null>(null);
  const { showNotification } = useNotification();
  const [lastNotifiedStage, setLastNotifiedStage] = useState(null);
  
  // Integration modal states
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showWarrantyModal, setShowWarrantyModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showIntegrationTabs, setShowIntegrationTabs] = useState(false);

  const supabase = createClientComponentClient();

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

  useEffect(() => {
    if (user && projectId) {
      fetchProject();
    }
  }, [user, projectId]);

  const fetchProject = async () => {
    if (!user) {
      setProjectError('المستخدم غير مصادق عليه');
      return;
    }
    setLoading(true);
    setProjectError(null);
    setProject(null);
    try {
      const freshSupabase = createClientComponentClient();
      const { data: { user: currentUser }, error: authError } = await freshSupabase.auth.getUser();
      if (authError || !currentUser) {
        setProjectError('خطأ في المصادقة - يرجى تسجيل الدخول مرة أخرى');
        router.push('/login');
        return;
      }
      const projectData = await getProjectById(projectId);
      if (projectData) {
        const compatProject = {
          id: projectData.id,
          title: projectData.name,
          description: projectData.description,
          status: projectData.status,
          priority: projectData.priority,
          budget: projectData.budget,
          actual_cost: projectData.actual_cost,
          start_date: projectData.start_date,
          end_date: projectData.actual_completion_date,
          deadline: projectData.expected_completion_date,
          category: projectData.project_type,
          progress_percentage: projectData.progress_percentage,
          created_at: projectData.created_at,
          updated_at: projectData.updated_at,
          location: projectData.location,
        };
        setProject(compatProject);
        setProjectError(null);
      } else {
        setProject(null);
        setProjectError(`المشروع غير موجود (projectId: ${projectId}, userId: ${user?.id})`);
      }
    } catch (error) {
      setProjectError('حدث خطأ أثناء تحميل بيانات المشروع');
      setProject(null);
    } finally {
      setLoading(false);
    }
  };
  // Updated `handleUpdateProject` function to use corrected notification types
  const handleUpdateProject = async (updatedFields: any) => {
    if (!user || !project) {
      showNotification({
        type: NotificationTypes.ERROR,
        message: 'لا يمكن تحديث المشروع بدون بيانات المستخدم أو المشروع',
      });
      return;
    }
    setLoading(true);
    try {
      const updatedProject = await updateProjectAPI(project.id, updatedFields);
      if (updatedProject) {
        setProject((prevProject: any) => ({ ...prevProject, ...updatedFields }));
        showNotification({
          type: NotificationTypes.SUCCESS,
          message: 'تم تحديث المشروع بنجاح',
        });
      } else {
        showNotification({
          type: NotificationTypes.ERROR,
          message: 'فشل تحديث المشروع',
        });
      }
    } catch (error) {
      showNotification({
        type: NotificationTypes.ERROR,
        message: 'حدث خطأ أثناء تحديث المشروع',
      });
    } finally {
      setLoading(false);
    }
  };

  // Added toast notifications for project loading and error handling
  useEffect(() => {
    const toastId = 'project-loading-toast';
    if (loading) {
      toast.dismiss(toastId);
      toast.loading('جارٍ تحميل بيانات المشروع...', { id: toastId });
    } else {
      toast.dismiss(toastId);
      if (projectError) {
        showNotification({
          type: NotificationTypes.ERROR,
          message: projectError,
        });
      }
    }
  }, [loading, projectError]);

  useEffect(() => {
    if (project && project.status && lastNotifiedStage !== project.status) {
      // Fix: type for STAGE_ADVICE index
      const advice = STAGE_ADVICE[project?.status as keyof typeof STAGE_ADVICE];
      if (advice) {
        showNotification({
          type: 'info',
          message: `نصيحة للمرحلة الحالية: ${advice}`,
        });
        NotificationService.createNotification({
          user_id: user?.id || '',
          type: NotificationTypes.PROJECT_UPDATED,
          title: 'تقدم المشروع',
          message: `تم الانتقال إلى مرحلة: ${project.status}`,
          data: { projectId: project.id, status: project.status },
          is_read: false,
          priority: 'normal',
          channel: 'app',
          sent_at: new Date().toISOString(),
        });
      }
      setLastNotifiedStage(project.status);
    }
  }, [project?.status]);

  const getStatusColor = (status: any) => {
    switch (status) {
      case 'planning': return 'yellow';
      case 'in_progress': return 'blue';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };
  const getPriorityColor = (priority: any) => {
    switch (priority) {
      case 'low': return 'green';
      case 'medium': return 'yellow';
      case 'high': return 'orange';
      case 'urgent': return 'red';
      default: return 'gray';    }
  };

  // Integration callbacks
  const handleOrderCreate = () => {
    setShowOrderModal(true);
  };

  const handleWarrantyCreate = () => {
    setShowWarrantyModal(true);
  };

  const handleExpenseCreate = () => {
    setShowExpenseModal(true);
  };

  const handleOrderCreated = (orderId: string) => {
    setShowOrderModal(false);
    showNotification({
      type: NotificationTypes.SUCCESS,
      message: 'تم إنشاء الطلب بنجاح',
    });
    // Optionally refresh project data or update state
  };

  const handleWarrantyCreated = (warrantyId: string) => {
    setShowWarrantyModal(false);
    showNotification({
      type: NotificationTypes.SUCCESS,
      message: 'تم تسجيل الضمان بنجاح',
    });
  };

  const handleExpenseCreated = (expenseId: string) => {
    setShowExpenseModal(false);
    showNotification({
      type: NotificationTypes.SUCCESS,
      message: 'تم إضافة المصروف بنجاح',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  if (authError || projectError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">خطأ</h2>
          <p className="text-gray-600">{authError || projectError}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            العودة
          </button>
        </Card>
      </div>
    );
  }
  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">المشروع غير موجود</h2>
          <p className="text-gray-600">لم يتم العثور على المشروع المطلوب</p>
          <Link
            href="/user/projects"
            className="inline-block mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            العودة للمشاريع
          </Link>
        </Card>
      </div>
    );
  }  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge 
              status={project.status} 
              color={getStatusColor(project.status)}
            />
            <StatusBadge 
              status={project.priority} 
              color={getPriorityColor(project.priority)}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Project Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Overview */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">نظرة عامة</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                  <p className="text-gray-600">{project.description || 'لا يوجد وصف'}</p>
                </div>
                
                {/* Progress */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">التقدم</label>
                  <ProgressBar 
                    percentage={typeof project.progress_percentage === 'number' ? project.progress_percentage : (project.progress_percentage ? parseInt(project.progress_percentage) : calculateProjectProgress(project))}
                    className="mb-2"
                  />
                  <p className="text-sm text-gray-600">{typeof project.progress_percentage === 'number' ? project.progress_percentage : (project.progress_percentage ? parseInt(project.progress_percentage) : calculateProjectProgress(project))}% مكتمل</p>
                </div>

                {/* Location */}
                {project.location && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الموقع</label>
                    <p className="text-gray-600">{project.location}</p>
                  </div>
                )}

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.start_date && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ البدء</label>
                      <p className="text-gray-600">{formatDate(project.start_date)}</p>
                    </div>
                  )}
                  {project.deadline && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">الموعد المستهدف</label>
                      <p className="text-gray-600">{formatDate(project.deadline)}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Budget Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">الميزانية</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.budget && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-blue-700 mb-1">الميزانية المخططة</label>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(project.budget)}</p>
                  </div>
                )}
                {project.actual_cost && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-green-700 mb-1">التكلفة الفعلية</label>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(project.actual_cost)}</p>
                  </div>
                )}
              </div>
              
              {project.budget && project.actual_cost && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-1">الفرق</label>
                  <p className={`text-lg font-semibold ${
                    project.actual_cost > project.budget ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {project.actual_cost > project.budget ? '+' : ''}{formatCurrency(project.actual_cost - project.budget)}
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column - Actions & Info */}
          <div className="space-y-6">            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">إجراءات سريعة</h2>
              <div className="space-y-3">
                <button 
                  onClick={() => setShowIntegrationTabs(true)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  نظرة شاملة على المشروع
                </button>
                
                <button 
                  onClick={handleOrderCreate}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  طلب مواد البناء
                </button>
                
                <button 
                  onClick={handleWarrantyCreate}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  تسجيل ضمان
                </button>
                
                <button 
                  onClick={handleExpenseCreate}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  إضافة مصروف
                </button>
                
                <button 
                  onClick={() => router.push(`/user/projects/${project.id}/edit`)}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  تعديل المشروع
                </button>
                
                <Link 
                  href={`/user/projects/${project.id}/timeline`}
                  className="block w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition-colors text-center"
                >
                  الجدول الزمني
                </Link>
              </div>
            </Card>

            {/* Project Stats */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">إحصائيات</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">الحالة</span>
                  <span className="font-medium">{translateStatus(project.status)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">الأولوية</span>
                  <span className="font-medium">{project.priority}</span>
                </div>
                
                {project.category && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">الفئة</span>
                    <span className="font-medium">{project.category}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">تاريخ الإنشاء</span>
                  <span className="font-medium">{formatDate(project.created_at)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">آخر تحديث</span>
                  <span className="font-medium">{formatDate(project.updated_at)}</span>
                </div>
              </div>
            </Card>

            {/* Stage Advice */}
            {project.status && STAGE_ADVICE[project.status as keyof typeof STAGE_ADVICE] && (
              <Card className="p-6 bg-yellow-50 border-yellow-200">
                <h2 className="text-xl font-semibold mb-2 text-yellow-800">نصيحة المرحلة</h2>
                <p className="text-yellow-700 text-sm leading-relaxed">
                  {STAGE_ADVICE[project.status as keyof typeof STAGE_ADVICE]}
                </p>
              </Card>
            )}          </div>
        </div>

        {/* Integration Modals */}
        
        {/* Comprehensive Integration Tabs Modal */}
        {showIntegrationTabs && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-2xl font-bold">إدارة شاملة للمشروع: {project.title}</h2>
                <button
                  onClick={() => setShowIntegrationTabs(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
                <ProjectIntegrationTabs
                  projectId={project.id}
                  projectName={project.title}
                  onOrderCreate={handleOrderCreate}
                  onWarrantyCreate={handleWarrantyCreate}
                  onExpenseCreate={handleExpenseCreate}
                />
              </div>
            </div>
          </div>
        )}

        {/* Order Component Modal */}
        {showOrderModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-2xl font-bold">طلب مواد البناء - {project.title}</h2>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
                <ProjectOrderComponent
                  projectId={project.id}
                  projectName={project.title}
                  onOrderCreated={handleOrderCreated}
                  onCancel={() => setShowOrderModal(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Warranty Manager Modal */}
        {showWarrantyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[95vh] overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-2xl font-bold">إدارة الضمانات - {project.title}</h2>
                <button
                  onClick={() => setShowWarrantyModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
                <ProjectWarrantyManager
                  projectId={project.id}
                  projectName={project.title}
                  onWarrantyCreated={handleWarrantyCreated}
                  onCancel={() => setShowWarrantyModal(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Expense Tracker Modal */}
        {showExpenseModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[95vh] overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-2xl font-bold">تتبع المصروفات - {project.title}</h2>
                <button
                  onClick={() => setShowExpenseModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
                <ProjectExpenseTracker
                  projectId={project.id}
                  projectName={project.title}
                  projectBudget={project.budget}
                  onExpenseCreated={handleExpenseCreated}
                  onCancel={() => setShowExpenseModal(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectDetailClient;
