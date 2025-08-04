'use client';

import React from 'react';
import { Store, Package, ShoppingCart, BarChart3, TrendingUp } from 'lucide-react';

export default function StoreTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">إدارة المتجر - ERP</h2>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          إضافة منتج جديد
        </button>
      </div>

      {/* ERP Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <Package className="w-10 h-10 text-blue-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold">المنتجات</h3>
          <p className="text-xl font-bold text-blue-600 mt-1">156</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <ShoppingCart className="w-10 h-10 text-green-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold">طلبات جديدة</h3>
          <p className="text-xl font-bold text-green-600 mt-1">23</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <BarChart3 className="w-10 h-10 text-orange-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold">طلبات مؤكدة</h3>
          <p className="text-xl font-bold text-orange-600 mt-1">45</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <TrendingUp className="w-10 h-10 text-purple-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold">إجمالي المبيعات</h3>
          <p className="text-xl font-bold text-purple-600 mt-1">8</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
          <Store className="w-10 h-10 text-red-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold">العائد الشهري</h3>
          <p className="text-xl font-bold text-red-600 mt-1">125K</p>
        </div>
      </div>

      {/* ERP Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Management */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Package className="w-5 h-5 ml-2" />
            إدارة المخزون
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">المنتجات المتاحة</span>
              <span className="font-semibold">142</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">منتجات نفدت</span>
              <span className="font-semibold text-red-600">14</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">إنذار مخزون منخفض</span>
              <span className="font-semibold text-orange-600">8</span>
            </div>
          </div>
          <button className="w-full mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
            إدارة المخزون
          </button>
        </div>

        {/* Orders Management */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <ShoppingCart className="w-5 h-5 ml-2" />
            إدارة الطلبات
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">طلبات جديدة</span>
              <span className="font-semibold text-green-600">23</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">قيد المعالجة</span>
              <span className="font-semibold text-blue-600">45</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">تم التسليم</span>
              <span className="font-semibold">187</span>
            </div>
          </div>
          <button className="w-full mt-4 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
            معالجة الطلبات
          </button>
        </div>

        {/* Sales Analytics */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 ml-2" />
            تحليل المبيعات
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">مبيعات اليوم</span>
              <span className="font-semibold">12,500 ريال</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">مبيعات الشهر</span>
              <span className="font-semibold">125,000 ريال</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">نمو المبيعات</span>
              <span className="font-semibold text-green-600">+15%</span>
            </div>
          </div>
          <button className="w-full mt-4 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors">
            عرض التقارير
          </button>
        </div>
      </div>

      {/* Customer Search & Communication */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">البحث عن العملاء والتسويق</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">عملاء مسجلون</h4>
            <p className="text-gray-600 text-sm mb-3">ابحث عن العملاء المسجلين لتقديم عروض خاصة</p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              البحث عن العملاء
            </button>
          </div>
          <div>
            <h4 className="font-semibold mb-2">حملات تسويقية</h4>
            <p className="text-gray-600 text-sm mb-3">إرسال عروض وإشعارات للعملاء المستهدفين</p>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              إنشاء حملة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
