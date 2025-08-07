import React from 'react';
import { AuthProvider } from '@shared/auth/AuthProvider';

export const metadata = {
  title: 'Authentication',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        {children}
      </div>
    </AuthProvider>
  );
}
