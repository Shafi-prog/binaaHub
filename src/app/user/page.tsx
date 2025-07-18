'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UserPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to user dashboard
    router.replace('/user/dashboard');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-gray-800">جاري التحويل...</h1>
        <p className="text-gray-600 mt-2">سيتم تحويلك إلى لوحة التحكم</p>
      </div>
    </div>
  );
}