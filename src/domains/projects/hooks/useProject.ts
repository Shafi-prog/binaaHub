
import { useState, useEffect } from 'react';
import { Project, ProjectStage, ProjectMaterial } from '../models/Project';
import { ProjectService } from '../services/ProjectService';
import { ProjectRepository } from '../repositories/ProjectRepository';

const projectService = new ProjectService(new ProjectRepository());

export function useProject(projectId: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = async () => {
    if (!projectId) return;
    
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

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const updateProject = async (updates: Partial<Project>) => {
    if (!projectId) return;
    
    try {
      setLoading(true);
      const updatedProject = await projectService.updateProject(projectId, updates);
      setProject(updatedProject);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  return { project, loading, error, refetch: fetchProject, updateProject };
}

export function useUserProjects(userId: string) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    if (!userId) return;
    
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

  useEffect(() => {
    fetchProjects();
  }, [userId]);

  return { projects, loading, error, refetch: fetchProjects };
}

export function useProjectStages(projectId: string) {
  const [stages, setStages] = useState<ProjectStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStages = async () => {
    if (!projectId) return;
    
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

  useEffect(() => {
    fetchStages();
  }, [projectId]);

  return { stages, loading, error, refetch: fetchStages };
}

export function useProjectMaterials(projectId: string) {
  const [materials, setMaterials] = useState<ProjectMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMaterials = async () => {
    if (!projectId) return;
    
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

  useEffect(() => {
    fetchMaterials();
  }, [projectId]);

  return { materials, loading, error, refetch: fetchMaterials };
}
