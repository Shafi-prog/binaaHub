'use client';

import React from 'react';
import { FileText, Download, Share2, BarChart3, Calendar } from 'lucide-react';

export default function ReportsTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">التقارير الذكية</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          إنشاء تقرير جديد
        </button>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center mb-4">
            <FileText className="w-8 h-8 text-blue-600 ml-3" />
            <div>
              <h3 className="text-lg font-semibold">التقرير الختامي للمشروع</h3>
              <p className="text-sm text-gray-600">تقرير شامل مع الذكاء الاصطناعي</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div>• صور المراحل مرتبة زمنياً</div>
            <div>• تفاصيل العقود والفريق</div>
            <div>• قائمة المصاريف والفواتير</div>
            <div>• الضمانات والوثائق</div>
            <div>• تحليل ذكي بالـ AI</div>
          </div>
          <button className="w-full mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
            إنشاء تقرير ختامي
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center mb-4">
            <BarChart3 className="w-8 h-8 text-green-600 ml-3" />
            <div>
              <h3 className="text-lg font-semibold">تقرير الأداء المالي</h3>
              <p className="text-sm text-gray-600">تحليل المصاريف والميزانية</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div>• تحليل المصاريف حسب الفئة</div>
            <div>• مقارنة الميزانية المخططة والفعلية</div>
            <div>• توقعات التكلفة</div>
            <div>• تحليل الموردين</div>
          </div>
          <button className="w-full mt-4 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
            تقرير مالي
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center mb-4">
            <Calendar className="w-8 h-8 text-orange-600 ml-3" />
            <div>
              <h3 className="text-lg font-semibold">تقرير الجدولة</h3>
              <p className="text-sm text-gray-600">تتبع الجدول الزمني والتقدم</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div>• جدولة المراحل</div>
            <div>• تتبع التقدم</div>
            <div>• التأخيرات والمشاكل</div>
            <div>• توقعات الإنجاز</div>
          </div>
          <button className="w-full mt-4 px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors">
            تقرير زمني
          </button>
        </div>
      </div>

      {/* Previous Reports */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">التقارير السابقة</h3>
        
        <div className="space-y-4">
          {[
            {
              id: 1,
              title: 'التقرير الختامي - مشروع فيلا العائلة',
              type: 'تقرير ختامي',
              date: '2024-01-15',
              status: 'مكتمل',
              size: '2.5 MB'
            },
            {
              id: 2,
              title: 'تقرير مالي - الربع الأول 2024',
              type: 'تقرير مالي',
              date: '2024-01-10',
              status: 'مكتمل',
              size: '1.8 MB'
            },
            {
              id: 3,
              title: 'تقرير التقدم - مجمع تجاري',
              type: 'تقرير تقدم',
              date: '2024-01-05',
              status: 'قيد الإنشاء',
              size: '-'
            }
          ].map((report) => (
            <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3 space-x-reverse">
                <FileText className="w-8 h-8 text-gray-400" />
                <div>
                  <h4 className="font-semibold">{report.title}</h4>
                  <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-600">
                    <span>{report.type}</span>
                    <span>{new Date(report.date).toLocaleDateString('ar-SA')}</span>
                    <span>{report.size}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 space-x-reverse">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  report.status === 'مكتمل' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {report.status}
                </span>
                
                {report.status === 'مكتمل' && (
                  <>
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
