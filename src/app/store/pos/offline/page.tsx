/**
 * Enhanced Offline POS Page
 * SQLite-powered offline Point of Sale system
 */

import { Metadata } from 'next'
import EnhancedOfflinePOS from '@/components/store/pos/EnhancedOfflinePOS'

export const metadata: Metadata = {
  title: 'نقطة البيع المتقدمة - بنا',
  description: 'نظام نقطة البيع المتقدم مع إمكانيات العمل بدون إنترنت',
}

export default function OfflinePOSPage() {
  return <EnhancedOfflinePOS />
}
