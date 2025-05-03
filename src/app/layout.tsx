// src/app/layout.tsx
import Navbar from '@/components/Navbar' // كما في v3
import { Tajawal } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['200', '300', '400', '500', '700', '800', '900'],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={tajawal.className}>
        <Navbar />

        {/* مهم جداً: حاوية التخطيط الأفقية والعمودية */}
        <main className="container px-4 py-8">{children}</main>

        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  )
}
