'use client';

import React from 'react';
import { useProject } from '@/domains/projects/hooks/useProject';
import Link from 'next/link';

export function ProjectOwnerDashboard() {
  // This would use actual user data in real implementation
  const mockProjects = [
    {
      id: 'proj_001',
      name: 'Downtown Office Complex',
      status: 'active',
      progress: 65,
      budget: 500000,
      spent: 325000,
      nextMilestone: 'Foundation Completion',
      dueDate: '2025-09-15'
    },
    {
      id: 'proj_002',
      name: 'Residential Villa',
      status: 'planning',
      progress: 15,
      budget: 350000,
      spent: 52500,
      nextMilestone: 'Permit Approval',
      dueDate: '2025-08-20'
    }
  ];

  const upcomingPayments = [
    { description: 'Concrete Delivery', amount: 15000, dueDate: '2025-08-10' },
    { description: 'Labor Payment', amount: 8000, dueDate: '2025-08-12' },
    { description: 'Equipment Rental', amount: 2500, dueDate: '2025-08-15' }
  ];

  const teamUpdates = [
    { message: 'Foundation work started on Downtown Office', time: '2 hours ago', type: 'progress' },
    { message: 'New supervisor assigned to Villa project', time: '4 hours ago', type: 'team' },
    { message: 'Material delivery delayed by 1 day', time: '6 hours ago', type: 'delay' }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-medium">🏗️</span>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Active Projects</div>
              <div className="text-2xl font-bold text-gray-900">{mockProjects.length}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-medium">💰</span>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Total Budget</div>
              <div className="text-2xl font-bold text-gray-900">
                ${mockProjects.reduce((sum, p) => sum + p.budget, 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-medium">📊</span>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Avg Progress</div>
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(mockProjects.reduce((sum, p) => sum + p.progress, 0) / mockProjects.length)}%
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-medium">⚠️</span>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Pending Payments</div>
              <div className="text-2xl font-bold text-gray-900">{upcomingPayments.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">My Projects</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {mockProjects.map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Link 
                      href={`/projects/${project.id}`}
                      className="text-lg font-medium text-blue-600 hover:text-blue-800"
                    >
                      {project.name}
                    </Link>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      project.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Budget: ${project.budget.toLocaleString()}</span>
                      <span>Spent: ${project.spent.toLocaleString()}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>Next:</strong> {project.nextMilestone} - {project.dueDate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Updates */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Updates</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {teamUpdates.map((update, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                      update.type === 'progress' ? 'bg-green-400' :
                      update.type === 'team' ? 'bg-blue-400' : 'bg-yellow-400'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{update.message}</p>
                      <p className="text-xs text-gray-500">{update.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Upcoming Payments</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {upcomingPayments.map((payment, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{payment.description}</p>
                      <p className="text-xs text-gray-500">Due: {payment.dueDate}</p>
                    </div>
                    <span className="text-lg font-medium text-gray-900">
                      ${payment.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
