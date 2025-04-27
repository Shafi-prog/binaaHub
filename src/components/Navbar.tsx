'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const MenuIcon = dynamic(() => import('lucide-react').then((m) => m.Menu), { ssr: false })
const XIcon = dynamic(() => import('lucide-react').then((m) => m.X), { ssr: false })

const NAV_LINKS = [
  { href: '/', label: 'الرئيسية' },
  {
    href: '/#features',
    label: 'الخدمات',
    submenu: [
      { href: '/services/marketing', label: 'التسويق' },
      { href: '/services/development', label: 'التطوير' },
      { href: '/services/design', label: 'التصميم' },
    ],
  },
  { href: '/#pricing', label: 'الأسعار' },
]

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [servicesOpenMobile, setServicesOpenMobile] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser))
        } catch (error) {
          console.error('Error parsing user from localStorage', error)
        }
      }
    }
  }, [])

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
    }
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
        <div className="hidden md:flex gap-6 items-center text-sm relative">
          {NAV_LINKS.map(({ href, label, submenu }, i) => (
            <div key={i} className="relative group">
              <Link href={href} className="hover:text-blue-500">
                {label}
              </Link>
              {submenu && (
                <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md py-2 mt-2 w-40">
                  {submenu.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
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
          {NAV_LINKS.map(({ href, label, submenu }, i) => (
            <li key={i}>
              {submenu ? (
                <>
                  <button
                    onClick={() => setServicesOpenMobile(!servicesOpenMobile)}
                    className="w-full text-right text-blue-700 hover:underline"
                  >
                    {label}
                  </button>
                  {servicesOpenMobile && (
                    <ul className="pl-4 mt-2 space-y-2">
                      {submenu.map((item, index) => (
                        <li key={index}>
                          <Link href={item.href} onClick={() => setMenuOpen(false)}>
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link href={href} onClick={() => setMenuOpen(false)}>
                  {label}
                </Link>
              )}
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
