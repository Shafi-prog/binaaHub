import React from 'react';
import { EnhancedCard, Button } from '@/components/ui/enhanced-components';

export default function UserProjectsPage() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">مشاريعي</h1>
        <p className="text-gray-600">إدارة وتتبع جميع مشاريعك</p>
      </div>

      <EnhancedCard className="p-12 text-center">
        <div className="text-gray-400 text-6xl mb-4">🏗️</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد مشاريع حالياً</h3>
        <p className="text-gray-500 mb-4">ابدأ مشروعك الأول معنا</p>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          إنشاء مشروع جديد
        </Button>
      </EnhancedCard>
    </div>
  );
}
