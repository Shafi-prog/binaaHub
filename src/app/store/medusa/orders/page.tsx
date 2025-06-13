'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui';

export default function MedusaOrdersRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the unified orders page with Medusa filter
    console.log('🔄 [Medusa Orders] Redirecting to unified orders page');
    router.replace('/store/orders?view=advanced&source=medusa');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">إعادة توجيه إلى إدارة الطلبات الموحدة...</p>
        <p className="mt-2 text-sm text-gray-500">تم دمج طلبات التجارة الإلكترونية مع النظام الموحد</p>
      </div>
    </div>
  );
}
