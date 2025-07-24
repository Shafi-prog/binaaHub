'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';

export default function ProjectsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the projects list instead of new project creation
    router.replace('/user/projects/list');
  }, [router]);

  // Show a temporary loading state while redirecting
  return (
    <div className="container mx-auto p-6" dir="rtl">
      <Card className="p-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">جاري التحويل...</h1>
          <p className="text-gray-600">سيتم توجيهك إلى قائمة المشاريع</p>
        </div>
      </Card>
    </div>
  );
}

export const dynamic = 'force-dynamic';
