// @ts-nocheck
'use client';

import LogoutButton from '@/core/shared/components/ui/LogoutButton';

export type ProfileClientProps = {
  name: string;
  email: string;
  accountType: 'user' | 'store';
};

export default function ProfileClient({ name, email, accountType }: ProfileClientProps) {
  return (
    <div className="space-y-4 text-right text-gray-700">
      <p>
        <strong>الاسم:</strong> {name}
      </p>
      <p>
        <strong>البريد الإلكتروني:</strong> {email}
      </p>
      <p>
        <strong>نوع الحساب:</strong> {accountType === 'user' ? 'مستخدم' : 'متجر'}
      </p>

      <LogoutButton />
    </div>
  );
}


