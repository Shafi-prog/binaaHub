'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui';

export default function ERPDashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the unified store dashboard
    console.log('🔄 [ERP Dashboard] Redirecting to unified store dashboard');
    router.replace('/store/dashboard');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">إعادة توجيه إلى لوحة التحكم الموحدة...</p>
      </div>
    </div>
  );
}
