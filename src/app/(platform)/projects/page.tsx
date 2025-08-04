import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Projects - BinaaHub',
  description: 'Manage your construction projects'
};

export default function ProjectsPage() {
  // Mock projects data - in real app, this would come from an API
  const projects = [
    {
      id: '1',
      name: 'Dream Home Construction',
      description: 'Building our family home',
      status: 'active',
      progress: 65,
      budget: 250000,
      startDate: '2024-01-15'
    },
    {
      id: '2', 
      name: 'Office Renovation',
      description: 'Modern office space renovation',
      status: 'planning',
      progress: 15,
      budget: 75000,
      startDate: '2024-03-01'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
          <p className="mt-2 text-gray-600">
            Manage and track your construction projects
          </p>
        </div>
        
        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  project.status === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {project.status}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Budget</span>
                  <span className="font-medium">${project.budget.toLocaleString()}</span>
                </div>
              </div>
            </Link>
          ))}
          
          {/* Add New Project Card */}
          <Link
            href="/projects/create"
            className="bg-white rounded-lg shadow-sm border border-dashed border-gray-300 hover:border-blue-500 transition-colors p-6 flex items-center justify-center"
          >
            <div className="text-center">
              <div className="text-3xl text-gray-400 mb-2">+</div>
              <h3 className="text-lg font-semibold text-gray-900">New Project</h3>
              <p className="text-gray-600">Start a new construction project</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
