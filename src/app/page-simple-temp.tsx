// Force dynamic rendering to prevent prerender issues
export const dynamic = 'force-dynamic';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            مرحباً بك في منصة بينا
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            منصة البناء الذكي لإدارة مشاريع البناء والتشطيب
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-blue-600 mb-4">للمستخدمين</h3>
              <p className="text-gray-600 mb-6">
                ابدأ مشروع البناء الخاص بك مع أفضل المتاجر والمقاولين
              </p>
              <Link
                href="/login"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
              >
                دخول المستخدمين
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-green-600 mb-4">للمتاجر</h3>
              <p className="text-gray-600 mb-6">
                انضم إلى منصة بينا وزد مبيعاتك مع آلاف العملاء
              </p>
              <Link
                href="/login"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-block"
              >
                دخول المتاجر
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
