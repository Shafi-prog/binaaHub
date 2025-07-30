"use client";

import React from 'react';
import { useAuth } from '@/core/shared/auth/AuthProvider';

export default function TestContextPage() {
  console.log('🧪 TestContextPage is rendering');
  
  try {
    const { user, session, isLoading, error } = useAuth();
    console.log('📊 Auth data from context:', { user, session, isLoading, error });
    
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">🧪 Context Test</h1>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="font-bold">Loading State:</h3>
            <p>{isLoading ? 'Loading...' : 'Not Loading'}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded">
            <h3 className="font-bold">Error State:</h3>
            <p>{error || 'No Error'}</p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded">
            <h3 className="font-bold">User Data:</h3>
            <pre className="text-xs">{JSON.stringify(user, null, 2)}</pre>
          </div>
          
          <div className="bg-purple-50 p-4 rounded">
            <h3 className="font-bold">Session Data:</h3>
            <pre className="text-xs">{JSON.stringify(session, null, 2)}</pre>
          </div>
          
          <div className="bg-red-50 p-4 rounded">
            <h3 className="font-bold">Context Status:</h3>
            <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
            <p>Error: {error || 'None'}</p>
            <p>User Authenticated: {user ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('❌ Error using UserData context:', error);
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">❌ Context Error</h1>
        <p>{error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }
}
