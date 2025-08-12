"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';

export default function E2EAddToCartHelper() {
  const { addToCart, setProjectId } = useCart();
  const search = useSearchParams();
  const router = useRouter();

  const addSample = () => {
    const projId = search?.get('projectId') || 'e2e-project';
    setProjectId(projId);
    addToCart({
      id: 'e2e-item-1',
      name: 'E2E Test Item',
      price: 99,
      image: '',
      storeId: 'store-1',
      storeName: 'E2E Store'
    } as any);
    // انتقل إلى صفحة الدفع مع الحفاظ على حالة السلة عبر SPA
    setTimeout(() => {
      router.push(`/user/cart/checkout?projectId=${encodeURIComponent(projId)}`);
    }, 50);
  };

  return (
    <div className="container mx-auto p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">E2E: Add To Cart Helper</h1>
      <p className="text-gray-600 mb-4">هذه الصفحة تضيف عنصرًا تجريبيًا للسلة وتضبط projectId.</p>
      <Button onClick={addSample} data-test="e2e-add-cart">إضافة عنصر تجريبي للسلة</Button>
    </div>
  );
}
