'use client';

import * as React from 'react';

const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className = '',
}) => <div className={`border p-4 rounded-lg shadow ${className}`}>{children}</div>;

export function LoadingState() {
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="h-8 w-2/3 mb-4 bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-5/6 mt-2 bg-gray-200 rounded" />
      </Card>
    </div>
  );
}

export function TableLoadingState() {
  return (
    <Card className="p-4">
      <div className="h-8 w-1/3 mb-6 bg-gray-200 rounded" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 w-full bg-gray-200 rounded" />
        ))}
      </div>
    </Card>
  );
}

export function CardLoadingState() {
  return (
    <Card className="p-4">
      <div className="h-12 w-12 rounded-full mb-4 bg-gray-200" />
      <div className="h-6 w-3/4 mb-2 bg-gray-200 rounded" />
      <div className="h-4 w-1/2 bg-gray-200 rounded" />
    </Card>
  );
}

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-gray-200 rounded-md" />
          <div className="h-4 w-48 bg-gray-100 rounded-md" />
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex justify-between">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-7 w-16 bg-gray-300 rounded-md" />
                <div className="h-3 w-32 bg-gray-100 rounded" />
              </div>
              <div className="h-10 w-10 bg-gray-200 rounded-full" />
            </div>
          </Card>
        ))}
      </div>

      {/* Activities Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="h-5 w-32 bg-gray-200 rounded" />
              <div className="h-4 w-16 bg-gray-100 rounded" />
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="h-4 w-48 bg-gray-200 rounded" />
                    <div className="h-3 w-32 bg-gray-100 rounded" />
                  </div>
                  <div className="h-2" />
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
