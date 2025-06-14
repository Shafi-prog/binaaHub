'use client';

import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-center p-8">
      <h1 className="text-5xl font-bold text-red-600 mb-4">403</h1>
      <p className="text-xl text-gray-700 mb-8">عذرًا، لا تملك صلاحية الوصول إلى هذه الصفحة.</p>
      <Link
        href="/"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold"
      >
        العودة إلى الرئيسية
      </Link>
    </main>
  );
}
