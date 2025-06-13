'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui';

export default function ERPItemsRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the unified products page with advanced view
    console.log('🔄 [ERP Items] Redirecting to unified products page');
    router.replace('/store/products?view=advanced');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">إعادة توجيه إلى إدارة المنتجات الموحدة...</p>
        <p className="mt-2 text-sm text-gray-500">تم دمج إدارة العناصر مع إدارة المنتجات</p>
      </div>
    </div>
  );
}
