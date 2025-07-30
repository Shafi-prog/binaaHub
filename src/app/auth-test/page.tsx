// Simple test page to check authentication state and debug redirects
'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { useRouter } from 'next/navigation';

export default function AuthTestPage() {
  const { user, session, isLoading, error } = useAuth();
  const router = useRouter();
  const [authState, setAuthState] = useState<any>(null);

  useEffect(() => {
    // Log current auth state
    console.log('🔍 Current auth state:', {
      user: user ? { id: user.id, email: user.email, name: user.name, role: user.role } : null,
      hasSession: !!session,
      isLoading,
      error
    });

    setAuthState({
      user: user ? { id: user.id, email: user.email, name: user.name, role: user.role } : null,
      hasSession: !!session,
      isLoading,
      error,
      timestamp: new Date().toISOString()
    });
  }, [user, session, isLoading, error]);

  const manualRedirect = () => {
    console.log('🔄 Manual redirect to dashboard...');
    router.push('/user/dashboard');
  };

  const checkLocalStorage = () => {
    const stored = localStorage.getItem('supabase.auth.token');
    console.log('💾 localStorage content:', stored ? JSON.parse(stored) : 'empty');
    return stored;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8" dir="rtl">
      <div className="max-w-4xl mx-auto bg-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">🔍 Authentication Debug Page</h1>
        
        <div className="space-y-6">
          {/* Current Auth State */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Current Auth State:</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(authState, null, 2)}
            </pre>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={manualRedirect}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-3"
            >
              Manual Redirect to Dashboard
            </button>
            
            <button
              onClick={checkLocalStorage}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mr-3"
            >
              Check localStorage (see console)
            </button>

            <button
              onClick={() => window.location.href = '/user/dashboard'}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Force Navigation to Dashboard
            </button>
          </div>

          {/* Status Messages */}
          {isLoading && (
            <div className="bg-yellow-100 border border-yellow-300 rounded p-3">
              <p className="text-yellow-800">🔄 Loading authentication state...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-300 rounded p-3">
              <p className="text-red-800">❌ Error: {error}</p>
            </div>
          )}

          {user && (
            <div className="bg-green-100 border border-green-300 rounded p-3">
              <p className="text-green-800">✅ User authenticated: {user.email}</p>
              <p className="text-green-700">Role: {user.role}</p>
              <p className="text-green-700">Should redirect to: /user/dashboard</p>
            </div>
          )}

          {!user && !isLoading && (
            <div className="bg-gray-100 border border-gray-300 rounded p-3">
              <p className="text-gray-800">ℹ️ No user authenticated</p>
            </div>
          )}
        </div>

        {/* Debug Navigation */}
        <div className="mt-8 pt-6 border-t">
          <h3 className="font-semibold mb-3">Quick Navigation:</h3>
          <div className="space-x-3">
            <a href="/auth/login" className="text-blue-600 hover:underline">Login Page</a>
            <a href="/user/dashboard" className="text-blue-600 hover:underline">User Dashboard</a>
            <a href="/debug-login-test" className="text-blue-600 hover:underline">Debug Login Test</a>
          </div>
        </div>
      </div>
    </div>
  );
}
