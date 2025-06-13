"use client";

import ArabicLoginForm from '@/components/user/ArabicLoginForm';
import toast from 'react-hot-toast';

interface LoginData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const handleLogin = async (data: LoginData) => {
    try {
      console.log('🔐 [Login] Starting login request for:', data.email);
      
      const response = await fetch('/api/auth/login-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      console.log('🔐 [Login] API response status:', response.status);
      
      const result = await response.json();
      console.log('🔐 [Login] API response:', result);

      if (result.success) {
        toast.success('تم تسجيل الدخول بنجاح!');
        
        console.log('🔐 [Login] Cookies before redirect:', document.cookie);
        
        // Add a small delay to ensure cookies are set
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('🔐 [Login] Cookies after delay:', document.cookie);
        
        // Use the correct property from the API response
        const redirectPath = result.redirectTo || (result.user?.account_type === 'store' ? '/store/dashboard' : '/user/dashboard');
        
        // Add a flag to indicate this is a post-login redirect
        const urlWithFlag = `${redirectPath}?post_login=true`;
        
        console.log('🔄 [Login] Redirecting to:', urlWithFlag);
        window.location.href = urlWithFlag;
      } else {
        console.error('🔐 [Login] Login failed:', result.error);
        toast.error(`Login failed: ${result.error}`);
      }
    } catch (error: unknown) {
      console.error('🔐 [Login] Exception:', error);
      if (error instanceof Error) {
        toast.error(`An error occurred: ${error.message}`);
      } else {
        toast.error('An unknown error occurred.');
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
