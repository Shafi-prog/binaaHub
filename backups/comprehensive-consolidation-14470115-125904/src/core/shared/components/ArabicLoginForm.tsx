// @ts-nocheck
"use client";

import { useState } from 'react';
import { EnhancedInput, Button } from '@/core/shared/components/ui/enhanced-components';

export default function ArabicLoginForm({ onLogin }: { onLogin: (data: any) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onLogin({ email, password });
    } finally {
      setLoading(false);
    }
  };
  return (
    <form dir="rtl" className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
      <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 text-blue-700 text-center">تسجيل الدخول</h2>
      <EnhancedInput
        label="البريد الإلكتروني"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="text-base min-h-[48px]" // Ensure minimum touch target
        required
      />
      <EnhancedInput
        label="كلمة المرور"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="text-base min-h-[48px]" // Ensure minimum touch target
        required
      />      <Button
        type="submit"
        variant="primary"
        loading={loading}
        className="w-full min-h-[48px] text-base font-medium"
      >
        دخول
      </Button>
      
      <div className="text-center mt-4">
        <a href="/reset-password" className="text-blue-600 hover:text-blue-800 text-sm touch-target inline-block p-2">
          نسيت كلمة المرور؟
        </a>
      </div>
    </form>
  );
}


