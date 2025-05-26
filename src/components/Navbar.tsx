// src/components/Navbar.tsx
'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Session } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import { useRouter } from 'next/navigation'

interface NavbarProps {
  session: Session | null
}

export default function Navbar(props: NavbarProps) {
  // إنشاؤه هنا فقط للـ Client Side
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()

  const [accountType, setAccountType] = useState(null as string | null)
  const [userName, setUserName] = useState(null as string | null)

  // بعد استلام الـ session من الـ Layout، نجلب البيانات من الـ users table
  useEffect(() => {
    if (props.session?.user.id) {
      supabase
        .from('users')
        .select('account_type, name')
        .eq('id', props.session.user.id)
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            setAccountType(data.account_type)
            setUserName(data.name)
          }
        })
    }
  }, [props.session, supabase])

  const navLinks = [
    { href: '/', label: 'الرئيسية' },
    { href: '/#features', label: 'الخدمات' },
    { href: '/#pricing', label: 'الأسعار' },
  ]

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="bg-white shadow-md font-tajawal">
      <nav className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="شعار" className="w-10 h-10" />
          <span className="hidden md:inline text-sm font-bold text-blue-700">بناء دون عناء</span>
        </Link>

        <div className="hidden md:flex gap-6 items-center text-sm">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-blue-500">
              {l.label}
            </Link>
          ))}

          {props.session && accountType ? (
            <>
              <Link
                href={accountType === 'store' ? '/store/dashboard' : '/user/dashboard'}
                className="hover:text-blue-500"
              >
                {userName ?? props.session.user.email}
              </Link>
              <button onClick={handleSignOut} className="text-red-500 hover:underline">
                تسجيل الخروج
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-blue-500">
                تسجيل الدخول
              </Link>
              <Link href="/signup" className="hover:text-blue-500">
                إنشاء حساب
              </Link>
            </>
          )}
        </div>

        {/* نسخة الموبايل */}
        <div className="md:hidden px-4 pb-2 text-sm flex flex-wrap gap-4 justify-center border-t">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="block text-gray-700">
              {l.label}
            </Link>
          ))}
          {props.session && accountType ? (
            <>
              <Link href={accountType === 'store' ? '/store/dashboard' : '/user/dashboard'}>
                {userName ?? props.session.user.email}
              </Link>
              <button onClick={handleSignOut} className="text-red-500">
                خروج
              </button>
            </>
          ) : (
            <>
              <Link href="/login">دخول</Link>
              <Link href="/signup">تسجيل</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
