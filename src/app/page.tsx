import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">منصة بناء الذكية</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            منصة شاملة لإدارة مشاريع البناء والتشييد - تابع مشاريعك، أدر طلباتك، وراقب الضمانات بكل سهولة
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
            <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition">
              تسجيل الدخول
            </Link>
            <Link href="/signup" className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold text-lg transition">
              إنشاء حساب جديد
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
            <span className="text-4xl mb-2">🏗️</span>
            <h3 className="font-bold text-xl mb-1">إدارة المشاريع</h3>
            <p className="text-gray-500 text-center">تابع جميع مشاريعك من التخطيط حتى التسليم</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
            <span className="text-4xl mb-2">📋</span>
            <h3 className="font-bold text-xl mb-1">إدارة الطلبات</h3>
            <p className="text-gray-500 text-center">نظم طلبات المواد والخدمات بكفاءة عالية</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
            <span className="text-4xl mb-2">🛡️</span>
            <h3 className="font-bold text-xl mb-1">متابعة الضمانات</h3>
            <p className="text-gray-500 text-center">راقب ضمانات المواد والأعمال المختلفة</p>
          </div>
        </div>
      </div>
      <footer className="mt-16 text-gray-400 text-center text-sm">
        <p>© {new Date().getFullYear()} منصة بناء الذكية. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}
