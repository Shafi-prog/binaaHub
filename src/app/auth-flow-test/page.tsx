'use client';

import { useState } from 'react';

export default function AuthFlowTest() {
  const [status, setStatus] = useState('');
  const [sessionInfo, setSessionInfo] = useState(null);

  const testLogin = async (email: string, password: string, accountType: string) => {
    setStatus(`Logging in as ${accountType}...`);
    try {
      const response = await fetch('/api/auth/sync-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const result = await response.json();
      
      if (result.success) {
        setStatus(`✅ ${accountType} login successful!`);
        setSessionInfo(result);
        
        // Wait a moment then redirect to dashboard
        setTimeout(() => {
          window.location.href = result.redirect_to;
        }, 2000);
      } else {
        setStatus(`❌ ${accountType} login failed: ${result.error}`);
      }    } catch (error) {
      setStatus(`❌ Login error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testLogout = async () => {
    setStatus('Logging out...');
    try {
      const response = await fetch('/api/auth/sync-login', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      
      if (result.success) {
        setStatus('✅ Logout successful!');
        setSessionInfo(null);
        
        // Clear cookies and reload page to simulate Navbar logout
        document.cookie = `logout_timestamp=${new Date().toISOString()}; path=/; max-age=10`;
        const authCookies = ['auth_session_active', 'user_email', 'account_type', 'user_name', 'sync_login_timestamp', 'remember_user', 'sb-access-token', 'sb-refresh-token', 'supabase-auth-token'];
        authCookies.forEach(cookie => {
          document.cookie = `${cookie}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        });
        
        localStorage.clear();
        sessionStorage.clear();
        
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setStatus(`❌ Logout failed: ${result.error}`);
      }    } catch (error) {
      setStatus(`❌ Logout error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const checkSession = async () => {
    setStatus('Checking session...');
    try {
      const response = await fetch('/api/auth/sync-login', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      
      if (result.success) {
        setStatus('✅ Session is active');
        setSessionInfo(result);
      } else {
        setStatus('❌ No active session');
        setSessionInfo(null);
      }    } catch (error) {
      setStatus(`❌ Session check error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Auth Flow Test</h1>
        
        <div className="space-y-4 mb-8">
          <div className="text-lg font-medium">Status: <span className="text-blue-600">{status}</span></div>
          
          {sessionInfo && (
            <div className="bg-green-50 p-4 rounded border">
              <h3 className="font-medium text-green-800">Session Info:</h3>
              <pre className="text-sm mt-2 text-green-700">{JSON.stringify(sessionInfo, null, 2)}</pre>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => testLogin('user@user.com', '123456', 'User')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Login as User
          </button>
          
          <button
            onClick={() => testLogin('teststore@store.com', '123456', 'Store')}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Login as Store
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={checkSession}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Check Session
          </button>
          
          <button
            onClick={testLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="mt-8 text-center">
          <a href="/login" className="text-blue-600 hover:underline mr-4">Go to Login Page</a>
          <a href="/" className="text-blue-600 hover:underline">Go to Home</a>
        </div>
      </div>
    </div>
  );
}
