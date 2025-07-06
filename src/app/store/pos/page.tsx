'use client';

import React from 'react';
import EnhancedStorePOS from '@/components/store/pos/EnhancedStorePOS';

export default function StorePOSPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <h1 className="text-2xl font-bold text-gray-900">نقطة البيع (POS)</h1>
            <p className="text-gray-600">نظام نقطة البيع المتقدم مع البحث عن العملاء والمخزون</p>
          </div>
        </div>
      </div>
      
      <EnhancedStorePOS />
    </div>
  );
}
