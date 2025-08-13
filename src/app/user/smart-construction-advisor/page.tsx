"use client";
import React, { useState } from 'react';
import type { Advice } from '@/types/advice';

export default function SmartConstructionAdvisorPage() {
  const [projectType, setProjectType] = useState('residential');
  const [constructionPhase, setConstructionPhase] = useState('planning');
  const [location, setLocation] = useState('KSA');
  const [specificQuestion, setSpecificQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [advice, setAdvice] = useState<Advice | null>(null);

  const requestAdvice = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAdvice(null);
    try {
      const res = await fetch('/api/ai/advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectType, constructionPhase, location, specificQuestion }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `Request failed (${res.status})`);
      }
      const data: Advice = await res.json();
      setAdvice(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to get advice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">المستشار الذكي للبناء</h1>
            <p className="text-lg text-gray-600">نصائح ذكية ومخصصة لمشروع البناء الخاص بك</p>
          </div>

          <form onSubmit={requestAdvice} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نوع المشروع</label>
                <select
                  className="w-full border rounded-lg p-2"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                >
                  <option value="residential">سكني</option>
                  <option value="commercial">تجاري</option>
                  <option value="industrial">صناعي</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">مرحلة البناء</label>
                <select
                  className="w-full border rounded-lg p-2"
                  value={constructionPhase}
                  onChange={(e) => setConstructionPhase(e.target.value)}
                >
                  <option value="planning">التخطيط</option>
                  <option value="design">التصميم</option>
                  <option value="execution">التنفيذ</option>
                  <option value="handover">التسليم</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الموقع</label>
                <input
                  className="w-full border rounded-lg p-2"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="KSA"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">سؤال محدد (اختياري)</label>
                <textarea
                  className="w-full border rounded-lg p-2"
                  rows={3}
                  value={specificQuestion}
                  onChange={(e) => setSpecificQuestion(e.target.value)}
                  placeholder="اكتب سؤالك هنا"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'جاري التحليل...' : 'الحصول على النصائح'}
              </button>
              {error && <span className="text-red-600 text-sm">{error}</span>}
            </div>
          </form>

          {advice && (
            <div className="mt-8 space-y-6">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h2 className="text-xl font-semibold mb-2">النصائح (عربي)</h2>
                <p className="text-gray-800 leading-relaxed">{advice.text_ar}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h2 className="text-xl font-semibold mb-2">Advice (English)</h2>
                <p className="text-gray-800 leading-relaxed">{advice.text_en}</p>
              </div>

              {advice.sbcReferences && advice.sbcReferences.length > 0 && (
                <div className="bg-white rounded-lg p-4 border">
                  <h3 className="font-semibold text-gray-900 mb-3">مراجع كود البناء السعودي (SBC)</h3>
                  <ul className="list-disc pr-6 text-gray-700">
                    {advice.sbcReferences.map((ref, idx) => (
                      <li key={idx} className="mb-1">
                        <span className="font-medium">{ref.code}</span> — {ref.description_ar}
                        <span className="text-gray-500"> ( {ref.description_en} )</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Simple feature teasers */}
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <h3 className="font-semibold text-gray-900 mb-2">تحليل التكاليف</h3>
              <p className="text-gray-600 text-sm">تحليل ذكي لتكاليف مشروعك</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <h3 className="font-semibold text-gray-900 mb-2">اختيار المواد</h3>
              <p className="text-gray-600 text-sm">نصائح لاختيار أفضل المواد</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <h3 className="font-semibold text-gray-900 mb-2">جدولة المشروع</h3>
              <p className="text-gray-600 text-sm">تخطيط زمني محسن للمشروع</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
