"use client";

import React from 'react';

interface SectionRowProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export const SectionRow: React.FC<SectionRowProps> = ({
  title,
  children,
  className = "",
  actions
}) => {
  return (
    <div className={`border-b border-gray-200 py-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
};

interface SectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  headerActions?: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({
  title,
  children,
  className = "",
  headerActions
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            {headerActions && (
              <div className="flex items-center space-x-2">
                {headerActions}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actions,
  className = ""
}) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center space-x-2">
          {actions}
        </div>
      )}
    </div>
  );
};

// Default export containing all section components
const SectionComponents = {
  Section,
  SectionRow,
  SectionHeader
};

export default SectionComponents;
