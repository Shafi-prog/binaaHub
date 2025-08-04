'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ProjectNavigationProps {
  projectId: string;
  currentPath?: string;
}

export function ProjectNavigation({ projectId, currentPath }: ProjectNavigationProps) {
  const router = useRouter();

  const navigationItems = [
    {
      name: 'Overview',
      href: `/projects/${projectId}`,
      icon: '🏠',
      current: currentPath === 'overview'
    },
    {
      name: 'Stages',
      href: `/projects/${projectId}/stages`,
      icon: '📈',
      current: currentPath === 'stages'
    },
    {
      name: 'Materials',
      href: `/projects/${projectId}/materials`,
      icon: '🧱',
      current: currentPath === 'materials'
    },
    {
      name: 'Team',
      href: `/projects/${projectId}/team`,
      icon: '👥',
      current: currentPath === 'team'
    },
    {
      name: 'Expenses',
      href: `/projects/${projectId}/expenses`,
      icon: '💰',
      current: currentPath === 'expenses'
    },
    {
      name: 'Marketplace',
      href: `/projects/${projectId}/marketplace`,
      icon: '🛒',
      current: currentPath === 'marketplace'
    },
    {
      name: 'Services',
      href: `/projects/${projectId}/services`,
      icon: '🔧',
      current: currentPath === 'services'
    },
    {
      name: 'Warranties',
      href: `/projects/${projectId}/warranties`,
      icon: '📋',
      current: currentPath === 'warranties'
    },
    {
      name: 'Documents',
      href: `/projects/${projectId}/documents`,
      icon: '📁',
      current: currentPath === 'documents'
    },
    {
      name: 'Reports',
      href: `/projects/${projectId}/reports`,
      icon: '📊',
      current: currentPath === 'reports'
    }
  ];

  return (
    <nav className="bg-white shadow rounded-lg mb-6">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`${
                item.current
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
