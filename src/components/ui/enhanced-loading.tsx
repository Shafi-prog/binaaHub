"use client";

import React from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface EnhancedLoadingProps {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  text?: string;
  className?: string;
}

export function EnhancedLoading({
  title = "جارٍ تحميل البيانات...",
  subtitle = "يرجى الانتظار قليلاً",
  showLogo = true,
  size = 'lg',
  fullScreen = false,
  text = 'جاري التحميل...',
  className = ''
}: EnhancedLoadingProps) {
  const containerClass = fullScreen 
    ? "min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 font-tajawal"
    : "flex items-center justify-center p-8 font-tajawal";

  const cardSizes = {
    sm: "p-4 max-w-xs",
    md: "p-6 max-w-sm", 
    lg: "p-8 max-w-md"
  };

  const spinnerSizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16"
  };

  const titleSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={containerClass}>
      {fullScreen && (
        <>
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.05) 0%, transparent 50%), 
                             radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.05) 0%, transparent 50%)`
          }}></div>
        </>
      )}
      
      {/* Loading Card */}
      <div className={`relative z-10 loading-card flex flex-col items-center justify-center rounded-2xl shadow-2xl bg-white/90 border border-gray-200/50 backdrop-blur-sm ${cardSizes[size]}`}>
        {/* Spinner Section */}
        <div className="mb-6 flex items-center justify-center">
          <div className="relative">
            {/* Outer ring animation */}
            <div className={`absolute inset-0 ${spinnerSizes[size]} border-4 border-blue-200 rounded-full animate-ping opacity-30`}></div>
            {/* Middle ring */}
            <div className={`absolute inset-2 ${size === 'lg' ? 'w-12 h-12' : size === 'md' ? 'w-8 h-8' : 'w-6 h-6'} border-3 border-purple-200 rounded-full animate-pulse`}></div>
            {/* Inner spinner */}
            <LoadingSpinner size={size} className={`${spinnerSizes[size]} border-4 border-gray-200 border-t-blue-600 relative z-10`} />
          </div>
        </div>

        {/* Brand Icon */}
        {showLogo && (
          <div className={`mb-4 ${size === 'lg' ? 'w-12 h-12' : size === 'md' ? 'w-10 h-10' : 'w-8 h-8'} bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg`}>
            <svg 
              className={`${size === 'lg' ? 'w-6 h-6' : size === 'md' ? 'w-5 h-5' : 'w-4 h-4'} text-white`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
              />
            </svg>
          </div>
        )}
        
        {/* Loading Text */}
        <h2 className={`${titleSizes[size]} font-bold text-gray-800 mb-2 text-center`}>{title}</h2>
        <p className={`text-gray-500 ${size === 'sm' ? 'text-xs' : 'text-sm'} mb-4 text-center`}>{subtitle}</p>
        
        {/* Progress dots */}
        <div className="flex space-x-1 rtl:space-x-reverse">
          <div className={`${size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'} bg-blue-400 rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
          <div className={`${size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'} bg-blue-400 rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
          <div className={`${size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'} bg-blue-400 rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
        </div>

        {/* Additional Spinner/Text Section */}
        <div className="flex flex-col items-center justify-center mt-4">
          <div className={`animate-spin rounded-full border-4 border-primary border-t-transparent ${sizeClasses[size]}`} />
          {text && <p className="mt-2 text-sm text-gray-500">{text}</p>}
        </div>
      </div>
      
      {/* Floating elements for visual enhancement - only in fullscreen */}
      {fullScreen && (
        <>
          <div className="absolute top-10 left-10 w-4 h-4 bg-blue-200 rounded-full animate-float opacity-60"></div>
          <div className="absolute top-20 right-20 w-6 h-6 bg-purple-200 rounded-full animate-float-delayed opacity-40"></div>
          <div className="absolute bottom-20 left-20 w-3 h-3 bg-indigo-200 rounded-full animate-float opacity-50"></div>
          <div className="absolute bottom-10 right-10 w-5 h-5 bg-pink-200 rounded-full animate-float-delayed opacity-30"></div>
        </>
      )}
    </div>
  );
}

export default EnhancedLoading;
