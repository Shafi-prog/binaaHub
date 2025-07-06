'use client';

import ArabicLoginForm from '@/components/users/ArabicLoginForm';
import toast from 'react-hot-toast';

interface LoginData {
  email: string;
  password: string;
}

export default function LoginPage() {const handleLogin = async (data: LoginData) => {
    try {
      console.log('🔐 [Login] Starting login request for:', data.email);
      
      // Validate input data
      if (!data.email || !data.password) {
        toast.error('يرجى إدخال البريد الإلكتروني وكلمة المرور');
        return;
      }

      if (!data.email.includes('@')) {
        toast.error('يرجى إدخال بريد إلكتروني صحيح');
        return;
      }
      
      // First try local authentication for development
      let response = await fetch('/api/auth/local-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      console.log('🔐 [Login] Local auth response status:', response.status);

      // If local auth fails, try the main auth system
      if (!response.ok) {
        console.log('🔐 [Login] Local auth failed, trying main auth...');
        response = await fetch('/api/auth/login-db', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        console.log('🔐 [Login] Main auth response status:', response.status);
      }
      
      const result = await response.json();
      console.log('🔐 [Login] API response:', result);      if (result.success) {
        toast.success('تم تسجيل الدخول بنجاح!');
        
        console.log('🔐 [Login] Cookies before redirect:', document.cookie);
          // Determine redirect path
        let redirectPath = '/user/dashboard/'; // Default for regular users
        
        if (result.user?.account_type === 'store') {
          redirectPath = '/store/dashboard/';
        }
        
        // Use redirectTo from API if provided
        if (result.redirectTo) {
          redirectPath = result.redirectTo;
        }
        
        console.log('� [Login] Redirecting to:', redirectPath);
          // Add a delay then redirect
        setTimeout(() => {
          console.log('🔄 [Login] Redirecting now...');
          window.location.href = redirectPath;
        }, 1500);
      } else {
        console.error('🔐 [Login] Login failed:', result.error);
        toast.error(result.error || 'فشل تسجيل الدخول');
      }
    } catch (error: unknown) {
      console.error('🔐 [Login] Exception:', error);
      if (error instanceof Error) {
        console.error('🔐 [Login] Error stack:', error.stack);
        toast.error(`خطأ في الاتصال: ${error.message}`);
      } else {
        toast.error('حدث خطأ غير معروف');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-2">
      <div className="flex flex-col md:flex-row bg-white shadow-xl rounded-2xl w-full max-w-md md:max-w-6xl overflow-hidden">
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12">
          <ArabicLoginForm onLogin={handleLogin} />
        </div>
        <div className="hidden md:flex w-1/2 items-center justify-center bg-blue-50">
          <img src="/login-image.png" alt="Login Illustration" className="w-2/3 h-auto" />
        </div>
      </div>
    </div>
  );
}
