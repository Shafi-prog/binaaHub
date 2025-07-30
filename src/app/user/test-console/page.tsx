"use client";

import React from 'react';

export default function TestConsolePage() {
  console.log('🧪 TEST CONSOLE PAGE RENDERED');
  console.error('🧪 TEST CONSOLE PAGE RENDERED (via error)');
  
  React.useEffect(() => {
    console.log('🧪 TEST useEffect triggered');
    console.error('🧪 TEST useEffect triggered (via error)');
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">🧪 Console Test Page</h1>
      <p>Check the browser console and server logs for output.</p>
      <button 
        onClick={() => {
          console.log('🧪 Button clicked');
          console.error('🧪 Button clicked (via error)');
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Test Console Log
      </button>
    </div>
  );
}
