'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { Typography, EnhancedCard, Button } from '@/core/shared/components/ui/enhanced-components';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Badge } from '@/core/shared/components/ui/badge';
import { Progress } from '@/core/shared/components/ui/progress';
import { useRouter } from 'next/navigation';
import { ProjectTrackingService } from '@/core/services/projectTrackingService';
import { Project, ProjectSummary } from '@/core/shared/types/types';
import { supabaseDataService } from '@/core/shared/services/supabase-data-service';
import { 
  ArrowLeft, 
  BarChart3, 
  FileText, 
  Users, 
  DollarSign, 
  Share2, 
  Plus, 
  Eye, 
  Calculator,
  Home,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Trash2
} from 'lucide-react';

export default function ProjectsListPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  
  // Use real data from AuthProvider
  const { user } = useAuth();
  
  // Real project data state
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [projectSummaries, setProjectSummaries] = useState<{ [key: string]: ProjectSummary }>({});
  
  const tabs = [
    { id: 'all', label: 'كل المشاريع' },
    { id: 'planning', label: 'تخطيط' },
    { id: 'in_progress', label: 'جاري التنفيذ' },
    { id: 'completed', label: 'مكتملة' },
  ];

  // Load real user projects
  useEffect(() => {
    const loadProjects = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        const projectsData = await supabaseDataService.getUserProjects(user.id);
        setProjects(projectsData || []);
        setError(null);
      } catch (err) {
        console.error('Error loading projects:', err);
        setError('فشل في تحميل المشاريع');
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [user?.id]);

  useEffect(() => {
    // Load project summaries when projects are available
    if (projects && projects.length > 0) {
      loadProjectSummaries();
    }
  }, [projects]);

  const loadProjectSummaries = async () => {
    try {
      const summariesData: { [key: string]: ProjectSummary } = {};
      for (const project of projects) {
        // Calculate realistic summary data based on project status and data
        const estimatedCost = project.estimated_cost || project.budget || 0;
        const spentCost = project.spent_cost || 0;
        
        // Calculate completion percentage based on status and spending
        let completionPercentage = 0;
        if (project.status === 'completed') {
          completionPercentage = 100;
        } else if (project.status === 'in_progress') {
          // Base completion on spending ratio, but cap between 10-90% for in-progress
          const spendingRatio = estimatedCost > 0 ? (spentCost / estimatedCost) * 100 : 0;
          completionPercentage = Math.min(90, Math.max(10, Math.floor(spendingRatio)));
        } else if (project.status === 'planning') {
          // For planning projects, base completion on whether they have estimated costs
          completionPercentage = estimatedCost > 0 ? 5 : 0; // 5% if they have estimates, 0% if no planning yet
        }
        
        summariesData[project.id] = {
          projectId: project.id,
          totalEstimatedCost: estimatedCost,
          totalSpentCost: spentCost,
          remainingCost: Math.max(0, estimatedCost - spentCost),
          completionPercentage,
          materialProgress: {},
          phaseProgress: {
            foundation: { estimated: estimatedCost * 0.2, spent: spentCost * 0.2, completion: Math.min(100, completionPercentage + 10) },
            structure: { estimated: estimatedCost * 0.3, spent: spentCost * 0.3, completion: Math.min(100, completionPercentage) },
            finishing: { estimated: estimatedCost * 0.25, spent: spentCost * 0.25, completion: Math.max(0, completionPercentage - 20) },
            electrical: { estimated: estimatedCost * 0.15, spent: spentCost * 0.15, completion: Math.max(0, completionPercentage - 10) },
            plumbing: { estimated: estimatedCost * 0.1, spent: spentCost * 0.1, completion: Math.max(0, completionPercentage - 15) }
          }
        };
      }
      setProjectSummaries(summariesData);
    } catch (error) {
      console.error('Error loading project summaries:', error);
    }
  };

  const loadProjects = async () => {
    // This is now handled in the useEffect above
    return;
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المشروع؟')) return;
    
    try {
      // Here you would call a delete API
      // await supabaseDataService.deleteProject(projectId);
      
      // For now, just remove from local state
      setProjects(prev => prev.filter(p => p.id !== projectId));
      console.log('تم حذف المشروع:', projectId);
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('فشل في حذف المشروع');
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <Typography variant="body" className="text-gray-600">
                جاري تحميل المشاريع...
              </Typography>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Typography variant="heading" className="text-red-600 mb-2">
                خطأ في تحميل المشاريع
              </Typography>
              <Typography variant="body" className="text-gray-600">
                {error}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getFilteredProjects = () => {
    if (activeTab === 'all') return projects;
    return projects.filter(project => project.status === activeTab);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in_progress': return 'secondary';
      case 'planning': return 'outline';
      case 'on_hold': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planning': return 'تخطيط';
      case 'in_progress': return 'جاري التنفيذ';
      case 'completed': return 'مكتمل';
      case 'on_hold': return 'متوقف';
      default: return status;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 font-tajawal">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              رجوع
            </Button>
            <div>
              <Typography variant="heading" size="2xl" weight="bold" className="text-gray-800">
                مشاريعي
              </Typography>
              <Typography variant="body" className="text-gray-600">
                إدارة ومتابعة جميع مشاريع البناء
              </Typography>
            </div>
          </div>
          <Button
            variant="filled"
            onClick={() => router.push('/user/projects/create')}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            مشروع جديد
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredProjects().length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <Home className="w-16 h-16 mx-auto" />
              </div>
              <Typography variant="heading" size="lg" className="text-gray-600 mb-2">
                {activeTab === 'all' ? 'لا توجد مشاريع بعد' : `لا توجد مشاريع ${tabs.find(t => t.id === activeTab)?.label}`}
              </Typography>
              <Typography variant="body" className="text-gray-500 mb-6">
                ابدأ مشروعك الأول واستفد من أدوات بِنّا المتقدمة
              </Typography>
              <Button
                variant="filled"
                onClick={() => router.push('/user/projects/create')}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                إنشاء مشروع جديد
              </Button>
            </div>
          ) : (
            getFilteredProjects().map((project) => {
              const summary = projectSummaries[project.id];
              
              return (
                <EnhancedCard key={project.id} variant="elevated" hover className="p-6 cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-800">
                        {project.project_name || project.name || 'مشروع بدون اسم'}
                      </Typography>
                      <p className="text-sm text-gray-600 mt-1">{project.description || project.project_description || 'لا يوجد وصف'}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Home className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {(project.estimated_cost || project.budget || 0).toLocaleString('ar-SA')} ريال
                        </span>
                      </div>
                      {project.location && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">{project.location}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={getStatusBadgeVariant(project.status)}>
                        {getStatusLabel(project.status)}
                      </Badge>
                      <button 
                        className="text-blue-600 hover:text-blue-700"
                        onClick={() => router.push(`/user/projects/${project.id}`)}
                      >
                        <FileText className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>التقدم</span>
                      <span>{summary ? summary.completionPercentage : 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${summary ? summary.completionPercentage : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Financial Details */}
                  {summary ? (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">المقدر:</span>
                        <span className="font-medium">{summary.totalEstimatedCost.toLocaleString('en-US')} ر.س</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">المنفق:</span>
                        <span className="font-medium text-green-600">{summary.totalSpentCost.toLocaleString('en-US')} ر.س</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-gray-600">متبقي:</span>
                        <span className="font-bold text-orange-600">{summary.remainingCost.toLocaleString('en-US')} ر.س</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-sm">
                      <div className="text-center text-gray-500 py-4">
                        جاري تحميل التفاصيل المالية...
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-4 pt-4 border-t flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => router.push(`/user/projects/${project.id}`)}
                      className="flex-1 flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      عرض المشروع
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteProject(project.id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </EnhancedCard>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
