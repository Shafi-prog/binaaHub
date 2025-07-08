// @ts-nocheck
'use client'

import { Wifi, RefreshCw, Smartphone, Cloud } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        {/* Offline Icon */}
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wifi className="w-10 h-10 text-gray-400" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✕</span>
          </div>
        </div>

        {/* Title and Description */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">أنت في وضع عدم الاتصال</h1>
        <p className="text-gray-600 mb-6">
          لا يوجد اتصال بالإنترنت، ولكن يمكنك الاستمرار في استخدام بعض المزايا.
        </p>

        {/* Available Features */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-green-800 mb-3">المزايا المتاحة بدون إنترنت:</h3>
          <ul className="text-sm text-green-700 space-y-2 text-right">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              عرض المنتجات المحفوظة
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              نظام POS المحلي
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              إدارة المخزون الأساسية
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              المعاملات المحفوظة محلياً
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            إعادة المحاولة
          </button>

          <button
            onClick={() => window.location.href = '/store/pos/offline'}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Smartphone className="w-5 h-5" />
            الانتقال لنظام POS المحلي
          </button>
        </div>

        {/* PWA Features */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-3">
            <Cloud className="w-4 h-4" />
            <span>تطبيق الويب التقدمي (PWA)</span>
          </div>
          <p className="text-xs text-gray-400">
            سيتم مزامنة جميع البيانات تلقائياً عند عودة الاتصال
          </p>
        </div>

        {/* BinnaHub Branding */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            الوضع غير المتصل مدعوم من <span className="font-semibold text-green-600">BinnaHub Technology</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Phase 2 - تقنية SQLite المحلية والمزامنة التلقائية
          </p>
        </div>
      </div>
    </div>
  );
}


