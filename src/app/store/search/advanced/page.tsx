'use client'

import Link from 'next/link'

export default function AdvancedSearchPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">بحث مخصص</h1>
      <p className="text-gray-600 mb-4">هذه صفحة مؤقتة لواجهة البحث المخصص.</p>
      <Link href="/store/search" className="text-blue-600 hover:underline">العودة للبحث</Link>
    </div>
  )
}
