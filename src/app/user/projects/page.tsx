<<<<<<< HEAD
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
=======
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
        console.log('🆔 [Projects] User ID:', authResult.user.id);
        setUser(authResult.user);

        console.log('📡 [Projects] Fetching projects data...');
        const [projectsResponse, spendingDataResponse] = await Promise.all([
          getRecentProjects(authResult.user.id, 1), // Change from 20 to page 1
          getSpendingByCategory(authResult.user.id),
        ]);

        console.log('📊 [Projects] Projects response:', projectsResponse);
        console.log('📈 [Projects] Spending response:', spendingDataResponse);
        
        setProjects(projectsResponse?.items || []);
        setSpendingData(spendingDataResponse);

        console.log('✅ [Projects] Data loaded successfully');
        console.log('📝 [Projects] Final projects count:', projectsResponse?.items?.length || 0);
      } catch (error) {
        console.error('❌ [Projects] Error loading data:', error);
        setError('حدث خطأ في تحميل البيانات');
>>>>>>> e0e83bc2e6a4c393009b329773f07bfad211af6b
      } finally {
        setLoading(false);
      }
    };

<<<<<<< HEAD
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
=======
    fetchProjectsData();
  }, [isHydrated, router, supabase]);

  if (loading) {
    return <LoadingProgressIndicator />;
>>>>>>> e0e83bc2e6a4c393009b329773f07bfad211af6b
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
<<<<<<< HEAD
        <Card className="p-6 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">خطأ في المصادقة</h2>
          <p className="text-gray-600">{authError}</p>
        </Card>
=======
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{authError}</div>
          <Link href="/login" className="text-blue-600 hover:underline">
            تسجيل الدخول
          </Link>
        </div>
>>>>>>> e0e83bc2e6a4c393009b329773f07bfad211af6b
      </div>
    );
  }

<<<<<<< HEAD
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
=======
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
  // Updated logic to match backend: consider both status and is_active
  const activeProjects = projects.filter((p) => (p.status || p.is_active) !== 'completed' && (p.is_active !== false));
  const completedProjects = projects.filter((p) => (p.status || p.is_active) === 'completed' || p.is_active === false);
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const totalSpent = projects.reduce((sum, p) => sum + (p.actual_cost || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 font-tajawal">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
>>>>>>> e0e83bc2e6a4c393009b329773f07bfad211af6b
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
<<<<<<< HEAD
                  d="M12 4v16m8-8H4"
                />
              </svg>
=======
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">إدارة المشاريع</h1>
              <p className="text-gray-600">إدارة وتتبع مشاريعك البنائية</p>
            </div>
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
>>>>>>> e0e83bc2e6a4c393009b329773f07bfad211af6b
              مشروع جديد
            </Link>
          </div>
        </div>

<<<<<<< HEAD
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
=======
        {/* Project Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="إجمالي المشاريع"
            value={projects.length}
            color="blue"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
>>>>>>> e0e83bc2e6a4c393009b329773f07bfad211af6b
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
<<<<<<< HEAD
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
=======
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
                            {formatCurrency(project.budget || 0)}
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
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-blue-700">مشاريعي</h1>
          <Link href="/user/help-center/articles/project-steps" className="text-blue-600 hover:underline">مراحل البناء</Link>
        </div>
        {/* Checklist for project steps */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-bold mb-2">خطوات مشروعك</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>اختيار الأرض</li>
            <li>تصميم معماري وإنشائي</li>
            <li>الحصول على التراخيص</li>
            <li>شراء المواد</li>
            <li>تنفيذ البناء</li>
            <li>التشطيبات والتسليم</li>
          </ul>
        </div>
        {/* ...existing project list/table... */}
        {/* Floating help button */}
        <Link href="/user/help-center" className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full shadow-lg px-5 py-3 hover:bg-blue-700 z-50">مساعدة؟</Link>
      </main>
>>>>>>> e0e83bc2e6a4c393009b329773f07bfad211af6b
    </div>
  );
}
