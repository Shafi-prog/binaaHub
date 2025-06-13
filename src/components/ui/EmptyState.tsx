import React, { ReactNode } from 'react';

export function EmptyState({ 
  message = 'لا توجد بيانات',
  icon,
  title,
  description,
  actionLabel,
  onAction
}: { 
  message?: string,
  icon?: ReactNode,
  title?: string,
  description?: string,
  actionLabel?: string,
  onAction?: () => void | string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
      {icon || <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path d="M8 12h8M8 16h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
      <p className="mt-4 text-lg">{title || message}</p>
      {description && <p className="mt-2 text-sm text-gray-500">{description}</p>}
      {actionLabel && onAction && (
        <button 
          onClick={() => onAction()} 
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
