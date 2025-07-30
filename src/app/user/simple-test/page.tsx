"use client";

import React from 'react';
// import { useTest } from '@/core/shared/contexts/TestContext'; // TestContext not available

export default function SimpleTestPage() {
  console.log('🧪 SimpleTestPage is rendering');
  
  try {
    // Mock data since TestContext is not available
    const message = "Test message";
    const count = 42;
    console.log('📊 Test data from context:', { message, count });
    
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">🧪 Simple Test</h1>
        <p>Message: {message}</p>
        <p>Count: {count}</p>
      </div>
    );
  } catch (error) {
    console.error('❌ Error using Test context:', error);
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">❌ Test Error</h1>
        <p>{error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }
}
