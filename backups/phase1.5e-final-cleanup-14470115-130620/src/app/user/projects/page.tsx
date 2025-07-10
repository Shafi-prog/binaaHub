'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProjectsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main construction hub
    router.replace('/user/projects/new');
  }, [router]);

  return null;
}
