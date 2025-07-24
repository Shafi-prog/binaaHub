import React, { useState } from 'react';
import { Typography, EnhancedCard, Button } from '@/core/shared/components/ui/enhanced-components';

const finishingTypes = [
  'عادي',
  'فاخر',
  'سوبر ديلوكس',
];

export default function CostCalculatorPage() {
  const [form, setForm] = useState({
    floors: '1',
    length: '',
    width: '',
    finishing: finishingTypes[0],
    annex: false,
  });
  const [result, setResult] = useState<number|null>(null);

  const handleCalculate = () => {
    // Simple estimation logic (replace with real logic as needed)
    const area = Number(form.length) * Number(form.width);
    let baseCost = area * 500;
    if (form.floors === '2') baseCost *= 1.8;
    if (form.finishing === 'فاخر') baseCost *= 1.2;
    if (form.finishing === 'سوبر ديلوكس') baseCost *= 1.5;
    if (form.annex) baseCost += 30000;
    setResult(baseCost);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 font-tajawal">
      <div className="container mx-auto px-6 py-8 max-w-xl">
        <EnhancedCard variant="elevated" className="p-8 mb-8">
          <Typography variant="heading" size="2xl" weight="bold" className="mb-4 text-blue-800">
            حاسبة تكاليف البناء
          </Typography>
          <div className="mb-4">
            <label className="block mb-1">عدد الأدوار</label>
            <select className="w-full border rounded px-2 py-1" value={form.floors} onChange={e => setForm({ ...form, floors: e.target.value })}>
              <option value="1">دور واحد</option>
              <option value="2">دورين</option>
            </select>
          </div>
          <div className="mb-4 flex gap-2">
            <div className="flex-1">
              <label className="block mb-1">الطول (متر)</label>
              <input type="number" className="w-full border rounded px-2 py-1" value={form.length} onChange={e => setForm({ ...form, length: e.target.value })} />
            </div>
            <div className="flex-1">
              <label className="block mb-1">العرض (متر)</label>
              <input type="number" className="w-full border rounded px-2 py-1" value={form.width} onChange={e => setForm({ ...form, width: e.target.value })} />
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1">نوع التشطيب</label>
            <select className="w-full border rounded px-2 py-1" value={form.finishing} onChange={e => setForm({ ...form, finishing: e.target.value })}>
              {finishingTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <div className="mb-4 flex items-center gap-2">
            <input type="checkbox" id="annex" checked={form.annex} onChange={e => setForm({ ...form, annex: e.target.checked })} />
            <label htmlFor="annex">هل يوجد ملحق؟</label>
          </div>
          <Button onClick={handleCalculate} className="bg-blue-600 text-white rounded px-4 py-2">إضافة</Button>
        </EnhancedCard>
        {result !== null && (
          <EnhancedCard variant="elevated" className="p-6 bg-green-50 border-green-200">
            <Typography variant="subheading" size="lg" weight="semibold" className="text-green-800 mb-2">
              التقدير التقريبي لتكلفة البناء
            </Typography>
            <Typography variant="heading" size="2xl" weight="bold" className="text-green-700">
              {result.toLocaleString('en-US')} ر.س
            </Typography>
          </EnhancedCard>
        )}
      </div>
    </main>
  );
}
