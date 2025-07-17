'use client';
import { useEffect, useState } from 'react';

export default function DebugAuthPage() {
  const [authData, setAuthData] = useState<any>(null);
  const [cookies, setCookies] = useState('');

  useEffect(() => {
    // Check stored auth data
    const sessionData = sessionStorage.getItem('temp_user');
    const localData = localStorage.getItem('temp_user');
    const cookieData = document.cookie;
    
    setAuthData({
      sessionStorage: sessionData ? JSON.parse(sessionData) : null,
      localStorage: localData ? JSON.parse(localData) : null,
    });
    
    setCookies(cookieData);
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Debug Authentication</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Session Storage</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(authData?.sessionStorage, null, 2)}
          </pre>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Local Storage</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(authData?.localStorage, null, 2)}
          </pre>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Cookies</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {cookies}
          </pre>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Actions</h2>
          <button 
            onClick={() => {
              sessionStorage.clear();
              localStorage.clear();
              document.cookie.split(';').forEach(cookie => {
                const eqPos = cookie.indexOf('=');
                const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
              });
              window.location.reload();
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mr-4"
          >
            Clear All Auth
          </button>
          
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}
