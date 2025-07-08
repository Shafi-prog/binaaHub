// @ts-nocheck
/**
 * Advanced Reporting Page
 * Business intelligence and custom report builder
 */

import { Metadata } from 'next'
import AdvancedReportingEngine from '@/components/store/reporting/AdvancedReportingEngine'

export const metadata: Metadata = {
  title: 'التقارير المتقدمة - بنا',
  description: 'محرك التقارير المتقدم مع منشئ التقارير المخصصة وذكاء الأعمال',
}

export default function ReportsPage() {
  return <AdvancedReportingEngine />
}


