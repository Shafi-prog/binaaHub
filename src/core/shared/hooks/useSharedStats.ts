
import { useUserData } from '../contexts/UserDataContext';
import UserStatsCalculator from '../services/UserStatsCalculator';

export const useSharedStats = () => {
  const { orders, warranties, projects, invoices, profile, stats } = useUserData();
  
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
