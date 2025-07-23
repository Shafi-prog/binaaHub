'use client';

import React from 'react';
import { Button } from '@/core/shared/components/ui/button';

export default function TestButtonPage() {
  const handleClick = () => {
    console.log('Test button clicked!');
    alert('Test button works!');
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Button Test Page</h1>
      
      <div className="space-y-4">
        <Button onClick={handleClick} className="w-full">
          Test Button (English)
        </Button>
        
        <Button onClick={handleClick} className="w-full">
          احسب المواد المطلوبة
        </Button>
        
        <button 
          onClick={handleClick} 
          className="w-full px-4 py-2 bg-blue-600 text-white rounded"
        >
          Native Button Test
        </button>
      </div>
    </div>
  );
}
