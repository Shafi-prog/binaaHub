'use client'

import { BarChart, Bot, Calculator, LayoutTemplate, PanelLeft, Settings } from 'lucide-react'
import dynamic from 'next/dynamic'

const icons = {
  marketing: BarChart,
  dashboard: PanelLeft,
  calculator: Calculator,
  design: LayoutTemplate,
  ai: Bot,
  settings: Settings,
} as const

type IconKey = keyof typeof icons

interface ClientIconProps {
  type: IconKey
  size?: number
  className?: string
}

// ✅ استخدام Dynamic Import للمكونات الداخلية
export default function ClientIcon({ type, size = 24, className }: ClientIconProps) {
  const IconComponent = icons[type]
  const DynamicIcon = dynamic(() => Promise.resolve(IconComponent), { ssr: false })

  return <DynamicIcon size={size} className={className} />
}
