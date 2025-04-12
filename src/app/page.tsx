'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col font-tajawal">
      <section className="flex flex-col md:flex-row items-center justify-center flex-1">
        {/* Right side - Logo only */}
        <div className="md:w-1/2 w-full bg-gray-100 flex items-center justify-center p-10">
          <img src="/logo.png" alt="شعار بناء" className="w-60 h-60 object-contain" />
        </div>

        {/* Left side - Title + buttons */}
        <div className="md:w-1/2 w-full bg-white flex flex-col items-center justify-center p-10 text-right">
          <h1 className="text-4xl font-bold text-blue-900 mb-4 text-center">
            مرحبًا بك في منصة البناء الذكية
          </h1>
          <p className="text-gray-700 mb-6 max-w-md text-center">
            نوفر لك كل ما تحتاجه لتبدأ مشروعك بثقة، من المواد، الحاسبات، التصاميم، وحتى التوصيل.
          </p>

          <div className="flex flex-col gap-4 w-full max-w-sm">
            <Link
              href="/signup"
              className="bg-blue-600 text-white text-center py-3 rounded-md hover:bg-blue-700 transition"
            >
              سجل كمستخدم
            </Link>
            <Link
              href="/signup"
              className="bg-orange-500 text-white text-center py-3 rounded-md hover:bg-orange-600 transition"
            >
              سجل كمتجر
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
