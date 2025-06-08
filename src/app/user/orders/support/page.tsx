// صفحة تواصل مع المتاجر
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Send } from 'lucide-react';

interface Message {
  id: number;
  store: string;
  text: string;
  sentAt: string;
}

const initialMessages: Message[] = [
  { id: 1, store: 'متجر البناء الحديث', text: 'هل يمكن تعديل موعد التسليم؟', sentAt: '2025-06-04 10:30' },
  { id: 2, store: 'مواد الشرقية', text: 'هل يوجد خصم على الكميات الكبيرة؟', sentAt: '2025-06-03 15:12' },
];

export default function SupportStoresPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [form, setForm] = useState({ store: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.store.trim() || !form.text.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      setMessages((prev) => [
        { id: Date.now(), store: form.store, text: form.text, sentAt: new Date().toLocaleString('ar-EG') },
        ...prev,
      ]);
      setForm({ store: '', text: '' });
      setSubmitting(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex flex-col items-center justify-center font-tajawal py-8">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full text-center border border-purple-200">
        <div className="flex flex-col items-center mb-6">
          <MessageCircle className="w-12 h-12 text-purple-500 mb-2" />
          <h1 className="text-3xl font-bold text-purple-800 mb-2">تواصل مع المتاجر</h1>
          <p className="text-gray-600">راسل المتاجر مباشرة بخصوص طلباتك أو استفساراتك.</p>
        </div>
        {/* Support Form */}
        <form onSubmit={handleSubmit} className="mb-8 bg-purple-50 rounded-lg p-4 border border-purple-100">
          <input
            name="store"
            value={form.store}
            onChange={handleChange}
            placeholder="اسم المتجر أو رقم الطلب"
            className="w-full rounded p-2 border border-purple-200 mb-2 text-right"
            required
          />
          <textarea
            name="text"
            value={form.text}
            onChange={handleChange}
            placeholder="اكتب رسالتك هنا..."
            className="w-full rounded p-2 border border-purple-200 mb-2 text-right resize-none"
            rows={2}
            required
          />
          <button
            type="submit"
            disabled={submitting || !form.store.trim() || !form.text.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition disabled:opacity-50 flex items-center gap-2 justify-center"
          >
            <Send className="w-5 h-5" /> {submitting ? 'جاري الإرسال...' : 'إرسال'}
          </button>
        </form>
        {/* Messages List */}
        <div className="space-y-4 mb-6">
          {messages.length === 0 && <div className="text-gray-400">لا توجد رسائل بعد.</div>}
          {messages.map((msg) => (
            <div key={msg.id} className="bg-purple-50 border border-purple-100 rounded-lg p-4 text-right flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <div className="text-purple-900 font-medium mb-1">{msg.text}</div>
                <div className="text-xs text-gray-500">إلى: {msg.store}</div>
              </div>
              <div className="text-xs text-gray-400">{msg.sentAt}</div>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link href="/user/orders" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition">العودة للطلبات</Link>
        </div>
      </div>
    </div>
  );
}
