'use client';

import React, { useState } from 'react';
import { useProject } from '@/domains/projects/hooks/useProject';

interface TeamCollaborationProps {
  projectId: string;
}

export function TeamCollaboration({ projectId }: TeamCollaborationProps) {
  const { project } = useProject(projectId);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('contractor');

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // This would call the project service to invite a team member
      console.log(`Inviting ${newMemberEmail} as ${newMemberRole} to project ${projectId}`);
      setNewMemberEmail('');
      setNewMemberRole('contractor');
    } catch (error) {
      console.error('Failed to invite team member:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Team Invitation */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Invite Team Member</h3>
        <form onSubmit={handleInviteMember} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter team member's email"
              required
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="role"
              value={newMemberRole}
              onChange={(e) => setNewMemberRole(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="contractor">Contractor</option>
              <option value="supervisor">Supervisor</option>
              <option value="architect">Architect</option>
              <option value="engineer">Engineer</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send Invitation
          </button>
        </form>
      </div>

      {/* Activity Feed */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">JD</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                <span className="font-medium">John Doe</span> uploaded progress photos for Foundation stage
              </p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">SM</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                <span className="font-medium">Sarah Miller</span> marked Excavation stage as complete
              </p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">MB</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                <span className="font-medium">Mike Brown</span> added materials to inventory
              </p>
              <p className="text-xs text-gray-500">2 days ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Notifications */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Send Team Notification</h3>
        <form className="space-y-4">
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              id="message"
              rows={3}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Send a message to your team..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Send Notification
          </button>
        </form>
      </div>
    </div>
  );
}
