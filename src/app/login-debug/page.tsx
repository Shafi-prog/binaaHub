'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function LoginDebugPage() {
  const [email, setEmail] = useState('store@store.com');
  const [password, setPassword] = useState('store123');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    setResponse('');
    
    try {
      console.log('🧪 [Debug] Starting login test...');
      
      // Test local login API
      const loginResponse = await fetch('/api/auth/local-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log('🧪 [Debug] Response status:', loginResponse.status);
      
      const result = await loginResponse.json();
      console.log('🧪 [Debug] Response data:', result);
      
      setResponse(JSON.stringify(result, null, 2));
      
      if (result.success) {
        toast.success('تم تسجيل الدخول بنجاح!');
        console.log('🧪 [Debug] Login successful!');
      } else {
        toast.error(`Login failed: ${result.error}`);
        console.error('🧪 [Debug] Login failed:', result.error);
      }
      
    } catch (error) {
      console.error('🧪 [Debug] Exception:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setResponse(`Error: ${errorMsg}`);
      toast.error(`Exception: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login Debug Tool</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            onClick={testLogin}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Testing...' : 'Test Login'}
          </button>
        </div>
        
        {response && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">API Response:</h3>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-96">
              {response}
            </pre>
          </div>
        )}
        
        <div className="mt-6 text-xs text-gray-500">
          <p>This debug tool tests the login API directly.</p>
          <p>Check the browser console for detailed logs.</p>
        </div>
      </div>
    </div>
  );
}
