'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui';
import SimpleLayout from '@/components/layouts/SimpleLayout';
import { verifyTempAuth } from '@/lib/temp-auth';
import { Package, ShoppingCart, Users, BarChart, ExternalLink, Settings } from 'lucide-react';

export default function MedusaIntegrationPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    loadMedusaIntegration();
  }, []);

  const loadMedusaIntegration = async () => {
    try {
      setLoading(true);
      setError(null);

      const authResult = await verifyTempAuth(3);
      
      if (!authResult?.user) {
        console.log('❌ [Medusa] No authenticated user found');
        router.push('/login');
        return;
      }

      const { user } = authResult;

      if (user.account_type !== 'store') {
        console.log('❌ [Medusa] User is not a store account');
        router.push('/user/dashboard');
        return;
      }

      console.log('✅ [Medusa] Store user authenticated:', user.email);
      setCurrentUser(user);

    } catch (error) {
      console.error('❌ [Medusa] Error loading integration:', error);
      setError('حدث خطأ في تحميل التكامل');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <SimpleLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 text-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">تكامل Medusa للتجارة الإلكترونية</h1>
              <p className="text-green-100 text-sm sm:text-base">
                منصة التجارة الإلكترونية المتقدمة مع إدارة شاملة للمتجر الرقمي
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="bg-white text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors">
                <Settings size={20} />
                إعدادات التكامل
              </button>
            </div>
          </div>
        </div>

        {/* Integration Status */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Settings className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">حالة تكامل Medusa</h3>
              <p className="text-yellow-700 text-sm mb-3">
                تكامل Medusa قيد التطوير. ستتيح هذه المنصة إدارة متجرك الإلكتروني بشكل متقدم مع ميزات التجارة الإلكترونية الحديثة.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-white rounded-lg p-4 border border-yellow-200">
                  <h4 className="font-medium text-gray-800 mb-2">ميزات قادمة:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• إدارة كتالوج المنتجات المتقدم</li>
                    <li>• نظام الدفع المتعدد</li>
                    <li>• إدارة المخزون في الوقت الفعلي</li>
                    <li>• تحليلات التجارة الإلكترونية</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4 border border-yellow-200">
                  <h4 className="font-medium text-gray-800 mb-2">التكاملات:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• ربط مع نظام ERP الحالي</li>
                    <li>• مزامنة المنتجات والطلبات</li>
                    <li>• تقارير موحدة</li>
                    <li>• إدارة العملاء المدمجة</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Medusa Features Preview */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">ميزات منصة Medusa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
              <Package className="w-12 h-12 mx-auto mb-3 text-green-600" />
              <h3 className="font-medium text-gray-800 text-sm mb-1">كتالوج المنتجات</h3>
              <p className="text-xs text-gray-600">إدارة متقدمة للمنتجات مع المتغيرات والخيارات</p>
              <div className="mt-2 text-xs text-green-600 font-medium">قيد التطوير</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-blue-600" />
              <h3 className="font-medium text-gray-800 text-sm mb-1">إدارة الطلبات</h3>
              <p className="text-xs text-gray-600">معالجة الطلبات والمدفوعات والشحن</p>
              <div className="mt-2 text-xs text-blue-600 font-medium">قيد التطوير</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100">
              <Users className="w-12 h-12 mx-auto mb-3 text-purple-600" />
              <h3 className="font-medium text-gray-800 text-sm mb-1">إدارة العملاء</h3>
              <p className="text-xs text-gray-600">قاعدة بيانات العملاء وملفاتهم الشخصية</p>
              <div className="mt-2 text-xs text-purple-600 font-medium">قيد التطوير</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-100">
              <BarChart className="w-12 h-12 mx-auto mb-3 text-orange-600" />
              <h3 className="font-medium text-gray-800 text-sm mb-1">التحليلات</h3>
              <p className="text-xs text-gray-600">تقارير المبيعات والأداء والتحليلات</p>
              <div className="mt-2 text-xs text-orange-600 font-medium">قيد التطوير</div>
            </div>
          </div>
        </div>

        {/* Integration Plan */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">خطة التكامل</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
              <div className="bg-blue-100 p-2 rounded-lg">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">إعداد منصة Medusa</h3>
                <p className="text-sm text-gray-600">تثبيت وتكوين منصة Medusa للتجارة الإلكترونية</p>
                <div className="mt-1 text-xs text-blue-600 font-medium">المرحلة الحالية</div>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="bg-gray-100 p-2 rounded-lg">
                <span className="text-gray-600 font-bold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">ربط البيانات</h3>
                <p className="text-sm text-gray-600">مزامنة المنتجات والعملاء مع أنظمة ERP والمتجر الأساسي</p>
                <div className="mt-1 text-xs text-gray-600 font-medium">قادم</div>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="bg-gray-100 p-2 rounded-lg">
                <span className="text-gray-600 font-bold text-sm">3</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">واجهة متجر إلكتروني</h3>
                <p className="text-sm text-gray-600">إطلاق واجهة المتجر الإلكتروني للعملاء</p>
                <div className="mt-1 text-xs text-gray-600 font-medium">قادم</div>
              </div>
            </div>
          </div>
        </div>

        {/* External Links */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">روابط مفيدة</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href="https://medusajs.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <ExternalLink className="w-5 h-5 text-gray-500" />
              <div>
                <h3 className="font-medium text-gray-800">موقع Medusa</h3>
                <p className="text-sm text-gray-600">الموقع الرسمي للمنصة</p>
              </div>
            </a>
            
            <a 
              href="https://docs.medusajs.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <ExternalLink className="w-5 h-5 text-gray-500" />
              <div>
                <h3 className="font-medium text-gray-800">الوثائق</h3>
                <p className="text-sm text-gray-600">دليل التطوير والتكامل</p>
              </div>
            </a>
            
            <a 
              href="https://github.com/medusajs/medusa" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <ExternalLink className="w-5 h-5 text-gray-500" />
              <div>
                <h3 className="font-medium text-gray-800">GitHub</h3>
                <p className="text-sm text-gray-600">كود المصدر والتحديثات</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </SimpleLayout>
  );
}
