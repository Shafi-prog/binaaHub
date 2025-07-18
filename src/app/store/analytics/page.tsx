// @ts-nocheck
import { Metadata } from 'next';
import MarketAnalytics from '@/components/analytics/MarketAnalytics';
import CityPriceTracking from '@/components/pricing/CityPriceTracking';
import { AdvancedReportingEngine } from '@/core/shared/components/AdvancedReportingEngine';

export const metadata: Metadata = {
  title: 'تحليلات منصة بنا المتقدمة - التحليلات والتقارير الذكية',
  description: 'نظام التحليلات الشامل مع الذكاء الاصطناعي وتتبع الأسعار والتقارير المتقدمة',
};

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">📊 تحليلات منصة بنا المتقدمة</h1>
          <p className="text-gray-600 mt-2">
            نظام التحليلات الشامل مع الذكاء الاصطناعي وتتبع الأسعار والتقارير المتقدمة
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
            <span className="px-2 py-1 bg-green-100 rounded-full">🤖 الذكاء الاصطناعي</span>
            <span className="px-2 py-1 bg-blue-100 rounded-full">📈 التحليلات الفورية</span>
            <span className="px-2 py-1 bg-purple-100 rounded-full">🏆 Phase 2 - مكتمل</span>
          </div>
        </div>

        <div className="space-y-8">
          {/* Advanced Reporting Engine */}
          <section className="mb-8">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-2">🚀 محرك التقارير المتقدم</h2>
              <p className="text-gray-600">إنشاء تقارير مخصصة بتقنية السحب والإفلات مع التصدير التلقائي</p>
            </div>
            <AdvancedReportingEngine />
          </section>

          {/* Market Analytics Section */}
          <section className="mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-2">📊 تحليل السوق الذكي</h2>
              <p className="text-gray-600">تحليلات السوق مع العلامة المائية BinnaHub ومشاركة البيانات</p>
            </div>
            <MarketAnalytics className="w-full" />
          </section>

          {/* City Price Tracking Section */}
          <section className="mb-8">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-2">🏙️ تتبع الأسعار بالمدن</h2>
              <p className="text-gray-600">مقارنة أسعار مواد البناء عبر المدن السعودية مع التحديث الفوري</p>
            </div>
            <CityPriceTracking className="w-full" />
          </section>
        </div>
      </div>
    </div>
  );
}


