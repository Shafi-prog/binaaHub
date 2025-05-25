'use client';

import Link from 'next/link';
import { projects } from '../../data/dummyData';

export default function Projects() {
  return (
    <section id="projects" className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">مشاريعي</h2>
      <Link href="/projects/new" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-accent transition mb-6 inline-block">
        إضافة مشروع جديد
      </Link>
      <div className="space-y-4">
        {projects.map((project: any) => (
          <div key={project.id} className="bg-gray-50 p-4 rounded border border-gray-200">
            <h3 className="text-xl font-semibold text-blue-700">{project.name}</h3>
            <p><strong>الموقع:</strong> {project.location}</p>
            <p><strong>الحالة:</strong> {project.status}</p>
            <p><strong>الميزانية:</strong> {project.budget.toLocaleString('ar-EG')} ريال</p>
            <Link href={`/projects/${project.id}`} className="text-primary hover:underline">
              عرض التفاصيل
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
