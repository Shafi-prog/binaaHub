'use client';

import React, { useState } from 'react';
import { Typography, EnhancedCard, Button } from '@/core/shared/components/ui/enhanced-components';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calculator, Home, Building2 } from 'lucide-react';

const finishingTypes = [
  'عادي',
  'فاخر', 
  'سوبر ديلوكس',
];

export default function CostCalculatorPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    floors: '1',
    length: '',
    width: '',
    finishing: finishingTypes[0],
    annex: false,
  });
  const [result, setResult] = useState<number|null>(null);

  const handleCalculate = () => {
    const area = Number(form.length) * Number(form.width);
    let baseCost = area * 500; // Base cost per square meter
    
    if (form.floors === '2') baseCost *= 1.8;
    if (form.finishing === 'فاخر') baseCost *= 1.2;
    if (form.finishing === 'سوبر ديلوكس') baseCost *= 1.5;
    if (form.annex) baseCost += 30000;
    
    setResult(baseCost);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 font-tajawal">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            رجوع
          </Button>
          <div>
            <Typography variant="heading" size="2xl" weight="bold" className="text-gray-800">
              حاسبة التكاليف
            </Typography>
            <Typography variant="body" className="text-gray-600">
              احسب التكلفة التقديرية لمشروع البناء
            </Typography>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <EnhancedCard variant="elevated" className="p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calculator className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-800">
                  أدخل تفاصيل المشروع
                </Typography>
                <Typography variant="body" size="sm" className="text-gray-600">
                  املأ الحقول أدناه للحصول على تقدير دقيق
                </Typography>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">عدد الأدوار</label>
                <select 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  value={form.floors} 
                  onChange={e => setForm({ ...form, floors: e.target.value })}
                >
                  <option value="1">دور واحد</option>
                  <option value="2">دورين</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع التشطيب</label>
                <select 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  value={form.finishing} 
                  onChange={e => setForm({ ...form, finishing: e.target.value })}
                >
                  {finishingTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الطول (متر)</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  value={form.length} 
                  onChange={e => setForm({ ...form, length: e.target.value })} 
                  placeholder="أدخل الطول"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">العرض (متر)</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  value={form.width} 
                  onChange={e => setForm({ ...form, width: e.target.value })} 
                  placeholder="أدخل العرض"
                />
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="annex"
                  checked={form.annex} 
                  onChange={e => setForm({ ...form, annex: e.target.checked })}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="annex" className="text-sm font-medium text-gray-700">
                  هل يوجد ملحق؟
                </label>
              </div>
            </div>

            <Button 
              onClick={handleCalculate}
              variant="filled"
              size="lg"
              className="w-full mt-8"
              disabled={!form.length || !form.width}
            >
              احسب التكلفة
            </Button>
          </EnhancedCard>

          {result && (
            <EnhancedCard variant="elevated" className="p-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-green-600" />
                </div>
                <Typography variant="subheading" size="lg" weight="semibold" className="text-green-800 mb-2">
                  التكلفة التقديرية
                </Typography>
                <Typography variant="heading" size="3xl" weight="bold" className="text-green-900 mb-4">
                  {result.toLocaleString()} ر.س
                </Typography>
                <Typography variant="body" size="sm" className="text-green-700">
                  * هذا تقدير أولي وقد تختلف التكلفة الفعلية حسب المواصفات والأسعار الحالية
                </Typography>
              </div>
            </EnhancedCard>
          )}
        </div>
      </div>
    </main>
  );
}
