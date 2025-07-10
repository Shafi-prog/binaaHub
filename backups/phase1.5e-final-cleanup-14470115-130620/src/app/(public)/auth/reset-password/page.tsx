// @ts-nocheck
"use client";

import { useState } from 'react';
import { EnhancedInput, Button } from '@/domains/shared/components/ui/enhanced-components';
import toast from 'react-hot-toast';
import Link from 'next/link';


export const dynamic = 'force-dynamic'
// Force dynamic rendering to avoid SSG auth context issues


export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
        toast.success('Password reset email sent!');
      } else {
        toast.error(`Reset failed: ${result.error}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`An error occurred: ${error.message}`);
      } else {
        toast.error('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-2">
      <div className="flex flex-col md:flex-row bg-white shadow-xl rounded-2xl w-full max-w-md md:max-w-6xl overflow-hidden">
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12">
          <form dir="rtl" className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 space-y-6" onSubmit={handleResetPassword}>
            <h2 className="text-2xl font-bold mb-4 text-blue-700">إعادة تعيين كلمة المرور</h2>
            <p className="text-gray-600 mb-4">أدخل بريدك الإلكتروني لإرسال رابط إعادة تعيين كلمة المرور</p>
            
            <EnhancedInput
              label="البريد الإلكتروني"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full"
            >
              إرسال رابط إعادة التعيين
            </Button>
            
            {message && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-700">{message}</p>
              </div>
            )}
            
            <div className="text-center">
              <Link href="/login" className="text-blue-600 hover:text-blue-800">
                العودة إلى تسجيل الدخول
              </Link>
            </div>
          </form>
        </div>
        <div className="hidden md:flex w-1/2 items-center justify-center bg-blue-50">
          <img src="/login-image.png" alt="Reset Password Illustration" className="w-2/3 h-auto" />
        </div>
      </div>
    </div>
  );
}


