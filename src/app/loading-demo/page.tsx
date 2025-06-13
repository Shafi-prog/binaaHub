"use client";

import { useState } from 'react';
import { EnhancedLoading } from '@/components/ui/enhanced-loading';
import { Button } from '@/components/ui/button';

export default function LoadingDemoPage() {
  const [currentDemo, setCurrentDemo] = useState<'fullscreen' | 'card' | 'small' | 'medium'>('fullscreen');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">تجربة شاشات التحميل المحسنة</h1>
        
        {/* Demo Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <Button 
            onClick={() => setCurrentDemo('fullscreen')}
            variant={currentDemo === 'fullscreen' ? 'default' : 'outline'}
          >
            شاشة كاملة
          </Button>
          <Button 
            onClick={() => setCurrentDemo('medium')}
            variant={currentDemo === 'medium' ? 'default' : 'outline'}
          >
            متوسط
          </Button>
          <Button 
            onClick={() => setCurrentDemo('small')}
            variant={currentDemo === 'small' ? 'default' : 'outline'}
          >
            صغير
          </Button>
          <Button 
            onClick={() => setCurrentDemo('card')}
            variant={currentDemo === 'card' ? 'default' : 'outline'}
          >
            بطاقة
          </Button>
        </div>

        {/* Demo Display */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {currentDemo === 'fullscreen' && (
            <div style={{ height: '600px' }}>
              <EnhancedLoading 
                title="جارٍ تحميل البيانات..." 
                subtitle="يرجى الانتظار قليلاً"
                showLogo={true}
                size="lg"
                fullScreen={true}
              />
            </div>
          )}

          {currentDemo === 'medium' && (
            <div className="p-8">
              <EnhancedLoading 
                title="جارٍ معالجة الطلب..." 
                subtitle="سيكتمل في ثوانٍ معدودة"
                showLogo={true}
                size="md"
                fullScreen={false}
              />
            </div>
          )}

          {currentDemo === 'small' && (
            <div className="p-8">
              <EnhancedLoading 
                title="جارٍ الحفظ..." 
                subtitle="الرجاء الانتظار"
                showLogo={false}
                size="sm"
                fullScreen={false}
              />
            </div>
          )}

          {currentDemo === 'card' && (
            <div className="p-8 space-y-6">
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">مثال: تحميل المنتجات</h3>
                <EnhancedLoading 
                  title="جارٍ تحميل المنتجات..." 
                  subtitle="جاري جلب البيانات من الخادم"
                  showLogo={true}
                  size="md"
                  fullScreen={false}
                />
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">مثال: حفظ التغييرات</h3>
                <EnhancedLoading 
                  title="جارٍ الحفظ..." 
                  subtitle="يتم حفظ البيانات"
                  showLogo={false}
                  size="sm"
                  fullScreen={false}
                />
              </div>
            </div>
          )}
        </div>

        {/* Features List */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">الميزات المحسنة للتحميل:</h2>
          <ul className="space-y-2 text-gray-600">
            <li>✅ تصميم عصري مع تأثيرات متحركة</li>
            <li>✅ دعم RTL والنصوص العربية</li>
            <li>✅ أحجام متعددة (صغير، متوسط، كبير)</li>
            <li>✅ خيارات شاشة كاملة أو بطاقة</li>
            <li>✅ رسوم متحركة متقدمة ونقاط التحميل</li>
            <li>✅ تأثيرات بصرية (blur، gradient، shadows)</li>
            <li>✅ عناصر متحركة في الخلفية</li>
            <li>✅ استجابة لجميع أحجام الشاشات</li>
            <li>✅ إمكانية تخصيص النصوص والرموز</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
