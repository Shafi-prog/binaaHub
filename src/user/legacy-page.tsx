// @ts-nocheck
import Link from 'next/link';

export default function UserWarrantyPage() {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-700">الضمانات</h1>
        <Link href="/user/help-center/articles/warranty" className="text-blue-600 hover:underline">ما هو الضمان؟</Link>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="font-bold mb-2">لماذا الضمان مهم؟</h2>
        <ul className="list-disc pl-6 text-gray-700">
          <li>حماية حقوقك كمشتري</li>
          <li>سهولة طلب خدمة الضمان</li>
          <li>تتبع حالة الضمانات لكل منتج</li>
        </ul>
      </div>
      <div className="p-8"><h1 className="text-2xl font-bold mb-4">الضمانات</h1><p>هنا يمكنك تتبع حالة الضمانات لجميع مشترياتك.</p></div>
      <Link href="/user/help-center" className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full shadow-lg px-5 py-3 hover:bg-blue-700 z-50">مساعدة؟</Link>
    </main>
  );
}


