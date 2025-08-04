'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Building2, Calendar, DollarSign, Users } from 'lucide-react';
import { ProjectTrackingService } from '@/core/services/projectTrackingService';
import { Project } from '@/core/shared/types/types';
import { useUserData } from '@/core/shared/contexts/UserDataContext';
import { useRouter } from 'next/navigation';

export default function ProjectsTab() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile, projects: userProjects } = useUserData();
  const router = useRouter();

  useEffect(() => {
    const loadProjects = async () => {
      if (!profile?.id) return;
      
      try {
        const projectsData = await ProjectTrackingService.getProjects(profile.id);
        setProjects(projectsData);
      } catch (error) {
        console.error('Error loading projects:', error);
        // Use projects from context if available
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [profile?.id, userProjects]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'on-hold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planning': return 'تخطيط';
      case 'in-progress': return 'قيد التنفيذ';
      case 'completed': return 'مكتمل';
      case 'on-hold': return 'متوقف';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleCreateProject = () => {
    router.push('/projects/unified?mode=create');
  };

  const handleViewProject = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">مشاريعي</h2>
        <button 
          onClick={handleCreateProject}
          className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>مشروع جديد</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">إجمالي المشاريع</p>
              <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">قيد التنفيذ</p>
              <p className="text-2xl font-bold text-gray-900">
                {projects.filter(p => p.status === 'in-progress').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">إجمالي الميزانية</p>
              <p className="text-2xl font-bold text-gray-900">
                {projects.reduce((sum, p) => sum + (p.budget || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">المشاريع المكتملة</p>
              <p className="text-2xl font-bold text-gray-900">
                {projects.filter(p => p.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">قائمة المشاريع</h3>
        </div>
        
        {projects.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد مشاريع حاليا</h3>
            <p className="text-gray-600 mb-6">ابدأ مشروعك الأول الآن</p>
            <button 
              onClick={handleCreateProject}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              إنشاء مشروع جديد
            </button>
          </div>
        ) : (
          <div className="divide-y">
            {projects.map((project) => (
              <div key={project.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <h4 className="text-lg font-semibold text-gray-900">{project.name}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                        {getStatusLabel(project.status)}
                      </span>
                    </div>
                    
                    <div className="mt-2 flex items-center space-x-6 space-x-reverse text-sm text-gray-600">
                      <span>📍 {project.location || 'غير محدد'}</span>
                      <span>🏗️ {project.projectType}</span>
                      {project.startDate && (
                        <span>📅 {new Date(project.startDate).toLocaleDateString('ar-SA')}</span>
                      )}
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">التقدم</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {project.budget && (
                      <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          الميزانية: {project.budget.toLocaleString()} ريال
                        </span>
                        <span className="text-blue-600 font-medium">
                          المرحلة: {project.stage}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mr-6">
                    <button 
                      onClick={() => handleViewProject(project.id)}
                      className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      عرض التفاصيل
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
