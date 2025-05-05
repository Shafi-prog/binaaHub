import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function Navbar() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let accountType: 'user' | 'store' | null = null
  let userName: string | null = null

  if (user) {
    const { data: userData } = await supabase
      .from('users')
      .select('account_type, name')
      .eq('email', user.email)
      .single()

    accountType = userData?.account_type ?? null
    userName = userData?.name ?? null
  }

  const navLinks = [
    { href: '/', label: 'الرئيسية' },
    { href: '/#features', label: 'الخدمات' },
    { href: '/#pricing', label: 'الأسعار' },
  ]

  return (
    <header className="bg-white shadow-md font-tajawal">
      <nav className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="شعار" className="w-10 h-10" />
          <span className="text-sm font-bold text-blue-700 hidden md:inline">بناء دون عناء</span>
        </Link>

        <div className="hidden md:flex gap-6 items-center text-sm">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} className="hover:text-blue-500">
              {label}
            </Link>
          ))}

          {user ? (
            <>
              <Link
                href={accountType === 'store' ? '/store/dashboard' : '/user/dashboard'}
                className="hover:text-blue-500"
              >
                {userName ?? user.email}
              </Link>
              <Link href="/logout" className="text-red-500 hover:underline">تسجيل الخروج</Link>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-blue-500">تسجيل الدخول</Link>
              <Link href="/signup" className="hover:text-blue-500">إنشاء حساب</Link>
            </>
          )}
        </div>
      </nav>

      <div className="md:hidden px-4 pb-2 text-sm flex flex-wrap gap-4 justify-center border-t">
        {navLinks.map(({ href, label }) => (
          <Link key={href} href={href} className="block text-gray-700">
            {label}
          </Link>
        ))}
        {user ? (
          <>
            <Link href={accountType === 'store' ? '/store/dashboard' : '/user/dashboard'}>
              {userName ?? user.email}
            </Link>
            <Link href="/logout" className="text-red-500">خروج</Link>
          </>
        ) : (
          <>
            <Link href="/login">دخول</Link>
            <Link href="/signup">تسجيل</Link>
          </>
        )}
      </div>
    </header>
  )
}
