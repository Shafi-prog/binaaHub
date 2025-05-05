import { cookies } from 'next/headers'
import Navbar from '@/components/Navbar'
import { Tajawal } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['200', '300', '400', '500', '700', '800', '900'],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies()

  return (
    <html lang="ar" dir="rtl">
      <body className={tajawal.className}>
        {/* تمرير الكوكيز إلى نافبار لتفادي الخطأ */}
        {/* @ts-expect-error Server Component with props */}
        <Navbar cookieStore={cookieStore} />
        <main className="container px-4 py-8">{children}</main>
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  )
}
