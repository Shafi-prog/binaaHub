"use client";

import { useState } from 'react';
import { EnhancedInput, Button } from '@/components/ui/enhanced-components';

export default function ArabicSignupForm({ onSignup }: { onSignup: (data: any) => Promise<void> }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('user');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSignup({ name, email, password, accountType });
    } finally {
      setLoading(false);
    }
  };
  return (
    <form dir="rtl" className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
      <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 text-blue-700 text-center">إنشاء حساب جديد</h2>
      
      <EnhancedInput
        label="الاسم الكامل"
        value={name}
        onChange={e => setName(e.target.value)}
        className="text-base min-h-[48px]"
        required
      />
      
      <EnhancedInput
        label="البريد الإلكتروني"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="text-base min-h-[48px]"
        required
      />
      
      <EnhancedInput
        label="كلمة المرور"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="text-base min-h-[48px]"
        required
      />
        {/* Account Type Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">نوع الحساب</label>        <select
          value={accountType}
          onChange={e => setAccountType(e.target.value)}
          className="w-full px-3 py-3 min-h-[48px] text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="user">مستخدم عادي</option>
          <option value="store">متجر / مورد</option>
        </select>
        <p className="text-xs text-gray-500">
          {accountType === 'user' && 'للأفراد الذين يريدون شراء المواد والخدمات'}
          {accountType === 'store' && 'للمتاجر والموردين الذين يبيعون المواد والخدمات'}
        </p>
      </div>      <Button
        type="submit"
        variant="primary"
        loading={loading}
        className="w-full min-h-[48px] text-base font-medium"
      >
        إنشاء حساب
      </Button>
      
      <div className="text-center mt-4">
        <span className="text-gray-600 text-sm">لديك حساب بالفعل؟ </span>
        <a href="/login" className="text-blue-600 hover:text-blue-800 text-sm touch-target inline-block p-2">
          تسجيل الدخول
        </a>
      </div>
    </form>
  );
}
