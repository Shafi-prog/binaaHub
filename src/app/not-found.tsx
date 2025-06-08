<<<<<<< HEAD
import React from 'react';

// Custom 404 page for Next.js App Router
export default function NotFound(): React.JSX.Element {
  return (
    <div style={{
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      background: '#f8fafc', 
      color: '#1f2937', 
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ 
        fontSize: '5rem', 
        fontWeight: 'bold', 
        marginBottom: '1rem' 
      }}>
        404
      </h1>
      <h2 style={{ 
        fontSize: '2rem', 
        marginBottom: '1rem' 
      }}>
        الصفحة غير موجودة
      </h2>
      <p style={{ 
        fontSize: '1.2rem', 
        marginBottom: '2rem', 
        color: '#6b7280',
        textAlign: 'center',
        maxWidth: '600px'
      }}>
        عذراً، الصفحة التي تبحث عنها غير متوفرة. تأكد من صحة الرابط أو عد إلى الصفحة الرئيسية.
      </p>
      <a 
        href="/" 
        style={{
          background: '#2563eb', 
          color: 'white', 
          padding: '12px 32px', 
          borderRadius: '8px', 
          textDecoration: 'none', 
          fontWeight: 'bold', 
          fontSize: '1rem', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
          transition: 'background 0.2s'
        }}
      >
        العودة للرئيسية
      </a>
    </div>
=======
'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-center p-8">
      <h1 className="text-5xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-8">الصفحة غير موجودة.</p>
      <Link
        href="/"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold"
      >
        العودة إلى الرئيسية
      </Link>
    </main>
>>>>>>> e0e83bc2e6a4c393009b329773f07bfad211af6b
  );
}
