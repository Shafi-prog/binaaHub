import './globals.css';
import { Tajawal } from 'next/font/google';
import Navbar from '../components/Navbar'; // Fixed path

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: '200'
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={tajawal.className}>
        <Navbar />
        {children}
      </body>
    </html >
  );
}