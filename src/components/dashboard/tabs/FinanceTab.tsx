'use client';

import React from 'react';
import { Wallet, TrendingUp, Receipt, PiggyBank } from 'lucide-react';

export default function FinanceTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">المالية والمصاريف</h2>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          إضافة مصروف
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <Wallet className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">الرصيد الحالي</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">45,000 ريال</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">إجمالي المصاريف</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">125,000 ريال</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <Receipt className="w-12 h-12 text-orange-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">الفواتير المعلقة</h3>
          <p className="text-2xl font-bold text-orange-600 mt-2">12</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <PiggyBank className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">المدخرات</h3>
          <p className="text-2xl font-bold text-purple-600 mt-2">25,000 ريال</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">آخر المعاملات</h3>
          <p className="text-gray-600">سيتم عرض آخر المعاملات المالية هنا...</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">تقرير الإنفاق الشهري</h3>
          <p className="text-gray-600">رسم بياني لتطور الإنفاق...</p>
        </div>
      </div>
    </div>
  );
}
