'use client';

import { ProjectService } from './ProjectService';
import { ProjectRepository } from '../repositories/ProjectRepository';

export interface ProjectExpenseReport {
  projectId: string;
  totalExpenses: number;
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  recentPurchases: Array<{
    orderId: string;
    date: string;
    vendor: string;
    amount: number;
    items: string[];
  }>;
  monthlyTrend: Array<{
    month: string;
    amount: number;
  }>;
}

export interface ProjectBudget {
  projectId: string;
  totalBudget: number;
  categories: Array<{
    name: string;
    budgetedAmount: number;
    spentAmount: number;
    remainingAmount: number;
  }>;
  contingency: number;
  lastUpdated: string;
}

export interface ConcreteRequirements {
  type: 'ready_mix' | 'site_mix' | 'precast';
  quantity: number; // cubic meters
  strength: string; // e.g., 'C25', 'C30'
  deliveryDate: string;
  deliveryAddress: string;
  specialRequirements?: string[];
}

export interface EquipmentRental {
  equipmentType: string;
  startDate: string;
  endDate: string;
  deliveryAddress: string;
  operatorRequired: boolean;
  specifications?: Record<string, any>;
}

export interface Booking {
  id: string;
  projectId: string;
  serviceType: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  estimatedCost: number;
  providerId: string;
  providerName: string;
  details: Record<string, any>;
  createdAt: string;
}

export class ProjectMarketplaceService {
  private projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService(new ProjectRepository());
  }

  async linkPurchaseToProject(orderId: string, projectId: string, stageId?: string): Promise<void> {
    try {
      // This would integrate with the order system
      console.log(`Linking order ${orderId} to project ${projectId}${stageId ? ` stage ${stageId}` : ''}`);
      
      // Mock implementation - in real system, this would:
      // 1. Update the order record with project/stage reference
      // 2. Add expense entry to project budget tracking
      // 3. Update material inventory if applicable
      // 4. Trigger notifications to project team
      
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Failed to link purchase to project:', error);
      throw error;
    }
  }

  async getProjectRecommendations(projectId: string): Promise<any[]> {
    try {
      // Mock AI-powered product recommendations based on project stage and type
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return [
        {
          id: 'prod_001',
          name: 'High-Strength Concrete Mix',
          category: 'Materials',
          price: 45.00,
          unit: 'per bag',
          rating: 4.8,
          reason: 'Perfect for foundation work in your current stage',
          supplier: 'BuildCorp Materials',
          estimatedDelivery: '2-3 days'
        },
        {
          id: 'prod_002',
          name: 'Steel Reinforcement Bars',
          category: 'Materials',
          price: 120.00,
          unit: 'per piece',
          rating: 4.9,
          reason: 'Required for structural integrity',
          supplier: 'MetalWorks Supply',
          estimatedDelivery: '1-2 days'
        },
        {
          id: 'service_001',
          name: 'Concrete Pumping Service',
          category: 'Services',
          price: 350.00,
          unit: 'per day',
          rating: 4.7,
          reason: 'Efficient concrete placement for your foundation',
          supplier: 'QuickPump Services',
          estimatedDelivery: 'Next day'
        }
      ];
    } catch (error) {
      console.error('Failed to get project recommendations:', error);
      throw error;
    }
  }

  async trackProjectExpenses(projectId: string): Promise<ProjectExpenseReport> {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock expense tracking
      return {
        projectId,
        totalExpenses: 45000,
        categoryBreakdown: [
          { category: 'Materials', amount: 28000, percentage: 62.2 },
          { category: 'Labor', amount: 12000, percentage: 26.7 },
          { category: 'Equipment', amount: 3500, percentage: 7.8 },
          { category: 'Services', amount: 1500, percentage: 3.3 }
        ],
        recentPurchases: [
          {
            orderId: 'ORD-2025-001',
            date: '2025-08-03',
            vendor: 'BuildCorp Materials',
            amount: 2400,
            items: ['Concrete Mix (50 bags)', 'Delivery Service']
          },
          {
            orderId: 'ORD-2025-002',
            date: '2025-08-02',
            vendor: 'MetalWorks Supply',
            amount: 1800,
            items: ['Steel Rebar (15 pieces)', 'Wire Mesh']
          }
        ],
        monthlyTrend: [
          { month: 'June', amount: 15000 },
          { month: 'July', amount: 18000 },
          { month: 'August', amount: 12000 }
        ]
      };
    } catch (error) {
      console.error('Failed to track project expenses:', error);
      throw error;
    }
  }

  async createProjectBudget(projectId: string, budget: Omit<ProjectBudget, 'projectId' | 'lastUpdated'>): Promise<void> {
    try {
      console.log(`Creating budget for project ${projectId}:`, budget);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In real implementation, this would save to database
    } catch (error) {
      console.error('Failed to create project budget:', error);
      throw error;
    }
  }

  async bookConcreteService(projectId: string, requirements: ConcreteRequirements): Promise<Booking> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock booking creation
      return {
        id: `booking_${Date.now()}`,
        projectId,
        serviceType: 'concrete_delivery',
        status: 'pending',
        scheduledDate: requirements.deliveryDate,
        estimatedCost: requirements.quantity * 150, // $150 per cubic meter
        providerId: 'provider_concrete_001',
        providerName: 'Premium Concrete Solutions',
        details: requirements,
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to book concrete service:', error);
      throw error;
    }
  }

  async scheduleWasteCollection(projectId: string, wasteTypes: string[]): Promise<Booking> {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        id: `booking_${Date.now()}`,
        projectId,
        serviceType: 'waste_collection',
        status: 'pending',
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        estimatedCost: wasteTypes.length * 75, // $75 per waste type
        providerId: 'provider_waste_001',
        providerName: 'EcoWaste Management',
        details: { wasteTypes },
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to schedule waste collection:', error);
      throw error;
    }
  }

  async rentEquipment(projectId: string, equipment: EquipmentRental): Promise<Booking> {
    try {
      await new Promise(resolve => setTimeout(resolve, 900));
      
      const days = Math.ceil((new Date(equipment.endDate).getTime() - new Date(equipment.startDate).getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        id: `booking_${Date.now()}`,
        projectId,
        serviceType: 'equipment_rental',
        status: 'pending',
        scheduledDate: equipment.startDate,
        estimatedCost: days * 200, // $200 per day base rate
        providerId: 'provider_equipment_001',
        providerName: 'Heavy Equipment Rentals',
        details: equipment,
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to rent equipment:', error);
      throw error;
    }
  }
}
