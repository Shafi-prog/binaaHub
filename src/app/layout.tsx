import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import LayoutProvider from '../components/LayoutProvider';

export const metadata: Metadata = {
  title: 'Binna - منصة البناء الذكي',
  description: 'منصة البناء الذكي لإدارة مشاريع البناء والتشطيب',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-tajawal">
        <Toaster 
          position="top-center"
          toastOptions={{
            // Prevent duplicate toasts
            duration: 4000,
            style: {
              maxWidth: '500px',
            },
          }}
        />
        <LayoutProvider>{children}</LayoutProvider>
      </body>
    </html>
  );
}
