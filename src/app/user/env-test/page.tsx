"use client";

import React, { useEffect } from 'react';

export default function EnvTestPage() {
  useEffect(() => {
    console.log('🌍 Environment Variables Test (Client-Side):');
    console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    console.log('Environment object:', process.env);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">🌍 Environment Test</h1>
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold">Supabase URL:</h2>
          <p className="font-mono text-sm">{process.env.NEXT_PUBLIC_SUPABASE_URL || 'UNDEFINED'}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold">Supabase Key:</h2>
          <p className="font-mono text-sm">
            {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
              ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20) + '...' 
              : 'UNDEFINED'
            }
          </p>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold">Environment Keys:</h2>
          <p className="font-mono text-sm">
            {Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC')).join(', ') || 'No NEXT_PUBLIC_ variables found'}
          </p>
        </div>
      </div>
    </div>
  );
}
