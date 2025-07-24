'use client';

import React, { useState, useEffect } from 'react';
import { Typography, EnhancedCard, Button } from '@/core/shared/components/ui/enhanced-components';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Badge } from '@/core/shared/components/ui/badge';
import { Progress } from '@/core/shared/components/ui/progress';
import { useRouter } from 'next/navigation';
import { ProjectTrackingService } from '@/core/services/projectTrackingService';
import { Project, ProjectSummary } from '@/core/shared/types/types';
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectSummaries, setProjectSummaries] = useState<{ [key: string]: ProjectSummary }>({});
  const [loading, setLoading] = useState(true);
  
  const tabs = [
    { id: 'all', label: 'كل المشاريع' },
    { id: 'planning', label: 'تخطيط' },
    { id: 'in-progress', label: 'جاري التنفيذ' },
    { id: 'completed', label: 'مكتملة' },
  ];

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const projectsData = await ProjectTrackingService.getProjects();
      setProjects(projectsData);

      // Load summaries for each project
      const summaries: { [key: string]: ProjectSummary } = {};
      for (const project of projectsData) {
        const summary = await ProjectTrackingService.calculateProjectSummary(project.id);
        if (summary) {
          summaries[project.id] = summary;
        }
      }
      setProjectSummaries(summaries);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string, projectName: string) => {
    const confirmed = window.confirm(`هل أنت متأكد من حذف المشروع "${projectName}"؟ هذا الإجراء لا يمكن التراجع عنه.`);
    if (!confirmed) return;

    try {
      await ProjectTrackingService.deleteProject(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
      // Remove from summaries
      setProjectSummaries(prev => {
        const newSummaries = { ...prev };
        delete newSummaries[projectId];
        return newSummaries;
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('حدث خطأ في حذف المشروع');
    }
  };

  const getFilteredProjects = () => {
    if (activeTab === 'all') return projects;
    return projects.filter(project => project.status === activeTab);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in-progress': return 'secondary';
      case 'planning': return 'outline';
      case 'on-hold': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planning': return 'تخطيط';
      case 'in-progress': return 'جاري التنفيذ';
      case 'completed': return 'مكتمل';
      case 'on-hold': return 'متوقف';
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
          {getFilteredProjects().map((project) => {
            const summary = projectSummaries[project.id];
            
            return (
              <EnhancedCard key={project.id} variant="elevated" hover className="p-6 cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-800">
                      {project.name}
                    </Typography>
                    <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Home className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{project.area} متر مربع</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={getStatusBadgeVariant(project.status)}>
                      {getStatusLabel(project.status)}
                    </Badge>
                    <button 
                      className="text-blue-600 hover:text-blue-700"
                      onClick={() => router.push(`/user/comprehensive-construction-calculator?projectId=${project.id}`)}
                    >
                      <FileText className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>التقدم</span>
                    <span>{summary ? summary.completionPercentage : project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${summary ? summary.completionPercentage : project.progress}%` }}
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
                      لا توجد تقديرات محفوظة
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-4 pt-4 border-t flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => router.push(`/user/comprehensive-construction-calculator?projectId=${project.id}`)}
                    className="flex-1 flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    عرض المشروع
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteProject(project.id, project.name)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </EnhancedCard>
            );
          })}
        </div>
      </div>
    </main>
  );
}
