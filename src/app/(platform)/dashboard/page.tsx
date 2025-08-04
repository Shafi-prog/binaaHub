import { Metadata } from 'next';
import DynamicDashboard from '@/components/dashboard/DynamicDashboard';
import { RoleProvider } from '@/domains/user/contexts/RoleContext';
import { ProjectProvider } from '@/domains/projects/contexts/ProjectContext';
import { MarketplaceProvider } from '@/domains/marketplace/contexts/MarketplaceContext';

export const metadata: Metadata = {
  title: 'Dashboard - BinnaV2 Platform',
  description: 'Dynamic role-based construction management dashboard'
};

export default function DashboardPage() {
  return (
    <RoleProvider>
      <ProjectProvider>
        <MarketplaceProvider>
          <DynamicDashboard />
        </MarketplaceProvider>
      </ProjectProvider>
    </RoleProvider>
  );
}
