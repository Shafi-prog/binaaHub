'use client'

import Link from 'next/link'

export default function FilterSearchPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">تصفية متقدمة</h1>
      <p className="text-gray-600 mb-4">هذه صفحة مؤقتة لإعدادات التصفية المتقدمة.</p>
      <Link href="/store/search" className="text-blue-600 hover:underline">العودة للبحث</Link>
    </div>
  )
}
