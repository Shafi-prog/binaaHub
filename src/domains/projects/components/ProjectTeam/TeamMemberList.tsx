'use client';

import React from 'react';

interface ProjectTeamOverviewProps {
  projectId: string;
}

interface TeamMember {
  id: string;
  name?: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
}

export function ProjectTeamOverview({ projectId }: ProjectTeamOverviewProps) {
  // For now, we'll create a simple placeholder since we need project team hook
  const teamMembers: TeamMember[] = []; // This would come from useProjectTeam hook
  const loading = false;
  const error = null;

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Team</h3>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Team</h3>
        <p className="text-red-600">Error loading team: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Project Team</h3>
        <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Invite Member
        </button>
      </div>
      
      <div className="space-y-3">
        {teamMembers.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <p className="text-gray-500 mb-2">No team members yet</p>
            <p className="text-sm text-gray-400">Invite contractors, supervisors, and other team members</p>
          </div>
        ) : (
          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-sm">
                    {member.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{member.name || 'Unknown'}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="capitalize">{member.role}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      member.status === 'active' ? 'bg-green-100 text-green-800' :
                      member.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {member.status}
                    </span>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-gray-900">{teamMembers.length}</p>
            <p className="text-sm text-gray-500">Team Members</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">
              {teamMembers.filter(m => m.status === 'active').length}
            </p>
            <p className="text-sm text-gray-500">Active</p>
          </div>
        </div>
      </div>
    </div>
  );
}
