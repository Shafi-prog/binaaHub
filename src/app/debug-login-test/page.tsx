// Debug login test with detailed logging
'use client';

import React, { useState } from 'react';
import { useAuth } from '@/core/shared/auth/AuthProvider';

export default function DebugLoginTest() {
  const { signIn, user, session, isLoading, error } = useAuth();
  const [loginError, setLoginError] = useState('');

  const testLogin = async () => {
    console.log('🧪 Starting debug login test...');
    setLoginError('');
    
    try {
      console.log('📞 Calling AuthProvider.signIn...');
      const result = await signIn('testuser3@binna.com', 'password123');
      console.log('📋 Login result:', result);
      
      if (!result.success) {
        setLoginError(result.error || 'Login failed');
      }
    } catch (err) {
      console.error('🚨 Login test error:', err);
      setLoginError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8" dir="rtl">
      <div className="max-w-2xl mx-auto bg-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Debug Login Test</h1>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Current Auth State:</h3>
            <pre className="bg-gray-100 p-2 rounded text-sm">
{JSON.stringify({
  user: user ? { id: user.id, email: user.email, name: user.name } : null,
  hasSession: !!session,
  isLoading,
  error
}, null, 2)}
            </pre>
          </div>

          {loginError && (
            <div className="bg-red-100 border border-red-300 rounded p-3">
              <p className="text-red-700">Login Error: {loginError}</p>
            </div>
          )}

          <button
            onClick={testLogin}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Test Login with testuser3@binna.com
          </button>

          <div>
            <h3 className="font-semibold">Browser Console:</h3>
            <p className="text-sm text-gray-600">
              Open browser console (F12) to see detailed auth debugging logs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
