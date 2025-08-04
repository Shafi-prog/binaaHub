'use client';

import React from 'react';
import { useRole } from '@/domains/user/contexts/RoleContext';
import { ProjectOwnerDashboard } from './ProjectOwnerDashboard';
import { SupervisorDashboard } from './SupervisorDashboard';
import { StoreOwnerDashboard } from './StoreOwnerDashboard';
import { AdminDashboard } from './AdminDashboard';

export function RoleDashboard() {
  const { currentRole } = useRole();

  const renderDashboard = () => {
    switch (currentRole) {
      case 'project_owner':
        return <ProjectOwnerDashboard />;
      case 'supervisor':
        return <SupervisorDashboard />;
      case 'store_owner':
        return <StoreOwnerDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <ProjectOwnerDashboard />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          {currentRole === 'project_owner' && 'Project Owner Dashboard'}
          {currentRole === 'supervisor' && 'Supervisor Dashboard'}
          {currentRole === 'store_owner' && 'Store Owner Dashboard'}
          {currentRole === 'admin' && 'Admin Dashboard'}
        </h1>
      </div>
      
      {renderDashboard()}
    </div>
  );
}
