'use client';

import React, { useState } from 'react';
import { useProject } from '../../hooks/useProject';

interface ProjectSettingsProps {
  projectId: string;
}

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  type: 'email' | 'sms' | 'push';
}

export function ProjectSettings({ projectId }: ProjectSettingsProps) {
  const { project, updateProject } = useProject(projectId);
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);

  // Mock project settings data
  const [projectData, setProjectData] = useState({
    name: project?.name || 'My Construction Project',
    description: project?.description || 'Modern residential building construction',
    type: project?.type || 'residential',
    budget: project?.budget || 500000,
    startDate: project?.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '2024-01-15',
    expectedCompletion: project?.expectedCompletion ? new Date(project.expectedCompletion).toISOString().split('T')[0] : '2024-12-31',
    location: project?.location || 'Dubai, UAE',
    isPublic: false,
    allowMarketplace: true,
    enableAI: true
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: 'progress_updates',
      label: 'Progress Updates',
      description: 'Get notified when project milestones are completed',
      enabled: true,
      type: 'email'
    },
    {
      id: 'team_messages',
      label: 'Team Messages',
      description: 'Receive notifications for team communications',
      enabled: true,
      type: 'push'
    },
    {
      id: 'material_alerts',
      label: 'Material Alerts',
      description: 'Notifications for low inventory and delivery updates',
      enabled: true,
      type: 'email'
    },
    {
      id: 'budget_warnings',
      label: 'Budget Warnings',
      description: 'Alerts when spending approaches budget limits',
      enabled: true,
      type: 'sms'
    },
    {
      id: 'weather_updates',
      label: 'Weather Updates',
      description: 'Weather conditions that might affect construction',
      enabled: false,
      type: 'push'
    }
  ]);

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'permissions', label: 'Permissions', icon: '🔐' },
    { id: 'danger', label: 'Danger Zone', icon: '⚠️' }
  ];

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updateData = {
        ...projectData,
        startDate: new Date(projectData.startDate),
        expectedCompletion: new Date(projectData.expectedCompletion)
      };
      await updateProject(updateData);
      // Show success message in real app
      console.log('Project updated successfully');
    } catch (error) {
      console.error('Failed to update project:', error);
      // Show error message in real app
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationToggle = (settingId: string) => {
    setNotificationSettings(prev =>
      prev.map(setting =>
        setting.id === settingId
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
  };

  const handleDeleteProject = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this project? This action cannot be undone.'
    );
    
    if (confirmed) {
      try {
        // Mock project deletion
        console.log(`Deleting project ${projectId}`);
        // Redirect to projects list in real app
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  const renderGeneralSettings = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Project Information</h3>
      <form onSubmit={handleUpdateProject} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Project Name
            </label>
            <input
              type="text"
              id="name"
              value={projectData.name}
              onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              value={projectData.type}
              onChange={(e) => setProjectData({ ...projectData, type: e.target.value as 'residential' | 'commercial' | 'renovation' })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="industrial">Industrial</option>
              <option value="infrastructure">Infrastructure</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            value={projectData.description}
            onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
              Budget (AED)
            </label>
            <input
              type="number"
              id="budget"
              value={projectData.budget}
              onChange={(e) => setProjectData({ ...projectData, budget: Number(e.target.value) })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={projectData.startDate}
              onChange={(e) => setProjectData({ ...projectData, startDate: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={projectData.expectedCompletion}
              onChange={(e) => setProjectData({ ...projectData, expectedCompletion: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={projectData.location}
            onChange={(e) => setProjectData({ ...projectData, location: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="City, Country"
          />
        </div>

        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900">Project Features</h4>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={projectData.isPublic}
                onChange={(e) => setProjectData({ ...projectData, isPublic: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Make project publicly visible</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={projectData.allowMarketplace}
                onChange={(e) => setProjectData({ ...projectData, allowMarketplace: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Enable marketplace integration</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={projectData.enableAI}
                onChange={(e) => setProjectData({ ...projectData, enableAI: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Enable AI assistance features</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Notification Preferences</h3>
      <div className="space-y-4">
        {notificationSettings.map((setting) => (
          <div key={setting.id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">{setting.label}</h4>
              <p className="text-sm text-gray-500">{setting.description}</p>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                {setting.type.toUpperCase()}
              </span>
            </div>
            <button
              onClick={() => handleNotificationToggle(setting.id)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                setting.enabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  setting.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPermissions = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Project Permissions</h3>
      <div className="space-y-6">
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">Team Access Levels</h4>
          <div className="space-y-3">
            {[
              { role: 'Project Owner', permissions: 'Full access to all features', count: 1 },
              { role: 'Supervisor', permissions: 'Manage progress, team, and materials', count: 2 },
              { role: 'Contractor', permissions: 'Update progress and upload reports', count: 5 },
              { role: 'Viewer', permissions: 'Read-only access to project data', count: 3 }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.role}</p>
                  <p className="text-sm text-gray-500">{item.permissions}</p>
                </div>
                <span className="text-sm text-gray-500">{item.count} members</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">Data Sharing</h4>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                defaultChecked={true}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Share project statistics with team</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                defaultChecked={false}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Allow external API access</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                defaultChecked={true}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Enable project analytics</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDangerZone = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-red-600 mb-6">Danger Zone</h3>
      <div className="space-y-6">
        <div className="border border-red-200 rounded-lg p-4">
          <h4 className="text-md font-medium text-gray-900 mb-2">Archive Project</h4>
          <p className="text-sm text-gray-600 mb-4">
            Archive this project to remove it from active projects. You can restore it later.
          </p>
          <button className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors">
            Archive Project
          </button>
        </div>

        <div className="border border-red-300 rounded-lg p-4">
          <h4 className="text-md font-medium text-red-600 mb-2">Delete Project</h4>
          <p className="text-sm text-gray-600 mb-4">
            Permanently delete this project and all associated data. This action cannot be undone.
          </p>
          <button 
            onClick={handleDeleteProject}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Delete Project
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'permissions':
        return renderPermissions();
      case 'danger':
        return renderDangerZone();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
}
