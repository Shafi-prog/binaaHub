import React from 'react'

export function Card({ children, className }: any) {
  return <div className={`bg-white border rounded-xl ${className}`}>{children}</div>
}

export function CardContent({ children, className }: any) {
  return <div className={className}>{children}</div>
}
