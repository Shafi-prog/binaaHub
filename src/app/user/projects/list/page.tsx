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
  
  // Mock data for now
  const projects = [
    {
      id: '1',
      name: 'مشروع فيلا العائلة',
      description: 'بناء فيلا سكنية بمساحة 300 متر مربع',
      status: 'in-progress',
      budget: 500000,
      location: 'الرياض'
    },
    {
      id: '2', 
      name: 'مشروع مكتب تجاري',
      description: 'تجديد مكتب تجاري في وسط المدينة',
      status: 'planning',
      budget: 200000,
      location: 'جدة'
    }
  ];
  const isLoading = false;
  const error = null;
  const stats = { total: 2, active: 1, completed: 0 };
  
  const [projectSummaries, setProjectSummaries] = useState<{ [key: string]: ProjectSummary }>({});
  
  const tabs = [
    { id: 'all', label: 'كل المشاريع' },
    { id: 'planning', label: 'تخطيط' },
    { id: 'in-progress', label: 'جاري التنفيذ' },
    { id: 'completed', label: 'مكتملة' },
  ];

  useEffect(() => {
    // Only load project summaries since projects come from context
    if (projects && projects.length > 0) {
      loadProjectSummaries();
    }
  }, [projects]);

  const loadProjectSummaries = async () => {
    try {
      const summariesData: { [key: string]: ProjectSummary } = {};
      for (const project of projects) {
        // Mock summary data since service method doesn't exist
        summariesData[project.id] = {
          projectId: project.id,
          totalEstimatedCost: project.budget,
          totalSpentCost: project.budget * 0.7,
          remainingCost: project.budget * 0.3,
          completionPercentage: Math.floor(Math.random() * 100),
          materialProgress: {},
          phaseProgress: {
            foundation: { estimated: project.budget * 0.2, spent: project.budget * 0.15, completion: 75 },
            structure: { estimated: project.budget * 0.3, spent: project.budget * 0.25, completion: 80 },
            finishing: { estimated: project.budget * 0.25, spent: project.budget * 0.1, completion: 40 },
            electrical: { estimated: project.budget * 0.15, spent: project.budget * 0.1, completion: 65 },
            plumbing: { estimated: project.budget * 0.1, spent: project.budget * 0.05, completion: 50 }
          }
        };
      }
      setProjectSummaries(summariesData);
    } catch (error) {
      console.error('Error loading project summaries:', error);
    }
  };

  const loadProjects = async () => {
    // No longer needed since data comes from UserDataContext
    return;
  };    const handleDeleteProject = async (projectId: string) => {
    // This would be handled by the UserDataContext in a real implementation
    console.log('Delete project:', projectId);
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
                      <span className="text-sm text-gray-600">{project.budget?.toLocaleString('ar-SA')} ريال</span>
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
                    <span>{summary ? summary.completionPercentage : 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
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
                    onClick={() => handleDeleteProject(project.id)}
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
