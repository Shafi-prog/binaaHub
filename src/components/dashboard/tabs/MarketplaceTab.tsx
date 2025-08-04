'use client';

import React from 'react';
import { ShoppingCart, Package, Truck, CreditCard } from 'lucide-react';

export default function MarketplaceTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">السوق</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          تصفح المنتجات
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <Package className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">المنتجات</h3>
          <p className="text-gray-600 mt-2">تصفح المواد والمعدات</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <Truck className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">الخدمات</h3>
          <p className="text-gray-600 mt-2">خدمات النقل والتوصيل</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <ShoppingCart className="w-12 h-12 text-orange-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">طلباتي</h3>
          <p className="text-gray-600 mt-2">متابعة الطلبات الحالية</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <CreditCard className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">المدفوعات</h3>
          <p className="text-gray-600 mt-2">إدارة المدفوعات</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">آخر الطلبات</h3>
        <p className="text-gray-600">سيتم عرض آخر طلباتك هنا...</p>
      </div>
    </div>
  );
}
