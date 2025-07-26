'use client';

import React from 'react';
import { AuthProvider } from '@/core/shared/auth/AuthProvider';

interface ServiceProviderLayoutProps {
  children: React.ReactNode;
}

export default function ServiceProviderLayout({ children }: ServiceProviderLayoutProps) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </AuthProvider>
  );
}
