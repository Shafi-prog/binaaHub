'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { Card, LoadingSpinner, StatusBadge, ProgressBar } from '@/components/ui';
import { verifyAuthWithRetry } from '@/lib/auth-recovery';
import { getProjectById } from '@/lib/api/dashboard';
import { formatCurrency, formatDate, translateStatus } from '@/lib/utils';
import type { Project } from '@/types/dashboard';

interface ProjectCompat {
  id: string;
  title: string; // For backward compatibility
  description?: string;
  status: 'planning' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  budget_estimate?: number;
  actual_cost?: number;
  start_date?: string;
  end_date?: string;
  deadline?: string;
  category?: string;
  progress_percentage?: number;
  created_at: string;
  updated_at: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [project, setProject] = useState<ProjectCompat | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [projectError, setProjectError] = useState<string | null>(null);

  const supabase = createClientComponentClient();

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('🔍 [Project Detail] Verifying authentication...');
        const user = await verifyAuthWithRetry(3);

        if (user) {
          console.log('✅ [Project Detail] User authenticated:', user.email);
          setUser(user.user);
          setAuthError(null);
        } else {
          console.error('❌ [Project Detail] Authentication failed');
          setAuthError('يرجى تسجيل الدخول للمتابعة');
          router.push('/login');
        }
      } catch (error) {
        console.error('❌ [Project Detail] Auth error:', error);
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
    try {
      console.log('🔍 Fetching project:', projectId);

      const projectData = await getProjectById(projectId);

      if (projectData) {
        // Transform to backward compatible format
        const compatProject: ProjectCompat = {
          id: projectData.id,
          title: projectData.name, // Map name to title for backward compatibility
          description: projectData.description,
          status: projectData.status as any,
          priority: projectData.priority,
          budget_estimate: projectData.budget_estimate,
          actual_cost: projectData.actual_cost,
          start_date: projectData.start_date,
          end_date: projectData.actual_completion_date,
          deadline: projectData.expected_completion_date,
          category: projectData.project_type,
          progress_percentage: projectData.progress_percentage,
          created_at: projectData.created_at,
          updated_at: projectData.updated_at,
        };

        setProject(compatProject);
        console.log('✅ Project loaded:', compatProject);
      } else {
        setProjectError('المشروع غير موجود');
        console.log('❌ Project not found');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      setProjectError('حدث خطأ في تحميل بيانات المشروع');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'yellow';
      case 'in_progress':
        return 'blue';
      case 'completed':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'green';
      case 'medium':
        return 'yellow';
      case 'high':
        return 'orange';
      case 'urgent':
        return 'red';
      default:
        return 'gray';
    }
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
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
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
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
              <p className="text-gray-600">تفاصيل المشروع وحالة التقدم</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <StatusBadge status={project.status} label={translateStatus(project.status)} />
            <StatusBadge
              status={project.priority}
              label={`أولوية ${
                project.priority === 'low'
                  ? 'منخفضة'
                  : project.priority === 'medium'
                    ? 'متوسطة'
                    : project.priority === 'high'
                      ? 'عالية'
                      : 'عاجلة'
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Details */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">تفاصيل المشروع</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">الوصف</h3>
                  <p className="text-gray-600">{project.description}</p>
                </div>

                {project.category && (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">الفئة</h3>
                    <p className="text-gray-600">{project.category}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Progress */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">تقدم المشروع</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">النسبة المكتملة</span>
                    <span className="text-sm text-gray-600">
                      {project.progress_percentage || 0}%
                    </span>
                  </div>{' '}
                  <ProgressBar percentage={project.progress_percentage || 0} showLabel={false} />
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">الإجراءات</h2>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={`/user/projects/${project.id}/edit`}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  تعديل المشروع
                </Link>

                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  تقرير التقدم
                </button>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">معلومات المشروع</h2>
              <div className="space-y-4">
                {project.budget_estimate && (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-1">الميزانية المقدرة</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(project.budget_estimate)}
                    </p>
                  </div>
                )}

                {project.actual_cost && (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-1">التكلفة الفعلية</h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(project.actual_cost)}
                    </p>
                  </div>
                )}

                {project.start_date && (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-1">تاريخ البداية</h3>
                    <p className="text-gray-600">{formatDate(project.start_date)}</p>
                  </div>
                )}

                {project.deadline && (
                  <div>
                    <h3 className="font-medium text-gray-700 mb-1">الموعد النهائي</h3>
                    <p className="text-gray-600">{formatDate(project.deadline)}</p>
                  </div>
                )}

                <div>
                  <h3 className="font-medium text-gray-700 mb-1">تاريخ الإنشاء</h3>
                  <p className="text-gray-600">{formatDate(project.created_at)}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-1">آخر تحديث</h3>
                  <p className="text-gray-600">{formatDate(project.updated_at)}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
