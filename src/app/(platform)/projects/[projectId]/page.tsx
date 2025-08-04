import { Metadata } from 'next';
import { ProjectDashboard } from '@/domains/projects/components/ProjectHub/ProjectDashboard';

interface ProjectPageProps {
  params: {
    projectId: string;
  };
}

export const metadata: Metadata = {
  title: 'Project Dashboard - BinaaHub',
  description: 'Project management dashboard'
};

export default function ProjectPage({ params }: ProjectPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <ProjectDashboard projectId={params.projectId} />
    </div>
  );
}
