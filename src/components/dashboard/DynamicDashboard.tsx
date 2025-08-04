'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useUserData } from '@/core/shared/contexts/UserDataContext';
import { ROLE_DEFINITIONS, type MultiRoleUser, type UserRole } from '@/core/shared/types/roles';
import { 
  Building2, 
  ShoppingCart, 
  Wallet, 
  Users, 
  Store, 
  Settings,
  FileText,
  BarChart3,
  UserCheck,
  ChevronDown 
} from 'lucide-react';

// Tab Components (to be created)
import ProjectsTab from './tabs/ProjectsTab';
import MarketplaceTab from './tabs/MarketplaceTab';
import FinanceTab from './tabs/FinanceTab';
import WorkforceTab from './tabs/WorkforceTab';
import StoreTab from './tabs/StoreTab';
import ReportsTab from './tabs/ReportsTab';
import SettingsTab from './tabs/SettingsTab';

interface DashboardTab {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType<any>;
  requiredCapability: keyof typeof ROLE_DEFINITIONS[string];
}

const ALL_TABS: DashboardTab[] = [
  {
    id: 'projects',
    label: 'المشاريع',
    icon: Building2,
    component: ProjectsTab,
    requiredCapability: 'canCreateProjects'
  },
  {
    id: 'marketplace',
    label: 'السوق',
    icon: ShoppingCart,
    component: MarketplaceTab,
    requiredCapability: 'canViewMarketplace'
  },
  {
    id: 'finance',
    label: 'المالية',
    icon: Wallet,
    component: FinanceTab,
    requiredCapability: 'canViewFinancials'
  },
  {
    id: 'workforce',
    label: 'فريق العمل',
    icon: Users,
    component: WorkforceTab,
    requiredCapability: 'canManageTeam'
  },
  {
    id: 'store',
    label: 'المتجر',
    icon: Store,
    component: StoreTab,
    requiredCapability: 'canManageStore'
  },
  {
    id: 'reports',
    label: 'التقارير',
    icon: BarChart3,
    component: ReportsTab,
    requiredCapability: 'canGenerateReports'
  },
  {
    id: 'settings',
    label: 'الإعدادات',
    icon: Settings,
    component: SettingsTab,
    requiredCapability: 'canViewMarketplace' // Everyone can access settings
  }
];

export default function DynamicDashboard() {
  const { profile, projects } = useUserData();
  const [activeTab, setActiveTab] = useState('projects');
  const [currentRole, setCurrentRole] = useState<string>('project_owner');
  const [availableTabs, setAvailableTabs] = useState<DashboardTab[]>([]);
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  // Determine user roles based on profile and projects
  const userRoles: UserRole[] = useMemo(() => {
    const roles: UserRole[] = [];
    
    // Basic role based on having projects
    if (projects && projects.length > 0) {
      roles.push({
        id: 'role-1',
        type: 'project_owner',
        label: 'مالك مشروع',
        permissions: [],
        isActive: true
      });
    }
    
    // Add admin role for certain users (this would come from database)
    if (profile?.email === 'admin@binaa.com') {
      roles.push({
        id: 'role-admin',
        type: 'admin',
        label: 'مدير النظام',
        permissions: [],
        isActive: false
      });
    }
    
    // Default role for all users
    if (roles.length === 0) {
      roles.push({
        id: 'role-default',
        type: 'project_owner',
        label: 'مالك مشروع',
        permissions: [],
        isActive: true
      });
    }
    
    return roles;
  }, [profile, projects]);

  // Create user object from profile data
  const currentUser: MultiRoleUser = useMemo(() => {
    if (!profile) {
      return {
        id: 'guest-user',
        email: 'guest@example.com',
        name: 'مستخدم ضيف',
        phone: '',
        primaryRole: {
          id: 'role-1',
          type: 'project_owner',
          label: 'مالك مشروع',
          permissions: [],
          isActive: true
        },
        additionalRoles: [],
        currentActiveRole: 'project_owner',
        isVerified: false,
        registrationDate: new Date().toISOString().split('T')[0]
      };
    }

    const primaryRole = userRoles[0] || {
      id: 'role-default',
      type: 'project_owner' as const,
      label: 'مالك مشروع',
      permissions: [],
      isActive: true
    };

    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      phone: profile.phone || '',
      primaryRole: primaryRole,
      additionalRoles: userRoles.slice(1),
      currentActiveRole: currentRole,
      isVerified: true,
      registrationDate: profile.memberSince
    };
  }, [profile, userRoles, currentRole]);

  useEffect(() => {
    // Filter tabs based on current role capabilities
    const roleCapabilities = ROLE_DEFINITIONS[currentRole];
    if (roleCapabilities) {
      const filteredTabs = ALL_TABS.filter(tab => 
        roleCapabilities[tab.requiredCapability]
      );
      setAvailableTabs(filteredTabs);
      
      // Set first available tab as active if current tab is not available
      if (!filteredTabs.find(tab => tab.id === activeTab)) {
        setActiveTab(filteredTabs[0]?.id || 'projects');
      }
    }
  }, [currentRole, activeTab]);

  const handleRoleSwitch = (newRole: string) => {
    setCurrentRole(newRole);
    setShowRoleSelector(false);
    // In real implementation, this would update the user context
  };

  const currentTab = availableTabs.find(tab => tab.id === activeTab);
  const TabComponent = currentTab?.component || ProjectsTab;

  const getAllUserRoles = () => {
    return [currentUser.primaryRole, ...currentUser.additionalRoles];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Role Selector */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4 space-x-reverse">
              <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
              <span className="text-gray-500">مرحباً، {currentUser.name}</span>
            </div>
            
            {/* Role Selector */}
            <div className="relative">
              <button
                onClick={() => setShowRoleSelector(!showRoleSelector)}
                className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <UserCheck className="w-5 h-5" />
                <span>{getAllUserRoles().find(role => role.type === currentRole)?.label}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showRoleSelector && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                  {getAllUserRoles().map((role) => (
                    <button
                      key={role.id}
                      onClick={() => handleRoleSwitch(role.type)}
                      className={`w-full text-right px-4 py-3 hover:bg-gray-50 transition-colors ${
                        currentRole === role.type ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{role.label}</span>
                        {role.verificationStatus === 'verified' && (
                          <UserCheck className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 space-x-reverse overflow-x-auto">
            {availableTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 space-x-reverse py-4 px-2 border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TabComponent />
      </div>
    </div>
  );
}
