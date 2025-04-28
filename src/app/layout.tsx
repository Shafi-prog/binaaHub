// src/app/layout.tsx
import Navbar from '@/components/Navbar'; // تأكد أن المسار صحيح
import { Tajawal } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['200', '300', '400', '500', '700', '800', '900'], // يفضل تحديد عدة أوزان
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={tajawal.className}>
        <Navbar />
        {children}
        <Toaster position="top-center" reverseOrder={false} /> {/* ✅ تم إضافة Toaster بشكل صحيح هنا */}
      </body>
    </html>
  );
}
