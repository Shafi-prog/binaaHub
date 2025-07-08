// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';

export default function ClearAuthPage() {
  const [status, setStatus] = useState('Clearing authentication...');

  useEffect(() => {
    const clearAuth = async () => {
      try {
        // Call logout API
        await fetch('/api/auth/logout', { method: 'POST' });
        
        // Clear localStorage
        localStorage.clear();
        
        // Clear sessionStorage
        sessionStorage.clear();
        
        // Clear any remaining cookies on client side
        document.cookie.split(";").forEach(function(c) { 
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
        
        setStatus('Authentication cleared! You can now try logging in again.');
        
        // Redirect to login after a delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
        
      } catch (error) {
        console.error('Error clearing auth:', error);
        setStatus('Error clearing authentication. Try manually clearing browser data.');
      }
    };

    clearAuth();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Clear Authentication</h1>
        <div className="text-gray-600 mb-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>{status}</p>
        </div>
        <div className="text-sm text-gray-500">
          <p>This page will clear all authentication data and redirect you to login.</p>
          <p className="mt-2">If you continue to have issues, try opening an incognito/private window.</p>
        </div>
      </div>
    </div>
  );
}
