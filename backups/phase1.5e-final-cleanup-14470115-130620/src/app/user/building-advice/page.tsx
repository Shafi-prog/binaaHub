// @ts-nocheck
// صفحة نصائح البناء التفاعلية الشاملة
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Lightbulb, ArrowUpCircle, Home, Building2, Factory, ChevronLeft, ChevronRight, Calculator, Video, FileText } from 'lucide-react';


export const dynamic = 'force-dynamic'
// Force dynamic rendering to avoid SSG auth context issues


// --- أنواع المشاريع ---
const PROJECT_TYPES = [
  { key: 'residential', labelAr: 'سكني', labelEn: 'Residential', icon: <Home className="inline w-6 h-6 mr-1" /> },
  { key: 'commercial', labelAr: 'تجاري', labelEn: 'Commercial', icon: <Building2 className="inline w-6 h-6 mr-1" /> },
  { key: 'industrial', labelAr: 'صناعي', labelEn: 'Industrial', icon: <Factory className="inline w-6 h-6 mr-1" /> },
];

// --- مراحل البناء ---
const STAGES = [
  { key: 'planning', labelAr: 'مرحلة التخطيط', labelEn: 'Planning Stage' },
  { key: 'design', labelAr: 'مرحلة التصميم', labelEn: 'Design Stage' },
  { key: 'execution', labelAr: 'مرحلة التنفيذ', labelEn: 'Execution Stage' },
  { key: 'handover', labelAr: 'مرحلة التسليم', labelEn: 'Handover Stage' },
];

// --- نصائح المجتمع (موجودة سابقًا) ---
interface Advice {
  id: number;
  text: string;
  author: string;
  upvotes: number;
}
const initialAdvice: Advice[] = [
  { id: 1, text: 'ابدأ بتخطيط ميزانيتك بدقة قبل الشروع في البناء.', author: 'م. أحمد', upvotes: 7 },
  { id: 2, text: 'تأكد من اختيار مقاول موثوق واطلب عروض أسعار من أكثر من جهة.', author: 'م. سارة', upvotes: 5 },
  { id: 3, text: 'راجع كود البناء السعودي وتأكد من مطابقة جميع المخططات.', author: 'م. فهد', upvotes: 3 },
];

