"use client";

import { useState } from 'react';
import { EnhancedInput, Button } from '@/components/ui/enhanced-components';

export default function ArabicSignupForm({ onSignup }: { onSignup: (data: any) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    onSignup({ name, email, password });
    setLoading(false);
  };

  return (
    <form dir="rtl" className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 space-y-6" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-4 text-blue-700">إنشاء حساب جديد</h2>
      <EnhancedInput
        label="الاسم الكامل"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
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
      <Button
        type="submit"
        variant="primary"
        loading={loading}
        className="w-full"
      >
        إنشاء حساب
      </Button>
    </form>
  );
}
