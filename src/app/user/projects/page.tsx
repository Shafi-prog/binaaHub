'use client';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import {
  Card,
  StatCard,
  LoadingSpinner,
  StatusBadge,
  ProgressBar,
  EmptyState,
} from '@/components/ui';
import { getRecentProjects, getSpendingByCategory } from '@/lib/api/dashboard';
import {
  formatCurrency,
  formatDate,
  getStatusColor,
  calculateProjectProgress,
  translateStatus,
} from '@/lib/utils';
import { verifyAuthWithRetry } from '@/lib/auth-recovery';
import type { Project, SpendingByCategory } from '@/types/dashboard';

const LoadingProgressIndicator = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="animate-pulse space-y-8">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-64 bg-gray-200 rounded-lg"></div>
          <div className="h-12 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  </div>
);

export default function ProjectsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [spendingData, setSpendingData] = useState<SpendingByCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const router = useRouter();
  const supabase = createClientComponentClient();

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return; // Wait for hydration

    const fetchProjectsData = async () => {
      try {
        setLoading(true);
        setError(null);
        setAuthError(null);

        console.log('🔍 [Projects] Verifying authentication...');

        // Use robust authentication recovery
        const authResult = await verifyAuthWithRetry();
        if (authResult.error || !authResult.user) {
          console.error('❌ [Projects] Authentication failed');
          setAuthError('المستخدم غير مسجل الدخول');
          router.push('/login');
          return;
        }

        console.log('✅ [Projects] User authenticated:', authResult.user.email);
        setUser(authResult.user);

        const [projectsResponse, spendingDataResponse] = await Promise.all([
          getRecentProjects(authResult.user.id, 20),
          getSpendingByCategory(authResult.user.id),
        ]);

        setProjects(projectsResponse?.items || []);
        setSpendingData(spendingDataResponse);

        console.log('✅ [Projects] Data loaded successfully');
      } catch (error) {
        console.error('❌ [Projects] Error loading data:', error);
        setError('حدث خطأ في تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsData();
  }, [isHydrated, router, supabase]);

  if (loading) {
    return <LoadingProgressIndicator />;
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{authError}</div>
          <Link href="/login" className="text-blue-600 hover:underline">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <Link href="/user/dashboard" className="text-blue-600 hover:underline">
            العودة للوحة التحكم
          </Link>
        </div>
      </div>
    );
  }
  const activeProjects = projects.filter((p) => p.status !== 'completed');
  const completedProjects = projects.filter((p) => p.status === 'completed');
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget_estimate || 0), 0);
  const totalSpent = projects.reduce((sum, p) => sum + (p.actual_cost || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 font-tajawal">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">إدارة المشاريع</h1>
            <p className="text-gray-600">إدارة وتتبع مشاريعك البنائية</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/user/dashboard"
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              العودة للوحة التحكم
            </Link>
            <Link
              href="/user/projects/new"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              مشروع جديد
            </Link>
          </div>
        </div>

        {/* Project Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="إجمالي المشاريع"
            value={projects.length}
            color="blue"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            }
          />
          <StatCard
            title="مشاريع نشطة"
            value={activeProjects.length}
            color="green"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            }
          />
          <StatCard
            title="مشاريع مكتملة"
            value={completedProjects.length}
            color="purple"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
          <StatCard
            title="إجمالي المصروفات"
            value={formatCurrency(totalSpent)}
            subtitle={`من ${formatCurrency(totalBudget)}`}
            color="yellow"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects List */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">مشاريعي</h2>
                <div className="flex gap-2">
                  <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                    <option value="">جميع المشاريع</option>
                    <option value="planning">التخطيط</option>
                    <option value="construction">البناء</option>
                    <option value="finishing">التشطيب</option>
                    <option value="completed">مكتمل</option>
                  </select>
                </div>
              </div>

              {projects.length === 0 ? (
                <EmptyState
                  icon={
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  }
                  title="لا توجد مشاريع"
                  description="ابدأ مشروعك الأول الآن"
                  actionLabel="إنشاء مشروع جديد"
                  onAction={() => (window.location.href = '/user/projects/new')}
                />
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">{project.name}</h3>
                          <p className="text-gray-600 text-sm mb-2">{project.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>📍 {project.location}</span>
                            <span>📅 {formatDate(project.start_date || project.created_at)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge
                            status={project.status}
                            label={translateStatus(project.status)}
                            color={getStatusColor(project.status)}
                          />
                          {project.priority && (
                            <StatusBadge
                              status={project.priority}
                              label={
                                project.priority === 'low'
                                  ? 'أولوية منخفضة'
                                  : project.priority === 'medium'
                                    ? 'أولوية متوسطة'
                                    : project.priority === 'high'
                                      ? 'أولوية عالية'
                                      : 'أولوية عاجلة'
                              }
                              color={
                                project.priority === 'low'
                                  ? 'green'
                                  : project.priority === 'medium'
                                    ? 'yellow'
                                    : project.priority === 'high'
                                      ? 'orange'
                                      : 'red'
                              }
                            />
                          )}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">تقدم المشروع</span>
                          <span className="text-sm font-medium text-gray-800">
                            {project.progress_percentage || 0}%
                          </span>
                        </div>
                        <ProgressBar
                          percentage={project.progress_percentage || 0}
                          className="h-2"
                        />
                      </div>

                      {/* Budget Info */}
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-sm">
                          <span className="text-gray-600">المصروف: </span>
                          <span className="font-medium text-gray-800">
                            {formatCurrency(project.actual_cost || 0)}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">الميزانية: </span>
                          <span className="font-medium text-gray-800">
                            {formatCurrency(project.budget_estimate || 0)}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-3 border-t border-gray-100">
                        <Link
                          href={`/user/projects/${project.id}`}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-3 rounded transition-colors text-center"
                        >
                          عرض التفاصيل
                        </Link>
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm py-2 px-3 rounded transition-colors">
                          المصروفات
                        </button>
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm py-2 px-3 rounded transition-colors">
                          المستندات
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Spending by Category */}
          <div>
            <Card>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">المصروفات حسب الفئة</h2>

              {spendingData.length === 0 ? (
                <EmptyState
                  icon={
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  }
                  title="لا توجد مصروفات"
                  description="ابدأ بتسجيل مصروفات مشاريعك"
                />
              ) : (
                <div className="space-y-4">
                  {' '}
                  {spendingData.slice(0, 8).map((category, index) => (
                    <div key={category.category_id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {category.category_name_ar}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">
                        {formatCurrency(category.total_amount)}
                      </span>
                    </div>
                  ))}
                  {spendingData.length > 8 && (
                    <button className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium pt-2 border-t border-gray-100">
                      عرض جميع الفئات ({spendingData.length})
                    </button>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
