'use client';

import React from 'react';

export default function SimplePOSTest() {
  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center" dir="rtl">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">نقطة البيع - اختبار</h1>
        <p className="text-xl text-gray-600">هذه صفحة اختبار لنقطة البيع</p>
        <div className="mt-8 p-4 bg-white rounded-lg shadow">
          <p className="text-green-600 font-semibold">النظام يعمل بشكل صحيح</p>
        </div>
      </div>
    </div>
  );
}
