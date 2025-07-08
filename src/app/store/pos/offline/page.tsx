// @ts-nocheck
'use client'

/**
 * Enhanced Offline POS Page
 * SQLite-powered offline Point of Sale system
 */

import dynamic from 'next/dynamic'

const EnhancedOfflinePOS = dynamic(() => import('@/components/store/pos/EnhancedOfflinePOS'), {
  ssr: false,
  loading: () => <div className="p-8">Loading POS System...</div>
})

export default function OfflinePOSPage() {
  return <EnhancedOfflinePOS />
}


