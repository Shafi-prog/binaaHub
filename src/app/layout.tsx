import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import LayoutProvider from '../components/LayoutProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Binna - منصة البناء الذكي',
  description: 'منصة البناء الذكي لإدارة مشاريع البناء والتشطيب',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <title>Binna - منصة البناء الذكي</title>
        <meta name="description" content="منصة البناء الذكي لإدارة مشاريع البناء والتشطيب" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&family=Tajawal:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Toaster
          position="top-center"
          toastOptions={{
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
