'use client';
import { useEffect, useState } from 'react';

export default function BrowserTestPage() {
  const [browserInfo, setBrowserInfo] = useState<any>(null);

  useEffect(() => {
    setBrowserInfo({
      userAgent: navigator.userAgent,
      cookieEnabled: navigator.cookieEnabled,
      language: navigator.language,
      platform: navigator.platform,
      timestamp: new Date().toISOString(),
      localStorage: typeof Storage !== 'undefined',
      sessionStorage: typeof Storage !== 'undefined',
      cookies: document.cookie,
      url: window.location.href,
      protocol: window.location.protocol,
      host: window.location.host,
    });
  }, []);

  const testCookies = () => {
    try {
      const testCookie = 'test-cookie=test-value; path=/; max-age=60';
      document.cookie = testCookie;
      console.log('Cookie set:', testCookie);
      
      setTimeout(() => {
        const cookies = document.cookie;
        console.log('Cookies after set:', cookies);
        alert(`Cookies: ${cookies}`);
      }, 100);
    } catch (error) {
      console.error('Cookie test error:', error);
      alert('Cookie test failed: ' + error.message);
    }
  };

  const testUserLogin = () => {
    try {
      const mockUser = {
        id: 'user_001',
        email: 'user@binna.app',
        role: 'user'
      };
      
      sessionStorage.setItem('temp_user', JSON.stringify(mockUser));
      localStorage.setItem('temp_user', JSON.stringify(mockUser));
      
      const isSecure = window.location.protocol === 'https:';
      const cookieOptions = `; path=/; max-age=86400${isSecure ? '; secure' : ''}; samesite=strict`;
      
      document.cookie = `auth-token=user_001${cookieOptions}`;
      document.cookie = `user-session=user_001${cookieOptions}`;
      document.cookie = `temp_auth_user=user_001${cookieOptions}`;
      
      console.log('User login test - cookies set');
      
      setTimeout(() => {
        console.log('Redirecting to user dashboard...');
        window.location.href = '/user/dashboard';
      }, 1000);
    } catch (error) {
      console.error('User login test error:', error);
      alert('User login test failed: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Browser Test Page</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Browser Information</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(browserInfo, null, 2)}
          </pre>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Tests</h2>
          <div className="space-y-4">
            <button 
              onClick={testCookies}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-4"
            >
              Test Cookies
            </button>
            
            <button 
              onClick={testUserLogin}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-4"
            >
              Test User Login
            </button>
            
            <button 
              onClick={() => window.location.href = '/login'}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              Go to Login
            </button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Browser Cache Clear</h2>
          <p className="text-sm text-gray-600 mb-4">
            If you're seeing different behavior in different browsers, try these steps:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Clear browser cache and cookies</li>
            <li>Try incognito/private browsing mode</li>
            <li>Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)</li>
            <li>Check browser developer console for errors</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
