import { Metadata } from 'next';
import { MaterialInventory } from '@/domains/projects/components/ProjectMaterials/MaterialInventory';

interface MaterialsPageProps {
  params: {
    projectId: string;
  };
}

export const metadata: Metadata = {
  title: 'Project Materials - BinaaHub',
  description: 'Manage materials and warranties'
};

export default function MaterialsPage({ params }: MaterialsPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Materials & Inventory</h1>
          <p className="mt-2 text-gray-600">
            Track materials, costs, and warranty information
          </p>
        </div>
        <MaterialInventory projectId={params.projectId} />
      </div>
    </div>
  );
}
