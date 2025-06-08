"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { Card, LoadingSpinner, StatusBadge } from '@/components/ui';
import { verifyAuthWithRetry } from '@/lib/auth-recovery';
import { getRecentProjects } from '@/lib/api/dashboard';
import { formatCurrency, formatDate, translateStatus } from '@/lib/utils';
import type { Project } from '@/types/dashboard';

export default function ProjectsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  const supabase = createClientComponentClient();

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('🔍 [Projects] Verifying authentication...');
        const user = await verifyAuthWithRetry(3);

        if (user) {
          console.log('✅ [Projects] User authenticated:', user.email);
          setUser(user.user);
          setAuthError(null);
        } else {
          console.error('❌ [Projects] Authentication failed');
          setAuthError('يرجى تسجيل الدخول للمتابعة');
          router.push('/login');
        }
      } catch (error) {
        console.error('❌ [Projects] Auth error:', error);
        setAuthError('خطأ في المصادقة');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [router]);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user, currentPage]);

  const fetchProjects = async () => {
    if (!user) return;

    setLoading(true);
    setProjectsError(null);

    try {
      console.log('🔍 Fetching projects for user:', user.id);
      const result = await getRecentProjects(user.id, currentPage);
      
      console.log('📋 Projects result:', result);
      setProjects(result.items);
      setHasMore(result.hasMore);
      setTotal(result.total);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjectsError('حدث خطأ في تحميل المشاريع');
    } finally {
      setLoading(false);
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
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">مشاريعي</h1>
              <p className="text-gray-600">إدارة ومتابعة جميع مشاريع البناء</p>
            </div>
            <Link
              href="/user/projects/new"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              مشروع جديد
            </Link>
          </div>
        </div>

        {/* Projects Grid */}
        {projectsError ? (
          <Card className="p-6 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">خطأ</h2>
            <p className="text-gray-600">{projectsError}</p>
            <button
              onClick={fetchProjects}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              إعادة المحاولة
            </button>
          </Card>
        ) : projects.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">🏗️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">لا توجد مشاريع بعد</h2>
            <p className="text-gray-600 mb-6">ابدأ بإنشاء مشروعك الأول لتتبع تقدم البناء</p>
            <Link
              href="/user/projects/new"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              إنشاء مشروع جديد
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{project.name}</h3>
                  <div className="flex flex-col gap-2">
                    <StatusBadge 
                      status={project.status} 
                      label={translateStatus(project.status)} 
                    />
                    {project.priority && (
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
                    )}
                  </div>
                </div>

                {project.description && (
                  <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                )}

                <div className="space-y-2 mb-4">
                  {project.project_type && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">النوع:</span>
                      <span className="text-gray-900">{project.project_type}</span>
                    </div>
                  )}
                  {project.budget && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">الميزانية:</span>
                      <span className="text-gray-900">{formatCurrency(project.budget)}</span>
                    </div>
                  )}
                  {project.created_at && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">تاريخ الإنشاء:</span>
                      <span className="text-gray-900">{formatDate(project.created_at)}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/user/projects/${project.id}`}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-center"
                  >
                    عرض التفاصيل
                  </Link>
                  <Link
                    href={`/user/projects/${project.id}/edit`}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    تعديل
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {projects.length > 0 && (
          <div className="mt-8 flex justify-between items-center">
            <p className="text-gray-600">
              عرض {projects.length} من أصل {total} مشروع
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                السابق
              </button>
              <span className="px-4 py-2 border border-gray-300 rounded-lg bg-blue-50 text-blue-600">
                {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={!hasMore}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                التالي
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
