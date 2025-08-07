import React from 'react';
import { EnhancedCard, Button } from '@/components/ui/enhanced-components';

export default function UserProjectCreatePage() {
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
            <div className="text-blue-500 text-3xl mb-3">📋</div>
            <h4 className="font-semibold mb-2">تحديد المتطلبات</h4>
            <p className="text-gray-600 text-sm">حدد نوع المشروع والمتطلبات الأساسية</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <div className="text-green-500 text-3xl mb-3">💰</div>
            <h4 className="font-semibold mb-2">حساب التكلفة</h4>
            <p className="text-gray-600 text-sm">احصل على تقدير مفصل للتكاليف</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <div className="text-purple-500 text-3xl mb-3">🚀</div>
            <h4 className="font-semibold mb-2">بدء التنفيذ</h4>
            <p className="text-gray-600 text-sm">ابدأ مراحل التنفيذ مع متابعة التقدم</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button disabled className="px-8 py-3">
            ابدأ الآن (قريباً)
          </Button>
        </div>
      </EnhancedCard>
    </div>
  );
}
