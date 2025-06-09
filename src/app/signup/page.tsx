"use client";

import ArabicSignupForm from '@/components/user/ArabicSignupForm';
import { toast } from 'react-toastify';

interface SignupData {
  name: string;
  email: string;
  password: string;
}

export default function SignupPage() {
  const handleSignup = async (data: SignupData) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Signup successful!');
        window.location.href = '/user/store/dashboard';
      } else {
        toast.error(`Signup failed: ${result.error}`);
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
          <ArabicSignupForm onSignup={handleSignup} />
        </div>
        <div className="w-1/2 flex items-center justify-center">
          <img src="/login-illustration.svg" alt="Signup Illustration" className="w-2/3 h-auto" />
        </div>
      </div>
    </div>
  );
}