export default function BuildingAdvicePage() {
  // --- حالة اللغة ---
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  // --- معالج اختيار نوع المشروع ---
  const [projectType, setProjectType] = useState<string | null>(null);
  // --- مرحلة البناء الحالية ---
  const [stageIdx, setStageIdx] = useState(0);
  // --- نصائح المجتمع ---
  const [adviceList, setAdviceList] = useState<Advice[]>(initialAdvice);
  const [form, setForm] = useState({ text: '', author: '' });
  const [submitting, setSubmitting] = useState(false);

  // --- دوال نصائح المجتمع ---
  const handleUpvote = (id: number) => {
    setAdviceList((prev) => prev.map((a) => a.id === id ? { ...a, upvotes: a.upvotes + 1 } : a));
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.text.trim() || !form.author.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      setAdviceList((prev) => [
        { id: Date.now(), text: form.text, author: form.author, upvotes: 0 },
        ...prev,
      ]);
      setForm({ text: '', author: '' });
      setSubmitting(false);
    }, 600);
  };

  // --- محتوى المراحل ---
  const renderStageContent = () => {
    const stage = STAGES[stageIdx];
    if (lang === 'ar') {
      switch (stage.key) {
        case 'planning':
          return (
            <div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">نصائح التخطيط</h3>
              <ul className="list-disc pr-6 text-right mb-4 text-gray-700">
                <li>تحديد الميزانية بدقة ومراعاة التكاليف الخفية.</li>
                <li>الاطلاع على كود البناء السعودي (SBC) والتأكد من متطلبات الأرض.</li>
                <li>استشارة مهندس مختص قبل اتخاذ أي قرار.</li>
              </ul>
              {/* حاسبة ارتدادات تفاعلية */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-bold mb-2 flex items-center"><Calculator className="w-5 h-5 ml-1" />حاسبة الارتدادات</h4>
                <SetbackCalculator lang="ar" />
              </div>
              {/* قائمة مرجعية */}
              <div className="bg-white border border-blue-100 rounded-lg p-4 mb-2">
                <h5 className="font-bold mb-2">قائمة مرجعية:</h5>
                <ul className="list-check pr-6 text-sm text-gray-600">
                  <li>هل الأرض مسجلة نظاميًا؟</li>
                  <li>هل تم استخراج كروكي الأرض؟</li>
                  <li>هل تم تحديد نوع المشروع بوضوح؟</li>
                </ul>
              </div>
            </div>
          );
        case 'design':
          return (
            <div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">نصائح التصميم</h3>
              <ul className="list-disc pr-6 text-right mb-4 text-gray-700">
                <li>الالتزام بمتطلبات كود البناء السعودي للمخططات.</li>
                <li>مراعاة التهوية والإضاءة الطبيعية.</li>
                <li>مراجعة المخططات مع مكتب هندسي معتمد.</li>
              </ul>
              {/* Placeholder: حاسبة مواقف السيارات */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-bold mb-2 flex items-center"><Calculator className="w-5 h-5 ml-1" />حاسبة مواقف السيارات (قريبًا)</h4>
              </div>
              <div className="bg-white border border-blue-100 rounded-lg p-4 mb-2">
                <h5 className="font-bold mb-2">قائمة مرجعية:</h5>
                <ul className="list-check pr-6 text-sm text-gray-600">
                  <li>هل التصميم يحقق متطلبات الارتدادات والارتفاعات؟</li>
                  <li>هل تم توفير مخارج طوارئ حسب الكود؟</li>
                  <li>هل تم مراجعة العزل الحراري والصوتي؟</li>
                </ul>
              </div>
            </div>
          );
        case 'execution':
          return (
            <div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">نصائح التنفيذ</h3>
              <ul className="list-disc pr-6 text-right mb-4 text-gray-700">
                <li>العمل مع مقاول معتمد ووجود إشراف هندسي دائم.</li>
                <li>الالتزام بجدول زمني واضح ومكتوب.</li>
                <li>توثيق جميع مراحل التنفيذ بالصور والتقارير.</li>
              </ul>
              {/* Placeholder: محاكاة 3D */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-bold mb-2 flex items-center"><Video className="w-5 h-5 ml-1" />محاكاة ثلاثية الأبعاد (قريبًا)</h4>
              </div>
              <div className="bg-white border border-blue-100 rounded-lg p-4 mb-2">
                <h5 className="font-bold mb-2">قائمة مرجعية:</h5>
                <ul className="list-check pr-6 text-sm text-gray-600">
                  <li>هل تم فحص جودة المواد قبل الاستخدام؟</li>
                  <li>هل تم الالتزام بإجراءات السلامة؟</li>
                  <li>هل تم توثيق التعديلات أثناء التنفيذ؟</li>
                </ul>
              </div>
            </div>
          );
        case 'handover':
          return (
            <div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">نصائح التسليم</h3>
              <ul className="list-disc pr-6 text-right mb-4 text-gray-700">
                <li>إجراء فحص نهائي شامل للمبنى.</li>
                <li>الحصول على شهادة إتمام البناء من البلدية.</li>
                <li>توثيق جميع الضمانات والصيانة الدورية.</li>
              </ul>
              {/* Placeholder: نموذج استلام وتسليم */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-bold mb-2 flex items-center"><FileText className="w-5 h-5 ml-1" />نموذج استلام وتسليم (قريبًا)</h4>
              </div>
              <div className="bg-white border border-blue-100 rounded-lg p-4 mb-2">
                <h5 className="font-bold mb-2">قائمة مرجعية:</h5>
                <ul className="list-check pr-6 text-sm text-gray-600">
                  <li>هل تم استلام جميع الوثائق الرسمية؟</li>
                  <li>هل تم التأكد من عمل جميع الأنظمة (كهرباء، سباكة، إلخ)؟</li>
                  <li>هل تم توثيق الضمانات؟</li>
                </ul>
              </div>
            </div>
          );
        default:
          return null;
      }
    } else {
      // English content (placeholder)
      return <div className="text-center text-gray-500">English version coming soon.</div>;
    }
  };

  // --- مكون حاسبة الارتدادات ---
  function SetbackCalculator({ lang }: { lang: 'ar' | 'en' }) {
    const [landWidth, setLandWidth] = useState('');
    const [landDepth, setLandDepth] = useState('');
    const [frontSetback, setFrontSetback] = useState('');
    const [sideSetback, setSideSetback] = useState('');
    const [rearSetback, setRearSetback] = useState('');
    const [result, setResult] = useState<string | null>(null);
    const handleCalc = () => {
      if (!landWidth || !landDepth || !frontSetback || !sideSetback || !rearSetback) return;
      const w = parseFloat(landWidth), d = parseFloat(landDepth), f = parseFloat(frontSetback), s = parseFloat(sideSetback), r = parseFloat(rearSetback);
      if (isNaN(w) || isNaN(d) || isNaN(f) || isNaN(s) || isNaN(r)) return;
      const buildWidth = w - 2 * s;
      const buildDepth = d - f - r;
      setResult(`${lang === 'ar' ? 'المساحة المتاحة للبناء:' : 'Buildable area:'} ${Math.max(0, buildWidth * buildDepth)} م²`);
    };
    return (
      <div className="flex flex-col md:flex-row md:items-end gap-2 text-sm">
        <input type="number" min="1" placeholder={lang === 'ar' ? 'عرض الأرض (م)' : 'Land width (m)'} value={landWidth} onChange={e => setLandWidth(e.target.value)} className="border rounded p-1 w-28 text-right" />
        <input type="number" min="1" placeholder={lang === 'ar' ? 'عمق الأرض (م)' : 'Land depth (m)'} value={landDepth} onChange={e => setLandDepth(e.target.value)} className="border rounded p-1 w-28 text-right" />
        <input type="number" min="0" placeholder={lang === 'ar' ? 'ارتداد أمامي (م)' : 'Front setback (m)'} value={frontSetback} onChange={e => setFrontSetback(e.target.value)} className="border rounded p-1 w-28 text-right" />
        <input type="number" min="0" placeholder={lang === 'ar' ? 'ارتداد جانبي (م)' : 'Side setback (m)'} value={sideSetback} onChange={e => setSideSetback(e.target.value)} className="border rounded p-1 w-28 text-right" />
        <input type="number" min="0" placeholder={lang === 'ar' ? 'ارتداد خلفي (م)' : 'Rear setback (m)'} value={rearSetback} onChange={e => setRearSetback(e.target.value)} className="border rounded p-1 w-28 text-right" />
        <button type="button" onClick={handleCalc} className="bg-blue-600 text-white rounded px-3 py-1 font-bold">{lang === 'ar' ? 'احسب' : 'Calculate'}</button>
        {result && <span className="font-bold text-green-700 ml-2">{result}</span>}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center font-tajawal py-8">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl w-full border border-blue-200">
        {/* شريط اللغة */}
        <div className="flex justify-end mb-2">
          <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="text-blue-700 font-bold underline text-sm">{lang === 'ar' ? 'English' : 'العربية'}</button>
        </div>
        {/* مقدمة */}
        <div className="flex flex-col items-center mb-6">
          <Lightbulb className="w-12 h-12 text-yellow-400 mb-2" />
          <h1 className="text-3xl font-bold text-blue-800 mb-2">{lang === 'ar' ? 'دليل البناء السعودي التفاعلي' : 'Saudi Interactive Building Guide'}</h1>
          <p className="text-gray-600 max-w-xl text-center mb-2">
            {lang === 'ar'
              ? 'اتبع الخطوات التفاعلية لبناء مشروعك وفق كود البناء السعودي (SBC) مع أدوات، قوائم مرجعية، وروابط رسمية.'
              : 'Follow interactive steps to build your project according to the Saudi Building Code (SBC) with tools, checklists, and official resources.'}
          </p>
          <div className="flex gap-2 mt-2">
            <a href="https://www.sbc.gov.sa/" target="_blank" rel="noopener" className="text-blue-700 underline font-bold flex items-center"><FileText className="w-4 h-4 ml-1" />{lang === 'ar' ? 'موقع كود البناء السعودي' : 'SBC Official Site'}</a>
            <a href="https://www.youtube.com/watch?v=QwQwQwQwQwQ" target="_blank" rel="noopener" className="text-blue-700 underline font-bold flex items-center"><Video className="w-4 h-4 ml-1" />{lang === 'ar' ? 'فيديو تعريفي' : 'Intro Video'}</a>
          </div>
        </div>
        {/* معالج اختيار نوع المشروع */}
        {!projectType ? (
          <div className="mb-8 text-center">
            <h2 className="text-xl font-bold mb-4 text-blue-700">{lang === 'ar' ? 'اختر نوع مشروعك:' : 'Select your project type:'}</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {PROJECT_TYPES.map((type) => (
                <button key={type.key} onClick={() => setProjectType(type.key)} className="bg-blue-100 hover:bg-blue-200 border border-blue-300 rounded-lg px-6 py-4 text-lg font-bold text-blue-800 flex flex-col items-center min-w-[120px]">
                  {type.icon}
                  {lang === 'ar' ? type.labelAr : type.labelEn}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <button onClick={() => setProjectType(null)} className="text-blue-600 underline text-sm">{lang === 'ar' ? 'تغيير نوع المشروع' : 'Change project type'}</button>
              <span className="text-blue-900 font-bold">{lang === 'ar' ? PROJECT_TYPES.find(t => t.key === projectType)?.labelAr : PROJECT_TYPES.find(t => t.key === projectType)?.labelEn}</span>
            </div>
            {/* مراحل البناء */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <button onClick={() => setStageIdx(Math.max(0, stageIdx - 1))} disabled={stageIdx === 0} className="bg-blue-100 rounded-full p-2 disabled:opacity-40"><ChevronRight className="w-5 h-5" /></button>
              <span className="font-bold text-blue-800 text-lg">{lang === 'ar' ? STAGES[stageIdx].labelAr : STAGES[stageIdx].labelEn}</span>
              <button onClick={() => setStageIdx(Math.min(STAGES.length - 1, stageIdx + 1))} disabled={stageIdx === STAGES.length - 1} className="bg-blue-100 rounded-full p-2 disabled:opacity-40"><ChevronLeft className="w-5 h-5" /></button>
            </div>
            <div>{renderStageContent()}</div>
          </div>
        )}
        {/* قسم الموارد */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <h3 className="font-bold mb-2 text-blue-700 flex items-center"><FileText className="w-5 h-5 ml-1" />{lang === 'ar' ? 'روابط وموارد مهمة' : 'Important Resources'}</h3>
          <ul className="list-disc pr-6 text-sm text-blue-900">
            <li><a href="https://www.sbc.gov.sa/" target="_blank" rel="noopener" className="underline">{lang === 'ar' ? 'الموقع الرسمي لكود البناء السعودي' : 'SBC Official Website'}</a></li>
            <li><a href="https://www.momra.gov.sa/" target="_blank" rel="noopener" className="underline">{lang === 'ar' ? 'وزارة الشؤون البلدية والقروية' : 'Ministry of Municipal Affairs'}</a></li>
            <li><a href="/downloads/sbc-summary.pdf" className="underline">{lang === 'ar' ? 'ملخص كود البناء (PDF)' : 'SBC Summary (PDF)'}</a></li>
          </ul>
        </div>
        {/* نصائح المجتمع */}
        <div className="bg-white border border-blue-100 rounded-lg p-4 mb-8">
          <h3 className="font-bold mb-2 text-blue-700 flex items-center"><Lightbulb className="w-5 h-5 ml-1" />{lang === 'ar' ? 'نصائح المجتمع' : 'Community Advice'}</h3>
          <form onSubmit={handleSubmit} className="mb-4 bg-blue-50 rounded-lg p-3 border border-blue-100">
            <textarea
              name="text"
              value={form.text}
              onChange={handleChange}
              placeholder={lang === 'ar' ? 'اكتب نصيحة بناءة...' : 'Write a useful advice...'}
              className="w-full rounded p-2 border border-blue-200 mb-2 text-right resize-none"
              rows={2}
              required
            />
            <input
              name="author"
              value={form.author}
              onChange={handleChange}
              placeholder={lang === 'ar' ? 'اسمك (اختياري)' : 'Your name (optional)'}
              className="w-full rounded p-2 border border-blue-200 mb-2 text-right"
              maxLength={32}
            />
            <button
              type="submit"
              disabled={submitting || !form.text.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition disabled:opacity-50"
            >
              {submitting ? (lang === 'ar' ? 'جاري الإرسال...' : 'Submitting...') : (lang === 'ar' ? 'إضافة نصيحة' : 'Add Advice')}
            </button>
          </form>
          <div className="space-y-4">
            {adviceList.length === 0 && <div className="text-gray-400">{lang === 'ar' ? 'لا توجد نصائح بعد.' : 'No advice yet.'}</div>}
            {adviceList.map((advice) => (
              <div key={advice.id} className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-right flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <div className="text-blue-900 font-medium mb-1">{advice.text}</div>
                  <div className="text-xs text-gray-500">{advice.author ? (lang === 'ar' ? `بواسطة ${advice.author}` : `By ${advice.author}`) : (lang === 'ar' ? 'مستخدم مجهول' : 'Anonymous')}</div>
                </div>
                <button
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold text-sm"
                  onClick={() => handleUpvote(advice.id)}
                  aria-label={lang === 'ar' ? 'إعجاب' : 'Upvote'}
                >
                  <ArrowUpCircle className="w-5 h-5" /> {advice.upvotes}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 text-center">
          <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition">{lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</Link>
        </div>
      </div>
    </div>
  );
}


