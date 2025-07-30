
import { useUserData } from '../contexts/UserDataContext';
import UserStatsCalculator from '../services/UserStatsCalculator';
import { useAuth } from '@/core/shared/auth/AuthProvider';

export const useSharedStats = () => {
  const { user, session, isLoading, error } = useAuth();
  
  // Mock data for now
  const orders = [];
  const invoices = [];
  const projects = [];
  const warranties = [];
  const profile = null; // User profile type mismatch, using null for now
  const stats = { total: 0, active: 0, completed: 0 };
  
  const financialStats = UserStatsCalculator.calculateFinancialStats(orders, invoices, projects);
  const projectStats = UserStatsCalculator.calculateProjectStats(projects);
  const warrantyStats = UserStatsCalculator.calculateWarrantyStats(warranties);
  const orderStats = UserStatsCalculator.calculateOrderStats(orders);
  const loyaltyStats = UserStatsCalculator.calculateLoyaltyStats(profile, orders, projects);
  
  return {
    basicStats: stats,
    financialStats,
    projectStats,
    warrantyStats,
    orderStats,
    loyaltyStats,
  };
};
