// @ts-nocheck
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import LayoutProvider from '../core/shared/components/LayoutProvider';
import PWARegister from '../core/shared/components/PWARegister';
import ErrorHandler from '../core/shared/components/ErrorHandler';
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#22c55e" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&family=Tajawal:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ErrorHandler />
        <PWARegister />
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


