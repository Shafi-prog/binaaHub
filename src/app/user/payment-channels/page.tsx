// صفحة قنوات الدفع
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { CreditCard, PlusCircle } from 'lucide-react';


export const dynamic = 'force-dynamic'
// Force dynamic rendering to avoid SSG auth context issues


interface Channel {
  id: number;
  name: string;
  type: string;
  details: string;
}

const initialChannels: Channel[] = [
  { id: 1, name: 'مدى', type: 'بطاقة بنكية', details: 'جميع البنوك السعودية' },
  { id: 2, name: 'Apple Pay', type: 'محفظة إلكترونية', details: 'أجهزة Apple فقط' },
  { id: 3, name: 'تحويل بنكي', type: 'حوالة مصرفية', details: 'IBAN متاح بعد الطلب' },
];

export default function PaymentChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>(initialChannels);
  const [form, setForm] = useState({ name: '', type: '', details: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.type.trim() || !form.details.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      setChannels((prev) => [
        { id: Date.now(), name: form.name, type: form.type, details: form.details },
        ...prev,
      ]);
      setForm({ name: '', type: '', details: '' });
      setSubmitting(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 flex flex-col items-center justify-center font-tajawal py-8">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full text-center border border-pink-200">
        <div className="flex flex-col items-center mb-6">
          <CreditCard className="w-12 h-12 text-pink-500 mb-2" />
          <h1 className="text-3xl font-bold text-pink-800 mb-2">قنوات الدفع</h1>
          <p className="text-gray-600">اختر طريقة الدفع الأنسب لك أو اقترح قناة جديدة.</p>
        </div>
        {/* Payment Channels List */}
        <div className="space-y-4 mb-8">
          {channels.length === 0 && <div className="text-gray-400">لا توجد قنوات دفع متاحة بعد.</div>}
          {channels.map((ch) => (
            <div key={ch.id} className="bg-pink-50 border border-pink-100 rounded-lg p-4 text-right flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <div className="text-pink-900 font-medium mb-1">{ch.name}</div>
                <div className="text-xs text-gray-500">{ch.type}</div>
                <div className="text-xs text-gray-400">{ch.details}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Suggest Channel Form */}
        <form onSubmit={handleSubmit} className="mb-8 bg-pink-50 rounded-lg p-4 border border-pink-100">
          <div className="flex items-center gap-2 mb-2">
            <PlusCircle className="w-5 h-5 text-pink-600" />
            <span className="font-bold text-pink-700">اقترح قناة دفع جديدة</span>
          </div>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="اسم القناة (مثال: PayPal)"
            className="w-full rounded p-2 border border-pink-200 mb-2 text-right"
            required
          />
          <input
            name="type"
            value={form.type}
            onChange={handleChange}
            placeholder="نوع القناة (بطاقة، محفظة، تحويل...)"
            className="w-full rounded p-2 border border-pink-200 mb-2 text-right"
            required
          />
          <input
            name="details"
            value={form.details}
            onChange={handleChange}
            placeholder="تفاصيل إضافية (اختياري)"
            className="w-full rounded p-2 border border-pink-200 mb-2 text-right"
          />
          <button
            type="submit"
            disabled={submitting || !form.name.trim() || !form.type.trim()}
            className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg font-medium transition disabled:opacity-50"
          >
            {submitting ? 'جاري الإرسال...' : 'إرسال الاقتراح'}
          </button>
        </form>
        <div className="mt-8">
          <Link href="/cart" className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg font-medium transition">العودة للسلة</Link>
        </div>
      </div>
    </div>
  );
}


