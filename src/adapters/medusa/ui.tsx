import React from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Popover, PopoverContent } from '@/components/ui/popover'
import { Badge } from '@/components/ui/Badge'
import { toast as baseToast, useToast as baseUseToast } from '@/components/ui/use-toast'
import { cn as clx } from '@/core/shared/utils/cn'

export const Container: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className, children }) => (
  <div className={clx('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>{children}</div>
)

export const Heading: React.FC<React.PropsWithChildren<{ level?: 1|2|3|4|5|6; className?: string }>> = ({ level = 2, className, children }) => {
  const Tag = (`h${level}` as unknown) as keyof JSX.IntrinsicElements
  const sizes: Record<number, string> = {1:'text-3xl',2:'text-2xl',3:'text-xl',4:'text-lg',5:'text-base',6:'text-sm'}
  return <Tag className={clx('font-semibold tracking-tight', sizes[level], className)}>{children}</Tag>
}

export const Text: React.FC<React.PropsWithChildren<{ muted?: boolean; className?: string }>> = ({ muted, className, children }) => (
  <p className={clx('text-sm', muted && 'text-muted-foreground', className)}>{children}</p>
)

export { Button, Input, Checkbox, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch, Popover, PopoverContent, Badge }

export const toast = baseToast
export const useToast = baseUseToast

export function usePrompt() {
  return React.useCallback(async (opts: { title?: string; description?: string; confirmText?: string; cancelText?: string }) => {
    const msg = [opts?.title, opts?.description].filter(Boolean).join('\n') || 'هل أنت متأكد؟'
    return typeof window !== 'undefined' ? window.confirm(msg) : true
  }, [])
}

export const StatusBadge: React.FC<React.PropsWithChildren<{ variant?: 'success'|'warning'|'danger'|'info'|'neutral'; className?: string }>> = ({ variant = 'neutral', className, children }) => {
  const map = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    neutral: 'bg-gray-100 text-gray-800',
  }
  return <span className={clx('inline-flex items-center rounded px-2 py-0.5 text-xs font-medium', map[variant], className)}>{children}</span>
}

export const IconButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, children, ...props }) => (
  <button
    type="button"
    className={clx('inline-flex h-9 w-9 items-center justify-center rounded border bg-white hover:bg-gray-50', className)}
    {...props}
  >
    {children}
  </button>
)

type WithChildren = React.PropsWithChildren<{ className?: string }>

export const DropdownMenu: React.FC<WithChildren> & {
  Trigger: React.FC<WithChildren>
  Content: React.FC<WithChildren>
  Item: React.FC<WithChildren & { onSelect?: () => void }>
} = Object.assign(
  ({ children }: WithChildren) => <div className="relative inline-block">{children}</div>,
  {
    Trigger: ({ children }: WithChildren) => <>{children}</>,
    Content: ({ className, children }: WithChildren) => (
      <div className={clx('z-50 mt-2 min-w-40 rounded border bg-white p-1 shadow-lg', className)}>{children}</div>
    ),
    Item: ({ className, children, onSelect }: WithChildren & { onSelect?: () => void }) => (
      <button type="button" onClick={onSelect} className={clx('w-full rounded px-2 py-1.5 text-left hover:bg-gray-50', className)}>
        {children}
      </button>
    ),
  }
)

export const Tooltip: React.FC<WithChildren & { content?: React.ReactNode }> = ({ children }) => <>{children}</>

export const Label: React.FC<WithChildren & { htmlFor?: string }> = ({ className, children, htmlFor }) => (
  <label htmlFor={htmlFor} className={clx('mb-1 block text-sm font-medium text-gray-700', className)}>
    {children}
  </label>
)

export const Divider: React.FC<{ className?: string }> = ({ className }) => (
  <hr className={clx('my-4 border-t border-gray-200', className)} />
)

export const ProgressBar: React.FC<{ value: number; className?: string }> = ({ value, className }) => (
  <div className={clx('h-2 w-full rounded bg-gray-200', className)}>
    <div className="h-2 rounded bg-blue-600" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
  </div>
)

export const ProgressStatus = ProgressBar
export const ProgressTabs: React.FC<WithChildren> = ({ children }) => <div className="flex gap-2">{children}</div>
export const CommandBar: React.FC<WithChildren> = ({ children }) => <div className="flex flex-wrap gap-2">{children}</div>

export const Avatar: React.FC<{ src?: string; alt?: string; className?: string; fallback?: string }> = ({ src, alt, className, fallback }) => (
  <div className={clx('inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gray-200', className)}>
    {src ? <img src={src} alt={alt} className="h-full w-full object-cover" /> : <span className="text-xs text-gray-600">{fallback || '?'}</span>}
  </div>
)

// Simple Table primitives
export const Table: React.FC<WithChildren & { className?: string }> & {
  Head: React.FC<WithChildren>
  Body: React.FC<WithChildren>
  Row: React.FC<WithChildren>
  HeaderCell: React.FC<WithChildren>
  Cell: React.FC<WithChildren>
} = Object.assign(
  ({ className, children }: WithChildren) => (
    <table className={clx('w-full border-collapse text-sm', className)}>{children}</table>
  ),
  {
    Head: ({ children }: WithChildren) => <thead className="bg-gray-50 text-left">{children}</thead>,
    Body: ({ children }: WithChildren) => <tbody>{children}</tbody>,
    Row: ({ children }: WithChildren) => <tr className="border-b last:border-0">{children}</tr>,
    HeaderCell: ({ children }: WithChildren) => <th className="px-3 py-2 font-medium text-gray-700">{children}</th>,
    Cell: ({ children }: WithChildren) => <td className="px-3 py-2">{children}</td>,
  }
)

export { clx }

// Minimal DataTable helper shim used in some admin list tables
type AccessorConfig<T> = {
  header?: string
  cell?: (args: { row: { original: T } }) => React.ReactNode
  enableSorting?: boolean
  sortAscLabel?: string
  sortDescLabel?: string
}

type ActionConfig<T> = {
  actions: Array<{ label: string; icon?: React.ReactNode; onClick?: (ctx: { row: { original: T } }) => void }>
}

export function createDataTableColumnHelper<T = any>() {
  return {
    accessor: (key: keyof T, cfg: AccessorConfig<T>) => ({ id: String(key), key, ...cfg }),
    action: (cfg: ActionConfig<T>) => ({ id: 'actions', ...cfg }),
  }
}
