import { Order, Warranty, Project, ProjectPurchase } from '@/core/shared/types/types';
import { ProjectTrackingService } from './projectTrackingService';

export interface PurchaseAllocation {
  projectId: string;
  projectName: string;
  quantity: number;
  cost: number;
}

export interface PurchaseAssignmentDialog {
  show: boolean;
  order: Order | null;
  availableProjects: Project[];
  allocations: PurchaseAllocation[];
}

export class ProjectPurchaseService {
  // Get all active projects for purchase assignment
  static async getAvailableProjects(): Promise<Project[]> {
    try {
      const projects = await ProjectTrackingService.getProjects();
      return projects.filter(p => p.status !== 'completed');
    } catch (error) {
      console.error('Error getting available projects:', error);
      return [];
    }
  }

  // Auto-assign purchase to project if only one active project exists
  static async autoAssignPurchase(order: Order): Promise<boolean> {
    const availableProjects = await this.getAvailableProjects();
    
    if (availableProjects.length === 1) {
      const project = availableProjects[0];
      await this.assignOrderToProject(order, project.id);
      return true;
    }
    
    return false; // Multiple projects - need user selection
  }

  // Assign order to specific project
  static async assignOrderToProject(order: Order, projectId: string, allocation?: PurchaseAllocation[]): Promise<void> {
    try {
      // If no allocation specified, assign entire order to project
      if (!allocation) {
        const projectPurchase: ProjectPurchase = {
          id: `purchase-${Date.now()}`,
          projectId: projectId,
          materialId: `material-${order.id}`,
          materialName: order.item,
          purchasedQuantity: order.quantity || 1,
          unit: 'قطعة',
          pricePerUnit: order.totalCost ? order.totalCost / (order.quantity || 1) : 0,
          totalCost: order.totalCost || 0,
          purchaseDate: order.date,
          supplier: order.supplier || 'غير محدد',
          receiptNumber: order.id.toString(),
          status: 'ordered',
          orderId: order.id,
          hasWarranty: false
        };

        await this.addPurchaseToProject(projectPurchase);
      } else {
        // Handle multiple project allocations
        for (const alloc of allocation) {
          const projectPurchase: ProjectPurchase = {
            id: `purchase-${Date.now()}-${alloc.projectId}`,
            projectId: alloc.projectId,
            materialId: `material-${order.id}`,
            materialName: order.item,
            purchasedQuantity: alloc.quantity,
            unit: 'قطعة',
            pricePerUnit: alloc.cost / alloc.quantity,
            totalCost: alloc.cost,
            purchaseDate: order.date,
            supplier: order.supplier || 'غير محدد',
            receiptNumber: order.id.toString(),
            status: 'ordered',
            orderId: order.id,
            hasWarranty: false
          };

          await this.addPurchaseToProject(projectPurchase);
        }
      }

      // Update order with project assignment
      await this.updateOrderWithProject(order.id, projectId);
    } catch (error) {
      console.error('Error assigning order to project:', error);
      throw error;
    }
  }

  // Add warranty to project purchase
  static async addWarrantyToPurchase(warranty: Warranty, projectId: string): Promise<void> {
    try {
      // Find the purchase related to this warranty
      const project = await ProjectTrackingService.getProjectById(projectId);
      if (!project?.purchases) return;

      const relatedPurchase = project.purchases.find(p => 
        p.orderId === warranty.orderId || 
        p.materialName.toLowerCase().includes(warranty.item.toLowerCase())
      );

      if (relatedPurchase) {
        // Update purchase with warranty info
        relatedPurchase.warrantyId = warranty.id;
        relatedPurchase.warrantyEndDate = warranty.expiryDate;
        relatedPurchase.hasWarranty = true;

        await this.updateProjectPurchase(relatedPurchase);
      }

      // Update warranty with project link
      await this.updateWarrantyWithProject(warranty.id, projectId);
    } catch (error) {
      console.error('Error adding warranty to purchase:', error);
      throw error;
    }
  }

  // Get purchases for a project with warranty status
  static async getProjectPurchasesWithWarranty(projectId: string): Promise<ProjectPurchase[]> {
    try {
      const project = await ProjectTrackingService.getProjectById(projectId);
      return project?.purchases || [];
    } catch (error) {
      console.error('Error getting project purchases:', error);
      return [];
    }
  }

  // Get warranty items for a project
  static async getProjectWarranties(projectId: string): Promise<Warranty[]> {
    try {
      // This would typically come from a warranty service
      // For now, return mock data
      return [];
    } catch (error) {
      console.error('Error getting project warranties:', error);
      return [];
    }
  }

  // Private helper methods
  private static async addPurchaseToProject(purchase: ProjectPurchase): Promise<void> {
    // This would integrate with the project tracking service
    // to add the purchase to the project
    console.log('Adding purchase to project:', purchase);
  }

  private static async updateProjectPurchase(purchase: ProjectPurchase): Promise<void> {
    // Update existing purchase
    console.log('Updating project purchase:', purchase);
  }

  private static async updateOrderWithProject(orderId: number, projectId: string): Promise<void> {
    // Update order to link with project
    console.log('Linking order to project:', orderId, projectId);
  }

  private static async updateWarrantyWithProject(warrantyId: number, projectId: string): Promise<void> {
    // Update warranty to link with project
    console.log('Linking warranty to project:', warrantyId, projectId);
  }
}
