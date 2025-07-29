// Real authentication with Supabase
'use client';

import { AuthProvider } from '@/core/shared/auth/AuthProvider';
import SupabaseLoginComponent from '@/core/shared/components/SupabaseLoginPage';

export default function SupabaseLoginPage() {
  return (
    <AuthProvider>
      <SupabaseLoginComponent />
    </AuthProvider>
  );
}
