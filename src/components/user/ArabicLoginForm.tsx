"use client";

import { useState } from 'react';
import { EnhancedInput, EnhancedButton } from '@/components/ui/enhanced-components';

export default function ArabicLoginForm({ onLogin }: { onLogin: (data: any) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    onLogin({ email, password });
    setLoading(false);
  };

  return (
    <form dir="rtl" className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 space-y-6" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-4 text-blue-700">تسجيل الدخول</h2>
      <EnhancedInput
        label="البريد الإلكتروني"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <EnhancedInput
        label="كلمة المرور"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <EnhancedButton
        type="submit"
        variant="primary"
        loading={loading}
        className="w-full"
      >
        دخول
      </EnhancedButton>
    </form>
  );
}
