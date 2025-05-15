/// <reference lib="dom" />
/** @jsxImportSource react */
"use client";

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import './globals.css';
import { Tajawal } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import Navbar from '@/components/Navbar';

const tajawal = Tajawal({ subsets: ['arabic'], weight: ['400'] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={tajawal.className}>
        <Navbar session={null} />
        {children}
      </body>
    </html>
  );
}
