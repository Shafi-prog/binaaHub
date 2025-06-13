'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui';

export default function MedusaProductsRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the unified products page with Medusa integration note
    console.log('🔄 [Medusa Products] Redirecting to unified products page');
    router.replace('/store/products?view=advanced&source=medusa');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">إعادة توجيه إلى كتالوج المنتجات الموحد...</p>
        <p className="mt-2 text-sm text-gray-500">تم دمج منتجات Medusa مع النظام الموحد</p>
      </div>
    </div>
  );
}
