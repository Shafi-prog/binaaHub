'use client';

import { useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import CompleteERPSystem from '@/components/erp/CompleteERPSystem';
import { Card } from '@/components/ui';
import { 
  Store, 
  Settings, 
  ArrowRight, 
  ArrowLeft,
  BarChart3,
  Users,
  Package,
  ShoppingCart,
  FileText,
  CreditCard
} from 'lucide-react';

export default function StoreERPPage() {
  const user = useUser();
  const [showERP, setShowERP] = useState(false);

  if (showERP) {
    return (
      <div className="min-h-screen">
        <div className="bg-white shadow-sm border-b p-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <button
              onClick={() => setShowERP(false)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              العودة إلى قائمة المتاجر
            </button>
            <h1 className="text-xl font-semibold">نظام إدارة المتجر</h1>
          </div>
        </div>
        <CompleteERPSystem />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            إدارة المتجر
          </h1>
          <p className="text-gray-600">
            نظام إدارة متكامل لمتجرك مع جميع الأدوات المطلوبة
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">الإيرادات اليوم</p>
                <p className="text-2xl font-bold text-gray-900">12,350 ر.س</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">الطلبات الجديدة</p>
                <p className="text-2xl font-bold text-gray-900">23</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">العملاء الجدد</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">المنتجات</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main ERP Access */}
        <Card className="p-8 mb-8 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Store className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              نظام إدارة المتجر الشامل
            </h2>
            
            <p className="text-gray-600 mb-8">
              نظام ERP متكامل يضم جميع الأدوات التي تحتاجها لإدارة متجرك بكفاءة - 
              من إدارة العملاء والمنتجات إلى الفواتير ونقطة البيع
            </p>

            <button
              onClick={() => setShowERP(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
            >
              <Settings className="w-6 h-6 ml-2" />
              دخول نظام الإدارة
              <ArrowRight className="w-5 h-5 mr-2" />
            </button>
          </div>
        </Card>

        {/* Feature Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowERP(true)}>
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mr-3">لوحة التحكم</h3>
            </div>
            <p className="text-gray-600 mb-4">
              إحصائيات شاملة ومؤشرات أداء في الوقت الفعلي
            </p>
            <div className="flex items-center text-blue-600 hover:text-blue-800">
              <span className="text-sm font-medium">عرض التفاصيل</span>
              <ArrowRight className="w-4 h-4 mr-1" />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowERP(true)}>
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mr-3">إدارة العملاء</h3>
            </div>
            <p className="text-gray-600 mb-4">
              نظام CRM متكامل لإدارة علاقات العملاء
            </p>
            <div className="flex items-center text-green-600 hover:text-green-800">
              <span className="text-sm font-medium">إدارة العملاء</span>
              <ArrowRight className="w-4 h-4 mr-1" />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowERP(true)}>
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mr-3">إدارة المنتجات</h3>
            </div>
            <p className="text-gray-600 mb-4">
              تتبع المخزون والتنبيهات التلقائية
            </p>
            <div className="flex items-center text-purple-600 hover:text-purple-800">
              <span className="text-sm font-medium">إدارة المخزون</span>
              <ArrowRight className="w-4 h-4 mr-1" />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowERP(true)}>
            <div className="flex items-center mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mr-3">إدارة الطلبات</h3>
            </div>
            <p className="text-gray-600 mb-4">
              معالجة الطلبات من البداية إلى النهاية
            </p>
            <div className="flex items-center text-orange-600 hover:text-orange-800">
              <span className="text-sm font-medium">إدارة الطلبات</span>
              <ArrowRight className="w-4 h-4 mr-1" />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowERP(true)}>
            <div className="flex items-center mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold mr-3">إدارة الفواتير</h3>
            </div>
            <p className="text-gray-600 mb-4">
              فواتير متوافقة مع هيئة الزكاة والضريبة
            </p>
            <div className="flex items-center text-red-600 hover:text-red-800">
              <span className="text-sm font-medium">إنشاء الفواتير</span>
              <ArrowRight className="w-4 h-4 mr-1" />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowERP(true)}>
            <div className="flex items-center mb-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mr-3">نقطة البيع</h3>
            </div>
            <p className="text-gray-600 mb-4">
              واجهة حديثة ومتطورة للبيع المباشر
            </p>
            <div className="flex items-center text-indigo-600 hover:text-indigo-800">
              <span className="text-sm font-medium">البيع المباشر</span>
              <ArrowRight className="w-4 h-4 mr-1" />
            </div>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            جميع الأدوات التي تحتاجها لإدارة متجرك في مكان واحد
          </p>
          <button
            onClick={() => setShowERP(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ابدأ الآن
          </button>
        </div>
      </div>
    </div>
  );
}
