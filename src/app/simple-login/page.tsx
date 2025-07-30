// Simple working login component that bypasses fetch issues
'use client';

import { useState } from 'react';

export default function SimpleLoginTest() {
  const [email, setEmail] = useState('testuser3@binna.com');
  const [password, setPassword] = useState('password123');
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testProxyLogin = async () => {
    setIsLoading(true);
    setResult('🔄 Testing proxy login...');
    
    try {
      const response = await fetch('/api/auth/proxy-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResult(`✅ Login successful!\n` +
          `User ID: ${data.user.id}\n` +
          `Email: ${data.user.email}\n` +
          `Profile: ${data.profile?.displayName || 'Not found'}\n` +
          `Loyalty Points: ${data.profile?.loyaltyPoints || 0}`);
      } else {
        setResult(`❌ Login failed: ${data.error}`);
      }
    } catch (error) {
      setResult(`❌ Network error: ${error instanceof Error ? error.message : 'Unknown'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Simple Login Test</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          onClick={testProxyLogin}
          disabled={isLoading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test Login'}
        </button>
        
        {result && (
          <div className="mt-4 p-3 bg-gray-100 rounded">
            <pre className="text-sm whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
