'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProjectsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the projects list instead of new project creation
    router.replace('/user/projects/list');
  }, [router]);

  return null;
}
