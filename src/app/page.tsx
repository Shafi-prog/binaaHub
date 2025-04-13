'use client'

import { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const MenuIcon = dynamic(() => import('lucide-react').then(mod => mod.Menu), { ssr: false })
const BarChart = dynamic(() => import('lucide-react').then(mod => mod.BarChart), { ssr: false })
const Building = dynamic(() => import('lucide-react').then(mod => mod.Building), { ssr: false })
const PanelLeft = dynamic(() => import('lucide-react').then(mod => mod.PanelLeft), { ssr: false })
const Calculator = dynamic(() => import('lucide-react').then(mod => mod.Calculator), { ssr: false })
const Settings = dynamic(() => import('lucide-react').then(mod => mod.Settings), { ssr: false })
const XIcon = dynamic(() => import('lucide-react').then(mod => mod.X), { ssr: false })

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <main className="flex flex-col font-tajawal text-right bg-gray-50">
      <header className="w-full bg-white shadow-md flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden bg-blue-600 text-white p-2 rounded-md shadow-md"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
          </button>
          <h1 className="text-lg font-bold text-blue-700">بناء دون عناء</h1>
        </div>
        <nav className="hidden md:flex gap-6 text-sm text-gray-600">
          <Link href="#home">الرئيسية</Link>
          <Link href="#features">الخدمات</Link>
          <Link href="#pricing">الأسعار</Link>
          <Link href="/login">تسجيل الدخول</Link>
          <Link href="/signup">إنشاء حساب</Link>
        </nav>
      </header>

      <aside className={`bg-white shadow-md w-64 fixed top-0 right-0 h-full z-40 transform transition-transform duration-300 md:hidden ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4 text-blue-700">خدماتنا</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><BarChart size={18} /><Link href="/services/marketing">التسويق</Link></li>
            <li className="flex items-center gap-2"><Settings size={18} /><Link href="/services/subscriptions">الاشتراكات</Link></li>
            <li className="flex items-center gap-2"><PanelLeft size={18} /><Link href="/dashboard">لوحة التحكم</Link></li>
            <li className="flex items-center gap-2"><MenuIcon size={18} /><Link href="/services/hero">واجهة المستخدم</Link></li>
            <li className="flex items-center gap-2"><Calculator size={18} /><Link href="/services/calculator">الحاسبات</Link></li>
            <li className="flex items-center gap-2"><Building size={18} /><Link href="/projects">المشاريع</Link></li>
          </ul>
        </div>
      </aside>

      <section id="home" className="flex flex-col items-center justify-center min-h-screen py-20 px-6 bg-gradient-to-b from-blue-50 to-white">
        <h2 className="text-5xl font-bold text-blue-900 mb-6 text-center">منصة البناء الذكية</h2>
        <p className="text-gray-700 max-w-3xl text-lg text-center mb-8">
          منصة ذكية تقدم خدمات متكاملة من التسويق، إدارة المشاريع، الحاسبات، لوحة التحكم، وواجهة المستخدم. لتبسيط عملية البناء من البداية إلى النهاية.
        </p>
        <div className="flex gap-6 flex-wrap justify-center">
          <Link href="/signup" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition">ابدأ مجاناً</Link>
          <Link href="/login" className="bg-white border border-blue-600 text-blue-700 px-8 py-3 rounded-lg text-lg hover:bg-gray-100 transition">تسجيل الدخول</Link>
        </div>
      </section>

      <section id="features" className="bg-white py-16 px-6">
        <h3 className="text-3xl font-bold text-center text-blue-800 mb-12">خدماتنا</h3>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div><BarChart size={36} className="mx-auto text-blue-600 mb-4" /><h4 className="text-xl font-semibold">التسويق الذكي</h4><p className="text-sm text-gray-600 mt-2">استهدف العملاء بذكاء وزد مبيعاتك بسهولة.</p></div>
          <div><Settings size={36} className="mx-auto text-blue-600 mb-4" /><h4 className="text-xl font-semibold">إدارة الاشتراكات</h4><p className="text-sm text-gray-600 mt-2">نظام إدارة اشتراكات احترافي ومرن.</p></div>
          <div><PanelLeft size={36} className="mx-auto text-blue-600 mb-4" /><h4 className="text-xl font-semibold">لوحة تحكم متقدمة</h4><p className="text-sm text-gray-600 mt-2">تحكم شامل في كل تفاصيل مشروعك.</p></div>
          <div><MenuIcon size={36} className="mx-auto text-blue-600 mb-4" /><h4 className="text-xl font-semibold">واجهة مستخدم سهلة</h4><p className="text-sm text-gray-600 mt-2">تصميم جذاب وسهل الاستخدام للجميع.</p></div>
          <div><Calculator size={36} className="mx-auto text-blue-600 mb-4" /><h4 className="text-xl font-semibold">حاسبات المشروع</h4><p className="text-sm text-gray-600 mt-2">أدوات دقيقة لحساب التكاليف.</p></div>
          <div><Building size={36} className="mx-auto text-blue-600 mb-4" /><h4 className="text-xl font-semibold">إدارة المشاريع</h4><p className="text-sm text-gray-600 mt-2">راقب تقدم المشروع خطوة بخطوة.</p></div>
        </div>
      </section>

      <section id="pricing" className="bg-gray-100 py-16 px-6">
        <h3 className="text-3xl font-bold text-center text-blue-800 mb-10">الباقات والأسعار</h3>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold text-blue-800 mb-2">الباقة المجانية</h4>
            <p className="text-gray-600 text-sm mb-4">ابدأ مشروعك الآن مجاناً وجرّب كل الأدوات.</p>
            <p className="text-2xl font-bold text-blue-600 mb-6">0 ر.س / شهرياً</p>
            <Link href="/signup" className="block w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">ابدأ الآن</Link>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-2 border-blue-600">
            <h4 className="text-xl font-semibold text-blue-800 mb-2">الباقة الاحترافية</h4>
            <p className="text-gray-600 text-sm mb-4">لرواد المشاريع الجادين في النمو والتوسع.</p>
            <p className="text-2xl font-bold text-blue-600 mb-6">199 ر.س / شهرياً</p>
            <Link href="/signup" className="block w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">اشترك الآن</Link>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold text-blue-800 mb-2">الباقة المخصصة</h4>
            <p className="text-gray-600 text-sm mb-4">للمؤسسات والمشاريع الكبيرة.</p>
            <p className="text-2xl font-bold text-blue-600 mb-6">حسب الطلب</p>
            <Link href="/contact" className="block w-full bg-gray-300 text-blue-800 py-2 rounded hover:bg-gray-400 transition">تواصل معنا</Link>
          </div>
        </div>
      </section>

      <footer className="bg-white text-center py-6 border-t mt-10 text-sm text-gray-500">
        <p>© 2025 منصة بناء - جميع الحقوق محفوظة</p>
        <p className="mt-2">للتواصل: <a href="mailto:support@binaa.com" className="text-blue-600 hover:underline">support@binaa.com</a></p>
      </footer>
    </main>
  )
}