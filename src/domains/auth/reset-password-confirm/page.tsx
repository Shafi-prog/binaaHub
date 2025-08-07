"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import toast from 'react-hot-toast';

export const dynamic = 'force-dynamic'

function ResetPasswordConfirmContent() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Check if we have the required tokens from the URL
    const accessToken = searchParams?.get('access_token');
    const refreshToken = searchParams?.get('refresh_token');
    const token = searchParams?.get('token');
    
    if (accessToken && refreshToken || token) {
      setValidToken(true);
    }
  }, [searchParams]);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('كلمات المرور غير متطابقة');
      return;
    }

    if (password.length < 6) {
      toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate password update success
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('تم تحديث كلمة المرور بنجاح!');
      router.push('/login');
    } catch (error) {
      console.error('Password update error:', error);
      toast.error('حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  if (!validToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50" dir="rtl">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">رابط غير صالح</h2>
            <p className="text-gray-600 mb-4">الرابط غير صالح أو منتهي الصلاحية</p>
            <Button 
              onClick={() => router.push('/auth/forgot-password')}
              variant="outline"
            >
              طلب رابط جديد
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-700 text-center">
            تعيين كلمة مرور جديدة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                كلمة المرور الجديدة
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full"
                placeholder="أدخل كلمة مرور جديدة"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تأكيد كلمة المرور
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full"
                placeholder="أكد كلمة المرور الجديدة"
              />
            </div>
            
            <Button
              type="submit"
              loading={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Loading component for Suspense fallback
function ResetPasswordConfirmLoading() {
  return (
    <div className="min-h-screen bg-gray-50 font-tajawal flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-md w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold text-gray-800 mb-2">جاري التحميل...</h1>
        <p className="text-gray-600">يرجى الانتظار</p>
      </div>
    </div>
  );
}

// Main component wrapped with Suspense
export default function ResetPasswordConfirmPage() {
  return (
    <Suspense fallback={<ResetPasswordConfirmLoading />}>
      <ResetPasswordConfirmContent />
    </Suspense>
  );
}




