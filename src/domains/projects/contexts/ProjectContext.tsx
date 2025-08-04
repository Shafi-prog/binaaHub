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

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
