"use client";

import ArabicLoginForm from '@/components/user/ArabicLoginForm';
import { toast } from 'react-toastify';

interface LoginData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const handleLogin = async (data: LoginData) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Login successful!');
        const redirectPath = result.role === 'store' ? '/store/dashboard' : '/user/dashboard';
        window.location.href = redirectPath;
      } else {
        toast.error(`Login failed: ${result.error}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`An error occurred: ${error.message}`);
      } else {
        toast.error('An unknown error occurred.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="flex bg-white shadow-xl rounded-2xl w-full max-w-6xl">
        <div className="w-1/2 p-12">
          <ArabicLoginForm onLogin={handleLogin} />
        </div>
        <div className="w-1/2 flex items-center justify-center">
          <img src="/login-image.png" alt="Login Illustration" className="w-2/3 h-auto" />
        </div>
      </div>
    </div>
  );
}
