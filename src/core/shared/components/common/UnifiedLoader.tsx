/**
 * Unified Loader Component
 * Consolidates 25+ loader implementations across store pages
 * Supports different loading states, sizes, and contexts
 */

'use client';

import React from 'react';
import { Loader2, RefreshCw, Clock, Database, Zap } from 'lucide-react';

export type LoaderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type LoaderType = 'spinner' | 'dots' | 'pulse' | 'skeleton' | 'progress';
export type LoaderContext = 'page' | 'component' | 'button' | 'inline' | 'overlay';

export interface UnifiedLoaderProps {
  size?: LoaderSize;
  type?: LoaderType;
  context?: LoaderContext;
  message?: string;
  progress?: number; // 0-100 for progress type
  className?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  fullScreen?: boolean;
  transparent?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

// Size configurations
const sizeConfig = {
  xs: { size: 'w-3 h-3', text: 'text-xs', padding: 'p-1' },
  sm: { size: 'w-4 h-4', text: 'text-sm', padding: 'p-2' },
  md: { size: 'w-6 h-6', text: 'text-base', padding: 'p-4' },
  lg: { size: 'w-8 h-8', text: 'text-lg', padding: 'p-6' },
  xl: { size: 'w-12 h-12', text: 'text-xl', padding: 'p-8' }
};

// Color configurations
const colorConfig = {
  primary: 'text-indigo-600 border-indigo-600',
  secondary: 'text-gray-600 border-gray-600',
  success: 'text-green-600 border-green-600',
  warning: 'text-yellow-600 border-yellow-600',
  error: 'text-red-600 border-red-600'
};

// Spinner Component
const Spinner: React.FC<{ size: string; color: string; icon?: React.ReactNode }> = ({ 
  size, 
  color, 
  icon 
}) => {
  const IconComponent = icon || Loader2;
  return (
    <div className={`${size} ${color} animate-spin`}>
      {React.isValidElement(IconComponent) ? IconComponent : <Loader2 className="w-full h-full" />}
    </div>
  );
};

// Dots Component
const Dots: React.FC<{ size: string; color: string }> = ({ size, color }) => {
  const dotSize = size.includes('w-3') ? 'w-1.5 h-1.5' : size.includes('w-4') ? 'w-2 h-2' : 'w-3 h-3';
  
  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={`${dotSize} ${color} rounded-full animate-pulse`}
          style={{
            animationDelay: `${index * 0.2}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );
};

// Pulse Component
const Pulse: React.FC<{ size: string; color: string }> = ({ size, color }) => (
  <div className={`${size} ${color} rounded-full animate-pulse bg-current opacity-75`} />
);

// Skeleton Component
const Skeleton: React.FC<{ context: LoaderContext }> = ({ context }) => {
  switch (context) {
    case 'page':
      return (
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            <div className="h-4 bg-gray-300 rounded w-4/6"></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-32 bg-gray-300 rounded"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
          </div>
        </div>
      );
    
    case 'component':
      return (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-20 bg-gray-300 rounded"></div>
        </div>
      );
    
    case 'button':
      return <div className="h-10 bg-gray-300 rounded animate-pulse w-24"></div>;
    
    default:
      return <div className="h-4 bg-gray-300 rounded animate-pulse"></div>;
  }
};

// Progress Component
const Progress: React.FC<{ progress: number; color: string; size: string }> = ({ 
  progress, 
  color, 
  size 
}) => {
  const height = size.includes('w-3') ? 'h-1' : size.includes('w-4') ? 'h-2' : 'h-3';
  
  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full ${height}`}>
        <div
          className={`${height} ${color} bg-current rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        />
      </div>
      <div className="text-xs text-gray-500 mt-1 text-center">
        {Math.round(progress)}%
      </div>
    </div>
  );
};

// Main Unified Loader Component
export const UnifiedLoader: React.FC<UnifiedLoaderProps> = ({
  size = 'md',
  type = 'spinner',
  context = 'component',
  message,
  progress = 0,
  className = '',
  color = 'primary',
  fullScreen = false,
  transparent = false,
  icon,
  children
}) => {
  const sizeClasses = sizeConfig[size];
  const colorClasses = colorConfig[color];

  // Render loading indicator based on type
  const renderLoader = () => {
    switch (type) {
      case 'dots':
        return <Dots size={sizeClasses.size} color={colorClasses} />;
      
      case 'pulse':
        return <Pulse size={sizeClasses.size} color={colorClasses} />;
      
      case 'skeleton':
        return <Skeleton context={context} />;
      
      case 'progress':
        return <Progress progress={progress} color={colorClasses} size={sizeClasses.size} />;
      
      case 'spinner':
      default:
        return <Spinner size={sizeClasses.size} color={colorClasses} icon={icon} />;
    }
  };

  // Content wrapper
  const content = (
    <div className={`flex flex-col items-center justify-center space-y-2 ${sizeClasses.padding}`}>
      {renderLoader()}
      {message && (
        <p className={`${sizeClasses.text} text-gray-600 text-center animate-pulse`}>
          {message}
        </p>
      )}
      {children}
    </div>
  );

  // Context-specific wrappers
  if (fullScreen) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${
        transparent ? 'bg-transparent' : 'bg-white bg-opacity-90'
      } ${className}`}>
        {content}
      </div>
    );
  }

