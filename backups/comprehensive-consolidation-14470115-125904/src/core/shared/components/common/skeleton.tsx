"use client";

import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  width = "100%",
  height = "1rem",
  rounded = false,
  lines = 1
}) => {
  const baseClasses = "animate-pulse bg-gray-300";
  const roundedClasses = rounded ? "rounded-full" : "rounded";
  
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  if (lines === 1) {
    return (
      <div
        className={`${baseClasses} ${roundedClasses} ${className}`}
        style={style}
      />
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`${baseClasses} ${roundedClasses}`}
          style={{
            ...style,
            width: index === lines - 1 ? '75%' : '100%' // Last line is shorter
          }}
        />
      ))}
    </div>
  );
};

interface TextSkeletonProps {
  lines?: number;
  className?: string;
}

const TextSkeleton: React.FC<TextSkeletonProps> = ({
  lines = 3,
  className = ""
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse bg-gray-300 rounded h-4"
          style={{
            width: index === lines - 1 ? '60%' : index === lines - 2 ? '80%' : '100%'
          }}
        />
      ))}
    </div>
  );
};

interface CardSkeletonProps {
  className?: string;
  showImage?: boolean;
  imageHeight?: string;
  lines?: number;
}

const CardSkeleton: React.FC<CardSkeletonProps> = ({
  className = "",
  showImage = true,
  imageHeight = "200px",
  lines = 3
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {showImage && (
        <div
          className="animate-pulse bg-gray-300"
          style={{ height: imageHeight }}
        />
      )}
      <div className="p-4">
        <div className="animate-pulse bg-gray-300 rounded h-6 mb-3" style={{ width: '80%' }} />
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-gray-300 rounded h-4"
              style={{
                width: index === lines - 1 ? '60%' : '100%'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  className = ""
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, index) => (
            <div key={index} className="animate-pulse bg-gray-300 rounded h-4" />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  className="animate-pulse bg-gray-300 rounded h-4"
                  style={{ width: colIndex === 0 ? '100%' : '80%' }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface AvatarSkeletonProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const AvatarSkeleton: React.FC<AvatarSkeletonProps> = ({
  size = 'md',
  className = ""
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`animate-pulse bg-gray-300 rounded-full ${sizeClasses[size]} ${className}`} />
  );
};

// Loading page skeleton
interface PageSkeletonProps {
  showHeader?: boolean;
  showSidebar?: boolean;
  className?: string;
}

const PageSkeleton: React.FC<PageSkeletonProps> = ({
  showHeader = true,
  showSidebar = false,
  className = ""
}) => {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {showHeader && (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="animate-pulse bg-gray-300 rounded h-8 w-64" />
        </div>
      )}
      
      <div className={`flex ${showSidebar ? 'space-x-6' : ''} p-6`}>
        {showSidebar && (
          <div className="w-64 space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse bg-gray-300 rounded h-10" />
            ))}
          </div>
        )}
        
        <div className="flex-1 space-y-6">
          <div className="animate-pulse bg-gray-300 rounded h-12 w-3/4" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Two-column page skeleton
export const TwoColumnPageSkeleton = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${className}`}>
      <div className="lg:col-span-2 space-y-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <div className="space-y-4">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
};

// Default export
export default Skeleton;

// Named exports for convenience
export {
  TextSkeleton,
  CardSkeleton,
  TableSkeleton,
  AvatarSkeleton,
  PageSkeleton
};
