'use client'

export const dynamic = 'force-dynamic' // إضافة force-dynamic لضمان تحويل الصفحة إلى Dynamic Rendering بدلاً من Prerendering

import { ClientIcon } from '@/components/icons'
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
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-blue-700">مرحبًا بك في مشروع Next.js الموحد 🚀</h1>
    </main>
  );
}
