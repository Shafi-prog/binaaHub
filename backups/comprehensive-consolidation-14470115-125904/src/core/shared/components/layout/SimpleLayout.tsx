"use client";

import React from 'react';

interface SimpleLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  containerClassName?: string;
}

const SimpleLayout: React.FC<SimpleLayoutProps> = ({
  children,
  title,
  subtitle,
  className = "",
  containerClassName = ""
}) => {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {(title || subtitle) && (
        <div className="bg-white shadow-sm border-b">
          <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ${containerClassName}`}>
            {title && (
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
            )}
          </div>
        </div>
      )}
      
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${containerClassName}`}>
        {children}
      </main>
    </div>
  );
};

export default SimpleLayout;
