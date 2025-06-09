'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AuthDiagnosticPage() {
  const [authState, setAuthState] = useState<string>('checking');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [sessionInfo, setSessionInfo] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClientComponentClient();
        
        // Get session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          setAuthState('error');
          return;
        }

        if (session && session.user) {
          setAuthState('authenticated');
          setUserInfo(session.user);
          setSessionInfo(session);
        } else {
          setAuthState('unauthenticated');
        }
      } catch (error) {
        console.error('Auth diagnostic error:', error);
        setAuthState('error');
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Auth Diagnostic</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <div className={`p-4 rounded-md ${
            authState === 'authenticated' ? 'bg-green-100 text-green-800' :
            authState === 'unauthenticated' ? 'bg-red-100 text-red-800' :
            authState === 'error' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {authState === 'authenticated' && '✅ User authenticated'}
            {authState === 'unauthenticated' && '❌ Not authenticated'}
            {authState === 'error' && '❌ Authentication error'}
            {authState === 'checking' && '⏳ Checking authentication...'}
          </div>
        </div>

        {userInfo && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">User Information</h2>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
              {JSON.stringify(userInfo, null, 2)}
            </pre>
          </div>
        )}

        {sessionInfo && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Session Information</h2>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
              {JSON.stringify(sessionInfo, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}