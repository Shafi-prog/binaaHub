"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { Card, LoadingSpinner, StatusBadge, EnhancedLoading } from '@/components/ui';
import { verifyAuthWithRetry } from '@/lib/auth-recovery';
import { getAllProjects } from '@/lib/api/dashboard';
import { formatCurrency, formatDate, translateStatus } from '@/lib/utils';
import type { Project } from '@/types/dashboard';
import { 
  Plus, 
  Building2, 
  Calendar, 
  DollarSign, 
  User as UserIcon, 
  Eye,
  Edit,
  Trash2,
  Filter,
  Search
} from 'lucide-react';
import { 
  isProjectActive, 
  getStatusLabel, 
  getProgressFromStatus, 
  getStatusColor, 
  calculateProjectProgress,
  getProjectTypeLabel 
} from '@/lib/project-utils';

export default function ProjectsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const supabase = createClientComponentClient();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await verifyAuthWithRetry(3);
        if (user) {
          setUser(user.user);
          setAuthError(null);
          fetchProjects(user.user.id);
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
  const fetchProjects = async (userId: string) => {
    try {
      const projects = await getAllProjects(userId);
      setProjects(projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  if (loading) {
    return (
      <EnhancedLoading 
        title="جارٍ تحميل المشاريع..."
        subtitle="يرجى الانتظار حتى نقوم بجلب بياناتك"
        showLogo={true}
        size="lg"
        fullScreen={true}
      />
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md sm:max-w-7xl mx-auto px-2 sm:px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">مشاريعي</h1>
              <p className="text-sm sm:text-base text-gray-600">إدارة ومتابعة جميع مشاريع البناء الخاصة بك</p>
            </div>
            <div className="mt-3 sm:mt-0">
              <Link
                href="/user/projects/new"
                className="inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                مشروع جديد
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="البحث في المشاريع..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-xs sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">جميع الحالات</option>
                <option value="planning">التخطيط</option>
                <option value="design">التصميم</option>
                <option value="permits">التراخيص</option>
                <option value="construction">التنفيذ</option>
                <option value="finishing">التشطيب</option>
                <option value="completed">مكتمل</option>
                <option value="on_hold">متوقف</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <Card className="p-8 sm:p-12 text-center">
            <Building2 className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">لا توجد مشاريع</h3>
            <p className="text-xs sm:text-base text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'لا توجد مشاريع تطابق معايير البحث'
                : 'ابدأ بإنشاء مشروعك الأول'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Link
                href="/user/projects/new"
                className="inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                إنشاء مشروع جديد
              </Link>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">{project.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{project.description}</p>
                  </div>
                  <div className="ml-2 sm:ml-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {getStatusLabel(project.status)}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3 sm:mb-4">
                  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-1">
                    <span>التقدم</span>
                    <span>{calculateProjectProgress(project)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${calculateProjectProgress(project)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                  {project.budget && (
                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span>الميزانية: {formatCurrency(project.budget)}</span>
                    </div>
                  )}
                  {project.expected_completion_date && (
                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>التاريخ المتوقع: {formatDate(project.expected_completion_date)}</span>
                    </div>
                  )}
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <Building2 className="h-4 w-4 mr-2" />
                    <span>النوع: {getProjectTypeLabel(project.project_type || '')}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-stretch gap-2 pt-3 sm:pt-4 border-t border-gray-200">
                  <Link
                    href={`/user/projects/${project.id}`}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs sm:text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    عرض
                  </Link>
                  <Link
                    href={`/user/projects/${project.id}/edit`}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs sm:text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    تعديل
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <Card className="p-4 sm:p-6 text-center">
            <div className="bg-blue-100 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-gray-900">{projects.length}</div>
            <div className="text-xs sm:text-sm text-gray-600">إجمالي المشاريع</div>
          </Card>
          
          <Card className="p-4 sm:p-6 text-center">
            <div className="bg-green-100 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-gray-900">
              {projects.filter(p => p.status === 'completed').length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">المشاريع المكتملة</div>
          </Card>
          
          <Card className="p-4 sm:p-6 text-center">
            <div className="bg-orange-100 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-gray-900">
              {projects.filter(isProjectActive).length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">قيد التنفيذ</div>
          </Card>
          
          <Card className="p-4 sm:p-6 text-center">
            <div className="bg-yellow-100 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-gray-900">
              {projects.filter(p => ['planning', 'design', 'permits'].includes((p.status || '').toLowerCase())).length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">في مرحلة التخطيط</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
