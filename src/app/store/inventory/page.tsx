'use client';

import React from 'react';
import EnhancedInventoryManagement from '@/core/shared/components/EnhancedInventoryManagement';


export const dynamic = 'force-dynamic'
// Force dynamic rendering to avoid SSG auth context issues


export default function StoreInventoryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <h1 className="text-2xl font-bold text-gray-900">إدارة المخزون المتقدمة</h1>
            <p className="text-gray-600">نظام إدارة المخزون الشامل مع التتبع المباشر والتحليلات</p>
          </div>
        </div>
      </div>
      
      <EnhancedInventoryManagement />
    </div>
  );
}


