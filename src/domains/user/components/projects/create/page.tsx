import React from 'react';
import { EnhancedCard, Button } from '@/components/ui/enhanced-components';

export default function ProjectCreatePage() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">إنشاء مشروع جديد</h1>
        <p className="text-gray-600">ابدأ مشروع البناء الخاص بك</p>
      </div>

      <EnhancedCard className="p-8">
        <div className="text-center mb-8">
          <div className="text-gray-400 text-6xl mb-4">🏗️</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">معالج إنشاء المشروع</h3>
          <p className="text-gray-500 mb-4">قيد التطوير - سيكون متاحاً قريباً</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <h4 className="font-semibold text-gray-900 mb-2">نوع المشروع</h4>
            <p className="text-gray-600 text-sm">سكني، تجاري، صناعي</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <h4 className="font-semibold text-gray-900 mb-2">المساحة والموقع</h4>
            <p className="text-gray-600 text-sm">تحديد المواصفات</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <h4 className="font-semibold text-gray-900 mb-2">الميزانية</h4>
            <p className="text-gray-600 text-sm">تقدير التكاليف</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            بدء إنشاء المشروع
          </Button>
        </div>
      </EnhancedCard>
    </div>
  );
}
