'use client';

import React from 'react';
import { Users, UserPlus, Calendar, FileText } from 'lucide-react';

export default function WorkforceTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">فريق العمل</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          إضافة عضو جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">إجمالي الفريق</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">15</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <UserPlus className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">المشرفين</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">3</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <Calendar className="w-12 h-12 text-orange-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">المقاولين</h3>
          <p className="text-2xl font-bold text-orange-600 mt-2">5</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <FileText className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">العقود النشطة</h3>
          <p className="text-2xl font-bold text-purple-600 mt-2">8</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">أعضاء الفريق</h3>
        <p className="text-gray-600">سيتم عرض قائمة أعضاء الفريق والعقود هنا...</p>
      </div>
    </div>
  );
}
