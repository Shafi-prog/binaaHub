'use client'

import { BarChart, Bot, Calculator, LayoutTemplate, PanelLeft, Settings } from 'lucide-react'

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

export default function ClientIcon({ type, size = 24, className }: ClientIconProps) {
  const IconComponent = icons[type]
  return <IconComponent size={size} className={className} />
}
