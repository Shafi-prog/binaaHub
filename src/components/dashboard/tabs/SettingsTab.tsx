'use client';

import React from 'react';
import { Settings, User, Shield, Bell, Palette, Globe } from 'lucide-react';

export default function SettingsTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">الإعدادات</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center mb-4">
            <User className="w-6 h-6 text-blue-600 ml-3" />
            <h3 className="text-lg font-semibold">إعدادات الملف الشخصي</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
              <input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                     defaultValue="أحمد محمد" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
              <input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                     defaultValue="ahmed@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
              <input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                     defaultValue="+966501234567" />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center mb-4">
            <Shield className="w-6 h-6 text-green-600 ml-3" />
            <h3 className="text-lg font-semibold">إعدادات الأمان</h3>
          </div>
          <div className="space-y-4">
            <button className="w-full text-right px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              تغيير كلمة المرور
            </button>
            <button className="w-full text-right px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              تفعيل المصادقة الثنائية
            </button>
            <button className="w-full text-right px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              مراجعة الجلسات النشطة
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center mb-4">
            <Bell className="w-6 h-6 text-orange-600 ml-3" />
            <h3 className="text-lg font-semibold">إعدادات الإشعارات</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>إشعارات البريد الإلكتروني</span>
              <input type="checkbox" className="rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span>إشعارات الهاتف</span>
              <input type="checkbox" className="rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span>تحديثات المشروع</span>
              <input type="checkbox" className="rounded" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span>تحديثات الطلبات</span>
              <input type="checkbox" className="rounded" defaultChecked />
            </div>
          </div>
        </div>

        {/* App Preferences */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center mb-4">
            <Palette className="w-6 h-6 text-purple-600 ml-3" />
            <h3 className="text-lg font-semibold">تفضيلات التطبيق</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">اللغة</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">المنطقة الزمنية</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="riyadh">الرياض (GMT+3)</option>
                <option value="mecca">مكة (GMT+3)</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span>الوضع المظلم</span>
              <input type="checkbox" className="rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          حفظ التغييرات
        </button>
      </div>
    </div>
  );
}
