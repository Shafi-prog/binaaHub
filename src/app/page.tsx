import React from 'react'
import ClientIcon from '@/components/ClientIcon'
import Link from 'next/link'

const sections = [
  { key: 'marketing', label: 'التسويق الذكي', href: '/marketing' },
  { key: 'dashboard', label: 'لوحة تحكم شاملة', href: '/dashboard' },
  { key: 'calculator', label: 'حاسبات متخصصة', href: '/services/calculators' },
  { key: 'design', label: 'تصميم داخلي ذكي', href: '/services/design' },
  { key: 'ai', label: 'دعم AI ذكي', href: '/ai/ai-assistant' },
  { key: 'settings', label: 'الاشتراكات والخدمات', href: '/settings' },
] as const

export default function HomePage() {
  return (
    <main className="flex flex-col font-tajawal text-right bg-gray-50">
      <section
        id="home"
        className="flex flex-col items-center justify-center min-h-[90vh] px-6 bg-gradient-to-b from-blue-50 to-white text-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">منصة البناء الذكية</h2>
        <p className="text-gray-700 max-w-2xl text-lg mb-6">
          سهّل عمليات البناء، تابع المشاريع، وادفع وسدد، وكل ذلك من مكان واحد مع دعم الذكاء
          الاصطناعي وإدارة كاملة لمصاريفك.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/signup"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
          >
            ابدأ مجاناً
          </Link>
          <Link
            href="/login"
            className="border border-blue-600 text-blue-700 px-8 py-3 rounded-lg hover:bg-gray-100"
          >
            تسجيل الدخول
          </Link>
        </div>
      </section>

      <section id="features" className="bg-white py-16 px-6">
        <h3 className="text-3xl font-bold text-center text-blue-800 mb-10">خدماتنا</h3>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          {sections.map(({ key, label }, idx) => (
            <div key={idx} className="bg-gray-50 p-6 rounded shadow-sm hover:shadow-md transition">
              <ClientIcon type={key} size={40} className="mx-auto mb-4 text-blue-600" />
              <h4 className="text-xl font-semibold">{label}</h4>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="bg-gray-100 py-16 px-6">
        <h3 className="text-3xl font-bold text-center text-blue-800 mb-10">خطط الأسعار</h3>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 text-center">
          {[
            {
              title: 'مجانية',
              price: '0 ر.س',
              desc: 'ابدأ مشروعك مجاناً وجرب أدواتنا.',
              href: '/signup',
            },
            {
              title: 'احترافية',
              price: '199 ر.س',
              desc: 'كل الميزات المتقدمة لمشروعك.',
              href: '/signup',
              featured: true,
            },
            {
              title: 'مخصصة',
              price: 'حسب الطلب',
              desc: 'حلول مرنة لمشاريع المؤسسات.',
              href: '/contact',
            },
          ].map(({ title, price, desc, href, featured }, idx) => (
            <div
              key={idx}
              className={`bg-white p-6 rounded-lg shadow ${
                featured ? 'border-2 border-blue-600' : 'border'
              }`}
            >
              <h4 className="text-xl font-semibold text-blue-800 mb-2">{title}</h4>
              <p className="text-gray-600 text-sm mb-4">{desc}</p>
              <p className="text-2xl font-bold text-blue-600 mb-6">{price}</p>
              <Link
                href={href}
                className="block w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                ابدأ الآن
              </Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-white text-center py-6 border-t mt-10 text-sm text-gray-500">
        <p>© 2025 منصة binaaHub - جميع الحقوق محفوظة</p>
        <p className="mt-2">
          تواصل معنا:{' '}
          <a href="mailto:support@binaa.com" className="text-blue-600 hover:underline">
            support@binaa.com
          </a>
        </p>
      </footer>
    </main>
  )
}
