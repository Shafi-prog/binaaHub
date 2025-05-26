/// <reference lib="dom" />
'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import './globals.css'
import { Tajawal } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Navbar from '@/components/Navbar'
import type { Session } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database'

const tajawal = Tajawal({ subsets: ['arabic'], weight: ['400'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase])

  return (
    <html lang="ar" dir="rtl">
      <body className={tajawal.className}>
        <Toaster position="top-center" />
        <Navbar session={session} />
        {children}
      </body>
    </html>
  )
}
