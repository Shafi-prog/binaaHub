import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/core/shared/auth/AuthProvider'
import { Toaster } from 'react-hot-toast'
import MainHeader from '@/components/layout/MainHeader'

export const metadata: Metadata = {
  title: 'binaaHub - Construction Platform',
  description: 'Complete construction management platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <AuthProvider>
          <MainHeader />
          {children}
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  )
}




