// Temporary Separator component - needs to be replaced with proper implementation
import React from 'react';

export interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Separator({ orientation = 'horizontal', className = '' }: SeparatorProps) {
  const orientationClasses = orientation === 'horizontal' 
    ? 'h-px w-full' 
    : 'w-px h-full';
    
  return (
    <div 
      className={`shrink-0 bg-gray-200 ${orientationClasses} ${className}`}
      role="separator"
      aria-orientation={orientation}
    />
  );
}


