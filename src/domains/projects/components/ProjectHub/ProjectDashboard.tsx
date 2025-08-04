
'use client';

import React from 'react';
import { useProject } from '../../hooks/useProject';
import { ProjectStageTracker } from '../ProjectStages/StageTracker';
import { MaterialInventory } from '../ProjectMaterials/MaterialInventory';
import { ProjectTeamOverview } from '../ProjectTeam/TeamMemberList';
import { ProjectExpensesSummary } from '../ProjectExpenses/BudgetTracker';

interface ProjectHubProps {
  projectId: string;
}

export function ProjectHub({ projectId }: ProjectHubProps) {
  const { project, loading, error } = useProject(projectId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Project</h3>
        <p className="text-red-600">{error || 'Project not found'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600 mt-1">{project.description}</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              project.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : project.status === 'planning'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {project.status}
            </span>
          </div>
        </div>
      </div>

      {/* Project Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Budget</h3>
          <p className="text-2xl font-bold text-gray-900">
            ${project.budget?.toLocaleString() || '0'}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h3 className="text-sm font-medium text-gray-500">Progress</h3>
          <p className="text-2xl font-bold text-gray-900">
            {/* Calculate progress based on project status */}
            {project.status === 'completed' ? '100' : 
             project.status === 'active' ? '65' : 
             project.status === 'planning' ? '10' : '0'}%
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h3 className="text-sm font-medium text-gray-500">Start Date</h3>
          <p className="text-lg font-semibold text-gray-900">
            {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not set'}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h3 className="text-sm font-medium text-gray-500">Deadline</h3>
          <p className="text-lg font-semibold text-gray-900">
            {project.expectedCompletion ? new Date(project.expectedCompletion).toLocaleDateString() : 'TBD'}
          </p>
        </div>
      </div>

      {/* Project Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectStageTracker projectId={projectId} />
        <ProjectExpensesSummary projectId={projectId} />
        <MaterialInventory projectId={projectId} />
        <ProjectTeamOverview projectId={projectId} />
      </div>
    </div>
  );
}

// Also export as ProjectDashboard for backward compatibility
export const ProjectDashboard = ProjectHub;
