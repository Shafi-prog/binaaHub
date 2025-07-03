"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { EnhancedInput, Button } from '@/components/ui/enhanced-components';
import toast from 'react-hot-toast';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ResetPasswordConfirmPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Check if we have the required tokens from the URL
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    
    if (accessToken && refreshToken) {
      setValidToken(true);
      // Set the session with the tokens
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
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
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        toast.error(`خطأ في تحديث كلمة المرور: ${error.message}`);
      } else {
        toast.success('تم تحديث كلمة المرور بنجاح!');
        router.push('/login');
      }
    } catch (error) {
      console.error('Password update error:', error);
      toast.error('حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  if (!validToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">رابط غير صالح</h2>
          <p className="text-gray-600 mb-4">الرابط غير صالح أو منتهي الصلاحية</p>
          <a href="/reset-password" className="text-blue-600 hover:text-blue-800">
            طلب رابط جديد
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-2">
      <div className="flex flex-col md:flex-row bg-white shadow-xl rounded-2xl w-full max-w-md md:max-w-6xl overflow-hidden">
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12">
          <form dir="rtl" className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 space-y-6" onSubmit={handlePasswordUpdate}>
            <h2 className="text-2xl font-bold mb-4 text-blue-700">تعيين كلمة مرور جديدة</h2>
            
            <EnhancedInput
              label="كلمة المرور الجديدة"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
            
            <EnhancedInput
              label="تأكيد كلمة المرور"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
            
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full"
            >
              تحديث كلمة المرور
            </Button>
          </form>
        </div>
        <div className="hidden md:flex w-1/2 items-center justify-center bg-blue-50">
          <img src="/login-image.png" alt="Reset Password Illustration" className="w-2/3 h-auto" />
        </div>
      </div>
    </div>
  );
}
