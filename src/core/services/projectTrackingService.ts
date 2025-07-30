'use client';

import { 
  Project, 
  ProjectEstimation, 
  ProjectPurchase, 
  ProjectSummary, 
  MaterialEstimation,
  LightingEstimation 
} from '@/core/shared/types/types';

export class ProjectTrackingService {
  private static readonly STORAGE_KEY = 'binna_projects';
  private static readonly ESTIMATIONS_KEY = 'binna_estimations';
  private static readonly PURCHASES_KEY = 'binna_purchases';

  // إدارة المشاريع
  static async getProjects(): Promise<Project[]> {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : this.getDefaultProjects();
    } catch (error) {
      console.error('Error loading projects:', error);
      return this.getDefaultProjects();
    }
  }

  static async saveProject(project: Project): Promise<void> {
    if (typeof window === 'undefined') return;
    
    try {
      const projects = await this.getProjects();
      const existingIndex = projects.findIndex(p => p.id === project.id);
      
      const updatedProject = existingIndex >= 0 
        ? { ...project, updatedAt: new Date().toISOString() }
        : { ...project, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      
      if (existingIndex >= 0) {
        projects[existingIndex] = updatedProject;
      } else {
        projects.push(updatedProject);
      }
      
      // Save to localStorage
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
      
      // Also save to mock database for consistency
      await this.saveProjectToMockDatabase(updatedProject);
      
    } catch (error) {
      console.error('Error saving project:', error);
    }
  }

  private static async saveProjectToMockDatabase(project: Project): Promise<void> {
    try {
      // Use real Supabase client instead of mock
      const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs');
      const supabase = createClientComponentClient();
      
      // Transform project to match database schema
      const dbProject = {
        id: project.id,
        user_id: 'local_user', // Since we're using local auth
        project_name: project.name,
        description: project.description,
        status: project.status,
        start_date: project.startDate,
        budget: project.budget || 0,
        actual_cost: 0, // Default since spent property doesn't exist
        completion_percentage: project.progress || 0,
        location: { city: project.location || 'الرياض' },
        project_type: project.projectType,
        created_at: project.createdAt,
        updated_at: project.updatedAt
      };
      
      // Save to real Supabase database
      const { error } = await supabase
        .from('projects')
        .upsert(dbProject);
      
      if (error) {
        console.error('Error saving project to database:', error);
      } else {
        console.log('✅ Project saved to database:', project.name);
      }
    } catch (error) {
      console.error('Error saving project to mock database:', error);
    }
  }

  static async getProjectById(id: string): Promise<Project | null> {
    const projects = await this.getProjects();
    return projects.find(p => p.id === id) || null;
  }

  // إدارة التقديرات
  static async saveEstimation(estimation: ProjectEstimation): Promise<void> {
    if (typeof window === 'undefined') return;
    
    try {
      const estimations = await this.getEstimations();
      const existingIndex = estimations.findIndex(e => e.projectId === estimation.projectId);
      
      if (existingIndex >= 0) {
        estimations[existingIndex] = estimation;
      } else {
        estimations.push(estimation);
      }
      
      localStorage.setItem(this.ESTIMATIONS_KEY, JSON.stringify(estimations));
      
      // تحديث المشروع بالتقدير
      const project = await this.getProjectById(estimation.projectId);
      if (project) {
        project.estimations = estimation;
        await this.saveProject(project);
      }
    } catch (error) {
      console.error('Error saving estimation:', error);
    }
  }

  static async getEstimations(): Promise<ProjectEstimation[]> {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.ESTIMATIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading estimations:', error);
      return [];
    }
  }

  static async getEstimationByProjectId(projectId: string): Promise<ProjectEstimation | null> {
    const estimations = await this.getEstimations();
    return estimations.find(e => e.projectId === projectId) || null;
  }

  // إدارة المشتريات
  static async savePurchase(purchase: ProjectPurchase): Promise<void> {
    if (typeof window === 'undefined') return;
    
    try {
      const purchases = await this.getPurchases();
      const existingIndex = purchases.findIndex(p => p.id === purchase.id);
      
      if (existingIndex >= 0) {
        purchases[existingIndex] = purchase;
      } else {
        purchases.push(purchase);
      }
      
      localStorage.setItem(this.PURCHASES_KEY, JSON.stringify(purchases));
    } catch (error) {
      console.error('Error saving purchase:', error);
    }
  }

  static async getPurchases(): Promise<ProjectPurchase[]> {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.PURCHASES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading purchases:', error);
      return [];
    }
  }

  static async getPurchasesByProjectId(projectId: string): Promise<ProjectPurchase[]> {
    const purchases = await this.getPurchases();
    return purchases.filter(p => p.projectId === projectId);
  }

  // حساب ملخص المشروع
  static async calculateProjectSummary(projectId: string): Promise<ProjectSummary | null> {
    try {
      const project = await this.getProjectById(projectId);
      const estimation = await this.getEstimationByProjectId(projectId);
      const purchases = await this.getPurchasesByProjectId(projectId);

      if (!project || !estimation) return null;

      const totalEstimatedCost = estimation.totalCost;
      const totalSpentCost = purchases.reduce((sum, p) => sum + p.totalCost, 0);
      const remainingCost = totalEstimatedCost - totalSpentCost;

      // حساب تقدم المواد حسب الفئة
      const materialProgress: ProjectSummary['materialProgress'] = {};
      
      estimation.materials.forEach(material => {
        const category = material.category;
        if (!materialProgress[category]) {
          materialProgress[category] = {
            estimatedQuantity: 0,
            purchasedQuantity: 0,
            installedQuantity: 0,
            remainingQuantity: 0,
            estimatedCost: 0,
            spentCost: 0,
            remainingCost: 0
          };
        }

        materialProgress[category].estimatedQuantity += material.estimatedQuantity;
        materialProgress[category].estimatedCost += material.totalCost;

        // حساب المشتريات لهذه المادة
        const materialPurchases = purchases.filter(p => p.materialId === material.materialId);
        const purchasedQuantity = materialPurchases.reduce((sum, p) => sum + p.purchasedQuantity, 0);
        const installedQuantity = materialPurchases
          .filter(p => p.status === 'installed')
          .reduce((sum, p) => sum + p.purchasedQuantity, 0);
        const spentCost = materialPurchases.reduce((sum, p) => sum + p.totalCost, 0);

        materialProgress[category].purchasedQuantity += purchasedQuantity;
        materialProgress[category].installedQuantity += installedQuantity;
        materialProgress[category].spentCost += spentCost;
        materialProgress[category].remainingQuantity = 
          materialProgress[category].estimatedQuantity - materialProgress[category].purchasedQuantity;
        materialProgress[category].remainingCost = 
          materialProgress[category].estimatedCost - materialProgress[category].spentCost;
      });

      // حساب تقدم المراحل
      const phaseProgress: ProjectSummary['phaseProgress'] = {
        foundation: { estimated: 0, spent: 0, completion: 0 },
        structure: { estimated: 0, spent: 0, completion: 0 },
        finishing: { estimated: 0, spent: 0, completion: 0 },
        electrical: { estimated: 0, spent: 0, completion: 0 },
        plumbing: { estimated: 0, spent: 0, completion: 0 }
      };

      // حساب التقديرات والإنفاق لكل مرحلة
      estimation.materials.forEach(material => {
        const phase = material.phase;
        if (phaseProgress[phase]) {
          phaseProgress[phase].estimated += material.totalCost;
          
          const materialPurchases = purchases.filter(p => p.materialId === material.materialId);
          const spentOnMaterial = materialPurchases.reduce((sum, p) => sum + p.totalCost, 0);
          phaseProgress[phase].spent += spentOnMaterial;
        }
      });

      // حساب نسبة الإكمال لكل مرحلة
      Object.keys(phaseProgress).forEach(phase => {
        const phaseData = phaseProgress[phase as keyof typeof phaseProgress];
        phaseData.completion = phaseData.estimated > 0 
          ? Math.round((phaseData.spent / phaseData.estimated) * 100)
          : 0;
      });

      const completionPercentage = totalEstimatedCost > 0 
        ? Math.round((totalSpentCost / totalEstimatedCost) * 100)
        : 0;

      return {
        projectId,
        totalEstimatedCost,
        totalSpentCost,
        remainingCost,
        completionPercentage,
        materialProgress,
        phaseProgress
      };

    } catch (error) {
      console.error('Error calculating project summary:', error);
      return null;
    }
  }

  // مشاريع تجريبية افتراضية
  private static getDefaultProjects(): Project[] {
    return [
      {
        id: '1',
        name: 'فيلا الحي الجديد',
        stage: 'التشطيبات',
        progress: 75,
        createdAt: '2024-01-15T00:00:00.000Z',
        updatedAt: '2024-02-20T00:00:00.000Z',
        description: 'فيلا سكنية بمساحة 300 متر مربع',
        area: 300,
        projectType: 'villa',
        floorCount: 2,
        roomCount: 6,
        status: 'in-progress'
      },
      {
        id: '2',
        name: 'شقة الزمالك',
        stage: 'العظم',
        progress: 45,
        createdAt: '2024-02-01T00:00:00.000Z',
        updatedAt: '2024-02-25T00:00:00.000Z',
        description: 'شقة سكنية 150 متر مربع',
        area: 150,
        projectType: 'apartment',
        floorCount: 1,
        roomCount: 4,
        status: 'in-progress'
      },
      {
        id: '3',
        name: 'عمارة تجارية وسط البلد',
        stage: 'التخطيط',
        progress: 20,
        createdAt: '2024-02-10T00:00:00.000Z',
        updatedAt: '2024-02-26T00:00:00.000Z',
        description: 'عمارة تجارية متعددة الأدوار',
        area: 800,
        projectType: 'commercial',
        floorCount: 4,
        roomCount: 16,
        status: 'planning'
      }
    ];
  }

  // تصدير البيانات للطباعة أو المشاركة
  static async exportProjectData(projectId: string): Promise<any> {
    try {
      const project = await this.getProjectById(projectId);
      const estimation = await this.getEstimationByProjectId(projectId);
      const purchases = await this.getPurchasesByProjectId(projectId);
      const summary = await this.calculateProjectSummary(projectId);

      return {
        project,
        estimation,
        purchases,
        summary,
        exportDate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error exporting project data:', error);
      return null;
    }
  }

  // حذف مشروع
  static async deleteProject(projectId: string): Promise<void> {
    if (typeof window === 'undefined') return;
    
    try {
      // حذف المشروع
      const projects = await this.getProjects();
      const filteredProjects = projects.filter(p => p.id !== projectId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredProjects));

      // حذف التقديرات
      const estimations = await this.getEstimations();
      const filteredEstimations = estimations.filter(e => e.projectId !== projectId);
      localStorage.setItem(this.ESTIMATIONS_KEY, JSON.stringify(filteredEstimations));

      // حذف المشتريات
      const purchases = await this.getPurchases();
      const filteredPurchases = purchases.filter(p => p.projectId !== projectId);
      localStorage.setItem(this.PURCHASES_KEY, JSON.stringify(filteredPurchases));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  }
}
