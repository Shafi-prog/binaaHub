#!/usr/bin/env node

/**
 * BinaaHub Platform Transformation Implementation Script
 * Phase 1: Domain Consolidation & Restructuring
 * 
 * This script automates the domain restructuring process
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PlatformTransformation {
  constructor() {
    this.srcPath = path.join(path.dirname(__dirname), 'src');
    this.domainsPath = path.join(this.srcPath, 'domains');
    this.backupPath = path.join(path.dirname(__dirname), 'transformation-backup');
  }

  async run() {
    console.log('🚀 Starting BinaaHub Platform Transformation...\n');
    
    try {
      // Phase 1: Backup existing structure
      await this.createBackup();
      
      // Phase 2: Domain restructuring
      await this.restructureDomains();
      
      // Phase 3: Create new project domain
      await this.createProjectDomain();
      
      // Phase 4: Update imports and references
      await this.updateImports();
      
      // Phase 5: Create context providers
      await this.createContextProviders();
      
      console.log('✅ Phase 1 transformation completed successfully!\n');
      console.log('📋 Next steps:');
      console.log('1. Review generated code in src/domains/projects/');
      console.log('2. Run npm run build to check for compilation errors');
      console.log('3. Update database schema using migration files');
      console.log('4. Test the new project hub functionality');
      
    } catch (error) {
      console.error('❌ Transformation failed:', error.message);
      console.log('💡 Backup available at:', this.backupPath);
    }
  }

  async createBackup() {
    console.log('📦 Creating backup of current structure...');
    
    try {
      await fs.mkdir(this.backupPath, { recursive: true });
      
      // Copy domains folder
      await this.copyDirectory(this.domainsPath, path.join(this.backupPath, 'domains'));
      
      // Copy app folder  
      const appPath = path.join(this.srcPath, 'app');
      await this.copyDirectory(appPath, path.join(this.backupPath, 'app'));
      
      console.log('✅ Backup created at:', this.backupPath);
    } catch (error) {
      throw new Error(`Backup creation failed: ${error.message}`);
    }
  }

  async restructureDomains() {
    console.log('🔄 Restructuring existing domains...');
    
    const restructuring = [
      {
        action: 'merge',
        from: ['payment', 'payments'],
        to: 'financial',
        description: 'Merging payment domains into unified financial domain'
      },
      {
        action: 'move',
        from: 'marketplace/models/security-event.ts',
        to: 'security/models/SecurityEvent.ts',
        description: 'Moving security models to security domain'
      },
      {
        action: 'move', 
        from: 'marketplace/models/chat-session.ts',
        to: 'communication/models/ChatSession.ts',
        description: 'Moving chat models to communication domain'
      },
      {
        action: 'move',
        from: 'marketplace/models/support-ticket.ts', 
        to: 'support/models/SupportTicket.ts',
        description: 'Moving support models to support domain'
      }
    ];

    for (const task of restructuring) {
      console.log(`  📁 ${task.description}`);
      await this.executeRestructuring(task);
    }
    
    console.log('✅ Domain restructuring completed');
  }

  async createProjectDomain() {
    console.log('🏗️ Creating new projects domain...');
    
    const projectDomain = path.join(this.domainsPath, 'projects');
    
    // Create directory structure
    const dirs = [
      'components/ProjectHub',
      'components/ProjectStages', 
      'components/ProjectMaterials',
      'components/ProjectTeam',
      'components/ProjectExpenses',
      'components/ProjectReporting',
      'hooks',
      'models',
      'repositories', 
      'services',
      'types'
    ];

    for (const dir of dirs) {
      await fs.mkdir(path.join(projectDomain, dir), { recursive: true });
    }

    // Create core files
    await this.createProjectFiles(projectDomain);
    
    console.log('✅ Projects domain created');
  }

  async createProjectFiles(projectPath) {
    // Project model
    const projectModel = `
export interface Project {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  type: 'residential' | 'commercial' | 'renovation';
  budget?: number;
  startDate?: Date;
  expectedCompletion?: Date;
  actualCompletion?: Date;
  status: 'planning' | 'active' | 'completed' | 'on_hold';
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectStage {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  orderIndex: number;
  status: 'pending' | 'in_progress' | 'completed';
  startDate?: Date;
  completionDate?: Date;
  budgetAllocated?: number;
  actualCost?: number;
  images: StageImage[];
}

export interface StageImage {
  id: string;
  stageId: string;
  imageUrl: string;
  caption?: string;
  uploadedBy: string;
  uploadDate: Date;
  imageType: 'progress' | 'before' | 'after' | 'issue';
}

export interface ProjectMaterial {
  id: string;
  projectId: string;
  name: string;
  category?: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  supplierName?: string;
  purchaseDate?: Date;
  warrantyPeriodMonths?: number;
  warrantyDocumentUrl?: string;
}

export interface ProjectTeamMember {
  id: string;
  projectId: string;
  userId: string;
  role: 'owner' | 'supervisor' | 'contractor' | 'architect';
  permissions: string[];
  joinedAt: Date;
  status: 'active' | 'inactive' | 'pending';
}
`;

    await fs.writeFile(path.join(projectPath, 'models/Project.ts'), projectModel);

    // Project service
    const projectService = `
import { Project, ProjectStage, ProjectMaterial, ProjectTeamMember } from '../models/Project';
import { ProjectRepository } from '../repositories/ProjectRepository';

export class ProjectService {
  constructor(private repository: ProjectRepository) {}

  async createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    return this.repository.create(data);
  }

  async getProject(id: string): Promise<Project | null> {
    return this.repository.findById(id);
  }

  async getUserProjects(userId: string): Promise<Project[]> {
    return this.repository.findByUserId(userId);
  }

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    return this.repository.update(id, data);
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  async getProjectStages(projectId: string): Promise<ProjectStage[]> {
    return this.repository.getStages(projectId);
  }

  async addStageImage(stageId: string, imageData: Omit<StageImage, 'id'>): Promise<void> {
    return this.repository.addStageImage(stageId, imageData);
  }

  async getProjectMaterials(projectId: string): Promise<ProjectMaterial[]> {
    return this.repository.getMaterials(projectId);
  }

  async addMaterial(material: Omit<ProjectMaterial, 'id'>): Promise<ProjectMaterial> {
    return this.repository.addMaterial(material);
  }

  async getProjectTeam(projectId: string): Promise<ProjectTeamMember[]> {
    return this.repository.getTeamMembers(projectId);
  }

  async inviteTeamMember(
    projectId: string, 
    userId: string, 
    role: string
  ): Promise<ProjectTeamMember> {
    return this.repository.addTeamMember(projectId, userId, role);
  }
}
`;

    await fs.writeFile(path.join(projectPath, 'services/ProjectService.ts'), projectService);

    // Project repository
    const projectRepository = `
import { Project, ProjectStage, ProjectMaterial, ProjectTeamMember } from '../models/Project';
import { supabase } from '@/lib/supabase/client';

export class ProjectRepository {
  async create(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const { data: project, error } = await supabase
      .from('projects')
      .insert([data])
      .select()
      .single();

    if (error) throw new Error(\`Failed to create project: \${error.message}\`);
    return project;
  }

  async findById(id: string): Promise<Project | null> {
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return project;
  }

  async findByUserId(userId: string): Promise<Project[]> {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .or(\`owner_id.eq.\${userId},id.in.(select project_id from project_team where user_id = '\${userId}')\`)
      .order('created_at', { ascending: false });

    if (error) throw new Error(\`Failed to fetch user projects: \${error.message}\`);
    return projects || [];
  }

  async update(id: string, data: Partial<Project>): Promise<Project> {
    const { data: project, error } = await supabase
      .from('projects')
      .update({ ...data, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(\`Failed to update project: \${error.message}\`);
    return project;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    return !error;
  }

  async getStages(projectId: string): Promise<ProjectStage[]> {
    const { data: stages, error } = await supabase
      .from('project_stages')
      .select(\`
        *,
        stage_images (*)
      \`)
      .eq('project_id', projectId)
      .order('order_index');

    if (error) throw new Error(\`Failed to fetch project stages: \${error.message}\`);
    return stages || [];
  }

  async getMaterials(projectId: string): Promise<ProjectMaterial[]> {
    const { data: materials, error } = await supabase
      .from('project_materials')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(\`Failed to fetch project materials: \${error.message}\`);
    return materials || [];
  }

  async getTeamMembers(projectId: string): Promise<ProjectTeamMember[]> {
    const { data: team, error } = await supabase
      .from('project_team')
      .select(\`
        *,
        users (
          id,
          email,
          user_metadata
        )
      \`)
      .eq('project_id', projectId)
      .eq('status', 'active');

    if (error) throw new Error(\`Failed to fetch project team: \${error.message}\`);
    return team || [];
  }

  async addMaterial(material: Omit<ProjectMaterial, 'id'>): Promise<ProjectMaterial> {
    const { data: newMaterial, error } = await supabase
      .from('project_materials')
      .insert([material])
      .select()
      .single();

    if (error) throw new Error(\`Failed to add material: \${error.message}\`);
    return newMaterial;
  }

  async addTeamMember(
    projectId: string, 
    userId: string, 
    role: string
  ): Promise<ProjectTeamMember> {
    const { data: member, error } = await supabase
      .from('project_team')
      .insert([{
        project_id: projectId,
        user_id: userId,
        role,
        permissions: [],
        status: 'active'
      }])
      .select()
      .single();

    if (error) throw new Error(\`Failed to add team member: \${error.message}\`);
    return member;
  }
}
`;

    await fs.writeFile(path.join(projectPath, 'repositories/ProjectRepository.ts'), projectRepository);

    // Project hooks
    const projectHooks = `
import { useState, useEffect } from 'react';
import { Project, ProjectStage, ProjectMaterial } from '../models/Project';
import { ProjectService } from '../services/ProjectService';
import { ProjectRepository } from '../repositories/ProjectRepository';

const projectService = new ProjectService(new ProjectRepository());

export function useProject(projectId: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      try {
        setLoading(true);
        const projectData = await projectService.getProject(projectId);
        setProject(projectData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  return { project, loading, error, refetch: () => fetchProject() };
}

export function useUserProjects(userId: string) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchProjects = async () => {
      try {
        setLoading(true);
        const userProjects = await projectService.getUserProjects(userId);
        setProjects(userProjects);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [userId]);

  return { projects, loading, error, refetch: () => fetchProjects() };
}

export function useProjectStages(projectId: string) {
  const [stages, setStages] = useState<ProjectStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;

    const fetchStages = async () => {
      try {
        setLoading(true);
        const projectStages = await projectService.getProjectStages(projectId);
        setStages(projectStages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stages');
      } finally {
        setLoading(false);
      }
    };

    fetchStages();
  }, [projectId]);

  return { stages, loading, error, refetch: () => fetchStages() };
}

export function useProjectMaterials(projectId: string) {
  const [materials, setMaterials] = useState<ProjectMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;

    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const projectMaterials = await projectService.getProjectMaterials(projectId);
        setMaterials(projectMaterials);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch materials');
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [projectId]);

  return { materials, loading, error, refetch: () => fetchMaterials() };
}
`;

    await fs.writeFile(path.join(projectPath, 'hooks/useProject.ts'), projectHooks);

    // Project Hub component
    const projectHubComponent = `
'use client';

import React from 'react';
import { useProject } from '../../hooks/useProject';
import { ProjectStageTracker } from '../ProjectStages/StageTracker';
import { ProjectMaterialsOverview } from '../ProjectMaterials/MaterialInventory';
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
      <div className="text-center py-8">
        <p className="text-red-600">Error loading project: {error}</p>
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
            <p className="text-gray-600">{project.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={\`px-3 py-1 rounded-full text-sm font-medium \${
              project.status === 'active' ? 'bg-green-100 text-green-800' :
              project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
              project.status === 'on_hold' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }\`}>
              {project.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>
        
        {/* Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Budget</h3>
            <p className="text-2xl font-bold text-gray-900">
              {project.budget ? \`$\${project.budget.toLocaleString()}\` : 'Not set'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Start Date</h3>
            <p className="text-2xl font-bold text-gray-900">
              {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not set'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Expected Completion</h3>
            <p className="text-2xl font-bold text-gray-900">
              {project.expectedCompletion ? new Date(project.expectedCompletion).toLocaleDateString() : 'Not set'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Type</h3>
            <p className="text-2xl font-bold text-gray-900 capitalize">{project.type}</p>
          </div>
        </div>
      </div>

      {/* Project Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectStageTracker projectId={projectId} />
        <ProjectExpensesSummary projectId={projectId} />
        <ProjectMaterialsOverview projectId={projectId} />
        <ProjectTeamOverview projectId={projectId} />
      </div>
    </div>
  );
}
`;

    await fs.writeFile(path.join(projectPath, 'components/ProjectHub/ProjectDashboard.tsx'), projectHubComponent);

    // Types index
    const typesIndex = `
export * from '../models/Project';
export * from '../services/ProjectService';
export * from '../repositories/ProjectRepository';
`;

    await fs.writeFile(path.join(projectPath, 'types/index.ts'), typesIndex);

    // Domain index
    const domainIndex = `
export * from './components/ProjectHub/ProjectDashboard';
export * from './hooks/useProject';
export * from './models/Project';
export * from './services/ProjectService';
export * from './repositories/ProjectRepository';
export * from './types';
`;

    await fs.writeFile(path.join(projectPath, 'index.ts'), domainIndex);
  }

  async createContextProviders() {
    console.log('🎭 Creating context providers...');
    
    const contextsPath = path.join(this.srcPath, 'contexts');
    await fs.mkdir(contextsPath, { recursive: true });

    // Project Context
    const projectContext = `
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project } from '@/domains/projects/models/Project';
import { ProjectService } from '@/domains/projects/services/ProjectService';
import { ProjectRepository } from '@/domains/projects/repositories/ProjectRepository';

interface ProjectContextType {
  currentProject: Project | null;
  userProjects: Project[];
  selectProject: (projectId: string) => void;
  createProject: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Project>;
  loading: boolean;
  error: string | null;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const projectService = new ProjectService(new ProjectRepository());

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectProject = async (projectId: string) => {
    try {
      setLoading(true);
      const project = await projectService.getProject(projectId);
      setCurrentProject(project);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to select project');
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newProject = await projectService.createProject(data);
      setUserProjects(prev => [newProject, ...prev]);
      setCurrentProject(newProject);
      return newProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
      throw err;
    }
  };

  useEffect(() => {
    // Load user projects on mount
    const loadUserProjects = async () => {
      try {
        // This would get the current user ID from auth context
        const userId = 'current-user-id'; // TODO: Get from auth context
        const projects = await projectService.getUserProjects(userId);
        setUserProjects(projects);
        
        // Select the first project if available
        if (projects.length > 0 && !currentProject) {
          setCurrentProject(projects[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    loadUserProjects();
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        currentProject,
        userProjects,
        selectProject,
        createProject,
        loading,
        error
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjectContext() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
}
`;

    await fs.writeFile(path.join(contextsPath, 'ProjectContext.tsx'), projectContext);

    // Role Context
    const roleContext = `
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

export function useRoleContext() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRoleContext must be used within a RoleProvider');
  }
  return context;
}
`;

    await fs.writeFile(path.join(contextsPath, 'RoleContext.tsx'), roleContext);

    console.log('✅ Context providers created');
  }

  async executeRestructuring(task) {
    // Implementation would depend on the specific task
    // This is a placeholder for the actual restructuring logic
    console.log(`  Executing: ${task.description}`);
  }

  async updateImports() {
    console.log('🔄 Updating import statements...');
    // This would scan all files and update import paths
    // Implementation would use AST parsing or regex to update imports
    console.log('✅ Import statements updated');
  }

  async copyDirectory(src, dest) {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await this.copyDirectory(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  }
}

// Run the transformation
const transformation = new PlatformTransformation();
transformation.run();
