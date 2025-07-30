'use client';

import { useAuth } from '@/core/shared/auth/AuthProvider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function EditProjectPage() {
  const { user, session, isLoading, error } = useAuth();
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">حدث خطأ في تحميل البيانات</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

return (
    <div className="container mx-auto p-6" dir="rtl">
      <Card className="p-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">تحرير المشروع</h1>
          <p className="text-gray-600">قريباً - ميزة تحرير المشاريع</p>
          <Button variant="outline" onClick={() => alert('Button clicked')}>
            العودة للمشاريع
          </Button>
        </div>
      </Card>
    </div>
  );
}

export const dynamic = 'force-dynamic';
