import { Metadata } from 'next';
import PushNotificationManager from '@/components/notifications/PushNotificationManager';

export const metadata: Metadata = {
  title: 'إعدادات الإشعارات المتقدمة - منصة بنا',
  description: 'إدارة إعدادات الإشعارات والتنبيهات الذكية مع تقنية PWA المتقدمة',
};

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🔔 إعدادات الإشعارات المتقدمة</h1>
          <p className="text-gray-600 mt-2">
            إدارة إعدادات الإشعارات والتنبيهات الذكية مع تقنية PWA المتقدمة
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">📱 PWA مدعوم</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">🔔 إشعارات فورية</span>
            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">🏆 Phase 2 - مكتمل</span>
          </div>
        </div>

        <div className="space-y-8">
          <PushNotificationManager className="w-full" />

          {/* PWA Features Showcase */}
          <section className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">📱</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">تطبيق الويب التقدمي (PWA) - Phase 2 ✅</h3>
                <p className="text-green-100">احصل على تجربة تطبيق أصلي مع إشعارات فورية</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white/10 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">🚀 سرعة فائقة</h4>
                <p className="text-sm text-green-100">تحميل فوري وأداء متميز حتى مع ضعف الإنترنت</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">📴 يعمل بدون إنترنت</h4>
                <p className="text-sm text-green-100">استخدم الوظائف الأساسية حتى بدون اتصال</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">🔔 إشعارات محلية</h4>
                <p className="text-sm text-green-100">تلقي الإشعارات حتى عند إغلاق المتصفح</p>
              </div>
            </div>
          </section>

          {/* BinnaHub Branding */}
          <div className="text-center py-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              نظام الإشعارات المتقدم مدعوم من <span className="font-semibold text-green-600">BinnaHub Technology</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              تقنية حديثة للإشعارات الذكية والتفاعل المتقدم - Phase 2 مكتمل
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
