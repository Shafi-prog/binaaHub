"use client";

import React from 'react';

interface SingleColumnPageProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const SingleColumnPage: React.FC<SingleColumnPageProps> = ({
  children,
  className = "",
  maxWidth = 'lg'
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-full'
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 py-8 ${maxWidthClasses[maxWidth]}`}>
        {children}
      </div>
    </div>
  );
};

interface TwoColumnPageProps {
  leftColumn: React.ReactNode;
  rightColumn: React.ReactNode;
  leftColumnWidth?: 'narrow' | 'normal' | 'wide';
  className?: string;
}

export const TwoColumnPage: React.FC<TwoColumnPageProps> = ({
  leftColumn,
  rightColumn,
  leftColumnWidth = 'normal',
  className = ""
}) => {
  const leftWidthClasses = {
    narrow: 'lg:w-1/4',
    normal: 'lg:w-1/3',
    wide: 'lg:w-2/5'
  };

  const rightWidthClasses = {
    narrow: 'lg:w-3/4',
    normal: 'lg:w-2/3',
    wide: 'lg:w-3/5'
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className={`${leftWidthClasses[leftColumnWidth]}`}>
            {leftColumn}
          </div>
          <div className={`${rightWidthClasses[leftColumnWidth]}`}>
            {rightColumn}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ThreeColumnPageProps {
  leftColumn: React.ReactNode;
  centerColumn: React.ReactNode;
  rightColumn: React.ReactNode;
  className?: string;
}

export const ThreeColumnPage: React.FC<ThreeColumnPageProps> = ({
  leftColumn,
  centerColumn,
  rightColumn,
  className = ""
}) => {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            {leftColumn}
          </div>
          <div className="lg:col-span-1">
            {centerColumn}
          </div>
          <div className="lg:col-span-1">
            {rightColumn}
          </div>
        </div>
      </div>
    </div>
  );
};

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  breadcrumbs
}) => {
  return (
    <div className="border-b border-gray-200 pb-6 mb-8">
      {breadcrumbs && (
        <nav className="mb-4">
          <ol className="flex space-x-2 text-sm text-gray-500">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && <span className="mx-2">/</span>}
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-gray-700">
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-gray-900">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center space-x-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

// Default export containing all page components
const PageLayouts = {
  SingleColumnPage,
  TwoColumnPage,
  ThreeColumnPage,
  PageHeader
};

export default PageLayouts;
