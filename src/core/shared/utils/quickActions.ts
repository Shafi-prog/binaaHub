
import { Order, Warranty, Project, Invoice } from '../contexts/UserDataContext';

export class QuickActions {
  // Quick filters for common data queries
  static getRecentOrders(orders: Order[], days: number = 30): Order[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return orders.filter(order => new Date(order.orderDate) >= cutoffDate);
  }
  
  static getActiveWarranties(warranties: Warranty[]): Warranty[] {
    return warranties.filter(warranty => warranty.status === 'active');
  }
  
  static getExpiringWarranties(warranties: Warranty[], months: number = 3): Warranty[] {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() + months);
    
    return warranties.filter(warranty => {
      return warranty.status === 'active' && 
             new Date(warranty.expiryDate) <= cutoffDate;
    });
  }
  
  static getActiveProjects(projects: Project[]): Project[] {
    return projects.filter(project => project.status === 'in-progress');
  }
  
  static getOverdueInvoices(invoices: Invoice[]): Invoice[] {
    const today = new Date();
    return invoices.filter(invoice => 
      invoice.status === 'pending' && new Date(invoice.dueDate) < today
    );
  }
  
  static getPendingOrders(orders: Order[]): Order[] {
    return orders.filter(order => 
      order.status === 'pending' || order.status === 'confirmed' || order.status === 'shipped'
    );
  }
  
  // Quick calculations
  static calculateMonthlySpending(orders: Order[]): number {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return orders
      .filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate.getMonth() === currentMonth && 
               orderDate.getFullYear() === currentYear;
      })
      .reduce((sum, order) => sum + order.total, 0);
  }
  
  static calculateProjectBudgetUtilization(projects: Project[]): number {
    const totalBudget = projects.reduce((sum, project) => sum + project.budget, 0);
    const totalSpent = projects.reduce((sum, project) => sum + project.spent, 0);
    
    return totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  }
}
