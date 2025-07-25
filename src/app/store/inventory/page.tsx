'use client';

import React from 'react';
import EnhancedInventoryManagement from '@/core/shared/components/EnhancedInventoryManagement';

export const dynamic = 'force-dynamic'

export default function StoreInventoryPage() {
  return (
    <div className="p-6">
      <EnhancedInventoryManagement />
    </div>
  );
}


