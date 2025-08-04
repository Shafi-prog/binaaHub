import { Metadata } from 'next';
import { StageTracker } from '@/domains/projects/components/ProjectStages/StageTracker';

interface StagesPageProps {
  params: {
    projectId: string;
  };
}

export const metadata: Metadata = {
  title: 'Project Stages - BinaaHub',
  description: 'Track construction stages and progress'
};

export default function StagesPage({ params }: StagesPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Construction Stages</h1>
          <p className="mt-2 text-gray-600">
            Track progress and upload photos for each construction stage
          </p>
        </div>
        <StageTracker projectId={params.projectId} />
      </div>
    </div>
  );
}
