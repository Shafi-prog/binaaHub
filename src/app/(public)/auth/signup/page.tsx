// @ts-nocheck
"use client";

import ArabicSignupForm from '@/components/users/ArabicSignupForm';
import toast from 'react-hot-toast';

interface SignupData {
  name: string;
  email: string;
  password: string;
}

export default function SignupPage() {  const handleSignup = async (data: SignupData) => {
    try {
      console.log('🔄 Starting signup for:', data.email);
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      console.log('📝 Signup response:', {
        status: response.status,
        success: result.success,
        error: result.error,
        message: result.message
      });      if (result.success) {
        if (result.requiresVerification) {
          toast.success('تم إنشاء الحساب! يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب.');
          // Stay on signup page or redirect to verification page
        } else {
          toast.success('تم إنشاء الحساب بنجاح!');
          const redirectUrl = result.redirectTo || '/user/dashboard';
          window.location.href = redirectUrl;
        }
      } else {
        // Show the actual error message from the API
        const errorMessage = result.error || 'حدث خطأ غير متوقع';
        console.log('ℹ️ Signup failed:', errorMessage); // Use console.log instead of console.error
        toast.error(`فشل في إنشاء الحساب: ${errorMessage}`);
      }
    } catch (error: unknown) {
      console.error('❌ Signup error:', error);
      if (error instanceof Error) {
        toast.error(`حدث خطأ: ${error.message}`);
      } else {
        toast.error('حدث خطأ غير متوقع.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-2">
      <div className="flex flex-col md:flex-row bg-white shadow-xl rounded-2xl w-full max-w-md md:max-w-6xl overflow-hidden">
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12">
          <ArabicSignupForm onSignup={handleSignup} />
        </div>
        <div className="hidden md:flex w-1/2 items-center justify-center bg-blue-50">
          <img src="/login-illustration.svg" alt="Signup Illustration" className="w-2/3 h-auto" />
        </div>
      </div>
    </div>
  );
}


