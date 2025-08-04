
import { Project, ProjectStage, ProjectMaterial, ProjectTeamMember } from '../models/Project';
import { supabase } from '@/lib/supabase/client';

export class ProjectRepository {
  async create(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const { data: project, error } = await supabase
      .from('projects')
      .insert([data])
      .select()
      .single();

    if (error) throw new Error(`Failed to create project: ${error.message}`);
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
      .or(`owner_id.eq.${userId},id.in.(select project_id from project_team where user_id = '${userId}')`)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch user projects: ${error.message}`);
    return projects || [];
  }

  async update(id: string, data: Partial<Project>): Promise<Project> {
    const { data: project, error } = await supabase
      .from('projects')
      .update({ ...data, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update project: ${error.message}`);
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
      .select(`
        *,
        stage_images (*)
      `)
      .eq('project_id', projectId)
      .order('order_index');

    if (error) throw new Error(`Failed to fetch project stages: ${error.message}`);
    return stages || [];
  }

  async getMaterials(projectId: string): Promise<ProjectMaterial[]> {
    const { data: materials, error } = await supabase
      .from('project_materials')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch project materials: ${error.message}`);
    return materials || [];
  }

  async getTeamMembers(projectId: string): Promise<ProjectTeamMember[]> {
    const { data: team, error } = await supabase
      .from('project_team')
      .select(`
        *,
        users (
          id,
          email,
          user_metadata
        )
      `)
      .eq('project_id', projectId)
      .eq('status', 'active');

    if (error) throw new Error(`Failed to fetch project team: ${error.message}`);
    return team || [];
  }

  async addMaterial(material: Omit<ProjectMaterial, 'id'>): Promise<ProjectMaterial> {
    const { data: newMaterial, error } = await supabase
      .from('project_materials')
      .insert([material])
      .select()
      .single();

    if (error) throw new Error(`Failed to add material: ${error.message}`);
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

    if (error) throw new Error(`Failed to add team member: ${error.message}`);
    return member;
  }
}
