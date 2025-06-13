'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui';

export default function MedusaAnalyticsRedirect() {
  const router = useRouter();

  useEffect(() => {
    console.log('🔄 [Medusa Analytics] Redirecting to unified analytics page');
    router.replace('/store/analytics?source=medusa');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">إعادة توجيه إلى التحليلات الموحدة...</p>
        <p className="mt-2 text-sm text-gray-500">تم دمج تحليلات Medusa مع النظام الموحد</p>
      </div>
    </div>
  );
}
