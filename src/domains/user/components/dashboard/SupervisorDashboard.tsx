'use client';

import React from 'react';
import Link from 'next/link';

export function SupervisorDashboard() {
  const availableJobs = [
    {
      id: 'job_001',
      projectName: 'Downtown Office Complex',
      location: 'Downtown District',
      stage: 'Foundation',
      duration: '2 weeks',
      rate: '$150/day',
      skills: ['Concrete', 'Foundation Work', 'Quality Control']
    },
    {
      id: 'job_002', 
      projectName: 'Shopping Mall Extension',
      location: 'North Side',
      stage: 'Structural Framing',
      duration: '3 weeks',
      rate: '$175/day',
      skills: ['Steel Work', 'Structural', 'Safety Management']
    }
  ];

  const currentProjects = [
    {
      id: 'proj_sup_001',
      name: 'Residential Villa',
      owner: 'Ahmed Hassan',
      stage: 'Roofing',
      progress: 75,
      startDate: '2025-07-15',
      expectedEnd: '2025-08-30'
    }
  ];

  const completedJobs = [
    { projectName: 'Office Building A', rating: 4.8, earnings: 4200, duration: '28 days' },
    { projectName: 'Warehouse Complex', rating: 4.9, earnings: 3600, duration: '24 days' },
    { projectName: 'Retail Store', rating: 4.7, earnings: 2100, duration: '14 days' }
  ];

  const totalEarnings = completedJobs.reduce((sum, job) => sum + job.earnings, 0);
  const avgRating = completedJobs.reduce((sum, job) => sum + job.rating, 0) / completedJobs.length;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-medium">📋</span>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Available Jobs</div>
              <div className="text-2xl font-bold text-gray-900">{availableJobs.length}</div>
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
              <div className="text-sm font-medium text-gray-500">Total Earnings</div>
              <div className="text-2xl font-bold text-gray-900">${totalEarnings.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-medium">⭐</span>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Avg Rating</div>
              <div className="text-2xl font-bold text-gray-900">{avgRating.toFixed(1)}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-medium">🏗️</span>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Active Projects</div>
              <div className="text-2xl font-bold text-gray-900">{currentProjects.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Jobs */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Available Jobs</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {availableJobs.map((job) => (
                <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{job.projectName}</h4>
                      <p className="text-sm text-gray-600">{job.location} • {job.stage}</p>
                    </div>
                    <span className="text-lg font-bold text-green-600">{job.rate}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Duration:</span>
                      <span className="text-gray-900">{job.duration}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {job.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    <button className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                      Apply for Job
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Current Projects */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Current Projects</h3>
            </div>
            <div className="p-6">
              {currentProjects.length > 0 ? (
                <div className="space-y-4">
                  {currentProjects.map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <Link 
                          href={`/projects/${project.id}`}
                          className="text-lg font-medium text-blue-600 hover:text-blue-800"
                        >
                          {project.name}
                        </Link>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                          Active
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Owner: {project.owner}</p>
                        <p className="text-sm text-gray-600">Stage: {project.stage}</p>
                        
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          <span>Started: {project.startDate}</span>
                          <br />
                          <span>Expected End: {project.expectedEnd}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No active projects</p>
              )}
            </div>
          </div>

          {/* Completed Jobs */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Completed Jobs</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {completedJobs.map((job, index) => (
                  <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{job.projectName}</p>
                      <p className="text-xs text-gray-500">{job.duration}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">${job.earnings}</p>
                      <div className="flex items-center">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-xs text-gray-600 ml-1">{job.rating}</span>
                      </div>
                    </div>
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
