'use client';

import { useEffect, useState } from 'react';
import { getTempAuthUser, verifyTempAuth } from '@/lib/temp-auth';

export default function AuthDebugPage() {
  const [cookieInfo, setCookieInfo] = useState<string>('');
  const [authUser, setAuthUser] = useState<any>(null);
  const [verifyResult, setVerifyResult] = useState<any>(null);

  useEffect(() => {
    // Get all cookies
    setCookieInfo(document.cookie || 'No cookies found');
    
    // Try to get temp auth user
    const user = getTempAuthUser();
    setAuthUser(user);
    
    // Try to verify auth
    verifyTempAuth(3).then(result => {
      setVerifyResult(result);
    });
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug</h1>
      
      <div className="space-y-6">
        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Raw Cookies</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
            {cookieInfo}
          </pre>
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">getTempAuthUser() Result</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm">
            {JSON.stringify(authUser, null, 2)}
          </pre>
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">verifyTempAuth() Result</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm">
            {JSON.stringify(verifyResult, null, 2)}
          </pre>
        </div>        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Test Login</h2>
          <div className="space-x-2">
            <button 
              onClick={async () => {
                try {
                  const response = await fetch('/api/auth/login-db', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      email: 'user@user.com',
                      password: 'user123'
                    })
                  });
                  const result = await response.json();
                  console.log('Login result:', result);
                  
                  // Wait a moment then refresh auth info
                  setTimeout(() => {
                    setCookieInfo(document.cookie || 'No cookies found');
                    setAuthUser(getTempAuthUser());
                    verifyTempAuth(3).then(setVerifyResult);
                  }, 1000);
                } catch (error) {
                  console.error('Login error:', error);
                }
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Test Login
            </button>
            
            <button 
              onClick={async () => {
                try {
                  const response = await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                  });
                  const result = await response.json();
                  console.log('Logout result:', result);
                  
                  // Clear local state and refresh
                  setTimeout(() => {
                    setCookieInfo(document.cookie || 'No cookies found');
                    setAuthUser(null);
                    setVerifyResult(null);
                  }, 1000);
                } catch (error) {
                  console.error('Logout error:', error);
                }
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Test Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
