
import { Project, ProjectStage, ProjectMaterial, ProjectTeamMember, StageImage } from '../models/Project';
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
