import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { ProjectData } from '@/types/project';

const supabase = createClientComponentClient();

export async function getProjectById(id: string): Promise<ProjectData | null> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching project:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

export async function updateProject(id: string, updates: Partial<ProjectData>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating project:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating project:', error);
    return false;
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting project:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    return false;
  }
}

export async function getAllProjects(userId?: string): Promise<ProjectData[]> {
  try {
    let query = supabase.from('projects').select('*');
    
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function getSpendingByCategory(projectId: string) {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('category, amount')
      .eq('project_id', projectId);

    if (error) {
      console.error('Error fetching spending by category:', error);
      return [];
    }

    // Group by category and sum amounts
    const grouped = data?.reduce((acc: Record<string, number>, expense) => {
      const category = expense.category || 'Other';
      acc[category] = (acc[category] || 0) + (expense.amount || 0);
      return acc;
    }, {}) || {};

    return Object.entries(grouped).map(([category, amount]) => ({
      category,
      amount
    }));
  } catch (error) {
    console.error('Error fetching spending by category:', error);
    return [];
  }
}

export async function getRecentExpenses(projectId: string, limit = 10) {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent expenses:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching recent expenses:', error);
    return [];
  }
}
