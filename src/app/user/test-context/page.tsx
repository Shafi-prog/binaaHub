"use client";

import React from 'react';
import { useAuth } from '@/core/shared/auth/AuthProvider';

export default function UserTestContextPage() {
  console.log('🧪 UserTestContextPage is rendering');
  
  try {
    const { user, session, isLoading, error } = useAuth();
    console.log('📊 Auth data from context:', { user, session, isLoading, error });
    
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">🧪 User Context Test</h1>
        
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
            <h3 className="font-bold">User State:</h3>
            <p>User: {user ? 'Authenticated' : 'Not Authenticated'}</p>
            {user && (
              <div className="mt-2">
                <p>Email: {user.email}</p>
                <p>ID: {user.id}</p>
              </div>
            )}
          </div>

          <div className="bg-purple-50 p-4 rounded">
            <h3 className="font-bold">Session State:</h3>
            <p>Session: {session ? 'Active' : 'No Session'}</p>
            {session && (
              <div className="mt-2">
                <p>Access Token: {session.access_token ? 'Present' : 'Missing'}</p>
                <p>Expires: {session.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : 'Unknown'}</p>
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-bold">Raw Data:</h3>
            <pre className="text-xs overflow-auto max-h-40">
              {JSON.stringify({ user, session, isLoading, error }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
    
  } catch (err) {
    console.error('❌ Error in UserTestContextPage:', err);
    
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4 text-red-600">❌ Context Error</h1>
        <div className="bg-red-50 p-4 rounded">
          <p className="text-red-700">Error loading user context: {String(err)}</p>
        </div>
      </div>
    );
  }
}
