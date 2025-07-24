'use client';

import React, { useState } from 'react';
import { Typography, EnhancedCard, Button } from '@/core/shared/components/ui/enhanced-components';
import { BarChart3, FileText, Users, DollarSign } from 'lucide-react';

export default function ProjectsListPage() {
  const [activeTab, setActiveTab] = useState('all');
  
  const tabs = [
    { id: 'all', label: 'كل المشاريع' },
    { id: 'shared', label: 'مشاركة' },
    { id: 'not-shared', label: 'غير مشتركة' },
    { id: 'my-projects', label: 'مشاريعي ملكي' },
  ];

  const projects = [
    {
      id: '1',
      name: 'حساب',
      progress: 100,
      estimated: 250000,
      paid: 180000,
      skeleton: 120000,
      finishing: 60000,
      remaining: 70000
    },
    {
      id: '2', 
      name: 'مقرن',
      progress: 75,
      estimated: 180000,
      paid: 135000,
      skeleton: 90000,
      finishing: 45000,
      remaining: 45000
    },
    {
      id: '3',
      name: 'مشروع عمارة خالتي',
      progress: 45,
      estimated: 500000,
      paid: 225000,
      skeleton: 150000,
      finishing: 75000,
      remaining: 275000
    },
    {
      id: '4',
      name: 'بناء',
      progress: 30,
      estimated: 300000,
      paid: 90000,
      skeleton: 60000,
      finishing: 30000,
      remaining: 210000
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 font-tajawal">
      <div className="container mx-auto px-6 py-8">
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
          {projects.map((project) => (
            <EnhancedCard key={project.id} variant="elevated" hover className="p-6 cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-800">
                  {project.name}
                </Typography>
                <button className="text-blue-600 hover:text-blue-700" onClick={() => alert('Button clicked')}>
                  <FileText className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>التقدم</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Financial Details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">المقدرة:</span>
                  <span className="font-medium">{project.estimated.toLocaleString('en-US')} ر.س</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">المدفوعات:</span>
                  <span className="font-medium">{project.paid.toLocaleString('en-US')} ر.س</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">العظم:</span>
                  <span className="font-medium">{project.skeleton.toLocaleString('en-US')} ر.س</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">التشطيب:</span>
                  <span className="font-medium">{project.finishing.toLocaleString('en-US')} ر.س</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">متبقي:</span>
                  <span className="font-bold text-red-600">{project.remaining.toLocaleString('en-US')} ر.س</span>
                </div>
              </div>

              {/* Share Button */}
              <div className="mt-4 pt-4 border-t">
                <button className="w-full bg-blue-50 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors" onClick={() => alert('Button clicked')}>
                  مشاركة
                </button>
              </div>
            </EnhancedCard>
          ))}
        </div>
      </div>
    </main>
  );
}
