'use client';

import React from 'react';
import { useProjectStages } from '../../hooks/useProject';

interface ProjectStageTrackerProps {
  projectId: string;
}

export function ProjectStageTracker({ projectId }: ProjectStageTrackerProps) {
  const { stages, loading, error } = useProjectStages(projectId);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Stages</h3>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Stages</h3>
        <p className="text-red-600">Error loading stages: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Project Stages</h3>
        <span className="text-sm text-gray-500">
          {stages.filter(s => s.status === 'completed').length} / {stages.length} completed
        </span>
      </div>
      
      <div className="space-y-3">
        {stages.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No stages defined yet</p>
        ) : (
          stages.map((stage, index) => (
            <div key={stage.id} className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                stage.status === 'completed' ? 'bg-green-100 text-green-800' :
                stage.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-600'
              }`}>
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{stage.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    stage.status === 'completed' ? 'bg-green-100 text-green-800' :
                    stage.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {stage.status.replace('_', ' ')}
                  </span>
                </div>
                {stage.description && (
                  <p className="text-sm text-gray-600 mt-1">{stage.description}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      {stages.length > 0 && (
        <div className="mt-4">
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(stages.filter(s => s.status === 'completed').length / stages.length) * 100}%` 
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}

// Also export as StageTracker for backward compatibility
export const StageTracker = ProjectStageTracker;
