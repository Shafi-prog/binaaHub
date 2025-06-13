'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui';

export default function MedusaCustomersRedirect() {
  const router = useRouter();

  useEffect(() => {
    console.log('🔄 [Medusa Customers] Redirecting to unified customers page');
    router.replace('/store/erp/customers?source=medusa');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">إعادة توجيه إلى إدارة العملاء الموحدة...</p>
        <p className="mt-2 text-sm text-gray-500">تم دمج عملاء Medusa مع النظام الموحد</p>
      </div>
    </div>
  );
}
