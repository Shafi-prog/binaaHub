'use client';

import React from 'react';
import { Project } from '../../models/Project';

interface ProjectKPIsProps {
  project: Project;
}

type ChangeType = 'positive' | 'negative' | 'neutral';

export function ProjectKPIs({ project }: ProjectKPIsProps) {
  // Calculate KPIs
  const totalBudget = project.budget || 0;
  const daysElapsed = project.startDate 
    ? Math.floor((new Date().getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const expectedDuration = project.expectedCompletion && project.startDate
    ? Math.floor((new Date(project.expectedCompletion).getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const progress = expectedDuration > 0 ? Math.min((daysElapsed / expectedDuration) * 100, 100) : 0;

  const kpis = [
    {
      title: 'Total Budget',
      value: `$${totalBudget.toLocaleString()}`,
      change: '+2.5%',
      changeType: 'positive' as ChangeType,
      icon: '💰'
    },
    {
      title: 'Project Progress',
      value: `${Math.round(progress)}%`,
      change: '+5.2%',
      changeType: 'positive' as ChangeType,
      icon: '📊'
    },
    {
      title: 'Days Elapsed',
      value: `${daysElapsed}`,
      change: `${expectedDuration - daysElapsed} remaining`,
      changeType: 'neutral' as ChangeType,
      icon: '📅'
    },
    {
      title: 'Team Members',
      value: '8',
      change: '+2 this week',
      changeType: 'positive' as ChangeType,
      icon: '👥'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpis.map((kpi, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
              <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            </div>
            <div className="text-2xl">{kpi.icon}</div>
          </div>
          <div className="mt-2">
            <span
              className={`text-sm ${
                kpi.changeType === 'positive'
                  ? 'text-green-600'
                  : kpi.changeType === 'negative'
                  ? 'text-red-600'
                  : 'text-gray-600'
              }`}
            >
              {kpi.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
