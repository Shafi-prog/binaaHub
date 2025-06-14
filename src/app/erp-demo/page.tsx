'use client';

import { useState } from 'react';
import CompleteERPSystem from '@/components/erp/CompleteERPSystem';
import { Card } from '@/components/ui';
import { 
  Store, 
  BarChart3, 
  Users, 
  Package, 
  FileText, 
  Settings,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export default function ERPDemoPage() {
  const [showERP, setShowERP] = useState(false);

  if (showERP) {
    return <CompleteERPSystem />;
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            نظام إدارة المتجر الشامل
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            نظام ERP متكامل مع جميع الميزات المطلوبة - جاهز للاستخدام المباشر
          </p>
          <button
            onClick={() => setShowERP(true)}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center mx-auto"
          >
            <Store className="w-6 h-6 ml-2" />
            عرض النظام الكامل
            <ArrowRight className="w-5 h-5 mr-2" />
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Dashboard */}
          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">لوحة التحكم</h3>
            <p className="text-gray-600 mb-4">
              مؤشرات الأداء الرئيسية والتحليلات في الوقت الفعلي
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                إحصائيات المبيعات
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                رسوم بيانية تفاعلية
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                إجراءات سريعة
              </li>
            </ul>
          </Card>

          {/* CRM */}
          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">إدارة العملاء</h3>
            <p className="text-gray-600 mb-4">
              نظام CRM متكامل لإدارة العلاقات مع العملاء
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                ملفات العملاء الشاملة
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                تتبع المعاملات
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                إدارة الرقم الضريبي
              </li>
            </ul>
          </Card>

          {/* Inventory */}
          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">إدارة المخزون</h3>
            <p className="text-gray-600 mb-4">
              تتبع المخزون والتنبيهات التلقائية
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                تتبع الكميات
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                تنبيهات المخزون المنخفض
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                إدارة الموردين
              </li>
            </ul>
          </Card>

          {/* Orders */}
          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">إدارة الطلبات</h3>
            <p className="text-gray-600 mb-4">
              معالجة الطلبات من البداية إلى النهاية
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                تتبع حالة الطلب
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                حساب الضريبة التلقائي
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                تحديث المخزون
              </li>
            </ul>
          </Card>

          {/* Invoicing */}
          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">الفواتير</h3>
            <p className="text-gray-600 mb-4">
              فواتير متوافقة مع هيئة الزكاة والضريبة
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                رمز QR للفاتورة
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                امتثال ZATCA
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                تصدير PDF
              </li>
            </ul>
          </Card>

          {/* POS */}
          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">نقطة البيع</h3>
            <p className="text-gray-600 mb-4">
              واجهة حديثة لنقطة البيع
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                دفع نقدي وبالبطاقة
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                بحث سريع عن المنتجات
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                طباعة الإيصالات
              </li>
            </ul>
          </Card>
        </div>

        {/* Technical Features */}
        <div className="bg-white rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">المميزات التقنية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">MongoDB</h4>
              <p className="text-sm text-gray-600">قاعدة بيانات سحابية مرنة</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">React & Next.js</h4>
              <p className="text-sm text-gray-600">تطبيق ويب حديث وسريع</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">TypeScript</h4>
              <p className="text-sm text-gray-600">أمان الأنواع والتطوير</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-orange-600" />
              </div>
              <h4 className="font-semibold mb-2">RESTful API</h4>
              <p className="text-sm text-gray-600">واجهات برمجة موحدة</p>
            </div>
          </div>
        </div>

        {/* Integration Instructions */}
        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">كيفية التكامل</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">1. التثبيت السريع</h3>
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <code className="text-sm">
                  npm install mongodb recharts
                </code>
              </div>
              <h3 className="text-lg font-semibold mb-4">2. الاستخدام</h3>
              <div className="bg-gray-100 p-4 rounded-lg">
                <code className="text-sm">
                  import CompleteERPSystem from '@/components/erp/CompleteERPSystem';<br />
                  <br />
                  export default function StorePage() {'{'}
                  <br />
                  &nbsp;&nbsp;return &lt;CompleteERPSystem /&gt;;<br />
                  {'}'}
                </code>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">المميزات الجاهزة</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
                  <span>بيانات تجريبية للاختبار</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
                  <span>واجهات API كاملة</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
                  <span>منطق الأعمال المتكامل</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
                  <span>تصميم متجاوب</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
                  <span>دعم اللغة العربية</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
                  <span>امتثال للمعايير السعودية</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-6">
            نظام ERP متكامل وجاهز للاستخدام المباشر في متجرك
          </p>
          <button
            onClick={() => setShowERP(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-lg text-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
          >
            ابدأ الاستخدام الآن
          </button>
          <p className="text-sm text-gray-500 mt-4">
            * لا يتطلب إعداد معقد - جاهز للعمل فوراً
          </p>
        </div>
      </div>
    </div>
  );
}