  if (context === 'overlay') {
    return (
      <div className={`absolute inset-0 flex items-center justify-center ${
        transparent ? 'bg-transparent' : 'bg-white bg-opacity-90'
      } ${className}`}>
        {content}
      </div>
    );
  }

  if (context === 'inline') {
    return (
      <span className={`inline-flex items-center space-x-1 ${className}`}>
        {renderLoader()}
        {message && <span className={sizeClasses.text}>{message}</span>}
      </span>
    );
  }

  if (context === 'button') {
    return (
      <div className={`flex items-center justify-center space-x-2 ${className}`}>
        {renderLoader()}
        {message && <span className={sizeClasses.text}>{message}</span>}
      </div>
    );
  }

  // Default component wrapper
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {content}
    </div>
  );
};

// Specialized loader components for common use cases
export const PageLoader: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <UnifiedLoader
    size="lg"
    type="spinner"
    context="page"
    message={message}
    fullScreen
    className="min-h-screen"
  />
);

export const ComponentLoader: React.FC<{ message?: string; transparent?: boolean }> = ({ 
  message = 'Loading...', 
  transparent = false 
}) => (
  <UnifiedLoader
    size="md"
    type="spinner"
    context="component"
    message={message}
    transparent={transparent}
    className="min-h-32"
  />
);

export const ButtonLoader: React.FC<{ message?: string; size?: LoaderSize }> = ({ 
  message, 
  size = 'sm' 
}) => (
  <UnifiedLoader
    size={size}
    type="spinner"
    context="button"
    message={message}
    className="px-2"
  />
);

export const InlineLoader: React.FC<{ message?: string }> = ({ message }) => (
  <UnifiedLoader
    size="xs"
    type="spinner"
    context="inline"
    message={message}
  />
);

export const SkeletonLoader: React.FC<{ context?: LoaderContext }> = ({ context = 'component' }) => (
  <UnifiedLoader
    type="skeleton"
    context={context}
  />
);

export const ProgressLoader: React.FC<{ 
  progress: number; 
  message?: string; 
  size?: LoaderSize 
}> = ({ progress, message, size = 'md' }) => (
  <UnifiedLoader
    size={size}
    type="progress"
    progress={progress}
    message={message}
    className="w-full max-w-md"
  />
);

// ERP-specific loaders with appropriate icons and messages
export const ERPSyncLoader: React.FC<{ 
  erpName?: string; 
  progress?: number;
  syncType?: 'products' | 'orders' | 'customers' | 'inventory' | 'full';
}> = ({ erpName = 'ERP System', progress, syncType = 'full' }) => {
  const messages = {
    products: `Syncing products with ${erpName}...`,
    orders: `Syncing orders with ${erpName}...`,
    customers: `Syncing customers with ${erpName}...`,
    inventory: `Syncing inventory with ${erpName}...`,
    full: `Full sync with ${erpName} in progress...`
  };

  return (
    <UnifiedLoader
      size="lg"
      type={progress !== undefined ? 'progress' : 'spinner'}
      progress={progress}
      message={messages[syncType]}
      icon={<Database />}
      color="primary"
    />
  );
};

export const APILoader: React.FC<{ 
  operation?: string; 
  endpoint?: string;
}> = ({ operation = 'Processing', endpoint }) => (
  <UnifiedLoader
    size="sm"
    type="spinner"
    message={`${operation}${endpoint ? ` ${endpoint}` : ''}...`}
    icon={<RefreshCw />}
    context="inline"
  />
);

export const DataLoader: React.FC<{ 
  dataType?: string; 
  count?: number;
}> = ({ dataType = 'data', count }) => (
  <UnifiedLoader
    size="md"
    type="dots"
    message={`Loading ${dataType}${count ? ` (${count} items)` : ''}...`}
    color="secondary"
  />
);

export default UnifiedLoader;
