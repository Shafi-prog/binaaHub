'use client'

import { useAuth } from '../hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingSpinner } from '../components/ui/loading-spinner';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredRoles?: string[];
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export function AuthGuard({ 
  children, 
  requiredRole, 
  requiredRoles,
  redirectTo = '/auth/signin',
  fallback 
}: AuthGuardProps) {
  const { isAuthenticated, isLoading, user, hasRole, hasAnyRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return fallback || <LoadingSpinner />;
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return fallback || <div>Redirecting to login...</div>;
  }

  // Check role permissions
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
          <p className="text-sm text-gray-500 mt-2">Required role: {requiredRole}</p>
        </div>
      </div>
    );
  }

  if (requiredRoles && !hasAnyRole(requiredRoles)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
          <p className="text-sm text-gray-500 mt-2">Required roles: {requiredRoles.join(', ')}</p>
        </div>
      </div>
    );
  }

  // User is authenticated and has required permissions
  return <>{children}</>;
}

export default AuthGuard;
