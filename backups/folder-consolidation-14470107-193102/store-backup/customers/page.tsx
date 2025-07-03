'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui';

export default function UnifiedCustomersPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to ERP customers page as the unified customer management
    console.log('🔄 [Unified Customers] Redirecting to ERP customers management');
    router.replace('/store/erp/customers');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">إعادة توجيه إلى إدارة العملاء المتقدمة...</p>
        <p className="mt-2 text-sm text-gray-500">نظام CRM متطور مع ميزات ERP شاملة</p>
      </div>
    </div>
  );
}
