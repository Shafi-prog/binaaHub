'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Typography, EnhancedCard, Button } from '@/core/shared/components/ui/enhanced-components';
import { BarChart3, FileText, Users, DollarSign, ChevronLeft, Plus } from 'lucide-react';
import { ProjectTrackingService } from '@/core/services/projectTrackingService';
import { useAuth } from '@/core/shared/auth/AuthProvider';

export default function ProjectsListPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    ProjectTrackingService.getProjects(user.id).then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, [user]);

  const tabs = [
    { id: 'all', label: 'كل المشاريع' },
    { id: 'shared', label: 'مشاركة' },
    { id: 'not-shared', label: 'غير مشتركة' },
    { id: 'my-projects', label: 'مشاريعي ملكي' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-xl">
        <div>Loading projects...</div>
        <div className="mt-4 text-sm text-gray-500">User ID: {user?.id || 'No user'}</div>
      </div>
    );
  }

  // Debug output for fetched projects
  console.log('Current user:', user);
  console.log('Fetched projects:', projects);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 font-tajawal">
      <div className="container mx-auto px-6 py-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/user/dashboard" className="hover:text-blue-600 transition-colors">
              لوحة التحكم
            </Link>
            <ChevronLeft className="w-4 h-4" />
            <span className="text-gray-900 font-medium">مشاريعي</span>
          </div>
          <div className="flex gap-2">
            <Link href="/user/projects/create">
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                مشروع جديد
              </Button>
            </Link>
            <Link href="/user/projects/calculator">
              <Button variant="outline" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                حاسبة التكلفة
              </Button>
            </Link>
          </div>
        </div>
        <Typography variant="heading" size="2xl" weight="bold" className="text-gray-800 mb-6">
          مشاريعي
        </Typography>
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
          {projects.length === 0 && (
            <div className="col-span-full text-center text-gray-400">No projects found for this user.</div>
          )}
          {projects.map((project) => (
            <EnhancedCard key={project.id} variant="elevated" hover className="p-6 cursor-pointer bg-gray-900 text-white">
              <div className="flex justify-between items-start mb-4">
                <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-100">
                  {project.name}
                </Typography>
                {/* Display button now says 'عرض' and routes to the correct details page */}
                <Link href={`/user/projects/${project.id}`} className="text-blue-400 hover:text-blue-200">
                  <span title="عرض"><FileText className="w-5 h-5" /></span>
                </Link>
              </div>
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{project.progress || 0}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${project.progress || 0}%` }}
                  ></div>
                </div>
              </div>
              {/* Financial Details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Budget:</span>
                  <span className="font-medium">{project.budget ? project.budget.toLocaleString('en-US') : 0} SAR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Location:</span>
                  <span className="font-medium">{project.location || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Level:</span>
                  <span className="font-medium">{project.stage || '-'}</span>
                </div>
              </div>
              {/* Actions */}
              <div className="mt-4 pt-4 border-t flex gap-2">
                <Link href={`/user/projects/${project.id}/edit`} className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-2 rounded text-center">تعديل</Link>
                {/* Fix: 'عرض' button now always routes to the project details page */}
                <Link href={`/user/projects/${project.id}`} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-2 rounded text-center">عرض</Link>
                <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-2 rounded" onClick={() => alert('Delete project')}>حذف</button>
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-2 rounded" onClick={() => alert('Advertise project')}>إعلان</button>
              </div>
            </EnhancedCard>
          ))}
        </div>
      </div>
    </main>
  );
}
