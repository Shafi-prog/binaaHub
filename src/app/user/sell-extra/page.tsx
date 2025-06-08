// صفحة بيع مواد فائضة
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { PackagePlus, ArrowUpCircle } from 'lucide-react';

interface ExtraMaterial {
  id: number;
  name: string;
  quantity: string;
  price: string;
  contact: string;
  upvotes: number;
}

const initialMaterials: ExtraMaterial[] = [
  { id: 1, name: 'حديد تسليح 12مم', quantity: '10 طن', price: '3500 ر.س', contact: '0501234567', upvotes: 2 },
  { id: 2, name: 'طابوق عازل', quantity: '5000 قطعة', price: '1 ر.س/قطعة', contact: '0559876543', upvotes: 1 },
];

export default function SellExtraPage() {
  const [materials, setMaterials] = useState<ExtraMaterial[]>(initialMaterials);
  const [form, setForm] = useState({ name: '', quantity: '', price: '', contact: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleUpvote = (id: number) => {
    setMaterials((prev) => prev.map((m) => m.id === id ? { ...m, upvotes: m.upvotes + 1 } : m));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.quantity.trim() || !form.price.trim() || !form.contact.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      setMaterials((prev) => [
        { id: Date.now(), name: form.name, quantity: form.quantity, price: form.price, contact: form.contact, upvotes: 0 },
        ...prev,
      ]);
      setForm({ name: '', quantity: '', price: '', contact: '' });
      setSubmitting(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center justify-center font-tajawal py-8">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full text-center border border-green-200">
        <div className="flex flex-col items-center mb-6">
          <PackagePlus className="w-12 h-12 text-green-500 mb-2" />
          <h1 className="text-3xl font-bold text-green-800 mb-2">بيع مواد فائضة</h1>
          <p className="text-gray-600">اعرض المواد الفائضة لديك ليستفيد منها الآخرون.</p>
        </div>
        {/* Material Form */}
        <form onSubmit={handleSubmit} className="mb-8 bg-green-50 rounded-lg p-4 border border-green-100">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="اسم المادة"
            className="w-full rounded p-2 border border-green-200 mb-2 text-right"
            required
          />
          <input
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            placeholder="الكمية (مثال: 10 طن، 500 قطعة)"
            className="w-full rounded p-2 border border-green-200 mb-2 text-right"
            required
          />
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="السعر (مثال: 3500 ر.س، 1 ر.س/قطعة)"
            className="w-full rounded p-2 border border-green-200 mb-2 text-right"
            required
          />
          <input
            name="contact"
            value={form.contact}
            onChange={handleChange}
            placeholder="رقم التواصل (واتساب أو جوال)"
            className="w-full rounded p-2 border border-green-200 mb-2 text-right"
            required
          />
          <button
            type="submit"
            disabled={submitting || !form.name.trim() || !form.quantity.trim() || !form.price.trim() || !form.contact.trim()}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition disabled:opacity-50"
          >
            {submitting ? 'جاري الإضافة...' : 'إضافة مادة'}
          </button>
        </form>
        {/* Materials List */}
        <div className="space-y-4 mb-6">
          {materials.length === 0 && <div className="text-gray-400">لا توجد مواد معروضة بعد.</div>}
          {materials.map((mat) => (
            <div key={mat.id} className="bg-green-50 border border-green-100 rounded-lg p-4 text-right flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <div className="text-green-900 font-medium mb-1">{mat.name} <span className="text-xs text-gray-500">({mat.quantity})</span></div>
                <div className="text-xs text-gray-500 mb-1">سعر: {mat.price}</div>
                <div className="text-xs text-gray-400">للتواصل: <a href={`https://wa.me/966${mat.contact.replace(/^0/, '')}`} target="_blank" rel="noopener noreferrer" className="underline text-green-700">{mat.contact}</a></div>
              </div>
              <button
                className="flex items-center gap-1 text-green-600 hover:text-green-800 font-bold text-sm"
                onClick={() => handleUpvote(mat.id)}
                aria-label="إعجاب"
              >
                <ArrowUpCircle className="w-5 h-5" /> {mat.upvotes}
              </button>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link href="/" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition">العودة للرئيسية</Link>
        </div>
      </div>
    </div>
  );
}
