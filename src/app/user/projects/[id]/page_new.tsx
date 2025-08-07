'use client';
import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get current URL parameters
    const editId = searchParams?.get('editId');
    const enhanced = searchParams?.get('enhanced');
    const legacy = searchParams?.get('legacy');
    
    // Build redirect URL to unified page
    let redirectUrl = '/user/projects/list';
    const params = new URLSearchParams();
    
    // Determine mode based on current parameters
    if (editId) {
      params.set('editId', editId);
      params.set('edit', 'true');
    } else {
      params.set('create', 'true');
    }
    
    // Set interface preference
    if (enhanced === 'true' || (!legacy && !enhanced)) {
      params.set('enhanced', 'true');
    } else {
      params.set('legacy', 'true');
    }
    
    // Add any other existing parameters
    searchParams?.forEach((value, key) => {
      if (!params.has(key) && key !== 'enhanced' && key !== 'legacy') {
        params.set(key, value);
      }
    });
    
    if (params.toString()) {
      redirectUrl += '?' + params.toString();
    }
    
    // Redirect to unified page
    router.replace(redirectUrl);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">جاري التحويل للصفحة الموحدة...</p>
      </div>
    </div>
  );
}
