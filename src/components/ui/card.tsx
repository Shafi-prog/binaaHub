'use client'

import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export default function Card({ children, ...props }: CardProps) {
  return (
    <div {...props} className={`border p-4 rounded-lg shadow ${props.className ?? ''}`}>
      {children}
    </div>
  )
}

export function CardContent({ children, ...props }: CardProps) {
  return (
    <div {...props} className={`p-4 ${props.className ?? ''}`}>
      {children}
    </div>
  )
}
