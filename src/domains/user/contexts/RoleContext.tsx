'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserRole = 'project_owner' | 'supervisor' | 'store_owner' | 'admin';

interface Permission {
  action: string;
  resource: string;
}

interface RoleContextType {
  currentRole: UserRole;
  availableRoles: UserRole[];
  switchRole: (role: UserRole) => void;
  rolePermissions: Permission[];
  hasPermission: (action: string, resource: string) => boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  project_owner: [
    { action: 'read', resource: 'project' },
    { action: 'write', resource: 'project' },
    { action: 'delete', resource: 'project' },
    { action: 'invite', resource: 'team' },
    { action: 'purchase', resource: 'materials' }
  ],
  supervisor: [
    { action: 'read', resource: 'project' },
    { action: 'write', resource: 'progress' },
    { action: 'upload', resource: 'images' },
    { action: 'report', resource: 'issues' }
  ],
  store_owner: [
    { action: 'read', resource: 'orders' },
    { action: 'write', resource: 'products' },
    { action: 'manage', resource: 'inventory' },
    { action: 'view', resource: 'analytics' }
  ],
  admin: [
    { action: '*', resource: '*' } // Admin has all permissions
  ]
};

export function RoleProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>('project_owner');
  const [availableRoles] = useState<UserRole[]>(['project_owner', 'supervisor']); // This would come from user data

  const switchRole = (role: UserRole) => {
    if (availableRoles.includes(role)) {
      setCurrentRole(role);
    }
  };

  const rolePermissions = ROLE_PERMISSIONS[currentRole] || [];

  const hasPermission = (action: string, resource: string) => {
    return rolePermissions.some(
      permission => 
        (permission.action === '*' || permission.action === action) &&
        (permission.resource === '*' || permission.resource === resource)
    );
  };

  return (
    <RoleContext.Provider
      value={{
        currentRole,
        availableRoles,
        switchRole,
        rolePermissions,
        hasPermission
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
