export interface UserRole {
  id: string;
  type: 'project_owner' | 'supervisor' | 'contractor' | 'worker' | 'store' | 'service_provider' | 'admin';
  label: string;
  permissions: string[];
  isActive: boolean;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
  verificationDocuments?: string[];
}

export interface MultiRoleUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  primaryRole: UserRole;
  additionalRoles: UserRole[];
  currentActiveRole: string; // Current role being used
  isVerified: boolean;
  registrationDate: string;
}

export interface RoleCapabilities {
  canCreateProjects: boolean;
  canManageTeam: boolean;
  canViewMarketplace: boolean;
  canManageStore: boolean;
  canProvideServices: boolean;
  canCreateContracts: boolean;
  canViewFinancials: boolean;
  canGenerateReports: boolean;
}

export const ROLE_DEFINITIONS: Record<string, RoleCapabilities> = {
  project_owner: {
    canCreateProjects: true,
    canManageTeam: true,
    canViewMarketplace: true,
    canManageStore: false,
    canProvideServices: false,
    canCreateContracts: true,
    canViewFinancials: true,
    canGenerateReports: true,
  },
  supervisor: {
    canCreateProjects: true,
    canManageTeam: true,
    canViewMarketplace: true,
    canManageStore: false,
    canProvideServices: true,
    canCreateContracts: true,
    canViewFinancials: true,
    canGenerateReports: true,
  },
  contractor: {
    canCreateProjects: false,
    canManageTeam: true,
    canViewMarketplace: true,
    canManageStore: false,
    canProvideServices: true,
    canCreateContracts: true,
    canViewFinancials: true,
    canGenerateReports: false,
  },
  worker: {
    canCreateProjects: false,
    canManageTeam: false,
    canViewMarketplace: true,
    canManageStore: false,
    canProvideServices: true,
    canCreateContracts: false,
    canViewFinancials: false,
    canGenerateReports: false,
  },
  store: {
    canCreateProjects: false,
    canManageTeam: false,
    canViewMarketplace: true,
    canManageStore: true,
    canProvideServices: false,
    canCreateContracts: true,
    canViewFinancials: true,
    canGenerateReports: true,
  },
  service_provider: {
    canCreateProjects: false,
    canManageTeam: true,
    canViewMarketplace: true,
    canManageStore: true,
    canProvideServices: true,
    canCreateContracts: true,
    canViewFinancials: true,
    canGenerateReports: true,
  },
  admin: {
    canCreateProjects: true,
    canManageTeam: true,
    canViewMarketplace: true,
    canManageStore: true,
    canProvideServices: true,
    canCreateContracts: true,
    canViewFinancials: true,
    canGenerateReports: true,
  },
};
