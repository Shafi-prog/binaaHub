'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const MenuIcon = dynamic(() => import('lucide-react').then((m) => m.Menu), { ssr: false })
const XIcon = dynamic(() => import('lucide-react').then((m) => m.X), { ssr: false })

const NAV_LINKS = [
  { href: '/', label: 'الرئيسية' },
  { href: '/#features', label: 'الخدمات' },
  { href: '/#pricing', label: 'الأسعار' },
]

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    router.push('/')
  }

  return (
    <>
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center font-tajawal">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="شعار بناء" className="w-10 h-10" />
          <span className="text-sm font-bold text-blue-700 hidden md:inline">بناء دون عناء</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6 items-center text-sm">
          {NAV_LINKS.map(({ href, label }, i) => (
            <Link key={i} href={href} className="hover:text-blue-500">
              {label}
            </Link>
          ))}
          {user ? (
            <>
              <Link href="/profile" className="hover:text-blue-500">
                {user.name}
              </Link>
              <button onClick={handleLogout} className="text-red-500 hover:underline">
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

        {/* Mobile Menu Button */}
        <button className="md:hidden text-blue-700" onClick={() => setMenuOpen(true)}>
          <MenuIcon size={24} />
        </button>
      </nav>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-white z-50 shadow-lg transform transition-transform duration-300 md:hidden ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-bold text-blue-700">القائمة</h2>
          <button onClick={() => setMenuOpen(false)} className="text-gray-600">
            <XIcon size={22} />
          </button>
        </div>
        <ul className="p-4 space-y-4 text-sm text-gray-700">
          {NAV_LINKS.map(({ href, label }, i) => (
            <li key={i}>
              <Link href={href} onClick={() => setMenuOpen(false)}>
                {label}
              </Link>
            </li>
          ))}
          {user ? (
            <>
              <li>
                <Link href="/profile" onClick={() => setMenuOpen(false)}>
                  {user.name}
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleLogout()
                    setMenuOpen(false)
                  }}
                  className="text-red-500"
                >
                  تسجيل الخروج
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  تسجيل الدخول
                </Link>
              </li>
              <li>
                <Link href="/signup" onClick={() => setMenuOpen(false)}>
                  إنشاء حساب
                </Link>
              </li>
            </>
          )}
        </ul>
      </aside>
    </>
  )
}
