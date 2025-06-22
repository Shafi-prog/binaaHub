'use client';

import { useEffect, useState } from 'react';

export default function AuthTestPage() {
  const [cookies, setCookies] = useState('');
  const [authStatus, setAuthStatus] = useState('');

  useEffect(() => {
    setCookies(document.cookie);
    
    // Test auth endpoint
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        setAuthStatus(JSON.stringify(data, null, 2));
      })
      .catch(err => {
        setAuthStatus(`Error: ${err.message}`);
      });
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Authentication Test</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Browser Cookies:</h2>
          <pre className="text-xs overflow-auto">{cookies || 'No cookies found'}</pre>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Auth Status (/api/auth/me):</h2>
          <pre className="text-xs overflow-auto">{authStatus || 'Loading...'}</pre>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Test Links:</h2>
          <div className="space-x-4">
            <a href="/store/dashboard/" className="text-blue-600 hover:underline">Store Dashboard</a>
            <a href="/login" className="text-blue-600 hover:underline">Login</a>
            <a href="/api/auth/me" className="text-blue-600 hover:underline">Auth Check API</a>
          </div>
        </div>
      </div>
    </div>
  );
}
